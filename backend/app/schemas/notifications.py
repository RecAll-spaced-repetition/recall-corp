from .base import CamelCaseBaseModel


__all__ = ["WebPushKeys", "WebPushSubscription"]


class WebPushKeys(CamelCaseBaseModel):
    p256dh: str
    auth: str


class WebPushSubscription(CamelCaseBaseModel):
    """Подписка в формате `PushSubscription.toJSON()`, который ожидает pywebpush."""
    endpoint: str
    keys: WebPushKeys
