from sqlalchemy import Column, Integer, String, Table, ARRAY, Float

from .metadata import get_metadata


__all__ = ["UserTable"]


UserTable = Table(
    "users", get_metadata(),
    Column("id", Integer, primary_key=True),
    Column("email", String(100), unique=True, index=True, nullable=False),
    Column("nickname", String(35), unique=True, index=True, nullable=False),
    Column("hashed_password", String(1024), nullable=False),
    Column("train_logs_opt_cnt", Integer, default=0),
    Column("train_opt_params", ARRAY(Float), nullable=True)
)
