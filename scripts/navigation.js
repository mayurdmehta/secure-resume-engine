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
    const activePage = document.getElementById(targetPageId);
    if (activePage) {
        activePage.classList.remove('hidden');
    }

    // Update the 'active' state for all navigation links.
    document.querySelectorAll('header .nav-link, #mobile-menu .nav-link').forEach(link => {
        link.classList.remove('active');
        // Check if the link's hash corresponds to the active page ID.
        if (link.hash === `#${targetPageId}`) {
            link.classList.add('active');
        }
    });
    
    // Ensure the mobile menu is closed after navigation.
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.add('hidden');
    }
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
        // Correctly identify navigation links in the header, mobile menu, and the logo.
        const navLink = e.target.closest('a.nav-link');
        const actionLink = e.target.closest('[data-action]');
        const mobileMenuButton = e.target.closest('#mobile-menu-button');

        // Handle clicks on internal navigation links (e.g., #projects).
        if (navLink && navLink.hash) {
            const pageId = navLink.hash.substring(1);
            // Ensure the target page exists in the DOM.
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
                // Programmatically click the FAB to trigger its existing toggle logic.
                if (chatbotFab) {
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

    // Perform initial routing when the application loads to handle deep links.
    handleRouting();
}
