"""
Database configuration settings and connection management
"""
import os
from mysql.connector import pooling
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'hr_app'),
    'port': int(os.getenv('DB_PORT', '3306')),
    'pool_name': 'hr_pool',
    'pool_size': int(os.getenv('DB_POOL_SIZE', '5')),
}

# Global connection pool
connection_pool = None

def init_db_pool():
    """Initialize the database connection pool"""
    global connection_pool
    try:
        connection_pool = pooling.MySQLConnectionPool(**DB_CONFIG)
        return True
    except Exception as e:
        print(f"Error initializing database pool: {str(e)}")
        return False

def get_db_connection():
    """Get a connection from .the pool"""
    global connection_pool
    if connection_pool is None:
        init_db_pool()
    return connection_pool.get_connection()

def close_db_connection(connection):
    """Close a database connection"""
    if connection:
        connection.close()
