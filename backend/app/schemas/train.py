from datetime import date, datetime, timezone, timedelta

from typing import Literal, Union
from pydantic import Field, RootModel
from fsrs import Rating, Card, ReviewLog, State, Scheduler

from .base import CamelCaseBaseModel, IdMixin
from .collection import CollectionShort


__all__ = [
    "TrainMarkAnswer",
    "TrainNever",
    "TrainNow",
    "TrainDue",
    "TrainPlan",
    "TrainWhen",
    "CollectionStats",
    "TrainCard",
    "TrainLog",
    "TrainLogCreate",
    "DayStat",
    "AllStats",
    "UserOptParams",
    "TrainCardExt",
]


class TrainMarkAnswer(CamelCaseBaseModel):
    mark: int = Field(ge=1, le=4)
    duration_ms: int | None

    def to_fsrs_rating(self) -> Rating:
        return Rating(int(self.mark))
    

class TrainNever(CamelCaseBaseModel):
    type: Literal["never"]
    

class TrainNow(CamelCaseBaseModel):
    type: Literal["now"]
    

class TrainDue(CamelCaseBaseModel):
    type: Literal["due"]
    due: datetime


class TrainWhen(CollectionShort):
    when: Union[TrainNever, TrainNow, TrainDue] = Field(discriminator='type')

    @staticmethod
    def from_collection_short(collection: CollectionShort, when: Union[TrainNever, TrainNow, TrainDue]):
        return TrainWhen(
            id=collection.id,
            is_public=collection.is_public,
            owner_id=collection.owner_id,
            title=collection.title,
            when=when
        )


class TrainPlan(IdMixin):
    cards_to_train: list[int]


class CollectionStats(IdMixin):
    avg_current_retrievability: float | None
    avg_stability: float | None
    avg_difficulty: float | None
    avg_after_year_retrievability: float | None

    @staticmethod
    def from_cards_with_scheduler(id: int, all_cards_len: int, trained_cards: list[Card], scheduler: Scheduler):
        if all_cards_len == 0:
            return CollectionStats(
                id=id,
                avg_current_retrievability=None, 
                avg_after_year_retrievability=None,
                avg_stability=None,
                avg_difficulty=None
            )

        avg_curr_r = 0.0
        avg_year_r = 0.0
        avg_s = 0.0
        avg_d = 0.0
        now_utc = datetime.now(timezone.utc)
        year_utc = now_utc.replace(year=now_utc.year + 1)
        for card in trained_cards:
            avg_curr_r += scheduler.get_card_retrievability(card, now_utc)
            avg_year_r += scheduler.get_card_retrievability(card, year_utc)
            avg_s += card.stability
            avg_d += card.difficulty
        avg_curr_r /= all_cards_len
        avg_year_r /= all_cards_len
        avg_s /= all_cards_len
        avg_d = (avg_d + (all_cards_len - len(trained_cards)) * 5.0) / all_cards_len

        return CollectionStats(
            id=id,
            avg_current_retrievability=avg_curr_r, 
            avg_after_year_retrievability=avg_year_r,
            avg_stability=avg_s,
            avg_difficulty=avg_d
        )


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


class TrainCardExt(TrainCard):
    current_retrievability: float | None
    after_year_retrievability: float | None
    
    @staticmethod
    def from_fsrs_card(user_id: int, card: Card, curr_r: float | None, year_r: float | None):
        return TrainCardExt(
            user_id=user_id,
            card_id=card.card_id, 
            state=int(card.state), 
            step=card.step, 
            stability=card.stability, 
            difficulty=card.difficulty, 
            due=card.due, 
            last_review=card.last_review,
            current_retrievability=curr_r,
            after_year_retrievability=year_r
        )
    
    @staticmethod
    def from_fsrs_card_with_scheduler(user_id: int, card: Card, scheduler: Scheduler):
        now_utc = datetime.now(timezone.utc)
        year_utc = now_utc.replace(year=now_utc.year + 1)
        curr_r = scheduler.get_card_retrievability(card, now_utc)
        year_r = scheduler.get_card_retrievability(card, year_utc)
        return TrainCardExt(
            user_id=user_id,
            card_id=card.card_id, 
            state=int(card.state), 
            step=card.step, 
            stability=card.stability, 
            difficulty=card.difficulty, 
            due=card.due, 
            last_review=card.last_review,
            current_retrievability=curr_r,
            after_year_retrievability=year_r
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


class DayStat(CamelCaseBaseModel):
    train_date: date
    cnt: int
    avg_mark: float
    total_duration: int
    logs: list[TrainLog]

    @staticmethod
    def from_train_logs(all_logs: list[TrainLog]):
        """
        Собирает из всего списка логи до тех пор, пока не сменится день.
        
        Бросает исключение, если список пустой
        """
        l = len(all_logs)
        if l == 0:
            raise TypeError("DayStat can be constructed only from not empty list")
        train_date = all_logs[0].review_datetime.date()
        cnt = 0
        avg_mark = 0.0
        total_duration = 0
        logs: list[TrainLog] = []
        i = 0
        while i < l and train_date == all_logs[i].review_datetime.date():
            new_log = all_logs[i]
            cnt += 1
            avg_mark += new_log.rating
            total_duration += new_log.review_duration if new_log.review_duration != None else 0
            logs.append(new_log)
            i += 1

        avg_mark /= cnt
        return DayStat(
            train_date=train_date, 
            cnt=cnt, 
            avg_mark=avg_mark, 
            total_duration=total_duration, 
            logs=logs
        )


class AllStats(CamelCaseBaseModel):
    curr_streak: int
    max_streak: int
    stats: list[DayStat]

    @staticmethod
    def from_train_logs(all_logs: list[TrainLog]):
        max_streak = 0
        curr_streak = 0
        streak = 0
        stats: list[DayStat] = []
        prev_date: date | None = None
        today = datetime.now(timezone.utc).date()
        i = 0
        l = len(all_logs)
        while i < l:
            day_stat = DayStat.from_train_logs(all_logs[i:])
            stats.append(day_stat)

            if day_stat.train_date == today:
                curr_streak += 1
                today -= timedelta(days=1)

            if prev_date != None and prev_date - day_stat.train_date == timedelta(days=1):
                streak += 1
            elif prev_date != day_stat.train_date:
                max_streak = max(max_streak, streak)
                streak = 1

            prev_date = day_stat.train_date
            i += day_stat.cnt
        
        return AllStats(curr_streak=curr_streak, max_streak=max_streak, stats=stats)


class UserOptParams(CamelCaseBaseModel):
    id: int
    train_logs_opt_cnt: int | None
    train_opt_params: list[float] | None
