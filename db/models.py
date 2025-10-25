"""
SQLAlchemy ORM models for the HR AI Platform.
Supports both Postgres (with pgvector) and MySQL.
"""

from sqlalchemy import (
    Column, String, Integer, Float, Text, ForeignKey, DateTime, 
    JSON, Boolean, DECIMAL, Date, func
)
from sqlalchemy.orm import relationship
from datetime import datetime

from db.database import Base


# -------------------------------
# User model
# -------------------------------
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="employee")  # employee, hr, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    resumes = relationship("Resume", back_populates="user")
    interviews = relationship("Interview", foreign_keys="Interview.candidate_id", back_populates="candidate")
    reviews_received = relationship("PerformanceReview", foreign_keys="PerformanceReview.user_id", back_populates="user")
    reviews_given = relationship("PerformanceReview", foreign_keys="PerformanceReview.reviewer_id", back_populates="reviewer")
    learning_paths = relationship("LearningPath", back_populates="user")
    attendance_records = relationship("AttendanceRecord", back_populates="user")
    compensation_records = relationship("CompensationRecord", back_populates="user")

# -------------------------------
# Resume model
# -------------------------------
class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    resume_text = Column(Text)
    skills = Column(JSON)
    vector_embedding = Column(Text)  # Store as base64 encoded string
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="resumes")
    job_matches = relationship("JobMatch", back_populates="resume")

# -------------------------------
# Job model
# -------------------------------
class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(Text)
    required_skills = Column(JSON)
    department = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    interviews = relationship("Interview", back_populates="job")
    job_matches = relationship("JobMatch", back_populates="job")

# -------------------------------
# Job Match model
# -------------------------------
class JobMatch(Base):
    __tablename__ = "job_matches"
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    resume_id = Column(Integer, ForeignKey("resumes.id"))
    match_score = Column(Float)
    skills_matched = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    job = relationship("Job", back_populates="job_matches")
    resume = relationship("Resume", back_populates="job_matches")

# -------------------------------
# Interview model
# -------------------------------
class Interview(Base):
    __tablename__ = "interviews"
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    candidate_id = Column(Integer, ForeignKey("users.id"))
    interview_date = Column(DateTime)
    questions = Column(JSON)
    answers = Column(JSON)
    feedback = Column(Text)
    status = Column(String(20))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    job = relationship("Job", back_populates="interviews")
    candidate = relationship("User", foreign_keys=[candidate_id], back_populates="interviews")

# -------------------------------
# Performance Review model
# -------------------------------
class PerformanceReview(Base):
    __tablename__ = "performance_reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    reviewer_id = Column(Integer, ForeignKey("users.id"))
    review_period = Column(String(50))
    goals = Column(JSON)
    achievements = Column(Text)
    feedback = Column(Text)
    rating = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="reviews_received")
    reviewer = relationship("User", foreign_keys=[reviewer_id], back_populates="reviews_given")

# -------------------------------
# Learning Path model
# -------------------------------
class LearningPath(Base):
    __tablename__ = "learning_paths"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    current_skills = Column(JSON)
    target_skills = Column(JSON)
    recommended_courses = Column(JSON)
    progress = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="learning_paths")

# -------------------------------
# Attendance Record model
# -------------------------------
class AttendanceRecord(Base):
    __tablename__ = "attendance_records"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    check_in = Column(DateTime)
    check_out = Column(DateTime)
    status = Column(String(20))
    anomaly_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="attendance_records")

# -------------------------------
# Compensation Record model
# -------------------------------
class CompensationRecord(Base):
    __tablename__ = "compensation_records"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    salary = Column(DECIMAL(10, 2))
    bonus = Column(DECIMAL(10, 2))
    effective_date = Column(Date)
    department = Column(String(100))
    position = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="compensation_records")

# -------------------------------
# Diversity Metric model
# -------------------------------
class DiversityMetric(Base):
    __tablename__ = "diversity_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    department = Column(String(100))
    metrics = Column(JSON)
    report_date = Column(Date)
    recommendations = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
