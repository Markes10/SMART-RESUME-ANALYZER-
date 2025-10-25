"""
Database connectivity module for HR AI Platform
"""
import os
import mysql.connector
from mysql.connector import pooling
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MySQL Configuration
db_config = {
    "host": os.getenv("MYSQL_HOST", "localhost"),
    "user": os.getenv("MYSQL_USER", "root"),
    "password": os.getenv("MYSQL_PASSWORD", ""),
    "database": os.getenv("MYSQL_DB", "hr_app"),
    "pool_name": "hr_app_pool",
    "pool_size": 5
}

# Create connection pool
connection_pool = None

def init_db_pool():
    """Initialize the database connection pool"""
    global connection_pool
    try:
        connection_pool = mysql.connector.pooling.MySQLConnectionPool(**db_config)
        print("Database connection pool initialized successfully!")
        return True
    except mysql.connector.Error as err:
        print(f"Error initializing database pool: {err}")
        return False

def get_db_connection():
    """Get a connection from the pool"""
    if connection_pool:
        return connection_pool.get_connection()
    raise Exception("Database pool not initialized")

def close_db_connection(connection):
    """Close a database connection"""
    if connection:
        connection.close()

if __name__ == "__main__":
    # Initialize the database pool
    if init_db_pool():
        print("HR AI Platform is ready to use!")
        print("Use the provided Python modules to interact with the system.")
    else:
        print("Failed to initialize the HR AI Platform.")
