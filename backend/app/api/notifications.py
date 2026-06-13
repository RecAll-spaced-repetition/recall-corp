from fastapi import APIRouter, Response

from app.schemas import WebPushSubscription, WebPushOnlyEndPoint
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
async def unsubscribe_user_from_push(
        user_id: UserIdDep, subscription: WebPushOnlyEndPoint,
        notification_service: NotificationServiceDep
):
    await notification_service.unsubscribe(user_id, subscription)


@router.delete("/all", response_class=Response)
async def unsubscribe_user_from_push(
        user_id: UserIdDep,
        notification_service: NotificationServiceDep
):
    await notification_service.unsubscribe_user(user_id)


@router.post('/send/{user_id}', response_class=Response)
async def send_test_notfications(
    user_id: int, message: str,
    notification_service: NotificationServiceDep
):
    subs = await notification_service.get_user_subscriptions(user_id)
    subs_dicts = [sub.model_dump() for sub in subs]
    await push_notification(subs_dicts, message, message)
