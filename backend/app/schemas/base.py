from functools import cache
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


__all__ = ["CamelCaseBaseModel", "IdMixin", "PublicStatusMixin"]


class CamelCaseBaseModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    @classmethod
    @cache
    def fields(cls) -> list[str]:
        """Возвращает список названий полей модели для использования в запросах к базе данных."""
        return list(cls.model_fields.keys())


class IdMixin(CamelCaseBaseModel):
    id: int


class PublicStatusMixin(IdMixin):
    is_public: bool
