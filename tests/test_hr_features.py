"""
Tests for interview and performance feedback features
"""
import pytest
from datetime import datetime, timedelta
from routes.interview_copilot import generate_questions, analyze_feedback
from routes.performance_feedback import analyze_performance, generate_recommendations, analyze_performance_trends

@pytest.fixture
def sample_job_role():
    return {
        "title": "Senior Software Engineer",
        "requirements": [
            "5+ years of Python development",
            "Experience with cloud platforms",
            "Strong system design skills",
            "Team leadership experience"
        ],
        "responsibilities": [
            "Lead development team",
            "Design and implement scalable solutions",
            "Mentor junior developers",
            "Participate in architecture decisions"
        ]
    }

@pytest.fixture
def sample_interview_feedback():
    return {
        "technical_skills": {
            "python": 4,
            "system_design": 3,
            "problem_solving": 4
        },
        "soft_skills": {
            "communication": 4,
            "leadership": 3,
            "teamwork": 5
        },
        "notes": "Strong technical background, good communication skills, shows leadership potential"
    }

@pytest.fixture
def sample_performance_data():
    return {
        "goals_achieved": ["Launched new feature", "Improved system performance", "Mentored 2 juniors"],
        "metrics": {
            "code_quality": 90,
            "project_completion": 95,
            "team_collaboration": 85
        },
        "feedback": [
            {"type": "positive", "text": "Excellent technical skills and leadership"},
            {"type": "improvement", "text": "Could improve documentation practices"}
        ],
        "period": "2025-Q3"
    }

def test_interview_question_generation(sample_job_role):
    """Test interview question generation based on job role"""
    questions = generate_questions(sample_job_role)
    
    assert len(questions) >= 5
    # Check question categories
    categories = {q["category"] for q in questions}
    assert "technical" in categories
    assert "behavioral" in categories
    
    # Check question relevance
    technical_questions = [q for q in questions if q["category"] == "technical"]
    assert any("Python" in q["question"] for q in technical_questions)
    assert any("system design" in q["question"].lower() for q in technical_questions)

def test_interview_feedback_analysis(sample_interview_feedback):
    """Test interview feedback analysis"""
    analysis = analyze_feedback(sample_interview_feedback)
    
    assert "overall_score" in analysis
    assert 0 <= analysis["overall_score"] <= 5
    assert "strengths" in analysis
    assert "areas_for_improvement" in analysis
    assert "hiring_recommendation" in analysis
    
    # Check scoring logic
    assert len(analysis["strengths"]) >= 2
    assert analysis["overall_score"] >= 3.5  # Based on the sample feedback

def test_performance_analysis(sample_performance_data):
    """Test performance analysis functionality"""
    analysis = analyze_performance(sample_performance_data)
    
    assert "overall_rating" in analysis
    assert "key_achievements" in analysis
    assert "improvement_areas" in analysis
    assert "recommendations" in analysis
    
    # Validate analysis
    assert len(analysis["key_achievements"]) >= 2
    assert 0 <= analysis["overall_rating"] <= 100
    assert isinstance(analysis["recommendations"], list)

def test_performance_recommendations(sample_performance_data):
    """Test generating performance improvement recommendations"""
    recommendations = generate_recommendations(sample_performance_data)
    
    assert len(recommendations) >= 2
    for rec in recommendations:
        assert "action" in rec
        assert "expected_outcome" in rec
        assert "timeline" in rec
        assert "priority" in rec

@pytest.mark.parametrize("score,expected_outcome", [
    ({"technical_skills": {"python": 5, "system_design": 5}, "soft_skills": {"communication": 5}}, "strong_hire"),
    ({"technical_skills": {"python": 2, "system_design": 2}, "soft_skills": {"communication": 2}}, "reject"),
    ({"technical_skills": {"python": 3, "system_design": 4}, "soft_skills": {"communication": 3}}, "consider")
])
def test_hiring_decisions(score, expected_outcome):
    """Test hiring decision logic with different score combinations"""
    feedback = {
        **score,
        "notes": "Test feedback"
    }
    analysis = analyze_feedback(feedback)
    assert analysis["hiring_recommendation"] == expected_outcome

def test_performance_trend_analysis(sample_performance_data):
    """Test analysis of performance trends over time"""
    # Create historical performance data
    historical_data = [
        {**sample_performance_data, "period": "2025-Q1"},
        {**sample_performance_data, "period": "2025-Q2"},
        sample_performance_data  # Q3
    ]
    
    # Modify some metrics to create a trend
    historical_data[0]["metrics"]["code_quality"] = 80
    historical_data[1]["metrics"]["code_quality"] = 85
    
    trends = analyze_performance_trends(historical_data)
    assert "trends" in trends
    assert "code_quality" in trends["trends"]
    assert trends["trends"]["code_quality"]["direction"] == "improving"