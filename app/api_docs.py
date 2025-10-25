"""
API documentation and OpenAPI schema configuration
"""
from fastapi.openapi.utils import get_openapi
from typing import Dict

def custom_openapi(app) -> Dict:
    """Generate custom OpenAPI schema for the application"""
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="HR AI Platform API",
        version="1.0.0",
        description="""
        AI-powered HR management platform API.
        
        Features:
        - Resume Analysis & Job Matching
        - Interview Management
        - Performance Feedback
        - Learning Path Recommendations
        - Attendance Tracking
        - Compensation Analysis
        - Diversity & Inclusion Metrics
        
        For authentication, use the /auth/login endpoint to obtain a JWT token.
        Include the token in the Authorization header as: `Bearer <token>`
        """,
        routes=app.routes,
    )

    # Add security scheme
    openapi_schema["components"]["securitySchemes"] = {
        "bearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }

    # Add security requirement to all endpoints
    openapi_schema["security"] = [{"bearerAuth": []}]

    # Add response schemas
    openapi_schema["components"]["schemas"]["HTTPError"] = {
        "type": "object",
        "properties": {
            "detail": {"type": "string"},
            "code": {"type": "string"}
        }
    }

    # Add tags with descriptions
    openapi_schema["tags"] = [
        {
            "name": "auth",
            "description": "Authentication operations"
        },
        {
            "name": "resumes",
            "description": "Resume analysis and job matching"
        },
        {
            "name": "interviews",
            "description": "Interview management and feedback"
        },
        {
            "name": "performance",
            "description": "Performance reviews and feedback"
        },
        {
            "name": "learning",
            "description": "Learning paths and skill development"
        },
        {
            "name": "attendance",
            "description": "Attendance tracking and analysis"
        },
        {
            "name": "compensation",
            "description": "Compensation analysis and benchmarking"
        },
        {
            "name": "diversity",
            "description": "Diversity and inclusion metrics"
        }
    ]

    app.openapi_schema = openapi_schema
    return app.openapi_schema