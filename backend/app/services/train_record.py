from fastapi import HTTPException

from app.core import compute_card_new_progress, compute_repeat_interval_duration
from app.repositories import CardRepository, TrainRecordRepository, UserRepository
from app.schemas import Card, TrainRecord, TrainRecordCreate, UserAnswer

from .base import BaseService, with_unit_of_work


__all__ = ["TrainRecordService"]


class TrainRecordService(BaseService):
    @with_unit_of_work
    async def create_train_record(
            self, user_id: int, card_id: int, training: TrainRecordCreate
    ) -> TrainRecord:
        if not await self.uow.get_repository(UserRepository).exists_user_with_id(user_id):
            raise HTTPException(status_code=400)  ## ТУТ ДОЛЖНО БЫТЬ КАСТОМНОЕ ИСКЛЮЧЕНИЕ!
        if not await self.uow.get_repository(CardRepository).exists_card_with_id(card_id):
            raise HTTPException(status_code=400)  ## ТУТ ДОЛЖНО БЫТЬ КАСТОМНОЕ ИСКЛЮЧЕНИЕ!
        train_record_repo = self.uow.get_repository(TrainRecordRepository)
        last_training = await (train_record_repo
                               .get_user_card_last_train_record(user_id, card_id, TrainRecord))
        prev_progress = 0.0 if last_training is None else last_training.progress
        progress = compute_card_new_progress(prev_progress, training.mark)
        interval = compute_repeat_interval_duration(progress)
        train_data = training.model_dump()
        train_data.update(card_id=card_id, user_id=user_id, progress=progress)
        return await train_record_repo.create_train_record(train_data, interval, TrainRecord)

    @with_unit_of_work
    async def get_user_card_last_train_record(
            self, user_id: int, card_id: int
    ) -> TrainRecord | None:
        if not await self.uow.get_repository(UserRepository).exists_user_with_id(user_id):
            raise HTTPException(status_code=400)  ## ТУТ ДОЛЖНО БЫТЬ КАСТОМНОЕ ИСКЛЮЧЕНИЕ!
        if not await self.uow.get_repository(CardRepository).exists_card_with_id(card_id):
            raise HTTPException(status_code=400)  ## ТУТ ДОЛЖНО БЫТЬ КАСТОМНОЕ ИСКЛЮЧЕНИЕ!
        train_record_repo = self.uow.get_repository(TrainRecordRepository)
        return await train_record_repo.get_user_card_last_train_record(user_id, card_id, TrainRecord)
