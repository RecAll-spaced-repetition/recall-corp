from sqlalchemy import and_

from app.db.models import NotificationSubscriptionTable
from app.schemas import NotificationSubscriptionDTO

from .base import BaseSQLAlchemyRepository


__all__ = ["NotificationSubscriptionRepository"]


class NotificationSubscriptionRepository(BaseSQLAlchemyRepository):
    table = NotificationSubscriptionTable

    async def create_subscription(self, data: NotificationSubscriptionDTO):
        # upsert по endpoint (PK): повторная подписка того же браузера или смена
        # владельца на общем устройстве переписывает user_id/ключи, а не падает на дубле
        await self.upsert_one(data.model_dump(), NotificationSubscriptionDTO)

    async def delete_subscription(self, user_id: int, endpoint: str) -> None:
        await self.delete(and_(self.table.c.user_id == user_id, self.table.c.endpoint == endpoint))

    async def delete_user_subscriptions(self, user_id: int) -> None:
        await self.delete(self.table.c.user_id == user_id)

    async def get_user_subscriptions(self, user_id: int) -> list[NotificationSubscriptionDTO]:
        return await self.get_all_filtered(self.table.c.user_id == user_id, NotificationSubscriptionDTO)
