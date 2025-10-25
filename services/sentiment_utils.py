"""
Sentiment analysis utilities.

- Uses Hugging Face transformers sentiment-analysis pipeline
- Provides fallback random stub if transformers are not installed
"""

import random
from typing import Dict, Any

_transformers_available = None
_sentiment_model = None


def _get_sentiment_model():
    """Lazily import and return a transformers sentiment pipeline or None on failure."""
    global _transformers_available, _sentiment_model
    if _sentiment_model is not None:
        return _sentiment_model
    if _transformers_available is None:
        try:
            from transformers import pipeline  # type: ignore
            _transformers_available = True
        except Exception:
            _transformers_available = False
    if not _transformers_available:
        return None
    try:
        from transformers import pipeline  # type: ignore
        _sentiment_model = pipeline("sentiment-analysis")
    except Exception:
        _sentiment_model = None
    return _sentiment_model


# -------------------------------
# Core Function
# -------------------------------
def analyze_sentiment(text: str) -> Dict[str, Any]:
    """
    Analyze sentiment of a text.
    Returns label + score.
    """
    if not text or not text.strip():
        return {"sentiment": "neutral", "score": 0.0}

    model = _get_sentiment_model()
    if model:
        try:
            result = model(text)[0]
            return {"sentiment": result["label"].lower(), "score": float(result["score"])}
        except Exception as e:
            return {"sentiment": "error", "score": 0.0, "error": str(e)}

    # Fallback: random stub
    sentiment_classes = ["positive", "neutral", "negative"]
    sentiment = random.choice(sentiment_classes)
    score = round(random.uniform(0.5, 0.95), 3)

    return {"sentiment": sentiment, "score": score}
