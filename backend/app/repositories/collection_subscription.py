from sqlalchemy import and_, select, insert, update, func
from typing import Type

from app.db.models import CollectionTable, CollectionSubscriptionTable

from .base import BaseSQLAlchemyRepository, SchemaType


__all__ = ["CollectionSubscriptionRepository"]


class CollectionSubscriptionRepository(BaseSQLAlchemyRepository):
    collection_table = CollectionTable
    table = CollectionSubscriptionTable

    async def has_subscription(self, user_id: int, collection_id: int) -> bool:
        return await self.exists(and_(self.table.c.user_id == user_id, self.table.c.collection_id == collection_id))

    async def subscribe(self, user_id: int, collection_id: int):
        await self.connection.execute(insert(self.table), { 'user_id': user_id, 'collection_id': collection_id })

    async def unsubscribe(self, user_id: int, collection_id: int):
        await self.delete(and_(self.table.c.user_id == user_id, self.table.c.collection_id == collection_id))
    
    async def get_user_subscriptions(self, user_id: int, offset: int, limit: int | None, output_schema: Type[SchemaType]) -> SchemaType:
        query = (
            select(self.collection_table.c[*output_schema.fields()])
                .join(self.table, self.table.c.user_id == user_id)
                .where(self.table.c.collection_id == self.collection_table.c.id)
                .offset(offset)
        )
        if limit is not None:
            query = query.limit(limit)
        result = await self.connection.execute(query)
        return [output_schema(**elem) for elem in result.mappings().all()]