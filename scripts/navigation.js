/**
 * Switches the visible page based on the provided page ID or nested route (e.g., "blogs/slug").
 * @param {string} pageId The ID of the page or nested route to display.
 */
function switchPage(pageId) {
    // Support nested routes like "blogs/slug" by using the base segment for page selection.
    const baseId = (pageId || '').split('/')[0] || 'home';

    // Default to 'home' if baseId is invalid or doesn't exist.
    const targetPageId = document.getElementById(baseId) ? baseId : 'home';

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
        // Handle nested routes by comparing only the base segment.
        const linkBase = (link.hash || '').replace(/^#/, '').split('/')[0];
        if (linkBase === targetPageId) {
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
 * Handles routing by reading the URL hash (supports nested paths like "blogs/slug")
 * and switching to the correct base page.
 */
function handleRouting() {
    const path = window.location.hash.replace(/^#/, ''); // e.g., "blogs/slug"
    switchPage(path);
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

        // Handle clicks on internal navigation links (e.g., #projects, #blogs).
        if (navLink && navLink.hash) {
            const targetHash = navLink.hash; // e.g., "#blogs"
            const targetPath = targetHash.replace(/^#/, '');
            // Ensure the base target page exists in the DOM.
            const baseId = (targetPath || '').split('/')[0] || 'home';
            if (document.getElementById(baseId)) {
                e.preventDefault();
                // Only push a new state if the URL is actually changing.
                if (window.location.hash !== targetHash) {
                    history.pushState({ pageId: targetPath }, '', targetHash);
                }
                switchPage(targetPath);
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
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) mobileMenu.classList.toggle('hidden');
        }
    });

    // Add a listener for the 'popstate' event to handle browser back/forward buttons.
    window.addEventListener('popstate', handleRouting);

    // NEW: Also react to pure hash changes (e.g., clicking #blogs/<slug> cards or direct links).
    window.addEventListener('hashchange', handleRouting);

    // Perform initial routing when the application loads to handle deep links like #blogs/<slug>.
    handleRouting();
}
