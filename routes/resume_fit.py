"""
Resume endpoints for HR AI Platform
"""
import os
from typing import List
import PyPDF2
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends, Query
from .. import db
from ..models import User, Resume, Job, JobMatch
from ..services import embedding_service, skill_extractor, qdrant_utils
from ..services.auth import get_current_user

router = APIRouter(prefix="/resume", tags=["Resume"])

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Upload and process a resume"""
    # Validate file
    allowed_types = [".pdf", ".doc", ".docx"]
    if not any(file.filename.endswith(ext) for ext in allowed_types):
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # Save file
    file_path = f"uploads/resumes/{current_user.id}_{file.filename}"
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    
    # Extract text from .PDF
    if file.filename.endswith(".pdf"):
        with open(file_path, "rb") as pdf_file:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            resume_text = ""
            for page in pdf_reader.pages:
                resume_text += page.extract_text()
    else:
        # For doc/docx files you would need to implement text extraction
        resume_text = "Text extraction not implemented for this file type"
    
    # Extract skills and generate embedding
    skills = skill_extractor.extract_skills(resume_text)
    vector = embedding_service.embed_text(resume_text)
    
    # Store in database
    conn = db.get_db_connection()
    cursor = conn.cursor()
    query = """
        INSERT INTO resumes (user_id, resume_text, skills, vector_embedding)
        VALUES (%s, %s, %s, %s)
    """
    cursor.execute(query, (
        current_user.id,
        resume_text,
        ",".join(skills),
        vector.tobytes().hex()  # Convert vector to hex string
    ))
    resume_id = cursor.lastrowid
    conn.commit()
    
    cursor.close()
    db.close_db_connection(conn)
    
    return {
        'id': resume_id,
        'user_id': current_user.id,
        'skills': skills
    }

@router.get("/my-resumes", response_model=List[dict])
async def get_my_resumes(current_user: User = Depends(get_current_user)):
    """Get all resumes for current user"""
    conn = db.get_db_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM resumes WHERE user_id = %s"
    cursor.execute(query, (current_user.id,))
    resumes = cursor.fetchall()
    cursor.close()
    db.close_db_connection(conn)
    
    return [{
        'id': resume[0],
        'user_id': resume[1],
        'skills': resume[3].split(",") if resume[3] else []
    } for resume in resumes]

@router.post("/{resume_id}/match")
async def match_resume(
    resume_id: int,
    top_k: int = Query(default=3, gt=0),
    current_user: User = Depends(get_current_user)
):
    """Match a resume with available jobs"""
    conn = db.get_db_connection()
    cursor = conn.cursor()
    
    # Get resume
    query = "SELECT * FROM resumes WHERE id = %s AND user_id = %s"
    cursor.execute(query, (resume_id, current_user.id))
    resume = cursor.fetchone()
    
    if not resume:
        cursor.close()
        db.close_db_connection(conn)
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Get all jobs
    query = "SELECT * FROM jobs"
    cursor.execute(query)
    jobs = cursor.fetchall()
    
    matches = []
    for job in jobs:
        # Calculate similarity score
        similarity = embedding_service.calculate_similarity(
            resume[4],  # vector_embedding
            job[3]     # description
        )
        
        # Calculate skill overlap
        resume_skills = set(resume[3].split(","))
        job_skills = set(job[5].split(","))  # required_skills
        skill_overlap = len(resume_skills.intersection(job_skills))
        skill_overlap_score = skill_overlap / len(job_skills) if job_skills else 0
        
        # Store match in database
        query = """
            INSERT INTO job_matches (job_id, resume_id, match_score, skills_matched)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (
            job[0],  # job_id
            resume_id,
            similarity,
            ",".join(resume_skills.intersection(job_skills))
        ))
        
        matches.append({
            "job": {
                "id": job[0],
                "title": job[1],
                "description": job[3],
                "required_skills": list(job_skills)
            },
            "match_score": float(similarity),
            "skill_overlap_score": float(skill_overlap_score),
            "matching_skills": list(resume_skills.intersection(job_skills)),
            "missing_skills": list(job_skills - resume_skills)
        })
    
    conn.commit()
    cursor.close()
    db.close_db_connection(conn)
    
    # Sort matches by score
    matches.sort(key=lambda x: x["match_score"], reverse=True)
    
    return matches[:top_k]

@router.delete("/{resume_id}")
async def delete_resume(resume_id: int, current_user: User = Depends(get_current_user)):
    """Delete a resume"""
    conn = db.get_db_connection()
    cursor = conn.cursor()
    
    # Get resume
    query = "SELECT * FROM resumes WHERE id = %s AND user_id = %s"
    cursor.execute(query, (resume_id, current_user.id))
    resume = cursor.fetchone()
    
    if not resume:
        cursor.close()
        db.close_db_connection(conn)
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Delete from .database
    query = "DELETE FROM resumes WHERE id = %s"
    cursor.execute(query, (resume_id,))
    conn.commit()
    cursor.close()
    db.close_db_connection(conn)
    
    # Delete associated file
    file_path = f"uploads/resumes/{current_user.id}_{resume_id}"
    if os.path.exists(file_path):
        os.remove(file_path)
    
    return {"message": "Resume deleted successfully"}
