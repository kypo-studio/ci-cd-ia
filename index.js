// index.js
const express = require('express');
const path = require('path');
require('dotenv').config();

const geminiRoutes = require('./src/routes/gemini.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' })); // Augmenter la limite pour les images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Routes API
app.use('/api/gemini', geminiRoutes);

// Route racine
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error('❌ Global error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api/gemini`);
  console.log(`🌐 Interface: http://localhost:${PORT}`);
});

module.exports = app;
