// src/services/gemini.service.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    try {
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not defined');
      }

      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-flash-lite',
      });

      console.log('✅ Gemini service initialized');
    } catch (error) {
      console.error('❌ Gemini initialization error:', error);
      throw error;
    }
  }

  /**
   * Générer du texte simple
   */
  async generateText(prompt) {
    try {
      if (!prompt || prompt.trim().length === 0) {
        throw new Error('Prompt cannot be empty');
      }

      console.log('📝 Generating text...');

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text;
    } catch (error) {
      console.error('❌ Gemini generateText error:', error);
      throw new Error(`Failed to generate text: ${error.message}`);
    }
  }

  /**
   * Chat avec historique
   */
  async chat(message, history = []) {
    try {
      if (!message || message.trim().length === 0) {
        throw new Error('Message cannot be empty');
      }

      console.log('💬 Starting chat...');

      // Créer une session de chat avec l'historique
      const chat = this.model.startChat({
        history: history,
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });

      // Envoyer le message
      const result = await chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();

      return text;
    } catch (error) {
      console.error('❌ Gemini chat error:', error);
      throw new Error(`Failed to process chat: ${error.message}`);
    }
  }

  /**
   * Analyser une image
   */
  async analyzeImage(base64Image, prompt) {
    try {
      if (!base64Image || !prompt) {
        throw new Error('Image and prompt are required');
      }

      console.log('🖼️ Analyzing image...');

      // Retirer le préfixe data:image si présent
      const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '');

      const imagePart = {
        inlineData: {
          data: imageData,
          mimeType: 'image/jpeg',
        },
      };

      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('❌ Gemini analyzeImage error:', error);
      throw new Error(`Failed to analyze image: ${error.message}`);
    }
  }
}

// Exporter une instance unique
module.exports = new GeminiService();
