import { callBackend } from './api.js';

export function initChatbot() {
    document.body.addEventListener('click', event => {
        const chatbotFab = event.target.closest('#chatbot-fab');
        if (chatbotFab) {
            toggleChatbot();
        }
        const chatSendBtn = event.target.closest('#chat-send-btn');
        if (chatSendBtn) {
            sendChatMessage();
        }
    });
    
    document.body.addEventListener('keypress', event => {
        const chatInput = document.getElementById('chat-input');
        if (event.target === chatInput && event.key === 'Enter') {
            sendChatMessage();
        }
    });
}

function toggleChatbot() {
    const chatbotWindow = document.getElementById('chatbot-window');
    const isHidden = chatbotWindow.classList.contains('hidden');
    if (isHidden) {
        chatbotWindow.classList.remove('hidden');
        setTimeout(() => chatbotWindow.classList.remove('scale-95', 'opacity-0'), 10);
    } else {
        chatbotWindow.classList.add('scale-95', 'opacity-0');
        setTimeout(() => chatbotWindow.classList.add('hidden'), 300);
    }
}

async function sendChatMessage() {
    const chatInput = document.getElementById('chat-input');
    if (!chatInput) return;
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    addChatMessage(userMessage, 'user');
    chatInput.value = '';
    
    const chatMessages = document.getElementById('chat-messages');
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('flex', 'justify-start', 'typing-indicator');
    typingIndicator.innerHTML = `<div class="bg-brand-primary text-white p-3 rounded-lg max-w-xs"><p class="animate-pulse">...</p></div>`;
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const response = await callBackend('chatbot', '', '', userMessage);
        chatMessages.removeChild(typingIndicator);
        addChatMessage(response, 'ai');
    } catch (error) {
        chatMessages.removeChild(typingIndicator);
        addChatMessage("Sorry, I'm having trouble connecting right now.", 'ai');
    }
}

function addChatMessage(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('flex', sender === 'user' ? 'justify-end' : 'justify-start');
    
    const bubble = document.createElement('div');
    bubble.classList.add('p-3', 'rounded-lg', 'max-w-xs', sender === 'user' ? 'bg-gray-600' : 'bg-brand-primary', 'text-white');
    bubble.innerHTML = `<p>${message}</p>`;
    
    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}