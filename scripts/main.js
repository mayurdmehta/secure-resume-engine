import { initNavigation, performInitialRouting } from './navigation.js';
import { initToolkit } from './toolkit.js';
import { initChatbot } from './chatbot.js';
import { initProjects } from './projects.js';
import { initBlogs } from './blogs.js';

/**
 * Main application entry point.
 */
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Asynchronously load the page content from the external HTML file.
    await loadPageContent();
    
    // 2. Initialize all modules to set up their event listeners.
    initNavigation();
    initToolkit();
    initChatbot();
    initProjects();
    initBlogs();

    // 3. AFTER all modules are initialized, perform the initial route check.
    // This ensures that all listeners are in place before any events are dispatched.
    performInitialRouting();
});

/**
 * Fetches the HTML content from pages.html and injects it into the main
 * containers defined in index.html.
 */
async function loadPageContent() {
    const pageContent = document.getElementById('page-content');
    const modalContainer = document.getElementById('modal-container');
    const chatbotContainer = document.getElementById('chatbot-container');

    try {
        const response = await fetch('pages.html');
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const html = await response.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const pages = doc.getElementById('pages-container');
        const modals = doc.getElementById('modals-container');
        const chatbot = doc.getElementById('chatbot-container');
        const style = doc.querySelector('style');

        if (!pages || !modals || !chatbot || !style) {
            throw new Error("One or more content containers were not found in pages.html.");
        }

        if (pageContent) pageContent.innerHTML = pages.innerHTML;
        if (modalContainer) modalContainer.innerHTML = modals.innerHTML;
        if (chatbotContainer) chatbotContainer.innerHTML = chatbot.innerHTML;

        document.head.appendChild(style);

    } catch (error) {
        console.error("Failed to load page content:", error);
        if (pageContent) {
            pageContent.innerHTML = `<p class="text-red-500 text-center p-8">Error: Could not load page content.</p>`;
        }
    }
}
