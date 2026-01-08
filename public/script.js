// Configuration
const API_BASE_URL = 'http://localhost:3000/api/gemini';

// Éléments DOM
const statusElement = document.getElementById('status');
const statusText = statusElement.querySelector('.status-text');
const chatContainer = document.getElementById('chatContainer');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const clearChatBtn = document.getElementById('clearChat');
const generateForm = document.getElementById('generateForm');
const generateInput = document.getElementById('generateInput');
const resultContainer = document.getElementById('resultContainer');
const resultContent = document.getElementById('resultContent');
const quickPromptBtns = document.querySelectorAll('.prompt-btn');

// Variables
let chatHistory = [];

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    checkAPIHealth();
    setupEventListeners();
});

// Vérifier la santé de l'API
async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        
        if (data.success) {
            updateStatus('connected', 'Connecté ✅');
        } else {
            updateStatus('error', 'Erreur de connexion ❌');
        }
    } catch (error) {
        updateStatus('error', 'API non disponible ❌');
        console.error('Health check error:', error);
    }
}

// Mettre à jour le statut
function updateStatus(status, text) {
    statusElement.className = `status ${status}`;
    statusText.textContent = text;
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Chat form
    chatForm.addEventListener('submit', handleChatSubmit);
    
    // Clear chat
    clearChatBtn.addEventListener('click', clearChat);
    
    // Generate form
    generateForm.addEventListener('submit', handleGenerateSubmit);
    
    // Quick prompts
    quickPromptBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const prompt = btn.getAttribute('data-prompt');
            generateInput.value = prompt;
            handleGenerateSubmit(new Event('submit'));
        });
    });
}

// Gérer l'envoi du chat
async function handleChatSubmit(e) {
    e.preventDefault();
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Ajouter le message de l'utilisateur
    addMessage(message, 'user');
    chatInput.value = '';
    
    // Désactiver l'input pendant le traitement
    setLoading(true, 'chat');
    
    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                history: chatHistory
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            addMessage(data.data.text, 'ai');
            chatHistory = data.data.history;
        } else {
            addMessage(`Erreur: ${data.error}`, 'ai');
        }
    } catch (error) {
        addMessage('Erreur de connexion à l\'API', 'ai');
        console.error('Chat error:', error);
    } finally {
        setLoading(false, 'chat');
    }
}

// Ajouter un message au chat
function addMessage(text, type) {
    // Supprimer le message de bienvenue
    const welcomeMsg = chatContainer.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = text;
    
    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = new Date().toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageDiv.appendChild(bubble);
    messageDiv.appendChild(time);
    chatContainer.appendChild(messageDiv);
    
    // Scroll vers le bas
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Effacer le chat
function clearChat() {
    chatHistory = [];
    chatContainer.innerHTML = `
        <div class="welcome-message">
            <h3>👋 Bienvenue !</h3>
            <p>Posez-moi n'importe quelle question et je vous répondrai avec l'aide de Gemini AI.</p>
        </div>
    `;
}

// Gérer la génération de texte
async function handleGenerateSubmit(e) {
    e.preventDefault();
    
    const prompt = generateInput.value.trim();
    if (!prompt) return;
    
    setLoading(true, 'generate');
    resultContainer.style.display = 'block';
    resultContent.innerHTML = '<span class="loading">Génération en cours</span>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt })
        });
        
        const data = await response.json();
        
        if (data.success) {
            resultContent.textContent = data.data.text;
        } else {
            resultContent.textContent = `Erreur: ${data.error}`;
        }
    } catch (error) {
        resultContent.textContent = 'Erreur de connexion à l\'API';
        console.error('Generate error:', error);
    } finally {
        setLoading(false, 'generate');
    }
}

// Gérer l'état de chargement
function setLoading(isLoading, context) {
    if (context === 'chat') {
        chatInput.disabled = isLoading;
        sendBtn.disabled = isLoading;
        sendBtn.innerHTML = isLoading 
            ? '<span class="loading">Envoi</span>' 
            : '<span>Envoyer</span><span class="send-icon">📤</span>';
    } else if (context === 'generate') {
        generateInput.disabled = isLoading;
        const generateBtn = generateForm.querySelector('.generate-btn');
        generateBtn.disabled = isLoading;
        generateBtn.innerHTML = isLoading 
            ? '<span class="loading">Génération</span>' 
            : '✨ Générer';
    }
}
