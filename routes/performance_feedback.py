"""
Continuous Performance Feedback Writer routes.

Provides endpoints for:
- Generating feedback using LLMs
- Adjusting tone of feedback (positive/neutral/constructive)
"""

from .fastapi import APIRouter
from .pydantic import BaseModel
from .typing import Dict, Any
import datetime

# Stub: replace later with real vLLM or fine-tuned LLM calls
from .services import vllm_client

router = APIRouter(prefix="/feedback", tags=["Continuous Performance Feedback Writer"])


# -------------------------------
# Request Models
# -------------------------------
class FeedbackRequest(BaseModel):
    employee_id: str
    performance_summary: str
    tone: str = "neutral"  # options: positive, neutral, constructive


class AdjustToneRequest(BaseModel):
    text: str
    tone: str


# -------------------------------
# Endpoints
# -------------------------------

@router.post("/generate")
async def generate_feedback(req: FeedbackRequest) -> Dict[str, Any]:
    """
    Generate performance feedback based on employee summary (stub).
    Later: Replace with fine-tuned LLM trained on HR feedback dataset.
    """
    try:
        feedback_text = await vllm_client.generate(
            f"Write a {req.tone} performance feedback for an employee based on this summary: {req.performance_summary}"
        )
    except Exception:
        feedback_text = (
            f"[Stub] {req.tone.capitalize()} feedback for employee {req.employee_id}: "
            f"{req.performance_summary}"
        )

    return {
        "employee_id": req.employee_id,
        "tone": req.tone,
        "feedback": feedback_text,
        "generated_at": datetime.datetime.utcnow().isoformat()
    }


@router.post("/adjust_tone")
async def adjust_tone(req: AdjustToneRequest) -> Dict[str, Any]:
    """
    Adjust the tone of existing feedback (stub).
    Later: Replace with sentiment/tone adjustment model.
    """
    try:
        adjusted_text = await vllm_client.generate(
            f"Rewrite this feedback in a {req.tone} tone: {req.text}"
        )
    except Exception:
        adjusted_text = f"[Stub] Rewritten in {req.tone} tone: {req.text}"

    return {
        "original_text": req.text,
        "adjusted_tone": req.tone,
        "adjusted_text": adjusted_text,
        "adjusted_at": datetime.datetime.utcnow().isoformat()
    }
