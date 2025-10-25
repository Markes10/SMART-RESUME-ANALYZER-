"""
Skill extractor service.

- Uses spaCy for Named Entity Recognition & tokenization
- Matches text against ESCO skills JSON
"""

import os
import json
from typing import List, Set

# Try to import spaCy; if unavailable fallback to keyword matching
try:
    import spacy
    _SPACY_AVAILABLE = True
except Exception:
    _SPACY_AVAILABLE = False

# -------------------------------
# Load ESCO Skills
# -------------------------------
ESCO_PATH = os.getenv("ESCO_SKILLS_PATH", "data/esco_skills.json")

if os.path.exists(ESCO_PATH):
    try:
        with open(ESCO_PATH, "r", encoding="utf-8") as f:
            ESCO_SKILLS = set(json.load(f))
    except Exception:
        ESCO_SKILLS = {"python", "java", "sql", "project management", "communication", "leadership"}
else:
    # fallback minimal set if file missing
    ESCO_SKILLS = {"python", "java", "sql", "project management", "communication", "leadership"}


# Lazy spaCy model
_nlp = None
def _load_spacy():
    global _nlp
    if _nlp is None and _SPACY_AVAILABLE:
        try:
            _nlp = spacy.load("en_core_web_sm")
        except Exception:
            _nlp = None
    return _nlp


def extract_skills(text: str) -> List[str]:
    """
    Extract skills from .resume text using spaCy + ESCO skills list when available.
    Falls back to simple substring matching against ESCO_SKILLS.
    """
    if not text or not text.strip():
        return []

    text_lower = text.lower()

    # Try spaCy extraction when possible
    nlp = _load_spacy()
    found = set()
    if nlp:
        doc = nlp(text_lower)
        for token in doc:
            if not token.is_stop and not token.is_punct:
                lemma = token.lemma_.strip()
                for skill in ESCO_SKILLS:
                    if skill.lower() in lemma:
                        found.add(skill)
        for chunk in doc.noun_chunks:
            chunk_text = chunk.text.strip().lower()
            for skill in ESCO_SKILLS:
                if skill.lower() in chunk_text:
                    found.add(skill)
    else:
        # Simple keyword matching fallback
        for skill in ESCO_SKILLS:
            if skill.lower() in text_lower:
                found.add(skill)

    return sorted(found)
