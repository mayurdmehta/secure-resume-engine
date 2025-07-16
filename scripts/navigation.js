/**
 * Switches the visible page based on the provided page ID.
 * @param {string} pageId The ID of the page to display.
 */
function switchPage(pageId) {
    // Default to 'home' if pageId is invalid or doesn't exist.
    const targetPageId = (pageId && document.getElementById(pageId)) ? pageId : 'home';

    // Hide all page elements.
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    
    // Show the target page.
    document.getElementById(targetPageId).classList.remove('hidden');

    // Update the 'active' state for all navigation links.
    document.querySelectorAll('header .nav-link, #mobile-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.hash === `#${targetPageId}`) {
            link.classList.add('active');
        }
    });
    
    // Ensure the mobile menu is closed after navigation.
    document.getElementById('mobile-menu')?.classList.add('hidden');
}

/**
 * Handles routing by reading the URL hash and switching to the correct page.
 */
function handleRouting() {
    const pageId = window.location.hash.substring(1);
    switchPage(pageId);
}

/**
 * Initializes all navigation functionality for the site.
 */
export function initNavigation() {
    // Set up a global click listener to handle all navigation and actions.
    document.body.addEventListener('click', (e) => {
        const navLink = e.target.closest('a[href^="#"]');
        const actionLink = e.target.closest('[data-action]');
        const mobileMenuButton = e.target.closest('#mobile-menu-button');

        // Handle clicks on internal navigation links (e.g., #projects).
        if (navLink) {
            const pageId = navLink.hash.substring(1);
            if (document.getElementById(pageId)) {
                e.preventDefault();
                // Only push a new state if the URL is actually changing.
                if (window.location.hash !== navLink.hash) {
                    history.pushState({ pageId }, '', navLink.hash);
                }
                switchPage(pageId);
            }
        }

        // Handle clicks on action links (e.g., open chatbot).
        if (actionLink) {
            e.preventDefault();
            const action = actionLink.dataset.action;
            if (action === 'open-chatbot') {
                const chatbotFab = document.getElementById('chatbot-fab');
                const chatbotWindow = document.getElementById('chatbot-window');
                // Open chatbot only if it's currently hidden.
                if (chatbotFab && chatbotWindow?.classList.contains('hidden')) {
                    chatbotFab.click();
                }
            }
        }
        
        // Handle clicks on the mobile menu toggle button.
        if (mobileMenuButton) {
            document.getElementById('mobile-menu').classList.toggle('hidden');
        }
    });

    // Add a listener for the 'popstate' event to handle browser back/forward buttons.
    window.addEventListener('popstate', handleRouting);

    // Perform initial routing when the application loads.
    handleRouting();
}
