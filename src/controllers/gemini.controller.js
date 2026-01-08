// src/controllers/gemini.controller.js
const geminiService = require('../services/gemini.service');

class GeminiController {
  /**
   * POST /api/gemini/generate
   * Body: { prompt: string }
   */
  async generate(req, res) {
    try {
      const { prompt } = req.body;

      if (!prompt) {
        return res.status(400).json({ 
          error: 'Prompt is required' 
        });
      }

      const text = await geminiService.generateText(prompt);

      res.json({
        success: true,
        data: {
          prompt,
          response: text
        }
      });
    } catch (error) {
      console.error('Generate error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /api/gemini/chat
   * Body: { messages: Array }
   */
  async chat(req, res) {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ 
          error: 'Messages array is required' 
        });
      }

      const response = await geminiService.chat(messages);

      res.json({
        success: true,
        data: {
          response
        }
      });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /api/gemini/analyze-image
   * Body: { image: base64, prompt: string }
   */
  async analyzeImage(req, res) {
    try {
      const { image, prompt } = req.body;

      if (!image) {
        return res.status(400).json({ 
          error: 'Image (base64) is required' 
        });
      }

      const response = await geminiService.analyzeImage(image, prompt);

      res.json({
        success: true,
        data: {
          response
        }
      });
    } catch (error) {
      console.error('Analyze image error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/gemini/health
   */
  health(req, res) {
    res.json({
      success: true,
      service: 'gemini-api',
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new GeminiController();
