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
        
        // NEW: Dispatch a custom event to notify other modules of the page change.
        // This is the key to fixing the race condition.
        const event = new CustomEvent('page-switched', {
            detail: {
                pageId: targetPageId, // The base page ID (e.g., 'blogs')
                fullPath: pageId      // The full path from the hash (e.g., 'blogs/my-post')
            }
        });
        document.dispatchEvent(event);
    }

    // Update the 'active' state for all navigation links.
    document.querySelectorAll('header .nav-link, #mobile-menu .nav-link').forEach(link => {
        link.classList.remove('active');
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
 * Handles routing by reading the URL hash and switching to the correct page.
 */
function handleRouting() {
    const path = window.location.hash.replace(/^#/, '');
    switchPage(path);
}

/**
 * Initializes all navigation functionality for the site.
 */
export function initNavigation() {
    // A single, delegated click listener for all navigation and actions.
    document.body.addEventListener('click', (e) => {
        const navLink = e.target.closest('a.nav-link');
        const actionLink = e.target.closest('[data-action]');
        const mobileMenuButton = e.target.closest('#mobile-menu-button');

        if (navLink && navLink.hash) {
            const targetHash = navLink.hash;
            const targetPath = targetHash.replace(/^#/, '');
            const baseId = (targetPath || '').split('/')[0] || 'home';
            if (document.getElementById(baseId)) {
                e.preventDefault();
                if (window.location.hash !== targetHash) {
                    history.pushState({ pageId: targetPath }, '', targetHash);
                }
                switchPage(targetPath);
            }
        }

        if (actionLink) {
            e.preventDefault();
            const action = actionLink.dataset.action;
            if (action === 'open-chatbot') {
                const chatbotFab = document.getElementById('chatbot-fab');
                if (chatbotFab) chatbotFab.click();
            }
        }
        
        if (mobileMenuButton) {
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) mobileMenu.classList.toggle('hidden');
        }
    });

    // Listen for browser back/forward buttons and hash changes.
    window.addEventListener('popstate', handleRouting);
    window.addEventListener('hashchange', handleRouting);

    // Perform initial routing when the application loads.
    handleRouting();
}
