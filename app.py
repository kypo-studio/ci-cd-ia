from flask import Flask, request, jsonify
import google.generativeai as genai
import os
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# Configure Gemini
genai.configure(api_key=app.config['GEMINI_API_KEY'])
model = genai.GenerativeModel('gemini-2.5-flash-lite')

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'gemini-api',
        'version': '1.0.0'
    }), 200

@app.route('/generate', methods=['POST'])
def generate():
    """Generate text using Gemini"""
    try:
        data = request.get_json()
        
        if not data or 'prompt' not in data:
            return jsonify({'error': 'Missing prompt in request body'}), 400
        
        prompt = data['prompt']
        
        # Generate content
        response = model.generate_content(prompt)
        
        return jsonify({
            'success': True,
            'prompt': prompt,
            'response': response.text
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error generating content: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=False)

