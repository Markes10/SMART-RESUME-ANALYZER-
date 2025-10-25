"""
LLM utilities for interacting with Ollama running Mistral model.

- Generate text completions using Mistral
- Supports async calls with httpx
- Free and open source
"""

import os
import httpx
from typing import Dict, Any, List


# -------------------------------
# Config
# -------------------------------
OLLAMA_ENDPOINT = os.getenv("OLLAMA_ENDPOINT", "http://localhost:11434/api")
MODEL_NAME = os.getenv("OLLAMA_MODEL", "mistral")


# -------------------------------
# LLM Client
# -------------------------------
async def generate(prompt: str, max_tokens: int = 256, temperature: float = 0.7) -> str:
    """
    Call Ollama server to generate text using Mistral model.
    """
    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False,
        "options": {
            "num_predict": max_tokens,
            "temperature": temperature
        }
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            resp = await client.post(f"{OLLAMA_ENDPOINT}/generate", json=payload)
            resp.raise_for_status()
            data: Dict[str, Any] = resp.json()
            return data.get("response", "").strip()
        except Exception as e:
            return f"[Ollama error] {str(e)}"


async def chat(messages: List[Dict[str, str]], max_tokens: int = 256, temperature: float = 0.7) -> str:
    """
    Call Ollama server with chat-style interface.
    Expects messages: [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]
    """
    # Convert chat format to Mistral prompt format
    formatted_prompt = ""
    for msg in messages:
        role = msg["role"]
        content = msg["content"]
        if role == "user":
            formatted_prompt += f"[INST] {content} [/INST]\n"
        elif role == "assistant":
            formatted_prompt += f"{content}\n"
    
    payload = {
        "model": MODEL_NAME,
        "prompt": formatted_prompt,
        "stream": False,
        "options": {
            "num_predict": max_tokens,
            "temperature": temperature
        }
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            resp = await client.post(f"{OLLAMA_ENDPOINT}/chat", json=payload)
            resp.raise_for_status()
            data: Dict[str, Any] = resp.json()
            return data.get("response", "").strip()
        except Exception as e:
            return f"[Ollama error] {str(e)}"

# -------------------------------
# Specialized HR Functions
# -------------------------------

async def analyze_resume(resume_text: str, job_description: str) -> Dict[str, Any]:
    """
    AI Resume-Job Fit Analysis using Mistral
    """
    prompt = f"""[INST] Analyze the fit between this resume and job description:

Resume:
{resume_text}

Job Description:
{job_description}

Provide a structured analysis with:
1. Match Score (0-100)
2. Key Skills Match
3. Experience Alignment
4. Missing Skills
5. Recommendations [/INST]"""

    response = await generate(prompt)
    return {
        "analysis": response,
        "model": MODEL_NAME
    }

async def predict_turnover_risk(employee_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Predictive Turnover Analysis using Mistral
    """
    prompt = f"""[INST] Analyze turnover risk for this employee:
{str(employee_data)}

Provide:
1. Risk Level (Low/Medium/High)
2. Key Risk Factors
3. Retention Recommendations [/INST]"""
    
    response = await generate(prompt)
    return {
        "analysis": response,
        "model": MODEL_NAME
    }

async def generate_interview_questions(job_title: str, skills: List[str]) -> Dict[str, Any]:
    """
    AI Interview Question Generator using Mistral
    """
    prompt = f"""[INST] Generate interview questions for:
Position: {job_title}
Required Skills: {', '.join(skills)}

Provide:
1. Technical Questions
2. Behavioral Questions
3. Situational Questions
4. Follow-up Prompts [/INST]"""

    response = await generate(prompt)
    return {
        "questions": response,
        "model": MODEL_NAME
    }

async def create_onboarding_plan(role: str, department: str) -> Dict[str, Any]:
    """
    Onboarding Journey Generator using Mistral
    """
    prompt = f"""[INST] Create an onboarding plan for:
Role: {role}
Department: {department}

Include:
1. Week-by-week Schedule
2. Key Training Topics
3. Important Introductions
4. Required Resources
5. Milestones [/INST]"""

    response = await generate(prompt)
    return {
        "plan": response,
        "model": MODEL_NAME
    }

async def generate_performance_feedback(performance_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Performance Feedback Generator using Mistral
    """
    prompt = f"""[INST] Generate constructive performance feedback:
{str(performance_data)}

Include:
1. Key Achievements
2. Areas for Improvement
3. Specific Examples
4. Development Goals
5. Action Items [/INST]"""

    response = await generate(prompt)
    return {
        "feedback": response,
        "model": MODEL_NAME
    }

async def analyze_compensation_fairness(compensation_data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Compensation Fairness Analysis using Mistral
    """
    prompt = f"""[INST] Analyze compensation fairness:
{str(compensation_data)}

Provide:
1. Pay Equity Analysis
2. Market Comparison
3. Internal Fairness
4. Recommendations [/INST]"""

    response = await generate(prompt)
    return {
        "analysis": response,
        "model": MODEL_NAME
    }

async def recommend_learning_path(employee_profile: Dict[str, Any], career_goals: str) -> Dict[str, Any]:
    """
    Learning Path Recommender using Mistral
    """
    prompt = f"""[INST] Recommend a learning path:
Profile: {str(employee_profile)}
Career Goals: {career_goals}

Provide:
1. Recommended Courses
2. Skill Development Plan
3. Timeline
4. Success Metrics [/INST]"""

    response = await generate(prompt)
    return {
        "recommendations": response,
        "model": MODEL_NAME
    }

async def detect_attendance_anomalies(attendance_data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Attendance Anomaly Detection using Mistral
    """
    prompt = f"""[INST] Analyze attendance patterns:
{str(attendance_data)}

Identify:
1. Unusual Patterns
2. Potential Issues
3. Recommendations [/INST]"""

    response = await generate(prompt)
    return {
        "analysis": response,
        "model": MODEL_NAME
    }

async def analyze_diversity_inclusion(workforce_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Diversity & Inclusion Analytics using Mistral
    """
    prompt = f"""[INST] Analyze diversity and inclusion metrics:
{str(workforce_data)}

Provide:
1. Diversity Metrics
2. Inclusion Indicators
3. Gap Analysis
4. Recommendations [/INST]"""

    response = await generate(prompt)
    return {
        "analysis": response,
        "model": MODEL_NAME
    }
