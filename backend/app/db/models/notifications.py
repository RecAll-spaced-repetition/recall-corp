from sqlalchemy import Column, ForeignKey, String, Table

from .metadata import get_metadata


__all__ = ["NotificationSubscriptionTable"]


NotificationSubscriptionTable = Table(
    "notifications_subscriptions", get_metadata(),
    Column("subscription", String, primary_key=True),
    Column("user_id", ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True),
)
