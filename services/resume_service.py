"""
Resume service for handling resume-related operations
"""
from typing import Dict, List, Optional
from db.database import DatabaseOperations
from services.embedding_service import embed_text, calculate_similarity
from services.skill_extractor import extract_skills

class ResumeService(DatabaseOperations):
    def __init__(self):
        super().__init__('resumes')

    def create_resume(self, user_id: int, resume_text: str) -> Dict:
        """Create a new resume entry"""
        # Extract skills and generate embedding
        skills = extract_skills(resume_text)
        vector = embed_text(resume_text)
        
        # Convert vector to string for storage
        import json
        vector_str = json.dumps(vector)
        
        # Prepare data for insertion
        data = {
            'user_id': user_id,
            'resume_text': resume_text,
            'skills': skills,
            'vector_embedding': vector_str
        }
        
        # Insert into database
        resume_id = self.create(data)
        result = self.get_by_id(resume_id)
        return result if result else {}

    def get_user_resumes(self, user_id: int) -> List[Dict]:
        """Get all resumes for a user"""
        query = "SELECT * FROM resumes WHERE user_id = %s"
        return self.execute_query(query, (user_id,))

    def match_jobs(self, resume_id: int, top_k: int = 3) -> List[Dict]:
        """Match resume with available jobs"""
        # Get resume
        resume = self.get_by_id(resume_id)
        if not resume:
            return []

        # Get all jobs
        jobs = DatabaseOperations('jobs').get_all()
        
        matches = []
        for job in jobs:
            # Parse the stored vector
            import json
            resume_vector = json.loads(resume['vector_embedding'])
            job_vector = embed_text(job['description'])
            
            # Calculate similarity score
            similarity = calculate_similarity(
                resume_vector,
                job_vector
            )
            
            # Calculate skill overlap
            resume_skills = set(resume['skills'])
            job_skills = set(job['required_skills'])
            skill_overlap = len(resume_skills.intersection(job_skills))
            skill_overlap_score = skill_overlap / len(job_skills) if job_skills else 0
            
            # Store match in database
            match_data = {
                'job_id': job['id'],
                'resume_id': resume_id,
                'match_score': similarity,
                'skills_matched': list(resume_skills.intersection(job_skills))
            }
            DatabaseOperations('job_matches').create(match_data)
            
            matches.append({
                'job': job,
                'match_score': similarity,
                'skill_overlap_score': skill_overlap_score,
                'matching_skills': list(resume_skills.intersection(job_skills)),
                'missing_skills': list(job_skills - resume_skills)
            })
        
        # Sort matches by score
        matches.sort(key=lambda x: x['match_score'], reverse=True)
        return matches[:top_k]

resume_service = ResumeService()
