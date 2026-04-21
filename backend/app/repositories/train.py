from sqlalchemy import select, func, and_
from sqlalchemy.dialects.postgresql import aggregate_order_by
from datetime import datetime, timezone
from fsrs import Card, ReviewLog

from app.db import TrainCardTable, TrainLogTable
from app.schemas import TrainPlan, TrainCard, TrainLog

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
    
    async def get_user_train_cards(self, user_id: int, collection_cards: list[int] | None = None) -> list[Card]:
        expr = self.table.c.user_id == user_id 
        if collection_cards != None:
            expr = and_(self.table.c.user_id == user_id, self.table.c.card_id.in_(collection_cards))
        return [
            db_card.to_fsrs_card() 
            for db_card in await self.get_all_filtered(expr, TrainCard)
        ]
    
    async def get_cards_waiting_train(self, user_id: int, collection_cards: list[int]) -> tuple[list[int], datetime]:
        if not collection_cards:
            return []

        (need_train_again, no_need_train_again, min_due) = (await self.connection.execute(select(
            func.array_agg(aggregate_order_by(self.table.c.card_id, self.table.c.due))
                .filter(self.table.c.due <= func.now()).label("need_train_ids"),
            func.array_agg(aggregate_order_by(self.table.c.card_id, self.table.c.due))
                .filter(self.table.c.due > func.now()).label("no_need_train_ids"),
            func.min(self.table.c.due).label('min_due')
        ).where(
            self.table.c.user_id == user_id,
            self.table.c.card_id.in_(collection_cards),
        ))).one()

        if not need_train_again:
            need_train_again = []
        if not no_need_train_again:
            no_need_train_again = []

        not_trained_cards = list(set(collection_cards) - set(need_train_again) - set(no_need_train_again))
        if len(not_trained_cards) > 0:
            min_due = datetime.now(timezone.utc)

        return ([*not_trained_cards, *need_train_again], min_due)

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
