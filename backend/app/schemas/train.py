from datetime import datetime

from pydantic import Field
from fsrs import Rating, Card, ReviewLog, State
from fsrs.card import CardDict

from .base import CamelCaseBaseModel


__all__ = ["TrainRecordCreate", "UserAnswer", "TrainCard", "TrainLog"]


class TrainRecordCreate(CamelCaseBaseModel):
    mark: int = Field(ge=1, le=4)

    def to_rating(self) -> Rating:
        return Rating(int(self.mark))


class UserAnswer(CamelCaseBaseModel):
    answer: str


class TrainCard(CamelCaseBaseModel):
    user_id: int

    card_id: int
    state: int
    step: int | None
    stability: float | None
    difficulty: float | None
    due: datetime
    last_review: datetime | None

    def to_fsrs_card(self) -> Card:
        return Card(
            card_id=self.card_id, 
            state=State(self.state), 
            step=self.step, 
            stability=self.stability, 
            difficulty=self.difficulty, 
            due=self.due, 
            last_review=self.last_review
        )
    
    @staticmethod
    def from_fsrs_card(user_id: int, card: Card):
        return TrainCard(
            user_id=user_id,
            card_id=card.card_id, 
            state=int(card.state), 
            step=card.step, 
            stability=card.stability, 
            difficulty=card.difficulty, 
            due=card.due, 
            last_review=card.last_review
        )



class TrainLog(CamelCaseBaseModel):
    id: int
    user_id: int

    card_id: int
    rating: int
    review_datetime: datetime
    review_duration: int | None

    def to_fsrs_review_log(self) -> ReviewLog:
        return ReviewLog(
            card_id=self.card_id, 
            rating=Rating(int(self.rating)), 
            review_datetime=self.review_datetime,
            review_duration=self.review_duration
        )