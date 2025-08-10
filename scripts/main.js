import { initNavigation } from './navigation.js';
import { initToolkit } from './toolkit.js';
import { initChatbot } from './chatbot.js';
import { initProjects } from './projects.js';
import { initBlogs } from './blogs.js';

/**
 * Main application entry point.
 * This function runs when the DOM is fully loaded, fetches the page content,
 * and then initializes all the interactive modules.
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Asynchronously load the page content from the external HTML file.
    await loadPageContent();
    
    // Once content is loaded, initialize all the application's features.
    initNavigation();
    initToolkit();
    initChatbot();
    initProjects();
    initBlogs();
});

/**
 * Fetches the HTML content from pages.html and injects it into the main
 * containers defined in index.html (the "skeleton").
 * This approach separates content from logic, making the application
 * easier to maintain and scale.
 */
async function loadPageContent() {
    // Get references to the content mount points in index.html.
    const pageContent = document.getElementById('page-content');
    const modalContainer = document.getElementById('modal-container');
    const chatbotContainer = document.getElementById('chatbot-container');

    try {
        // Fetch the external HTML file that contains all page and modal content.
        const response = await fetch('pages.html');
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const html = await response.text();
        
        // Use DOMParser to convert the fetched HTML string into a document object.
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extract the content from the parsed document.
        const pages = doc.getElementById('pages-container');
        const modals = doc.getElementById('modals-container');
        const chatbot = doc.getElementById('chatbot-container');
        const style = doc.querySelector('style');

        // Check if all required content elements were found in pages.html.
        if (!pages || !modals || !chatbot || !style) {
            throw new Error("One or more content containers were not found in pages.html.");
        }

        // Inject the fetched content into the appropriate containers in index.html.
        if (pageContent) pageContent.innerHTML = pages.innerHTML;
        if (modalContainer) modalContainer.innerHTML = modals.innerHTML;
        if (chatbotContainer) chatbotContainer.innerHTML = chatbot.innerHTML;

        // Append the styles from pages.html to the document's head.
        document.head.appendChild(style);

    } catch (error) {
        // If the fetch fails, display an error message to the user.
        console.error("Failed to load page content:", error);
        if (pageContent) {
            pageContent.innerHTML = `<p class="text-red-500 text-center p-8">Error: Could not load page content. Please check the console for more details.</p>`;
        }
    }
}
