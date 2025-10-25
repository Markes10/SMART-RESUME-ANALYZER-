from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.db.database import Base

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[__import__('app.db.database', fromlist=['get_db']).get_db] = override_get_db
client = TestClient(app)
resp = client.post('/auth/register', json={"username":"testuser","email":"test@example.com","password":"testpass123","role":"employee"})
print(resp.status_code)
print(resp.json())
