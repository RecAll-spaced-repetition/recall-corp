from fastapi import APIRouter, Response

from app.schemas import WebPushSubscription
from app.core import push_notification

from .dependencies import NotificationServiceDep, UserIdDep


router = APIRouter(
    prefix="/web-push",
    tags=["web-push"]
)


@router.post("/", response_class=Response)
async def subscribe_to_push(
        user_id: UserIdDep, subscription: WebPushSubscription,
        notification_service: NotificationServiceDep
):
    await notification_service.subscribe(user_id, subscription)


@router.delete("/", response_class=Response)
async def unsubscribe_from_push(
        user_id: UserIdDep, subscription: WebPushSubscription,
        notification_service: NotificationServiceDep
):
    await notification_service.unsubscribe(user_id, subscription)


@router.post('/send/{user_id}', response_class=Response)
async def send_test_notfications(
    user_id: int, message: str,
    notification_service: NotificationServiceDep
):
    subs = await notification_service.get_user_subscriptions(user_id)
    push_notification(subs, message, message)
