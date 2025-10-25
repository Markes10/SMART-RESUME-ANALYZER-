"""
Database configuration module
"""
import os
import mysql.connector
from mysql.connector import pooling

# Get database configuration from environment variables
config = {
    'user': os.getenv('MYSQL_USER', 'root'),
    'password': os.getenv('MYSQL_PASSWORD', ''),
    'host': os.getenv('MYSQL_HOST', 'localhost'),
    'port': int(os.getenv('MYSQL_PORT', '3306')),
    'database': os.getenv('MYSQL_DB', 'hr_app')
}

# Connection pool configuration
pool_config = {
    'pool_name': 'mypool',
    'pool_size': 5,
    **config
}

connection_pool = None

def init_db_pool():
    """Initialize the database connection pool"""
    global connection_pool
    try:
        connection_pool = mysql.connector.pooling.MySQLConnectionPool(**pool_config)
        return True
    except Exception as e:
        print(f"Error initializing connection pool: {e}")
        return False

def get_db_connection():
    """Get a connection from the pool"""
    if connection_pool is None:
        raise Exception("Database connection pool not initialized")
    return connection_pool.get_connection()

def close_db_connection(connection):
    """Close a database connection"""
    if connection:
        connection.close()