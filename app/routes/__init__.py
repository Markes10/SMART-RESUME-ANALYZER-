"""
Routes initialization
Import and collect all route handlers
"""
from fastapi import APIRouter

# Initialize an empty list to store all routers
ALL_ROUTERS = []

# Import and add route handlers
# Example:
# from .auth import router as auth_router
# ALL_ROUTERS.append(auth_router)