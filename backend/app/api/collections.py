from fastapi import APIRouter, Response

from app.schemas import Collection, CollectionCreate, CollectionShort, TrainPlan

from .dependencies import CollectionServiceDep, UserIdDep, UserIdSoftDep


router = APIRouter(
    prefix="/collections",
    tags=["collection"]
)


@router.get("/{collection_id}")
async def read_collection(
        collection_id: int, user_id: UserIdSoftDep, 
        collection_service: CollectionServiceDep
) -> Collection:
    return await collection_service.get_collection(collection_id, user_id)


@router.get("/", description="Returns collections' list without descriptions")
async def read_collections(
        user_id: UserIdSoftDep, collection_service: CollectionServiceDep, 
        limit: int = 100, skip: int = 0
) -> list[CollectionShort]:
    return await collection_service.get_collections(user_id, limit, skip)


@router.get("/{collection_id}/cards")
async def read_collection_cards(
        collection_id: int, user_id: UserIdSoftDep,
        collection_service: CollectionServiceDep,
) -> list[int]:
    return await collection_service.get_collection_cards(collection_id, user_id)


@router.get("/{collection_id}/train")
async def train_cards(
        user_id: UserIdDep, collection_id: int, collection_service: CollectionServiceDep
) -> TrainPlan:
    return await collection_service.get_collection_training_cards(user_id, collection_id)


@router.put("/{collection_id}/subscribe")
async def subscribe_to_collection(
        user_id: UserIdDep, collection_id: int, collection_service: CollectionServiceDep
) -> list[CollectionShort]:
    return await collection_service.change_subscription(user_id, collection_id, True)


@router.put("/{collection_id}/unsubscribe")
async def unsubscribe_from_collection(
        user_id: UserIdDep, collection_id: int, collection_service: CollectionServiceDep
) -> list[CollectionShort]:
    return await collection_service.change_subscription(user_id, collection_id, False)


@router.post("/")
async def create_collection(
        user_id: UserIdDep, collection: CollectionCreate, collection_service: CollectionServiceDep
) -> Collection:
    return await collection_service.add_collection(user_id, collection)


@router.put("/{collection_id}")
async def update_collection(
        user_id: UserIdDep, collection_id: int, new_collection: CollectionCreate,
        collection_service: CollectionServiceDep
) -> Collection:
    return await collection_service.update_user_collection(user_id, collection_id, new_collection)


@router.put("/{collection_id}/publicity")
async def update_collection_publicity(
        user_id: UserIdDep, collection_id: int, is_public: bool,
        collection_service: CollectionServiceDep
) -> Collection:
    return await collection_service.update_collection_publicity(user_id, collection_id, is_public)


@router.delete("/{collection_id}", response_class=Response)
async def delete_collection(
        user_id: UserIdDep, collection_id: int, collection_service: CollectionServiceDep
):
    return await collection_service.delete_collection(user_id, collection_id)
