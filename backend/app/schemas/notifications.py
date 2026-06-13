from .base import CamelCaseBaseModel


__all__ = ["NotificationSubscriptionDTO", "WebPushKeys", "WebPushOnlyEndPoint", "WebPushSubscription"]

class NotificationSubscriptionDTO(CamelCaseBaseModel):
    user_id: int
    endpoint: str
    p256dh: str
    auth: str

class WebPushKeys(CamelCaseBaseModel):
    p256dh: str
    auth: str


class WebPushOnlyEndPoint(CamelCaseBaseModel):
    endpoint: str


class WebPushSubscription(WebPushOnlyEndPoint):
    keys: WebPushKeys

    def to_dto(self, user_id: int) -> NotificationSubscriptionDTO:
        return NotificationSubscriptionDTO(
            user_id=user_id, endpoint=self.endpoint, p256dh=self.keys.p256dh, auth=self.keys.auth
        )
    
    @staticmethod
    def from_dto(dto: NotificationSubscriptionDTO):
        return WebPushSubscription(endpoint=dto.endpoint, keys=WebPushKeys(p256dh=dto.p256dh, auth=dto.auth))
