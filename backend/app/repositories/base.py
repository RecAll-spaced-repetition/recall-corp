from abc import ABC, abstractmethod
from sqlalchemy import Table, insert, select, update, delete, exists
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncConnection
from typing import Type, TypeVar

from app.schemas import CamelCaseBaseModel


__all__ = ["BaseRepository", "BaseSQLAlchemyRepository", "SchemaType"]


SchemaType = TypeVar("SchemaType", bound=CamelCaseBaseModel)


class BaseRepository(ABC):
    @abstractmethod
    async def create_one(self, input_data, output_schema):
        raise NotImplementedError

    @abstractmethod
    async def upsert_one(self, input_data, output_schema, index_elements=None, set_=None):
        raise NotImplementedError

    @abstractmethod
    async def get_one_or_none(self, filter_expr, output_schema):
        raise NotImplementedError

    @abstractmethod
    async def get_all(self, output_schema, limit, offset):
        raise NotImplementedError

    @abstractmethod
    async def get_all_filtered(self, filter_expr, output_schema):
        raise NotImplementedError

    @abstractmethod
    async def update_one(self, filter_expr, update_values, output_schema):
        raise NotImplementedError

    @abstractmethod
    async def delete(self, filter_expr):
        raise NotImplementedError

    @abstractmethod
    async def exists(self, filter_expr):
        raise NotImplementedError


class BaseSQLAlchemyRepository(BaseRepository):
    table: Table = ...

    def __init__(self, conn: AsyncConnection):
        self.connection = conn

    def _item_id_filter(self, item_id: int):
        return self.table.c.id == item_id

    async def create_one(self, input_data: dict, output_schema: Type[SchemaType]) -> SchemaType:
        result = await self.connection.execute(
            insert(self.table)
            .values(**input_data)
            .returning(self.table.c[*output_schema.fields()])
        )
        return output_schema(**result.mappings().first())

    async def upsert_one(
            self, input_data: dict, output_schema: Type[SchemaType],
            index_elements: list[str] | None = None, set_: dict | None = None
    ) -> SchemaType:
        """INSERT ... ON CONFLICT DO UPDATE (PostgreSQL).

        По умолчанию конфликт ловится по первичному ключу, а обновляются все переданные
        колонки кроме тех, что входят в конфликтный ключ. `index_elements`/`set_` позволяют
        переопределить целевые колонки и набор обновляемых значений.
        """
        insert_stmt = pg_insert(self.table).values(**input_data)
        conflict_cols = index_elements or [col.name for col in self.table.primary_key.columns]
        if set_ is None:
            set_ = {
                name: insert_stmt.excluded[name]
                for name in input_data
                if name not in conflict_cols
            }
        result = await self.connection.execute(
            insert_stmt
            .on_conflict_do_update(index_elements=conflict_cols, set_=set_)
            .returning(self.table.c[*output_schema.fields()])
        )
        return output_schema(**result.mappings().first())

    async def get_one_or_none(self, filter_expr, output_schema: Type[SchemaType]) -> SchemaType | None:
        result = (await self.connection.execute(
            select(self.table.c[*output_schema.fields()])
            .where(filter_expr)
        )).mappings().first()
        return result and output_schema(**result)

    async def get_all(
            self, output_schema: Type[SchemaType], limit: int, offset: int
    ) -> list[SchemaType]:
        result = await self.connection.execute(
            select(self.table.c[*output_schema.fields()])
            .limit(limit).offset(offset)
        )
        return [output_schema(**elem) for elem in result.mappings().all()]

    async def get_all_filtered(
            self, filter_expr, output_schema: Type[SchemaType]
    ) -> list[SchemaType]:
        result = await self.connection.execute(
            select(self.table.c[*output_schema.fields()])
            .where(filter_expr)
        )
        return [output_schema(**elem) for elem in result.mappings().all()]

    async def update_one(
            self, filter_expr, update_values: dict, output_schema: Type[SchemaType]
    ) -> SchemaType:
        result = await self.connection.execute(
            update(self.table)
            .where(filter_expr)
            .values(**update_values)
            .returning(self.table.c[*output_schema.fields()])
        )
        return output_schema(**result.mappings().first())

    async def delete(self, filter_expr) -> None:
        await self.connection.execute(delete(self.table).where(filter_expr))

    async def exists(self, filter_expr) -> bool:
        result = await self.connection.execute(select(exists().where(filter_expr)))
        return result.scalar_one()
