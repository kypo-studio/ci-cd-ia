const express = require('express');
const app = express();

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to CI/CD IA API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      generate: '/generate'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.post('/generate', (req, res) => {
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Simulation de génération de texte
  const generatedText = `Generated response for: ${prompt}`;
  
  res.json({
    prompt,
    generated: generatedText,
    model: 'mock-model',
    timestamp: new Date().toISOString()
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

// Ne démarre le serveur que si ce n'est pas un import
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
