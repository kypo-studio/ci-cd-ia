"""API Flask pour utiliser Gemini"""
from flask import Flask, request, jsonify
import google.generativeai as genai
from app.config import Config
import logging

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configuration de Gemini
try:
    genai.configure(api_key=Config.GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.0-flash-exp')
    logger.info("✅ Gemini API configured successfully")
except Exception as e:
    logger.error(f"❌ Error configuring Gemini API: {e}")
    model = None


@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint de santé"""
    status = 'healthy' if model is not None else 'unhealthy'
    return jsonify({
        'status': status,
        'service': 'Gemini API',
        'version': '1.0.0'
    }), 200 if status == 'healthy' else 503


@app.route('/generate', methods=['POST'])
def generate_text():
    """Générer du texte avec Gemini"""
    try:
        data = request.get_json()
        
        if not data or 'prompt' not in data:
            return jsonify({'error': 'Le champ "prompt" est requis'}), 400
        
        prompt = data['prompt']
        max_tokens = data.get('max_tokens', 1000)
        
        if not model:
            return jsonify({'error': 'Gemini API non configurée'}), 503
        
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=max_tokens,
            )
        )
        
        return jsonify({
            'response': response.text,
            'model': 'gemini-2.0-flash-exp',
            'prompt': prompt
        }), 200
        
    except Exception as e:
        logger.error(f"Error generating text: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/chat', methods=['POST'])
def chat():
    """Chat avec historique"""
    try:
        data = request.get_json()
        
        if not data or 'messages' not in data:
            return jsonify({'error': 'Le champ "messages" est requis'}), 400
        
        messages = data['messages']
        
        if not model:
            return jsonify({'error': 'Gemini API non configurée'}), 503
        
        chat_session = model.start_chat(history=[])
        
        for msg in messages[:-1]:
            chat_session.send_message(msg['content'])
        
        response = chat_session.send_message(messages[-1]['content'])
        
        return jsonify({
            'response': response.text,
            'model': 'gemini-2.0-flash-exp'
        }), 200
        
    except Exception as e:
        logger.error(f"Error in chat: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    port = Config.PORT
    logger.info(f"🚀 Starting server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=Config.FLASK_ENV == 'development')
