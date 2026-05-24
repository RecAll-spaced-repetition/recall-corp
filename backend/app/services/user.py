from fastapi import HTTPException

from app.core import get_password_hash, verify_password
from app.repositories import (
    CardRepository,
    CollectionRepository,
    CollectionSubscriptionRepository,
    FileRepository,
    UserRepository,
)
from app.schemas import CollectionShort, User, UserAuth, UserBase, UserCreate, UserDTO

from .base import BaseService, with_unit_of_work

__all__ = ["UserService"]


class UserService(BaseService):
    @with_unit_of_work
    async def register_user(self, user: UserCreate) -> User:
        user_repo = self.uow.get_repository(UserRepository)

        register_data = UserDTO(**user.model_dump()).table_dict()

        if len(await user_repo.find_users_by_creds(register_data)) > 0:
            # TODO: вызывать кастомное исключение
            raise HTTPException(status_code=400)

        register_data["hashed_password"] = get_password_hash(register_data["hashed_password"])

        return await user_repo.create_one(register_data, User)

    @with_unit_of_work
    async def get_user(self, user_id: int) -> User:
        user_repo = self.uow.get_repository(UserRepository)
        user = await user_repo.get_user_by_id(user_id, User)

        if user is None:
            # TODO: вызывать кастомное исключение
            raise HTTPException(status_code=400)

        return user

    @with_unit_of_work
    async def get_user_subscriptions(
        self,
        user_id: int,
        offset: int = 0,
        limit: int | None = None,
    ) -> list[CollectionShort]:
        user_repo = self.uow.get_repository(UserRepository)

        if not await user_repo.exists_user_with_id(user_id):
            # TODO: вызывать кастомное исключение
            raise HTTPException(status_code=400)

        collection_sub_repo = self.uow.get_repository(CollectionSubscriptionRepository)

        return await collection_sub_repo.get_user_subscriptions(
            user_id=user_id,
            offset=offset,
            limit=limit,
            output_schema=CollectionShort,
        )

    @with_unit_of_work
    async def get_user_collections(
        self,
        user_id: int,
        offset: int = 0,
        limit: int | None = None,
    ) -> list[CollectionShort]:
        user_repo = self.uow.get_repository(UserRepository)

        if not await user_repo.exists_user_with_id(user_id):
            # TODO: вызывать кастомное исключение
            raise HTTPException(status_code=400)

        collection_repo = self.uow.get_repository(CollectionRepository)

        return await collection_repo.get_owner_collections(
            owner_id=user_id,
            limit=limit,
            offset=offset,
            output_schema=CollectionShort,
        )

    @with_unit_of_work
    async def get_user_cards(
        self,
        user_id: int,
        offset: int = 0,
        limit: int | None = None,
    ) -> list[int]:
        user_repo = self.uow.get_repository(UserRepository)

        if not await user_repo.exists_user_with_id(user_id):
            # TODO: вызывать кастомное исключение
            raise HTTPException(status_code=400)

        card_repo = self.uow.get_repository(CardRepository)

        return await card_repo.get_owner_cards(user_id, limit, offset)

    @with_unit_of_work
    async def get_user_files(
        self,
        user_id: int,
        offset: int = 0,
        limit: int | None = None,
    ) -> list[int]:
        user_repo = self.uow.get_repository(UserRepository)

        if not await user_repo.exists_user_with_id(user_id):
            # TODO: вызывать кастомное исключение
            raise HTTPException(status_code=400)

        file_repo = self.uow.get_repository(FileRepository)

        return await file_repo.get_by_owner(user_id, limit, offset)

    @with_unit_of_work
    async def update_profile(self, user_id: int, user_data: UserBase) -> User:
        user_repo = self.uow.get_repository(UserRepository)

        update_values = user_data.model_dump()
        users_with_data = await user_repo.find_users_by_creds(update_values)

        if (
            len(users_with_data) == 1
            and users_with_data[0] != user_id
            or len(users_with_data) > 1
        ):
            # TODO: вызывать кастомное исключение
            raise HTTPException(status_code=400)

        return await user_repo.update_user_by_id(user_id, update_values, User)

    @with_unit_of_work
    async def delete_profile(self, user_id: int) -> None:
        user_repo = self.uow.get_repository(UserRepository)

        if not await user_repo.exists_user_with_id(user_id):
            # TODO: вызывать кастомное исключение
            raise HTTPException(status_code=400)

        await user_repo.delete_user_by_id(user_id)

    @with_unit_of_work
    async def authenticate_user(self, user_data: UserAuth):
        user_repo = self.uow.get_repository(UserRepository)

        auth_data = UserDTO(email=user_data.email).table_dict()
        user = await user_repo.get_user_by_columns(auth_data, UserDTO)

        if user is None or not verify_password(user_data.password, user.password):
            # TODO: вызывать кастомное исключение
            raise HTTPException(status_code=400)

        return User(**user.model_dump())
