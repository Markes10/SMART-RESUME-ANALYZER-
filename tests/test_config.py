"""
Test configuration and shared utilities
"""
import os
from typing import AsyncGenerator, Generator
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from db.database import Base, get_db
from main import app

# Use in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def test_engine():
    return engine

@pytest.fixture(scope="function")
def test_db() -> Generator:
    """Create test database tables for each test"""
    Base.metadata.create_all(bind=engine)
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(test_db) -> Generator:
    """Create test client with database dependency override"""
    def override_get_db():
        try:
            yield test_db
        finally:
            test_db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
def test_user(client) -> dict:
    """Create a test user"""
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123"
    }
    response = client.post("/api/auth/register", json=user_data)
    return response.json()

# Mock data fixtures
@pytest.fixture(scope="function")
def sample_resume_text() -> str:
    return """
    PROFESSIONAL SUMMARY
    Experienced software engineer with 5 years of experience in Python, FastAPI, and React.
    
    SKILLS
    - Python, JavaScript, TypeScript
    - FastAPI, React, Node.js
    - SQL, MongoDB, Redis
    - Docker, Kubernetes, AWS
    
    EXPERIENCE
    Senior Software Engineer | Tech Corp
    - Developed and maintained microservices using FastAPI
    - Led team of 5 developers for cloud migration project
    - Improved system performance by 40%
    
    EDUCATION
    Bachelor of Science in Computer Science
    """

@pytest.fixture(scope="function")
def sample_job_posting() -> dict:
    return {
        "title": "Senior Software Engineer",
        "description": "We are looking for an experienced software engineer with strong Python and React skills.",
        "required_skills": ["Python", "React", "FastAPI", "SQL"],
        "department": "Engineering",
        "location": "Remote"
    }