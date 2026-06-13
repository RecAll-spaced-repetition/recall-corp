from sqlalchemy import Column, ForeignKey, String, Table, DateTime, func

from .metadata import get_metadata


__all__ = ["NotificationSubscriptionTable"]


NotificationSubscriptionTable = Table(
    "notifications_subscriptions", get_metadata(),
    Column("user_id", ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True),
    Column("endpoint", String, primary_key=True),
    Column("p256dh", String, nullable=False),
    Column("auth", String, nullable=False),
    Column("created_at", DateTime(timezone=True), server_default=func.now()),
)
