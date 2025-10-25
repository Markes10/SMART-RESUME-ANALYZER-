"""
Base database operations class
"""
from typing import Any, Dict, List, Optional
import mysql.connector
from .config import get_db_connection, close_db_connection
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLAlchemy (optional) - provides Base for ORM models
# Use DATABASE_URL if provided, otherwise fallback to a local sqlite file for development
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dev.db")

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Yield a SQLAlchemy session (FastAPI dependency style)."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class DatabaseOperations:
    def __init__(self, table_name: str):
        self.table_name = table_name

    def execute_query(self, query: str, params: tuple = None) -> Any:
        """Execute a database query"""
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        try:
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            if query.strip().upper().startswith('SELECT'):
                result = cursor.fetchall()
            else:
                connection.commit()
                result = cursor.lastrowid
            return result
        except mysql.connector.Error as e:
            connection.rollback()
            raise e
        finally:
            cursor.close()
            close_db_connection(connection)

    def get_by_id(self, id: int) -> Optional[Dict]:
        """Get a record by ID"""
        query = f"SELECT * FROM {self.table_name} WHERE id = %s"
        result = self.execute_query(query, (id,))
        return result[0] if result else None

    def get_all(self) -> List[Dict]:
        """Get all records"""
        query = f"SELECT * FROM {self.table_name}"
        return self.execute_query(query)

    def create(self, data: Dict) -> int:
        """Create a new record"""
        fields = ', '.join(data.keys())
        placeholders = ', '.join(['%s'] * len(data))
        query = f"INSERT INTO {self.table_name} ({fields}) VALUES ({placeholders})"
        values = tuple(data.values())
        return self.execute_query(query, values)

    def update(self, id: int, data: Dict) -> bool:
        """Update a record"""
        set_clause = ', '.join([f"{k} = %s" for k in data.keys()])
        query = f"UPDATE {self.table_name} SET {set_clause} WHERE id = %s"
        values = tuple(data.values()) + (id,)
        self.execute_query(query, values)
        return True

    def delete(self, id: int) -> bool:
        """Delete a record"""
        query = f"DELETE FROM {self.table_name} WHERE id = %s"
        self.execute_query(query, (id,))
        return True
