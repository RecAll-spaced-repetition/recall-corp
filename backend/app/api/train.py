from fastapi import APIRouter

from app.schemas import TrainCard, TrainMarkAnswer

from .dependencies import TrainCardServiceDep, UserIdDep


router = APIRouter(
    prefix="/train",
    tags=["train"]
)


@router.post("/{card_id}")
async def train_card(
        user_id: UserIdDep, card_id: int, training: TrainMarkAnswer,
        train_card_service: TrainCardServiceDep
) -> TrainCard:
    return await train_card_service.train_card(user_id, card_id, training)
