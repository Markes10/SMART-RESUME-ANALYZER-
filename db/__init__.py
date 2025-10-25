"""
Database package initialization.
Makes db a package and re-exports essential database functions.
"""

from .config import (
    init_db_pool,
    get_db_connection,
    close_db_connection
)
from .database import DatabaseOperations

__all__ = [
    'init_db_pool',
    'get_db_connection',
    'close_db_connection',
    'DatabaseOperations'
]
