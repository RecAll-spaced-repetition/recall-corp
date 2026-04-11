from datetime import datetime

from pydantic import Field
from fsrs import Rating, Card, ReviewLog, State

from .base import CamelCaseBaseModel


__all__ = ["TrainMarkAnswer", "UserAnswer", "TrainCard", "TrainLog", "TrainLogCreate", "UserOptParams"]


class TrainMarkAnswer(CamelCaseBaseModel):
    mark: int = Field(ge=1, le=4)

    def to_fsrs_rating(self) -> Rating:
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

class TrainLogCreate(CamelCaseBaseModel):
    user_id: int

    card_id: int
    rating: int
    review_datetime: datetime
    review_duration: int | None

    def to_fsrs_review_log(self) -> ReviewLog:
        return ReviewLog(
            card_id=self.card_id, 
            rating=Rating(self.rating), 
            review_datetime=self.review_datetime,
            review_duration=self.review_duration
        )
    
    @staticmethod
    def from_fsrs_review_log(user_id: int, review_log: ReviewLog):
        return TrainLogCreate(
            user_id=user_id,
            card_id=review_log.card_id,
            rating=int(review_log.rating),
            review_datetime=review_log.review_datetime,
            review_duration=review_log.review_duration
        )

class TrainLog(TrainLogCreate):
    id: int

class UserOptParams(CamelCaseBaseModel):
    id: int
    train_logs_opt_cnt: int | None
    train_opt_params: list[float] | None