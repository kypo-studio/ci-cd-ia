"""Configuration de l'application"""
import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Configuration"""
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    FLASK_ENV = os.getenv('FLASK_ENV', 'production')
    PORT = int(os.getenv('PORT', 8080))
    
    @staticmethod
    def validate():
        """Valider la configuration"""
        if not Config.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not set")
        return True
