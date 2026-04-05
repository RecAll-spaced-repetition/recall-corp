from sqlalchemy import select, desc, text, func, and_, asc, not_
from typing import Type
from fsrs import Card, ReviewLog

from app.db import TrainCardTable, TrainLogTable
from app.schemas import TrainCard, TrainLog

from .base import BaseSQLAlchemyRepository


__all__ = ["TrainCardRepository", "TrainLogRepository"]


class TrainCardRepository(BaseSQLAlchemyRepository):
    table = TrainCardTable

    async def get_train_card(self, user_id: int, card_id: int) -> Card | None:
        db_card = await self.get_one_or_none(and_(self.table.c.user_id == user_id, self.table.c.card_id == card_id), TrainCard)
        return None if not db_card else db_card.to_fsrs_card()

    async def update_train_card(self, user_id: int, card: Card) -> Card:
        return (await self.update_one(
            and_(self.table.c.user_id == user_id, self.table.c.card_id == card.card_id),
            TrainCard.from_fsrs_card(user_id, card).model_dump(exclude=['card_id', 'user_id']), 
            TrainCard
        )).to_fsrs_card()
    
    async def get_cards_nearest_due_cards(self, user_id: int, collection_cards: list[int]) -> list[int]:
        need_train_cards_ids = (await self.connection.execute(
            select(self.table.c.card_id, self.table.c.due)
            .where(self.table.c.user_id == user_id, self.table.c.card_id.in_(collection_cards), self.table.c.due <= func.now())
            .order_by(asc(self.table.c.due))
        )).scalars().all()
        no_need_train_cards_ids = (await self.connection.execute(
            select(self.table.c.card_id, self.table.c.due)
            .where(self.table.c.user_id == user_id, self.table.c.card_id.in_(collection_cards), self.table.c.card_id.not_in(need_train_cards_ids))
            .order_by(asc(self.table.c.due))
        )).scalars().all()
        not_trained_cards = list(set(collection_cards) - set(need_train_cards_ids) - set(no_need_train_cards_ids))
        return [*not_trained_cards, *need_train_cards_ids]


class TrainLogRepository(BaseSQLAlchemyRepository):
    table = TrainLogTable

    async def get_user_train_logs(self, user_id: int) -> list[ReviewLog]:
        return [
            review.to_fsrs_review_log() 
            for review in await self.get_all_filtered(self.table.c.user_id == user_id, TrainLog)
        ]

    async def get_user_card_train_logs(self, card_id: int, user_id: int) -> list[ReviewLog]:
        return [
            review.to_fsrs_review_log() 
            for review in await self.get_all_filtered(and_(self.table.c.card_id == card_id, self.table.c.user_id == user_id), TrainLog)
        ]
