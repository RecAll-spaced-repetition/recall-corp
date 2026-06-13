import asyncio
import json
import logging

import aiohttp
from pywebpush import webpush_async, WebPushException

from .config import get_settings


logger = logging.getLogger(__name__)

__settings = get_settings()

__all__ = ["push_notification"]


async def _send_one(session: aiohttp.ClientSession, subscription: dict, data: str) -> bool:
    """Шлёт один пуш. Возвращает True, если подписка протухла (404/410) и её надо удалить."""
    try:
        await webpush_async(
            subscription_info=subscription,
            data=data,
            vapid_private_key=__settings.notifications.VAPID_PRIVATE_KEY,
            # claims мутируется внутри (дописывается aud/exp эндпоинта) — свежий dict на каждый вызов
            vapid_claims={'sub': __settings.notifications.VAPID_SUBJECT},
            aiohttp_session=session,
        )
        return False
    except WebPushException as ex:
        # у aiohttp-ответа статус в .status (а не .status_code, как у requests)
        if getattr(ex.response, 'status', None) in (404, 410):
            return True
        logger.error("Web push failed: %r", ex)
        return False


async def push_notification(subscriptions: list[dict], title: str, body: str, url: str = '/') -> list[dict]:
    """Асинхронно шлёт уведомление по списку подписок, переиспользуя один aiohttp-сессион.

    Возвращает протухшие подписки (push-сервис ответил 404/410) — их нужно удалить из БД.
    """
    data = json.dumps({
        'title': title,
        'body': body,
        'data': {'url': url},
    })
    async with aiohttp.ClientSession() as session:
        results = await asyncio.gather(
            *(_send_one(session, subscription, data) for subscription in subscriptions)
        )
    return [sub for sub, expired in zip(subscriptions, results) if expired]
