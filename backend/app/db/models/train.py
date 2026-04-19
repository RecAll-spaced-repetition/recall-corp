from sqlalchemy import Column, ForeignKey, Integer, Float, Table, JSON, DateTime
from fsrs.card import CardDict
from fsrs.review_log import ReviewLogDict

from .metadata import get_metadata


__all__ = ["TrainCardTable", "TrainLogTable"]


"""
Copy of [`fsrs.card.CardDict`] with user_id FK
"""
TrainCardTable = Table(
    "train_card", get_metadata(),
    Column("user_id", ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("card_id", ForeignKey("cards.id", ondelete="CASCADE"), primary_key=True), 
    Column("state", Integer, nullable=False), 
    Column("step", Integer, nullable=True), 
    Column("stability", Float, nullable=True), 
    Column("difficulty", Float, nullable=True), 
    Column("due", DateTime(timezone=True), nullable=False), 
    Column("last_review", DateTime(timezone=True), nullable=True) 
)

"""
Copy of [`fsrs.card.ReviewLogDict`] with user_id FK and id PK
"""
TrainLogTable = Table(
    "train_log", get_metadata(),
    Column("id", Integer, primary_key=True),
    Column("user_id", ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False),
    Column("card_id", ForeignKey("cards.id", ondelete="CASCADE"), index=True, nullable=False),
    Column("rating", Integer, nullable=False),
    Column("review_datetime", DateTime(timezone=True), nullable=False),
    Column("review_duration", Integer, nullable=True)
)
