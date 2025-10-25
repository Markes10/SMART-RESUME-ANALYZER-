"""
Initialize the database with required tables
"""
import os
import sys
from pathlib import Path
import mysql.connector
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def init_database():
    """Initialize the database with schema"""
    try:
        # Connect without database first
        conn = mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASSWORD', ''),
            port=int(os.getenv('DB_PORT', '3306'))
        )
        cursor = conn.cursor()

        # Create database if not exists
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {os.getenv('DB_NAME', 'hr_app')}")
        cursor.execute(f"USE {os.getenv('DB_NAME', 'hr_app')}")

        # Read and execute schema.sql
        schema_path = Path(__file__).parent / 'db' / 'schema.sql'
        with open(schema_path, 'r', encoding='utf-8') as f:
            sql_commands = f.read().split(';')
            for command in sql_commands:
                if command.strip():
                    cursor.execute(command)
        
        conn.commit()
        print("Database initialized successfully!")

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        sys.exit(1)
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == '__main__':
    init_database()
