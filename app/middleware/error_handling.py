"""
Error handling middleware
"""
from fastapi import Request
from fastapi.responses import JSONResponse
import traceback

async def error_handler(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        # Log the full traceback for debugging
        traceback.print_exc()
        
        # Return a user-friendly error response
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal Server Error",
                "detail": str(e)
            }
        )