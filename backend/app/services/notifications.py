from fastapi import HTTPException

from app.repositories import NotificationSubscriptionRepository, UserRepository
from app.schemas import WebPushSubscription, WebPushOnlyEndPoint

from .base import BaseService, with_unit_of_work


__all__ = ["NotificationService"]


class NotificationService(BaseService):
    @with_unit_of_work
    async def subscribe(self, user_id: int, subscription: WebPushSubscription) -> None:
        if not await self.uow.get_repository(UserRepository).exists_user_with_id(user_id):
            raise HTTPException(status_code=401, detail="Authorized user doesn't exist")
        await self.uow.get_repository(NotificationSubscriptionRepository).create_subscription(
            subscription.to_dto(user_id)
        )

    @with_unit_of_work
    async def unsubscribe(self, user_id: int, subscription: WebPushOnlyEndPoint) -> None:
        await self.uow.get_repository(NotificationSubscriptionRepository).delete_subscription(
            user_id, subscription.endpoint
        )

    @with_unit_of_work
    async def unsubscribe_user(self, user_id) -> None:
        await self.uow.get_repository(NotificationSubscriptionRepository).delete_user_subscriptions(
            user_id
        )

    @with_unit_of_work
    async def get_user_subscriptions(self, user_id: int) -> list[WebPushSubscription]:
        dtos = await self.uow.get_repository(NotificationSubscriptionRepository).get_user_subscriptions(user_id)
        return [WebPushSubscription.from_dto(dto) for dto in dtos]
