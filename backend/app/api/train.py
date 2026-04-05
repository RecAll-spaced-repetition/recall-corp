from fastapi import APIRouter

from app.schemas import TrainCard, TrainRecordCreate

from .dependencies import TrainCardServiceDep, UserIdDep


router = APIRouter(
    prefix="/train",
    tags=["train"]
)


@router.post("/{card_id}")
async def create_train_record(
        user_id: UserIdDep, card_id: int, training: TrainRecordCreate,
        train_card_service: TrainCardServiceDep
) -> TrainCard:
    return await train_card_service.train_card(user_id, card_id, training)
