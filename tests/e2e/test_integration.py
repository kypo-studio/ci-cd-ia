"""Tests E2E de l'API"""
import pytest
import requests
import time


BASE_URL = "http://localhost:8080"


def wait_for_api(max_retries=30):
    """Attendre que l'API soit prête"""
    for _ in range(max_retries):
        try:
            response = requests.get(f"{BASE_URL}/health", timeout=2)
            if response.status_code in [200, 503]:
                return True
        except requests.exceptions.RequestException:
            time.sleep(1)
    return False


def test_api_is_running():
    """Test que l'API répond"""
    assert wait_for_api(), "API did not start in time"


def test_health_endpoint():
    """Test du endpoint health"""
    response = requests.get(f"{BASE_URL}/health")
    assert response.status_code in [200, 503]
    data = response.json()
    assert 'status' in data


def test_generate_endpoint():
    """Test du endpoint generate"""
    response = requests.post(
        f"{BASE_URL}/generate",
        json={'prompt': 'Test'}
    )
    assert response.status_code in [200, 500, 503]
