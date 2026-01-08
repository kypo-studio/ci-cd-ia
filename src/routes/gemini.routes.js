// src/routes/gemini.routes.js
const express = require('express');
const router = express.Router();
const geminiService = require('../services/gemini.service');

/**
 * GET /api/gemini/health
 * Vérifier l'état de l'API
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'gemini-api',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/gemini/generate
 * Générer du texte simple
 * Body: { prompt: string }
 */
router.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required',
      });
    }

    console.log('📝 Generating text for prompt:', prompt);

    const text = await geminiService.generateText(prompt);

    res.json({
      success: true,
      data: { text },
    });
  } catch (error) {
    console.error('❌ Generate route error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/gemini/chat
 * Chat avec historique
 * Body: { message: string, history: array }
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    // Validation
    if (
      !message ||
      typeof message !== 'string' ||
      message.trim().length === 0
    ) {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a non-empty string',
      });
    }

    // S'assurer que history est un tableau valide
    const chatHistory = Array.isArray(history) ? history : [];

    console.log('💬 Chat request:', {
      message: message.substring(0, 50) + '...',
      historyLength: chatHistory.length,
    });

    // Appeler le service Gemini
    const response = await geminiService.chat(message, chatHistory);

    // Construire le nouvel historique
    const newHistory = [
      ...chatHistory,
      {
        role: 'user',
        parts: [{ text: message }],
      },
      {
        role: 'model',
        parts: [{ text: response }],
      },
    ];

    res.json({
      success: true,
      data: {
        text: response,
        history: newHistory,
      },
    });
  } catch (error) {
    console.error('❌ Chat route error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/gemini/analyze-image
 * Analyser une image
 * Body: { image: base64, prompt: string }
 */
router.post('/analyze-image', async (req, res) => {
  try {
    const { image, prompt } = req.body;

    if (!image || !prompt) {
      return res.status(400).json({
        success: false,
        error: 'Image and prompt are required',
      });
    }

    console.log('🖼️ Analyzing image...');

    const response = await geminiService.analyzeImage(image, prompt);

    res.json({
      success: true,
      data: { response },
    });
  } catch (error) {
    console.error('❌ Analyze image route error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
