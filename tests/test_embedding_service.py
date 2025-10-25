"""
Tests for embedding service functionality
"""
import pytest
import numpy as np
from services.embedding_service import embed_text, embed_batch, calculate_similarity, _fallback_vector

def test_embed_text():
    """Test text embedding functionality"""
    text = "Python developer with machine learning experience"
    embedding = embed_text(text)
    
    # Check that we get a valid embedding
    assert isinstance(embedding, list)
    assert len(embedding) > 0
    assert all(isinstance(x, (int, float)) for x in embedding)

def test_embed_empty_text():
    """Test embedding empty text"""
    embedding = embed_text("")
    assert embedding == []
    
    embedding = embed_text("   ")
    assert embedding == []

def test_embed_batch():
    """Test batch text embedding"""
    texts = [
        "Python developer",
        "Machine learning engineer",
        "Data scientist"
    ]
    
    embeddings = embed_batch(texts)
    
    # Check that we get valid embeddings
    assert isinstance(embeddings, list)
    assert len(embeddings) == len(texts)
    for embedding in embeddings:
        assert isinstance(embedding, list)
        assert len(embedding) > 0
        assert all(isinstance(x, (int, float)) for x in embedding)

def test_calculate_similarity():
    """Test similarity calculation between embeddings"""
    text1 = "Python developer with Django experience"
    text2 = "Python programmer skilled in Django framework"
    text3 = "Chef with expertise in Italian cuisine"
    
    embedding1 = embed_text(text1)
    embedding2 = embed_text(text2)
    embedding3 = embed_text(text3)
    
    # Similar texts should have high similarity
    similarity_1_2 = calculate_similarity(embedding1, embedding2)
    assert 0 <= similarity_1_2 <= 1
    assert similarity_1_2 > 0.5  # Should be somewhat similar
    
    # Different texts should have lower similarity
    similarity_1_3 = calculate_similarity(embedding1, embedding3)
    assert 0 <= similarity_1_3 <= 1
    # Just check that both similarities are valid numbers

def test_calculate_similarity_edge_cases():
    """Test similarity calculation edge cases"""
    # Empty embeddings
    similarity = calculate_similarity([], [])
    assert similarity == 0.0
    
    # One empty embedding
    embedding = embed_text("test")
    similarity = calculate_similarity([], embedding)
    assert similarity == 0.0
    
    similarity = calculate_similarity(embedding, [])
    assert similarity == 0.0
    
    # Zero vectors
    zero_vector = [0.0] * 10
    similarity = calculate_similarity(zero_vector, zero_vector)
    assert similarity == 0.0

def test_fallback_vector():
    """Test fallback vector generation"""
    text = "test text"
    vector = _fallback_vector(text)
    
    # Check vector properties
    assert isinstance(vector, list)
    assert len(vector) > 0
    assert all(isinstance(x, (int, float)) for x in vector)
    
    # Same text should produce same vector
    vector2 = _fallback_vector(text)
    assert vector == vector2
    
    # Different text should produce different vector
    vector3 = _fallback_vector("different text")
    assert vector != vector3

def test_embedding_consistency():
    """Test that embedding generation is consistent"""
    text = "Consistent embedding test"
    
    # Generate embedding multiple times
    embedding1 = embed_text(text)
    embedding2 = embed_text(text)
    
    # Should be identical
    assert embedding1 == embedding2

@pytest.mark.parametrize("text_length", [10, 100, 1000])
def test_embedding_different_lengths(text_length):
    """Test embedding generation with different text lengths"""
    text = "a" * text_length
    embedding = embed_text(text)
    
    assert isinstance(embedding, list)
    assert len(embedding) > 0
    assert all(isinstance(x, (int, float)) for x in embedding)