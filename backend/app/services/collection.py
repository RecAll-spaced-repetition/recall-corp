from fastapi import HTTPException

from app.repositories import (
    CardCollectionRepository,
    CardRepository,
    CollectionRepository,
    CollectionSubscriptionRepository,
    FileCardRepository,
    UserRepository,
)
from app.schemas import Collection, CollectionCreate, CollectionShort, PublicStatusMixin

from .base import BaseService, with_unit_of_work

__all__ = ["CollectionService"]


class CollectionService(BaseService):
    @with_unit_of_work
    async def add_collection(self, user_id: int, collection: CollectionCreate) -> Collection:
        user_repo = self.uow.get_repository(UserRepository)

        if not await user_repo.exists_user_with_id(user_id):
            raise HTTPException(status_code=401, detail="Authorized user doesn't exist")

        collection_data = collection.model_dump()
        collection_data["owner_id"] = user_id

        collection_repo = self.uow.get_repository(CollectionRepository)

        return await collection_repo.create_one(collection_data, Collection)

    @with_unit_of_work
    async def get_collection(self, collection_id: int, user_id: int | None) -> Collection:
        collection_repo = self.uow.get_repository(CollectionRepository)
        collection = await collection_repo.get_collection_by_id(collection_id, Collection)

        if collection is None:
            raise HTTPException(status_code=404, detail="Collection not found")

        if not collection.is_public and collection.owner_id != user_id:
            raise HTTPException(status_code=403, detail="This collection is private")

        return collection

    @with_unit_of_work
    async def get_collections(
        self,
        user_id: int | None,
        limit: int,
        offset: int,
    ) -> list[CollectionShort]:
        collection_repo = self.uow.get_repository(CollectionRepository)

        return await collection_repo.get_all_visible_collections(
            user_id=user_id,
            output_schema=CollectionShort,
            limit=limit,
            offset=offset,
        )

    @with_unit_of_work
    async def get_collection_cards(self, collection_id: int, user_id: int | None) -> list[int]:
        # WHY: проверка существования коллекции и приватности
        await self.get_collection(collection_id, user_id)

        card_collection_repo = self.uow.get_repository(CardCollectionRepository)

        return await card_collection_repo.get_collection_cards(collection_id)

    @with_unit_of_work
    async def update_user_collection(
        self,
        user_id: int,
        collection_id: int,
        new_collection: CollectionCreate,
    ) -> Collection:
        collection_repo = self.uow.get_repository(CollectionRepository)

        if not await collection_repo.exists_collection_with_owner(user_id, collection_id):
            raise HTTPException(
                status_code=401,
                detail="Only authorized owners can edit collections",
            )

        return await collection_repo.update_collection_by_id(
            collection_id=collection_id,
            update_values=new_collection.model_dump(),
            output_schema=Collection,
        )

    @with_unit_of_work
    async def update_collection_publicity(
        self,
        user_id: int,
        collection_id: int,
        is_public: bool,
    ) -> Collection:
        collection_repo = self.uow.get_repository(CollectionRepository)

        if not await collection_repo.exists_collection_with_owner(user_id, collection_id):
            raise HTTPException(
                status_code=401,
                detail="Only authorized owners can change their collections' publicity",
            )

        collection = await collection_repo.update_collection_by_id(
            collection_id=collection_id,
            update_values={"is_public": is_public},
            output_schema=Collection,
        )

        card_collection_repo = self.uow.get_repository(CardCollectionRepository)
        updated_cards = await card_collection_repo.update_cards_publicity(
            collection_id=collection_id,
            is_public=is_public,
            output_schema=PublicStatusMixin,
        )

        file_card_repo = self.uow.get_repository(FileCardRepository)

        for updated_card in updated_cards:
            await file_card_repo.update_files_publicity(
                card_id=updated_card.id,
                is_public=updated_card.is_public,
                output_schema=PublicStatusMixin,
            )

        # TODO: Надо отписать всех кроме owner'а
        return collection

    @with_unit_of_work
    async def delete_collection(self, user_id: int, collection_id: int) -> None:
        collection_repo = self.uow.get_repository(CollectionRepository)

        if not await collection_repo.exists_collection_with_owner(user_id, collection_id):
            raise HTTPException(
                status_code=401,
                detail="Only authorized owners can delete collections",
            )

        card_collection_repo = self.uow.get_repository(CardCollectionRepository)
        collection_cards = set(await card_collection_repo.get_collection_cards(collection_id))

        await collection_repo.delete_collection(collection_id)

        cards_with_collections = await card_collection_repo.filter_cards_with_collection(
            cards=collection_cards
        )

        cards_without_collections = collection_cards.difference(cards_with_collections)

        card_repo = self.uow.get_repository(CardRepository)
        file_card_repo = self.uow.get_repository(FileCardRepository)

        for card_id in cards_without_collections:
            files_ids = await file_card_repo.get_card_files_ids(card_id)

            await card_repo.delete_card(card_id)

            await file_card_repo.refresh_files_publicity(files_ids, PublicStatusMixin)

        for card_id in cards_with_collections:
            updated_card = await card_collection_repo.refresh_card_publicity(
                card_id=card_id,
                output_schema=PublicStatusMixin,
            )

            await file_card_repo.update_files_publicity(
                card_id=updated_card.id,
                is_public=updated_card.is_public,
                output_schema=PublicStatusMixin,
            )

    @with_unit_of_work
    async def change_subscription(
        self,
        user_id: int,
        collection_id: int,
        subscription_value: bool,
    ) -> list[CollectionShort]:
        user_repo = self.uow.get_repository(UserRepository)

        if not await user_repo.exists_user_with_id(user_id):
            raise HTTPException(
                status_code=401,
                detail="Only authorized users can train collections",
            )

        # WHY: проверка существования коллекции и приватности
        await self.get_collection(collection_id, user_id)

        collection_subscription_repo = self.uow.get_repository(CollectionSubscriptionRepository)
        has_subscription = await collection_subscription_repo.has_subscription(
            user_id=user_id,
            collection_id=collection_id,
        )

        if subscription_value and not has_subscription:
            await collection_subscription_repo.subscribe(user_id, collection_id)

        elif not subscription_value and has_subscription:
            await collection_subscription_repo.unsubscribe(user_id, collection_id)

        return await collection_subscription_repo.get_user_subscriptions(
            user_id=user_id,
            offset=0,
            limit=None,
            output_schema=CollectionShort,
        )
