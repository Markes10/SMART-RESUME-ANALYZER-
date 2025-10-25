"""
Initialize the database with required tables and seed data
"""
import os
import sys
from pathlib import Path
import mysql.connector
from dotenv import load_dotenv

# Add the project root to the Python path
sys.path.append(str(Path(__file__).parent.parent))

from db.config import DB_CONFIG

# Load environment variables
load_dotenv()

def init_database():
    """Initialize the database with schema"""
    try:
        # Connect without database first
        conn = mysql.connector.connect(
            host=DB_CONFIG['host'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            port=DB_CONFIG['port']
        )
        cursor = conn.cursor()

        # Create database if not exists
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_CONFIG['database']}")
        cursor.execute(f"USE {DB_CONFIG['database']}")

        # Read and execute schema.sql
        schema_path = Path(__file__).parent.parent / 'db' / 'schema.sql'
        with open(schema_path, 'r', encoding='utf-8') as f:
            sql_commands = f.read().split(';')
            for command in sql_commands:
                if command.strip():
                    try:
                        cursor.execute(command)
                    except mysql.connector.Error as e:
                        print(f"Warning: {e}")
                        continue
        
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

def seed_sample_data():
    """Add sample data for testing"""
    try:
        # Connect to the database
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Check if sample data already exists
        cursor.execute("SELECT COUNT(*) FROM jobs")
        job_count = cursor.fetchone()[0]
        
        if job_count == 0:
            # Insert sample jobs
            sample_jobs = [
                ("Senior Python Developer", "We are looking for an experienced Python developer with Django and Flask experience. Must have knowledge of REST APIs, databases, and cloud platforms.", '["Python", "Django", "Flask", "REST", "SQL", "AWS"]'),
                ("Frontend React Engineer", "Join our team as a React engineer. We need someone with experience in React, TypeScript, and modern frontend frameworks. Knowledge of state management and testing is required.", '["React", "TypeScript", "JavaScript", "Redux", "Jest", "CSS"]'),
                ("Data Scientist", "Looking for a data scientist with experience in machine learning, statistics, and data visualization. Must have Python and R skills.", '["Python", "R", "Machine Learning", "Statistics", "Pandas", "Scikit-learn"]')
            ]
            
            for job in sample_jobs:
                cursor.execute(
                    "INSERT INTO jobs (title, description, required_skills) VALUES (%s, %s, %s)",
                    job
                )
            
            conn.commit()
            print("Sample data inserted successfully!")
        else:
            print("Sample data already exists. Skipping seeding.")
            
    except mysql.connector.Error as err:
        print(f"Error seeding data: {err}")
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == '__main__':
    init_database()
    seed_sample_data()