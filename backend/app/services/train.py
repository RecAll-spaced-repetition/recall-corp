from fastapi import HTTPException
from fsrs import Card, Scheduler, Optimizer

from app.repositories import CardRepository, UserRepository, TrainCardRepository, TrainLogRepository
from app.schemas import TrainRecordCreate, UserDTO, TrainCard, TrainLog, TrainLogCreate, UserOptParams

from .base import BaseService, with_unit_of_work


__all__ = ["TrainService"]


class TrainService(BaseService):
    @with_unit_of_work
    async def train_card(self, user_id: int, card_id: int, training: TrainRecordCreate):
        user = await self.uow.get_repository(UserRepository).get_user_by_id(user_id, UserOptParams)
        print('\n\n\t User: ', user)
        if not user:
            raise HTTPException(status_code=400)  ## ТУТ ДОЛЖНО БЫТЬ КАСТОМНОЕ ИСКЛЮЧЕНИЕ!
        if not await self.uow.get_repository(CardRepository).exists_card_with_id(card_id):
            raise HTTPException(status_code=400)  ## ТУТ ДОЛЖНО БЫТЬ КАСТОМНОЕ ИСКЛЮЧЕНИЕ!
        train_card_repo = self.uow.get_repository(TrainCardRepository)
        card = await train_card_repo.get_train_card(user_id, card_id)
        is_new = card == None
        if is_new:
            card = Card(card_id)
        scheduler = Scheduler() if not user.train_opt_params else Scheduler(user.train_opt_params)
        new_card, review_log = scheduler.review_card(card, training.to_rating())
        if is_new:
            await train_card_repo.create_one(TrainCard.from_fsrs_card(user_id, new_card).model_dump(), TrainCard)
        else:
            await train_card_repo.update_train_card(user_id, new_card)
        train_log_repo = self.uow.get_repository(TrainLogRepository)
        await train_log_repo.create_one(TrainLogCreate.from_fsrs_review_log(user_id, review_log).model_dump(), TrainLog)
        all_user_logs = await train_log_repo.get_user_train_logs(user_id)
        all_logs_cnt = len(all_user_logs)
        print('\n\n\t Logs cnt: ', all_logs_cnt)
        if all_logs_cnt - user.train_logs_opt_cnt >= 100: # TODO: Поменять на конфигурируемый параметр
            new_params = Optimizer(all_user_logs).compute_optimal_parameters()
            res = await self.uow.get_repository(UserRepository).update_user_by_id(
                user_id, UserOptParams(id=user_id, train_logs_opt_cnt=all_logs_cnt, train_opt_params=new_params).model_dump(exclude=['id']), UserOptParams
            )
            print(user.train_opt_params)
            print(new_params)
            print('\n\n\t Re-opt user: ', res)
        return TrainCard.from_fsrs_card(user_id, new_card)