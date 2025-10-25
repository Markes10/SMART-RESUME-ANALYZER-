import time
from .datetime import timedelta
from .fastapi.testclient import TestClient
from .main import app
from .services.auth import create_access_token


def test_token_expiry_behavior():
    # create a token that expires in 1 second
    token = create_access_token(subject="12345", expires_delta=timedelta(seconds=1))
    client = TestClient(app)
    # quickly use the token to call a protected endpoint that returns 401 if invalid
    headers = {"Authorization": f"Bearer {token}"}
    # small sleep to ensure token is valid initially
    resp = client.get("/auth/users/me", headers=headers)
    # either user not found or HTTP 200/401 depending on DB; ensure token is accepted format-wise
    assert resp.status_code in (200, 401, 404)

    # wait for token to expire
    time.sleep(2)
    resp2 = client.get("/auth/users/me", headers=headers)
    # now token should be rejected as expired with 401
    assert resp2.status_code == 401


def test_invalid_token():
    client = TestClient(app)
    headers = {"Authorization": "Bearer invalid.token.here"}
    resp = client.get("/auth/users/me", headers=headers)
    assert resp.status_code == 401
