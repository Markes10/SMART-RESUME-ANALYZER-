"""
Main application entry point
FastAPI web application with MySQL database
"""
from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.db.config import init_db_pool, get_db_connection, close_db_connection
from app.routes import ALL_ROUTERS
from app.middleware.error_handling import error_handler
from app.api_docs import custom_openapi
import uvicorn

# Create FastAPI app

@asynccontextmanager
async def lifespan(app):
    # Startup logic
    # Try to initialize DB pool; allow startup to continue in dev if it fails
    try:
        ok = init_db_pool()
        if not ok:
            # Log a warning and continue so the app can start for local/dev work
            print("Warning: Failed to initialize database connection pool; continuing without DB (dev mode).")
    except Exception as e:
        print(f"Warning: Exception while initializing DB pool: {e}; continuing without DB (dev mode).")
    yield
    # Shutdown logic (if needed)

app = FastAPI(
    title="HR AI Platform",
    description="AI-powered HR management platform",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",  # Customize docs URL
    redoc_url="/api/redoc",  # Customize ReDoc URL
    openapi_url="/api/openapi.json"  # Customize OpenAPI schema URL
)

# Register global error handling middleware
app.middleware('http')(error_handler)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint to verify the API is working"""
    return {"message": "HR AI Platform API is running"}

@app.get("/health")
async def health_check():
    """Health check endpoint to verify database connectivity"""
    try:
        conn = get_db_connection()
        close_db_connection(conn)
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        # Return an unhealthy status for easier dev debugging instead of raising
        return {"status": "unhealthy", "database": "disconnected", "detail": str(e)}


# Include application routers discovered in app/routes
for r in ALL_ROUTERS:
    try:
        app.include_router(r)
    except Exception:
        # If a router fails to include, skip to allow the app to start and surface errors later
        pass

# Set up custom OpenAPI schema
app.openapi = custom_openapi


if __name__ == "__main__":
    # Run the app for local development
    uvicorn.run("main:app", host="0.0.0.0", port=8000, log_level="info")
