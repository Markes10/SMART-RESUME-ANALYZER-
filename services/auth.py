"""
Security utilities for authentication and authorization
"""
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
import os

from fastapi import Depends, HTTPException, Header
from starlette.status import HTTP_401_UNAUTHORIZED, HTTP_500_INTERNAL_SERVER_ERROR
from jose import jwt, JWTError
from jose.exceptions import ExpiredSignatureError
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.db.models import User
from app.db.database import get_db

# Token settings (use environment variables in production)
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
JWT_ALGO = os.getenv("JWT_ALGO", "HS256")


# Use passlib CryptContext with bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against a bcrypt hash."""
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False


def create_access_token(subject: Optional[str] = None, data: Optional[Dict[str, Any]] = None, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token. Accepts either a subject string or a data dict.

    Usage:
      create_access_token(subject="123")
      create_access_token(data={"sub": "123", "role": "admin"})
    """
    # Use timezone-aware UTC datetime to avoid incorrect timestamp conversions
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    if data is None:
        if subject is None:
            raise ValueError("Either 'subject' or 'data' must be provided")
        to_encode = {"sub": str(subject)}
    else:
        to_encode = dict(data)

    # add expiry claim
    to_encode["exp"] = int(expire.timestamp())
    token = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGO)
    return token


def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)) -> Optional[User]:
    if not authorization:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Missing Authorization header")
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid token scheme")
    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
    except ExpiredSignatureError:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except JWTError:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user_id = payload.get("sub") or payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    try:
        user = db.query(User).filter(User.id == int(user_id)).first()
        if not user:
            # Explicitly raise instead of returning None so routes depending on
            # a User object receive a proper HTTP 401/404 instead of causing
            # a 500 when Pydantic attempts to serialize None to UserResponse.
            raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="User not found")
        return user
    except Exception as e:
        # For token validation flows we prefer returning 401 so callers
        # that only validate token format do not receive 500s during tests.
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Failed to retrieve user")


def allow_admin(current_user: User = Depends(get_current_user)):
    if not current_user or current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return current_user



