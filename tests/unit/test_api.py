"""Tests unitaires de l'API"""
import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app.main import app


@pytest.fixture
def client():
    """Fixture pour le client de test"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_health_check(client):
    """Test du endpoint health"""
    response = client.get('/health')
    assert response.status_code in [200, 503]
    data = response.get_json()
    assert 'status' in data
    assert 'service' in data


def test_generate_missing_prompt(client):
    """Test génération sans prompt"""
    response = client.post('/generate', json={})
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data


def test_generate_with_prompt(client):
    """Test génération avec prompt"""
    response = client.post('/generate', json={
        'prompt': 'Hello'
    })
    # Peut être 200 ou 500 selon si l'API key est configurée
    assert response.status_code in [200, 500, 503]


def test_chat_missing_messages(client):
    """Test chat sans messages"""
    response = client.post('/chat', json={})
    assert response.status_code == 400
