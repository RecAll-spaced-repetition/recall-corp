from datetime import UTC, datetime

from fastapi import HTTPException
from fsrs import Card, Optimizer, Scheduler

from app.core import get_settings
from app.repositories import (
    CardCollectionRepository,
    CardRepository,
    CollectionRepository,
    CollectionSubscriptionRepository,
    TrainCardRepository,
    TrainLogRepository,
    UserRepository,
)
from app.schemas import (
    AllStats,
    CollectionShort,
    CollectionStats,
    TrainCard,
    TrainCardExt,
    TrainDue,
    TrainLog,
    TrainLogCreate,
    TrainMarkAnswer,
    TrainNever,
    TrainNow,
    TrainPlan,
    TrainWhen,
    UserOptParams,
)

from .base import BaseService, with_unit_of_work

__all__ = ["TrainService"]


class TrainService(BaseService):
    @with_unit_of_work
    async def train_card(
        self,
        user_id: int,
        card_id: int,
        training: TrainMarkAnswer,
    ) -> TrainCardExt:
        # Базовые проверки
        user_repo = self.uow.get_repository(UserRepository)
        user = await user_repo.get_user_by_id(user_id, UserOptParams)

        if not user:
            # TODO: вызывать кастомное исключение
            raise HTTPException(status_code=400)

        card_repo = self.uow.get_repository(CardRepository)

        if not await card_repo.exists_card_with_id(card_id):
            # TODO: вызывать кастомное исключение
            raise HTTPException(status_code=400)

        # Тренировка карточки
        train_card_repo = self.uow.get_repository(TrainCardRepository)
        db_card = await train_card_repo.get_train_card(user_id, card_id)

        is_new = db_card is None

        card = Card(card_id) if is_new else db_card.to_fsrs_card()

        scheduler = (
            Scheduler() if not user.train_opt_params else Scheduler(user.train_opt_params)
        )

        new_card, review_log = scheduler.review_card(
            card=card,
            rating=training.to_fsrs_rating(),
            review_duration=training.duration_ms,
        )

        if is_new:
            await train_card_repo.create_one(
                input_data=TrainCard.from_fsrs_card(user_id, new_card).model_dump(),
                output_schema=TrainCard,
            )
        else:
            await train_card_repo.update_train_card(
                user_id=user_id,
                card=TrainCard.from_fsrs_card(user_id, new_card),
            )

        # Сохранение записи тренировки и оптимизация модели памяти
        train_log_repo = self.uow.get_repository(TrainLogRepository)

        await train_log_repo.create_one(
            input_data=TrainLogCreate.from_fsrs_review_log(user_id, review_log).model_dump(),
            output_schema=TrainLog,
        )

        all_user_logs = [
            train_log.to_fsrs_review_log()
            for train_log in await train_log_repo.get_user_train_logs(user_id)
        ]
        all_logs_cnt = len(all_user_logs)

        if all_logs_cnt - user.train_logs_opt_cnt >= get_settings().reopt_required_logs_cnt:
            new_params = Optimizer(all_user_logs).compute_optimal_parameters()

            await user_repo.update_user_by_id(
                user_id,
                UserOptParams(
                    id=user_id,
                    train_logs_opt_cnt=all_logs_cnt,
                    train_opt_params=new_params,
                ).model_dump(exclude=["id"]),
                UserOptParams,
            )

        return TrainCardExt.from_fsrs_card_with_scheduler(user_id, new_card, scheduler)

    @with_unit_of_work
    async def get_collection_train_due(self, user_id: int, collection_id: int) -> TrainWhen:
        user_repo = self.uow.get_repository(UserRepository)

        if not await user_repo.exists_user_with_id(user_id):
            # TODO: вызывать кастомное исключение
            raise HTTPException(status_code=400)

        collection_repo = self.uow.get_repository(CollectionRepository)
        collection = await collection_repo.get_collection_by_id(collection_id, CollectionShort)

        if not collection or collection.owner_id != user_id and not collection.is_public:
            # TODO: вызывать кастомное исключение
            raise HTTPException(status_code=400)

        collection_card_repo = self.uow.get_repository(CardCollectionRepository)
        all_cards = await collection_card_repo.get_collection_cards(collection_id)
        all_cards_len = len(all_cards)

        if all_cards_len == 0:
            return TrainWhen.from_collection_short(collection, when=TrainNever(type="never"))

        train_card_repo = self.uow.get_repository(TrainCardRepository)
        (_, min_due) = await train_card_repo.get_cards_waiting_train(user_id, all_cards)

        when = TrainNow(type="now")
        if min_due > datetime.now(UTC):
            when = TrainDue(due=min_due, type="due")

        return TrainWhen.from_collection_short(collection, when)

    @with_unit_of_work
    async def get_collection_train_cards(self, user_id: int, collection_id: int) -> TrainPlan:
        user_repo = self.uow.get_repository(UserRepository)

        if not await user_repo.exists_user_with_id(user_id):
            # TODO: вызывать кастомное исключение
            raise HTTPException(status_code=400)

        collection_repo = self.uow.get_repository(CollectionRepository)

        if not await collection_repo.exists_collection_with_id(collection_id):
            # TODO: вызывать кастомное исключение
            raise HTTPException(status_code=400)

        collection_card_repo = self.uow.get_repository(CardCollectionRepository)
        all_cards = await collection_card_repo.get_collection_cards(collection_id)

        if len(all_cards) == 0:
            return TrainPlan(id=collection_id, cards_to_train=[])

        train_card_repo = self.uow.get_repository(TrainCardRepository)
        (cards, _) = await train_card_repo.get_cards_waiting_train(user_id, all_cards)

        return TrainPlan(id=collection_id, cards_to_train=cards)

    @with_unit_of_work
    async def get_card_stats(self, user_id: int, card_id: int) -> TrainCardExt:
        # Базовые проверки
        user_repo = self.uow.get_repository(UserRepository)
        user = await user_repo.get_user_by_id(user_id, UserOptParams)

        if not user:
            # TODO: вызывать кастомное исключение
            raise HTTPException(status_code=400)

        card_repo = self.uow.get_repository(CardRepository)

        if not await card_repo.exists_card_with_id(card_id):
            # TODO: вызывать кастомное исключение
            raise HTTPException(status_code=404)

        train_card_repo = self.uow.get_repository(TrainCardRepository)
        scheduler = (
            Scheduler() if not user.train_opt_params else Scheduler(user.train_opt_params)
        )

        db_card = await train_card_repo.get_train_card(user_id, card_id)

        if db_card is None:
            raise HTTPException(status_code=404)

        return TrainCardExt.from_fsrs_card_with_scheduler(
            user_id, db_card.to_fsrs_card(), scheduler
        )

    @with_unit_of_work
    async def get_collection_train_stats(
        self,
        user_id: int,
        collection_id: int,
    ) -> CollectionStats:
        user_repo = self.uow.get_repository(UserRepository)
        user = await user_repo.get_user_by_id(user_id, UserOptParams)

        if not user:
            # TODO: вызывать кастомное исключение
            raise HTTPException(status_code=400)

        # WHY: свою статистику можно получить и по приватным коллекциям
        collection_repo = self.uow.get_repository(CollectionRepository)

        if not await collection_repo.exists_collection_with_id(collection_id):
            # TODO: вызывать кастомное исключение
            raise HTTPException(status_code=400)

        collection_card_repo = self.uow.get_repository(CardCollectionRepository)
        train_card_repo = self.uow.get_repository(TrainCardRepository)

        all_cards = await collection_card_repo.get_collection_cards(collection_id)
        all_cards_len = len(all_cards)

        scheduler = (
            Scheduler() if not user.train_opt_params else Scheduler(user.train_opt_params)
        )

        trained_cards = [
            db_card.to_fsrs_card()
            for db_card in await train_card_repo.get_user_train_cards(user_id, all_cards)
        ]

        return CollectionStats.from_cards_with_scheduler(
            id=collection_id,
            all_cards_len=all_cards_len,
            trained_cards=trained_cards,
            scheduler=scheduler,
        )

    @with_unit_of_work
    async def get_user_stats(self, user_id: int) -> AllStats:
        user_repo = self.uow.get_repository(UserRepository)
        user = await user_repo.get_user_by_id(user_id, UserOptParams)

        if not user:
            # TODO: вызывать кастомное исключение
            raise HTTPException(status_code=400)

        train_log_repo = self.uow.get_repository(TrainLogRepository)
        user_logs = await train_log_repo.get_user_train_logs(user_id, chrono=True)

        collection_sub_repo = self.uow.get_repository(CollectionSubscriptionRepository)
        subscriptions = await collection_sub_repo.get_user_subscriptions(
            user_id=user_id,
            offset=0,
            limit=None,
            output_schema=CollectionShort,
        )

        collection_card_repo = self.uow.get_repository(CardCollectionRepository)
        train_card_repo = self.uow.get_repository(TrainCardRepository)

        scheduler = (
            Scheduler() if not user.train_opt_params else Scheduler(user.train_opt_params)
        )

        collection_stats_list: list[CollectionStats] = []

        for subscription in subscriptions:
            collection_cards = await collection_card_repo.get_collection_cards(subscription.id)

            if not collection_cards:
                continue

            trained = await train_card_repo.get_user_train_cards(user_id, collection_cards)

            cstats = CollectionStats.from_cards_with_scheduler(
                id=subscription.id,
                all_cards_len=len(collection_cards),
                trained_cards=[tc.to_fsrs_card() for tc in trained],
                scheduler=scheduler,
            )
            collection_stats_list.append(cstats)

        if collection_stats_list:
            n = len(collection_stats_list)
            avg_curr_r = sum(cs.avg_current_retrievability for cs in collection_stats_list) / n
            avg_year_r = (
                sum(cs.avg_after_year_retrievability for cs in collection_stats_list) / n
            )
        else:
            avg_curr_r = None
            avg_year_r = None

        return AllStats.from_components(user_logs, avg_curr_r, avg_year_r)
