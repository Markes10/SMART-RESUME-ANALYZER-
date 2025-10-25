"""
Shared test fixtures and configuration
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.db.config import get_db_connection, close_db_connection
# Ensure all ORM models are imported so metadata is populated before create_all
from db import models as _models  # noqa: F401
from db.database import Base
from main import app

# Use in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture
def sample_resume_text():
    """Sample resume text for testing"""
    return """
    John Doe
    Senior Software Engineer
    
    Skills: Python, React, FastAPI, SQL, Docker, AWS
    
    Experience:
    - Senior Python Developer at Tech Corp (2020-Present)
    - Full Stack Developer at Startup Inc (2018-2020)
    
    Education:
    - B.S. Computer Science, University of Technology
    """

@pytest.fixture
def test_user(test_db):
    """Create a test user"""
    from db.models import User
    from services.auth import get_password_hash, create_access_token
    
    # Create a user
    hashed_password = get_password_hash("testpassword123")
    user = User(
        username="testuser",
        email="test@example.com",
        password_hash=hashed_password
    )
    
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    
    # Add access token
    access_token = create_access_token(data={"sub": user.username})
    user_dict = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "access_token": access_token
    }
    
    return user_dict

@pytest.fixture
def sample_job_posting():
    """Sample job posting for testing"""
    return {
        "title": "Senior Python Developer",
        "description": "We are looking for an experienced Python developer with FastAPI and React experience.",
        "required_skills": ["Python", "FastAPI", "React", "SQL"],
        "department": "Engineering"
    }

@pytest.fixture
def test_db():
    """Create test database"""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client(test_db):
    """Create test client"""
    def override_get_db():
        try:
            yield test_db
        finally:
            test_db.close()
    
    from db.database import get_db
    app.dependency_overrides[get_db] = override_get_db
    
    from db.database import get_db
    app.dependency_overrides[get_db] = override_get_db
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()
