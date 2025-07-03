import { initNavigation } from './navigation.js';
import { initToolkit } from './toolkit.js';
import { initChatbot } from './chatbot.js';
import { initProjects } from './projects.js';

// This function runs when the page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load the HTML content for each page
    loadPageContent();
    
    // Initialize all the different modules
    initNavigation();
    initToolkit();
    initChatbot();
    initProjects();
});

async function loadPageContent() {
    const pageContent = document.getElementById('page-content');
    const modalContainer = document.getElementById('modal-container');
    const chatbotFab = document.getElementById('chatbot-fab');
    const chatbotWindow = document.getElementById('chatbot-window');

    // Fetch and inject the HTML for all pages and components
    // This is a simplified way to handle templates without a framework
    try {
        const response = await fetch('pages.html'); // A new file to hold our page HTML
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        pageContent.innerHTML = doc.getElementById('pages-container').innerHTML;
        modalContainer.innerHTML = doc.getElementById('modals-container').innerHTML;
        chatbotFab.innerHTML = doc.getElementById('chatbot-fab-container').innerHTML;
        chatbotWindow.innerHTML = doc.getElementById('chatbot-window-container').innerHTML;

    } catch (error) {
        console.error("Failed to load page content:", error);
        pageContent.innerHTML = `<p class="text-red-500 text-center">Error: Could not load page content.</p>`;
    }
}