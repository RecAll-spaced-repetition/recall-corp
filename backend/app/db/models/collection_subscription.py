from sqlalchemy import Column, ForeignKey, Table

from .metadata import get_metadata


__all__ = ["CollectionSubscriptionTable"]


CollectionSubscriptionTable = Table(
    "collection_subscription", get_metadata(),
    Column("user_id", ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("collection_id", ForeignKey("collections.id", ondelete="CASCADE"), primary_key=True)
)
