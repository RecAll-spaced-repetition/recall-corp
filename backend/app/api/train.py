from fastapi import APIRouter

from app.schemas import TrainCard, TrainMarkAnswer, TrainPlan

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


@router.get("/stats/collection/{collection_id}")
async def train_cards(
        user_id: UserIdDep, collection_id: int, train_card_service: TrainCardServiceDep
) -> TrainPlan:
    return await train_card_service.get_collection_train_stats(user_id, collection_id)