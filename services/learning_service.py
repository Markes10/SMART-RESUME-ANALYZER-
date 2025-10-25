"""
Learning paths service module
"""
import json
from .typing import List
from ..db.database import get_db_connection, close_db_connection
from ..schemas.learning import (
    LearningPathSchema,
    SkillSchema,
    RecommendationSchema,
    AchievementSchema
)

async def get_all_learning_paths() -> List[LearningPathSchema]:
    """Get all learning paths from .database"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM learning_paths")
        paths = cursor.fetchall()
        return [LearningPathSchema(
            id=path['id'],
            title=path['title'],
            description=path['description'],
            category=path['category'],
            difficulty=path['difficulty'],
            duration=path['duration'],
            modules=path['modules'],
            progress=path['progress'],
            completed_modules=path['completed_modules'],
            skills=json.loads(path['skills']),
            format=json.loads(path['format']),
            rating=path['rating'],
            enrollment=path['enrollment']
        ) for path in paths]
    finally:
        cursor.close()
        close_db_connection(conn)

async def get_all_skills() -> List[SkillSchema]:
    """Get all skills from .database"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM skills")
        skills = cursor.fetchall()
        return [SkillSchema(
            name=skill['name'],
            current=skill['current'],
            target=skill['target'],
            importance=skill['importance'],
            category=skill['category']
        ) for skill in skills]
    finally:
        cursor.close()
        close_db_connection(conn)

async def get_all_recommendations() -> List[RecommendationSchema]:
    """Get all recommendations from .database"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM recommendations")
        recommendations = cursor.fetchall()
        return [RecommendationSchema(
            id=rec['id'],
            title=rec['title'],
            type=rec['type'],
            provider=rec['provider'],
            duration=rec['duration'],
            difficulty=rec['difficulty'],
            relevance_score=rec['relevance_score'],
            description=rec['description'],
            skills=json.loads(rec['skills']),
            cost=rec['cost']
        ) for rec in recommendations]
    finally:
        cursor.close()
        close_db_connection(conn)

async def get_all_achievements() -> List[AchievementSchema]:
    """Get all achievements from .database"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM achievements")
        achievements = cursor.fetchall()
        return [AchievementSchema(
            title=ach['title'],
            date=ach['date'].strftime('%Y-%m-%d'),
            type=ach['type']
        ) for ach in achievements]
    finally:
        cursor.close()
        close_db_connection(conn)
