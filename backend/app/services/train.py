from fastapi import HTTPException
from fsrs import Card, Scheduler, Optimizer
from datetime import datetime, timezone, date, timedelta

from app.repositories import CardRepository, UserRepository, TrainCardRepository, TrainLogRepository, CollectionRepository, CardCollectionRepository
from app.schemas import TrainMarkAnswer, TrainCard, TrainCardExt, TrainLog, TrainLogCreate, AllStats, TrainWhen, UserOptParams, CollectionStats, TrainNow, TrainDue, TrainPlan, TrainNever
from app.core import get_settings

from .base import BaseService, with_unit_of_work


__all__ = ["TrainService"]


class TrainService(BaseService):
    @with_unit_of_work
    async def train_card(self, user_id: int, card_id: int, training: TrainMarkAnswer) -> TrainCardExt:
        # Базовые проверки
        user = await self.uow.get_repository(UserRepository).get_user_by_id(user_id, UserOptParams)
        if not user:
            raise HTTPException(status_code=400)  ## ТУТ ДОЛЖНО БЫТЬ КАСТОМНОЕ ИСКЛЮЧЕНИЕ!
        if not await self.uow.get_repository(CardRepository).exists_card_with_id(card_id):
            raise HTTPException(status_code=400)  ## ТУТ ДОЛЖНО БЫТЬ КАСТОМНОЕ ИСКЛЮЧЕНИЕ!
        
        # Тренировка карточки
        train_card_repo = self.uow.get_repository(TrainCardRepository)
        db_card = await train_card_repo.get_train_card(user_id, card_id)
        is_new = db_card == None
        if is_new:
            card = Card(card_id)
        else:
            card = db_card.to_fsrs_card()
        scheduler = Scheduler() if not user.train_opt_params else Scheduler(user.train_opt_params)
        new_card, review_log = scheduler.review_card(card, training.to_fsrs_rating(), review_duration=training.duration_ms)
        if is_new:
            await train_card_repo.create_one(TrainCard.from_fsrs_card(user_id, new_card).model_dump(), TrainCard)
        else:
            await train_card_repo.update_train_card(user_id, TrainCard.from_fsrs_card(user_id, new_card))

        # Сохранение записи тренировки и оптимизация модели памяти
        train_log_repo = self.uow.get_repository(TrainLogRepository)
        await train_log_repo.create_one(TrainLogCreate.from_fsrs_review_log(user_id, review_log).model_dump(), TrainLog)
        all_user_logs = [
            train_log.to_fsrs_review_log() 
            for train_log in await train_log_repo.get_user_train_logs(user_id)
        ]
        all_logs_cnt = len(all_user_logs)
        if all_logs_cnt - user.train_logs_opt_cnt >= get_settings().reopt_required_logs_cnt:
            new_params = Optimizer(all_user_logs).compute_optimal_parameters()
            await self.uow.get_repository(UserRepository).update_user_by_id(
                user_id, UserOptParams(id=user_id, train_logs_opt_cnt=all_logs_cnt, train_opt_params=new_params).model_dump(exclude=['id']), UserOptParams
            )

        return TrainCardExt.from_fsrs_card_with_scheduler(user_id, new_card, scheduler)

    @with_unit_of_work
    async def get_collection_train_due(self, user_id: int, collection_id: int) -> TrainWhen:
        if not await self.uow.get_repository(UserRepository).exists_user_with_id(user_id):
            raise HTTPException(status_code=400)  ## ТУТ ДОЛЖНО БЫТЬ КАСТОМНОЕ ИСКЛЮЧЕНИЕ!
        if not await self.uow.get_repository(CollectionRepository).exists_collection_with_id(collection_id):
            raise HTTPException(status_code=400)  ## ТУТ ДОЛЖНО БЫТЬ КАСТОМНОЕ ИСКЛЮЧЕНИЕ!
        
        train_card_repo = self.uow.get_repository(TrainCardRepository)
        collection_card_repo = self.uow.get_repository(CardCollectionRepository)

        all_cards = await collection_card_repo.get_collection_cards(collection_id)
        all_cards_len = len(all_cards)
        if all_cards_len == 0:
            return TrainWhen(id=collection_id, when=TrainNever(type='never'))

        (_, min_due) = await train_card_repo.get_cards_waiting_train(user_id, all_cards)

        when = TrainNow(type='now')
        if min_due > datetime.now(timezone.utc):
            when = TrainDue(due=min_due, type='due')

        return TrainWhen(id=collection_id, when=when)

    @with_unit_of_work
    async def get_collection_train_cards(self, user_id: int, collection_id: int) -> TrainPlan:
        if not await self.uow.get_repository(UserRepository).exists_user_with_id(user_id):
            raise HTTPException(status_code=400)  ## ТУТ ДОЛЖНО БЫТЬ КАСТОМНОЕ ИСКЛЮЧЕНИЕ!
        if not await self.uow.get_repository(CollectionRepository).exists_collection_with_id(collection_id):
            raise HTTPException(status_code=400)  ## ТУТ ДОЛЖНО БЫТЬ КАСТОМНОЕ ИСКЛЮЧЕНИЕ!
        
        train_card_repo = self.uow.get_repository(TrainCardRepository)
        collection_card_repo = self.uow.get_repository(CardCollectionRepository)

        all_cards = await collection_card_repo.get_collection_cards(collection_id)
        if len(all_cards) == 0:
            return TrainPlan(id=collection_id, cards_to_train=[])

        (cards, _) = await train_card_repo.get_cards_waiting_train(user_id, all_cards)

        return TrainPlan(id=collection_id, cards_to_train=cards)
    
    @with_unit_of_work
    async def get_card_stats(self, user_id: int, card_id: int) -> TrainCardExt:
        # Базовые проверки
        user = await self.uow.get_repository(UserRepository).get_user_by_id(user_id, UserOptParams)
        if not user:
            raise HTTPException(status_code=400)  ## ТУТ ДОЛЖНО БЫТЬ КАСТОМНОЕ ИСКЛЮЧЕНИЕ!
        if not await self.uow.get_repository(CardRepository).exists_card_with_id(card_id):
            raise HTTPException(status_code=404)  ## ТУТ ДОЛЖНО БЫТЬ КАСТОМНОЕ ИСКЛЮЧЕНИЕ!
        
        train_card_repo = self.uow.get_repository(TrainCardRepository)
        scheduler = Scheduler() if not user.train_opt_params else Scheduler(user.train_opt_params)

        db_card = await train_card_repo.get_train_card(user_id, card_id)
        if db_card == None:
            raise HTTPException(status_code=404)
        
        return TrainCardExt.from_fsrs_card_with_scheduler(user_id, db_card.to_fsrs_card(), scheduler)

    @with_unit_of_work
    async def get_collection_train_stats(self, user_id: int, collection_id: int) -> CollectionStats:
        user = await self.uow.get_repository(UserRepository).get_user_by_id(user_id, UserOptParams)
        if not user:
            raise HTTPException(status_code=400)  ## ТУТ ДОЛЖНО БЫТЬ КАСТОМНОЕ ИСКЛЮЧЕНИЕ!
        if not await self.uow.get_repository(CollectionRepository).exists_collection_with_id(collection_id): # Свою имеющуюся статистику можно получить и по приватным коллекциям
            raise HTTPException(status_code=400)  ## ТУТ ДОЛЖНО БЫТЬ КАСТОМНОЕ ИСКЛЮЧЕНИЕ!
        
        train_card_repo = self.uow.get_repository(TrainCardRepository)
        collection_card_repo = self.uow.get_repository(CardCollectionRepository)

        all_cards = await collection_card_repo.get_collection_cards(collection_id)
        all_cards_len = len(all_cards)

        scheduler = Scheduler() if not user.train_opt_params else Scheduler(user.train_opt_params)
        trained_cards = [
            db_card.to_fsrs_card()
            for db_card in await train_card_repo.get_user_train_cards(user_id, all_cards)
        ]

        return CollectionStats.from_cards_with_scheduler(
            id=collection_id, 
            all_cards_len=all_cards_len,
            trained_cards=trained_cards,
            scheduler=scheduler
        )
    
    @with_unit_of_work
    async def get_user_stats(self, user_id: int) -> AllStats:
        user = await self.uow.get_repository(UserRepository).get_user_by_id(user_id, UserOptParams)
        if not user:
            raise HTTPException(status_code=400)  ## ТУТ ДОЛЖНО БЫТЬ КАСТОМНОЕ ИСКЛЮЧЕНИЕ!
        
        train_log_repo = self.uow.get_repository(TrainLogRepository)
        user_logs = await train_log_repo.get_user_train_logs(user_id, chrono=True)
        return AllStats.from_train_logs(user_logs)
