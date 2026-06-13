from sqlalchemy import and_, select
from sqlalchemy.dialects.postgresql import insert

from app.db.models import NotificationSubscriptionTable

from .base import BaseSQLAlchemyRepository


__all__ = ["NotificationSubscriptionRepository"]


class NotificationSubscriptionRepository(BaseSQLAlchemyRepository):
    table = NotificationSubscriptionTable

    async def upsert_subscription(self, user_id: int, subscription: str) -> None:
        """Сохраняет подписку. Если такая подписка уже есть (тот же браузерный профиль),
        переприсваивает её текущему пользователю."""
        await self.connection.execute(
            insert(self.table)
            .values(subscription=subscription, user_id=user_id)
            .on_conflict_do_update(
                index_elements=[self.table.c.subscription],
                set_={"user_id": user_id},
            )
        )

    async def delete_subscription(self, subscription: str, user_id: int | None = None) -> None:
        filter_expr = self.table.c.subscription == subscription
        if user_id is not None:
            filter_expr = and_(filter_expr, self.table.c.user_id == user_id)
        await self.delete(filter_expr)

    async def get_user_subscriptions(self, user_id: int) -> list[str]:
        result = await self.connection.execute(
            select(self.table.c.subscription).where(self.table.c.user_id == user_id)
        )
        return list(result.scalars().all())
