from typing import Annotated
from fastapi import Depends, Body

from app.core import get_profile_id, get_profile_id_soft
from app.services import CardService, UserService, CollectionService, TrainService, StorageService


__all__ = [
    "CardServiceDep", "CollectionServiceDep", 
    "TrainCardServiceDep", "StorageServiceDep",
    "UserIdDep", "UserIdSoftDep",
    "UserServiceDep", "IntListBody"
]


UserIdDep = Annotated[int, Depends(get_profile_id)]
UserIdSoftDep = Annotated[int | None, Depends(get_profile_id_soft)]
UserServiceDep = Annotated[UserService, Depends()]
CardServiceDep = Annotated[CardService, Depends()]
CollectionServiceDep = Annotated[CollectionService, Depends()]
TrainCardServiceDep = Annotated[TrainService, Depends()]
StorageServiceDep = Annotated[StorageService, Depends()]

IntListBody = Annotated[list[int], Body(min_length=1, max_length=100)]
