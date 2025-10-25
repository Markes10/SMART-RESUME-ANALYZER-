"""
vLLM client wrapper.

- Provides backwards-compatible functions for routes
- Internally delegates to llm_utils
"""

from typing import List, Dict, Any
from . import llm_utils


# -------------------------------
# Text Completion
# -------------------------------
async def generate_text(prompt: str, max_tokens: int = 256, temperature: float = 0.7) -> str:
    """
    Generate free-form text using vLLM.
    """
    return await llm_utils.generate(prompt, max_tokens=max_tokens, temperature=temperature)


# -------------------------------
# Chat
# -------------------------------
async def chat_completion(messages: List[Dict[str, Any]], max_tokens: int = 256, temperature: float = 0.7) -> str:
    """
    Generate a chat response using vLLM.
    """
    return await llm_utils.chat(messages, max_tokens=max_tokens, temperature=temperature)
