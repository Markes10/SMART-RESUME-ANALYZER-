# Makes services a package
"""
Services package initializer.

This file imports and exposes all service modules
so they can be easily imported across the app.
"""

from . import (
    qdrant_utils,
    embedding_service,
    skill_extractor,
    vllm_client,
    # future ML services
    # turnover_model,
    # anomaly_service,
    # fairness_service,
    # recommender_service,
    # dei_report_service,
)

__all__ = [
    "qdrant_utils",
    "embedding_service",
    "skill_extractor",
    "vllm_client",
    # "turnover_model",
    # "anomaly_service",
    # "fairness_service",
    # "recommender_service",
    # "dei_report_service",
]
