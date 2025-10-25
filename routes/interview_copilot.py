from fastapi import APIRouter, UploadFile, File
from typing import Dict, Any
from app.services import vllm_client, stt_utils, sentiment_utils

router = APIRouter(prefix="/interview", tags=["Interview Co-pilot"])


@router.post("/chat")
async def interview_chat(prompt: str):
    reply = await vllm_client.chat_completion([{"role": "user", "content": prompt}])
    return {"reply": reply}


@router.post("/stt/stream")
async def stt_stream(file: UploadFile = File(...)) -> Dict[str, Any]:
    audio_bytes = await file.read()
    transcript = stt_utils.transcribe(audio_bytes)
    return transcript


@router.post("/sentiment")
def sentiment_analysis(payload: Dict[str, str]):
    text = payload.get("text", "")
    result = sentiment_utils.analyze_sentiment(text)
    return result
