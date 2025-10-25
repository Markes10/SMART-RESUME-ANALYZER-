"""
Embedding Service for text (resumes, job descriptions, feedback, etc.)

- Uses sentence-transformers for embedding generation
- Provides single and batch embedding utilities
"""

import os
from typing import List

# We avoid importing sentence-transformers at module import time.
# Availability and actual model object are resolved lazily in _get_model().
_SENTENCE_AVAILABLE = None

# Default to an embedding size used in the project
VECTOR_SIZE = int(os.getenv("VECTOR_SIZE", "384"))

_model = None

def _get_model():
    """Lazy-load the sentence-transformers model to avoid import-time downloads."""
    global _model
    if _model is not None:
        return _model
    # Determine availability when first requested
    global _SENTENCE_AVAILABLE
    if _SENTENCE_AVAILABLE is None:
        try:
            from .sentence_transformers import SentenceTransformer  # type: ignore
            _SENTENCE_AVAILABLE = True
        except Exception:
            _SENTENCE_AVAILABLE = False
    if not _SENTENCE_AVAILABLE:
        return None
    MODEL_NAME = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
    # Import and instantiate on demand
    from .sentence_transformers import SentenceTransformer  # type: ignore
    _model = SentenceTransformer(MODEL_NAME)
    return _model


def _fallback_vector(text: str) -> List[float]:
    """Deterministic fallback embedding using SHA256 hashed bytes expanded to VECTOR_SIZE."""
    import hashlib
    import numpy as _np

    if not text:
        return [0.0] * VECTOR_SIZE

    digest = hashlib.sha256(text.encode("utf-8")).digest()
    # Repeat digest to reach desired size
    repeats = (VECTOR_SIZE + len(digest) - 1) // len(digest)
    raw = (digest * repeats)[:VECTOR_SIZE]
    vec = _np.frombuffer(raw, dtype=_np.uint8).astype(_np.float32)
    # Normalize
    norm = _np.linalg.norm(vec)
    if norm > 0:
        vec = vec / norm
    return vec.tolist()


def embed_text(text: str) -> List[float]:
    """Generate an embedding for a single text string."""
    if not text or not text.strip():
        return []
    if _SENTENCE_AVAILABLE:
        model = _get_model()
        if model is None:
            return _fallback_vector(text)
        return model.encode(text, convert_to_numpy=True).tolist()
    return _fallback_vector(text)


def embed_batch(texts: List[str]) -> List[List[float]]:
    """Generate embeddings for a batch of text strings."""
    if not texts:
        return []
    if _SENTENCE_AVAILABLE:
        model = _get_model()
        if model is None:
            return [_fallback_vector(t) for t in texts]
        return model.encode(texts, convert_to_numpy=True).tolist()
    return [_fallback_vector(t) for t in texts]


def calculate_similarity(embedding1: List[float], embedding2: List[float]) -> float:
    """Calculate cosine similarity between two embeddings."""
    if not embedding1 or not embedding2:
        return 0.0
    
    # Convert to numpy arrays if they aren't already
    import numpy as np
    vec1 = np.array(embedding1)
    vec2 = np.array(embedding2)
    
    # Calculate cosine similarity
    dot_product = np.dot(vec1, vec2)
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    
    if norm1 == 0 or norm2 == 0:
        return 0.0
    
    return float(dot_product / (norm1 * norm2))
