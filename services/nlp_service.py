import numpy as np
from .typing import List, Dict, Any


class NLPService:
    """
    Provides NLP capabilities including:
    - Text classification
    - Named Entity Recognition
    - Sentiment Analysis
    - Text Embeddings
    - Question Answering
    """
    def __init__(self):
        # Keep attributes None until used; heavy imports happen in getters
        self.sentiment_analyzer = None
        self.ner_pipeline = None
        self.qa_pipeline = None
        self.text_classifier = None
        self.embedding_model = None

    def _get_pipeline(self, task: str):
        """Return a transformers pipeline for the given task, lazily importing transformers."""
        try:
            from .transformers import pipeline  # type: ignore
        except Exception:
            return None
        try:
            return pipeline(task)
        except Exception:
            return None

    def _get_embedding_model(self):
        """Lazily load and return a SentenceTransformer model or None."""
        if self.embedding_model is not None:
            return self.embedding_model
        try:
            from .sentence_transformers import SentenceTransformer  # type: ignore
        except Exception:
            return None
        try:
            self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        except Exception:
            self.embedding_model = None
        return self.embedding_model
        
    def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment of the text"""
        if self.sentiment_analyzer is None:
            self.sentiment_analyzer = self._get_pipeline("sentiment-analysis")
        if self.sentiment_analyzer is None:
            return {"label": "neutral", "score": 0.0}
        result = self.sentiment_analyzer(text)[0]
        return {
            'label': result['label'],
            'score': result['score']
        }
        
    def extract_entities(self, text: str) -> List[Dict[str, Any]]:
        """Extract named entities from .text"""
        if self.ner_pipeline is None:
            self.ner_pipeline = self._get_pipeline("ner")
        if self.ner_pipeline is None:
            return []
        return self.ner_pipeline(text)
        
    def get_embedding(self, text: str) -> np.ndarray:
        """Get text embeddings"""
        model = self._get_embedding_model()
        if model is None:
            return np.zeros(384)
        return model.encode(text)
        
    def answer_question(self, context: str, question: str) -> Dict[str, Any]:
        """Answer questions based on context"""
        if self.qa_pipeline is None:
            self.qa_pipeline = self._get_pipeline("question-answering")
        if self.qa_pipeline is None:
            return {"answer": "", "score": 0.0, "start": 0, "end": 0}
        result = self.qa_pipeline(question=question, context=context)
        return {
            'answer': result['answer'],
            'score': result['score'],
            'start': result['start'],
            'end': result['end']
        }
        
    def classify_text(self, text: str) -> Dict[str, Any]:
        """Classify text into predefined categories"""
        if self.text_classifier is None:
            self.text_classifier = self._get_pipeline("text-classification")
        if self.text_classifier is None:
            return {"label": "unknown", "score": 0.0}
        result = self.text_classifier(text)[0]
        return {
            'label': result['label'],
            'score': result['score']
        }
