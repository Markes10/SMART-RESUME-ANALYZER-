from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)
resp = client.post('/auth/register', json={"username":"testuser","email":"test@example.com","password":"secret"})
print('STATUS', resp.status_code)
try:
    print('JSON:', resp.json())
except Exception:
    print('TEXT:', resp.text)
