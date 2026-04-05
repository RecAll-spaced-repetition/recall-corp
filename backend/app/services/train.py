from fastapi import HTTPException
from fsrs import Card, Scheduler

from app.repositories import CardRepository, UserRepository, TrainCardRepository, TrainLogRepository
from app.schemas import TrainRecordCreate, UserDTO, TrainCard, TrainLog

from .base import BaseService, with_unit_of_work


__all__ = ["TrainService"]


class TrainService(BaseService):
    @with_unit_of_work
    async def train_card(self, user_id: int, card_id: int, training: TrainRecordCreate):
        user = await self.uow.get_repository(UserRepository).get_user_by_id(user_id, UserDTO)
        if not user:
            raise HTTPException(status_code=400)  ## ТУТ ДОЛЖНО БЫТЬ КАСТОМНОЕ ИСКЛЮЧЕНИЕ!
        if not await self.uow.get_repository(CardRepository).exists_card_with_id(card_id):
            raise HTTPException(status_code=400)  ## ТУТ ДОЛЖНО БЫТЬ КАСТОМНОЕ ИСКЛЮЧЕНИЕ!
        train_card_repo = self.uow.get_repository(TrainCardRepository)
        card = await train_card_repo.get_train_card(user_id, card_id)
        is_new = card == None
        if is_new:
            card = Card(card_id)
        scheduler = Scheduler()
        # TODO: Здесь будут браться параметры юзера для модели памяти
        new_card, review_log = scheduler.review_card(card, training.to_rating())
        if is_new:
            await train_card_repo.create_one(TrainCard.from_fsrs_card(user_id, new_card).model_dump(), TrainCard)
        else:
            await train_card_repo.update_train_card(user_id, new_card)
        # train_log_repo = self.uow.get_repository(TrainLogRepository)
        # await train_log_repo.create_one({ 'card_id': card_id, 'user_id': user_id, 'data': review_log.to_json() })
        # all_user_logs = await train_log_repo.get_user_train_logs(user_id)
        # TODO: получаем все ревью логи и рефайним модель, если надо
        return TrainCard.from_fsrs_card(user_id, new_card)