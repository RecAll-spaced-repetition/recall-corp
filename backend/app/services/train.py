from fastapi import HTTPException
from fsrs import Card, Scheduler, Optimizer
from datetime import datetime, timezone

from app.repositories import CardRepository, UserRepository, TrainCardRepository, TrainLogRepository, CollectionRepository, CardCollectionRepository
from app.schemas import TrainMarkAnswer, TrainCard, TrainLog, TrainLogCreate, UserOptParams, TrainPlan
from app.core import get_settings

from .base import BaseService, with_unit_of_work


__all__ = ["TrainService"]


class TrainService(BaseService):
    @with_unit_of_work
    async def train_card(self, user_id: int, card_id: int, training: TrainMarkAnswer):
        # Базовые проверки
        user = await self.uow.get_repository(UserRepository).get_user_by_id(user_id, UserOptParams)
        if not user:
            raise HTTPException(status_code=400)  ## ТУТ ДОЛЖНО БЫТЬ КАСТОМНОЕ ИСКЛЮЧЕНИЕ!
        if not await self.uow.get_repository(CardRepository).exists_card_with_id(card_id):
            raise HTTPException(status_code=400)  ## ТУТ ДОЛЖНО БЫТЬ КАСТОМНОЕ ИСКЛЮЧЕНИЕ!
        
        # Тренировка карточки
        train_card_repo = self.uow.get_repository(TrainCardRepository)
        card = await train_card_repo.get_train_card(user_id, card_id)
        is_new = card == None
        if is_new:
            card = Card(card_id)
        scheduler = Scheduler() if not user.train_opt_params else Scheduler(user.train_opt_params)
        new_card, review_log = scheduler.review_card(card, training.to_fsrs_rating(), review_duration=training.duration_ms)
        if is_new:
            await train_card_repo.create_one(TrainCard.from_fsrs_card(user_id, new_card).model_dump(), TrainCard)
        else:
            await train_card_repo.update_train_card(user_id, new_card)

        # Сохранение записи тренировки и оптимизация модели памяти
        train_log_repo = self.uow.get_repository(TrainLogRepository)
        await train_log_repo.create_one(TrainLogCreate.from_fsrs_review_log(user_id, review_log).model_dump(), TrainLog)
        all_user_logs = await train_log_repo.get_user_train_logs(user_id)
        all_logs_cnt = len(all_user_logs)
        if all_logs_cnt - user.train_logs_opt_cnt >= get_settings().reopt_required_logs_cnt:
            new_params = Optimizer(all_user_logs).compute_optimal_parameters()
            await self.uow.get_repository(UserRepository).update_user_by_id(
                user_id, UserOptParams(id=user_id, train_logs_opt_cnt=all_logs_cnt, train_opt_params=new_params).model_dump(exclude=['id']), UserOptParams
            )
        return TrainCard.from_fsrs_card(user_id, new_card)
    
    @with_unit_of_work
    async def get_collection_train_stats(self, user_id: int, collection_id: int) -> TrainPlan:
        user = await self.uow.get_repository(UserRepository).get_user_by_id(user_id, UserOptParams)
        if not user:
            raise HTTPException(status_code=400)  ## ТУТ ДОЛЖНО БЫТЬ КАСТОМНОЕ ИСКЛЮЧЕНИЕ!
        if not await self.uow.get_repository(CollectionRepository).exists_collection_with_id(collection_id): # TODO: Надо бы проверять доступ
            raise HTTPException(status_code=400)  ## ТУТ ДОЛЖНО БЫТЬ КАСТОМНОЕ ИСКЛЮЧЕНИЕ!
        
        train_card_repo = self.uow.get_repository(TrainCardRepository)
        collection_card_repo = self.uow.get_repository(CardCollectionRepository)

        all_cards = await collection_card_repo.get_collection_cards(collection_id)
        all_cards_len = len(all_cards)
        if all_cards_len == 0:
            raise HTTPException(status_code=400)  ## ТУТ ДОЛЖНО БЫТЬ КАСТОМНОЕ ИСКЛЮЧЕНИЕ!

        (cards_to_train, min_due) = await train_card_repo.get_cards_waiting_train(user_id, all_cards)

        scheduler = Scheduler() if not user.train_opt_params else Scheduler(user.train_opt_params)
        avg_curr_r = 0.0
        avg_year_r = 0.0
        now_utc = datetime.now(timezone.utc)
        year_utc = now_utc.replace(year=now_utc.year + 1)
        for card in await train_card_repo.get_user_train_cards(user_id, all_cards):
            avg_curr_r += scheduler.get_card_retrievability(card, now_utc)
            avg_year_r += scheduler.get_card_retrievability(card, year_utc)
        avg_curr_r /= all_cards_len
        avg_year_r /= all_cards_len

        return TrainPlan(
            cards_to_train=cards_to_train, 
            min_due=min_due, 
            avg_current_retrievability=avg_curr_r, 
            avg_after_year_retrievability=avg_year_r
        )