"""
Qdrant utilities for vector storage and search.

- Store embeddings with metadata (resume_id, job_id, skills, etc.)
- Search for nearest neighbors
"""

import os
import uuid
from typing import List, Dict, Any

try:
    from qdrant_client import QdrantClient
    from qdrant_client.models import (
        VectorParams,
        Distance,
        PointStruct,
        Filter,
        FieldCondition,
        MatchValue
    )
    _QDRANT_AVAILABLE = True
except Exception:
    # Provide a simple in-memory fallback implementation for development
    QdrantClient = None
    VectorParams = None
    Distance = None
    PointStruct = None
    Filter = None
    FieldCondition = None
    MatchValue = None
    _QDRANT_AVAILABLE = False

# -------------------------------
# Config
# -------------------------------
QDRANT_HOST = os.getenv("QDRANT_HOST", "qdrant")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", 6333))
VECTOR_SIZE = int(os.getenv("VECTOR_SIZE", 384))  # sentence-transformers default

if _QDRANT_AVAILABLE:
    client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)
else:
    # In-memory store: {collection_name: [{id, vector, payload}]}
    _IN_MEMORY_STORE = {}
    class _InMemoryClient:
        def get_collections(self):
            return type("C", (), {"collections": []})
        def recreate_collection(self, collection_name, vectors_config=None):
            _IN_MEMORY_STORE[collection_name] = []
        def upsert(self, collection_name, points):
            _IN_MEMORY_STORE.setdefault(collection_name, []).extend(points)
        def search(self, collection_name, query_vector, limit=5, query_filter=None):
            items = _IN_MEMORY_STORE.get(collection_name, [])
            # naive cosine similarity
            def sim(v1, v2):
                import math
                if not v1 or not v2:
                    return 0.0
                dot = sum(a*b for a,b in zip(v1, v2))
                norm1 = math.sqrt(sum(a*a for a in v1))
                norm2 = math.sqrt(sum(b*b for b in v2))
                return dot / (norm1*norm2 + 1e-9)
            results = []
            for it in items:
                score = sim(query_vector, it.get('vector') or [])
                r = type('R', (), {
                    'id': it.get('id'),
                    'score': score,
                    'payload': it.get('payload')
                })
                results.append(r)
            results.sort(key=lambda x: x.score, reverse=True)
            return results[:limit]
        def delete(self, collection_name, points_selector):
            items = _IN_MEMORY_STORE.get(collection_name, [])
            _IN_MEMORY_STORE[collection_name] = [i for i in items if i.get('id') not in points_selector]

    client = _InMemoryClient()


# -------------------------------
# Collection Management
# -------------------------------
def ensure_collection(name: str):
    """
    Create Qdrant collection if it doesn't exist.
    """
    collections = client.get_collections().collections
    if not any(c.name == name for c in collections):
        client.recreate_collection(
            collection_name=name,
            vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE)
        )


# -------------------------------
# Store Vector
# -------------------------------
def store_vector(collection_name: str, vector: List[float], payload: Dict[str, Any]) -> str:
    """
    Store a vector with metadata in Qdrant.
    """
    ensure_collection(collection_name)

    point_id = str(uuid.uuid4())
    point = PointStruct(
        id=point_id,
        vector=vector,
        payload=payload
    )

    client.upsert(collection_name=collection_name, points=[point])

    return point_id


# -------------------------------
# Search Vector
# -------------------------------
def search_vector(
    collection_name: str,
    vector: List[float],
    top_k: int = 5,
    filter_payload: Dict[str, Any] = None
) -> List[Dict[str, Any]]:
    """
    Search for nearest neighbors in Qdrant.
    Optionally filter by payload (e.g., skills).
    """
    ensure_collection(collection_name)

    qdrant_filter = None
    if filter_payload:
        conditions = [
            FieldCondition(key=k, match=MatchValue(value=v))
            for k, v in filter_payload.items()
        ]
        qdrant_filter = Filter(must=conditions)

    results = client.search(
        collection_name=collection_name,
        query_vector=vector,
        limit=top_k,
        query_filter=qdrant_filter
    )

    return [
        {
            "id": r.id,
            "score": r.score,
            "payload": r.payload
        }
        for r in results
    ]


# -------------------------------
# Delete Vector
# -------------------------------
def delete_vector(collection_name: str, point_id: str):
    """
    Delete a vector by ID.
    """
    client.delete(
        collection_name=collection_name,
        points_selector=[point_id]
    )
