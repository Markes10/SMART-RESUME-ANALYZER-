"""
Tests for API endpoints
"""
import pytest
from fastapi.testclient import TestClient

def test_health_check(client: TestClient):
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data

def test_resume_upload_endpoint(client: TestClient, test_user, sample_resume_text):
    """Test resume upload endpoint"""
    headers = {"Authorization": f"Bearer {test_user['access_token']}"}
    response = client.post(
        "/api/resumes/upload",
        json={"resume_text": sample_resume_text},
        headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "skills" in data
    assert len(data["skills"]) > 0

def test_job_matching_endpoint(client: TestClient, test_user, sample_resume_text, sample_job_posting):
    """Test job matching endpoint"""
    # First upload a resume
    headers = {"Authorization": f"Bearer {test_user['access_token']}"}
    resume_response = client.post(
        "/api/resumes/upload",
        json={"resume_text": sample_resume_text},
        headers=headers
    )
    resume_id = resume_response.json()["id"]
    
    # Create a job
    job_response = client.post(
        "/api/jobs/create",
        json=sample_job_posting,
        headers=headers
    )
    assert job_response.status_code == 200
    
    # Test job matching
    response = client.get(
        f"/api/resumes/{resume_id}/match-jobs",
        headers=headers
    )
    assert response.status_code == 200
    matches = response.json()
    assert isinstance(matches, list)
    assert len(matches) > 0
    assert "match_score" in matches[0]
    assert "matching_skills" in matches[0]

def test_unauthorized_access(client: TestClient, sample_resume_text):
    """Test unauthorized access to protected endpoints"""
    # Try without auth token
    response = client.post(
        "/api/resumes/upload",
        json={"resume_text": sample_resume_text}
    )
    assert response.status_code == 401

def test_invalid_resume_upload(client: TestClient, test_user):
    """Test resume upload with invalid data"""
    headers = {"Authorization": f"Bearer {test_user['access_token']}"}
    response = client.post(
        "/api/resumes/upload",
        json={"resume_text": ""},  # Empty resume text
        headers=headers
    )
    assert response.status_code == 400

@pytest.mark.parametrize("endpoint", [
    "/api/resumes/upload",
    "/api/jobs/create",
    "/api/resumes/1/match-jobs"
])
def test_protected_endpoints(client: TestClient, endpoint):
    """Test that protected endpoints require authentication"""
    response = client.get(endpoint)
    assert response.status_code == 401
    assert "detail" in response.json()

def test_resume_list_endpoint(client: TestClient, test_user):
    """Test getting list of user's resumes"""
    headers = {"Authorization": f"Bearer {test_user['access_token']}"}
    response = client.get("/api/resumes", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)