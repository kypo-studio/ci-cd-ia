// test-gemini.js
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  try {
    console.log('🔑 GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Définie' : '❌ MANQUANTE');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    console.log('📡 Envoi de la requête à Gemini...');
    
    const result = await model.generateContent('Dis bonjour en 3 langues');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Réponse de Gemini:');
    console.log(text);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('Détails:', error);
  }
}

testGemini();
