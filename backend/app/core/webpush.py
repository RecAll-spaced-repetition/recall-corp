import json
import logging
from pywebpush import webpush, WebPushException

from .config import get_settings


logger = logging.getLogger(__name__)

__settings = get_settings()

__all__ = ["push_notification"]


def push_notification(subscriptions: list[str], title: str, body: str, url: str = '/') -> list[str]:
    """Шлёт уведомление по списку подписок (синхронно, из async-кода запускать в thread'е).

    Возвращает протухшие подписки (push-сервис ответил 404/410) — их нужно удалить из БД.
    """
    expired_subscriptions = []
    data = json.dumps({
        'title': title,
        'body': body,
        'data': {'url': url},
    })
    for subscription in subscriptions:
        try:
            webpush(
                subscription_info=json.loads(subscription),
                data=data,
                vapid_private_key=__settings.notifications.VAPID_PRIVATE_KEY,
                vapid_claims={'sub': __settings.notifications.VAPID_SUBJECT},
            )
        except WebPushException as ex:
            if ex.response is not None and ex.response.status_code in (404, 410):
                expired_subscriptions.append(subscription)
            else:
                logger.error("Web push failed: %r", ex)
    return expired_subscriptions
