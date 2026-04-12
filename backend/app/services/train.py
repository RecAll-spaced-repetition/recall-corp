from fastapi import HTTPException
from fsrs import Card, Scheduler, Optimizer
from logging import info, warning

from app.repositories import CardRepository, UserRepository, TrainCardRepository, TrainLogRepository
from app.schemas import TrainMarkAnswer, UserDTO, TrainCard, TrainLog, TrainLogCreate, UserOptParams
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