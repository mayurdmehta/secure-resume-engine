/**
 * Switches the visible page and dispatches a custom event.
 * @param {string} pageId The ID of the page or nested route to display.
 */
function switchPage(pageId) {
    const baseId = (pageId || '').split('/')[0] || 'home';
    const targetPageId = document.getElementById(baseId) ? baseId : 'home';
    const activePage = document.getElementById(targetPageId);

    if (activePage) {
        document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
        activePage.classList.remove('hidden');

        // Correctly find the nav link for the base page (e.g., 'projects')
        const navLink = document.querySelector(`a.nav-link[href="#${targetPageId}"]`);
        const pageTitle = navLink ? navLink.textContent.trim() : 'Home';
        
        // Only track the main page view here. The specific project/blog view
        // will be tracked by their respective modules if needed.
        trackPageView(`/${targetPageId}`, pageTitle);

        const event = new CustomEvent('page-switched', {
            detail: {
                pageId: targetPageId,
                fullPath: pageId
            }
        });
        document.dispatchEvent(event);
    }

    document.querySelectorAll('header .nav-link, #mobile-menu .nav-link').forEach(link => {
        link.classList.remove('active');
        const linkBase = (link.hash || '').replace(/^#/, '').split('/')[0];
        if (linkBase === targetPageId) {
            link.classList.add('active');
        }
    });

    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.add('hidden');
    }
}

/**
 * Handles routing by reading the URL hash.
 */
function handleRouting() {
    const path = window.location.hash.replace(/^#/, '');
    switchPage(path);
}

/**
 * Initializes navigation event listeners.
 */
export function initNavigation() {
    document.body.addEventListener('click', (e) => {
        const navLink = e.target.closest('a.nav-link');
        const actionLink = e.target.closest('[data-action]');
        const mobileMenuButton = e.target.closest('#mobile-menu-button');

        // This listener does not handle project cards anymore, that's in projects.js
        if (navLink && navLink.hash && !navLink.closest('.project-card')) {
            e.preventDefault();
            const targetPath = navLink.hash.replace(/^#/, '');
            if (window.location.hash !== navLink.hash) {
                history.pushState({ pageId: targetPath }, '', navLink.hash);
            }
            switchPage(targetPath);
        }

        if (actionLink) {
            e.preventDefault();
            const action = actionLink.dataset.action;
            if (action === 'open-chatbot') {
                document.getElementById('chatbot-fab')?.click();
            }
        }
        
        if (mobileMenuButton) {
            document.getElementById('mobile-menu')?.classList.toggle('hidden');
        }
    });

    window.addEventListener('popstate', handleRouting);
    window.addEventListener('hashchange', handleRouting);
}

/**
 * This function is called once from main.js after all modules are initialized.
 */
export function performInitialRouting() {
    handleRouting();
}


/**
 * Sends a page_view event to Google Analytics for SPA navigation.
 * @param {string} path - The virtual path of the page (e.g., '/blogs').
 * @param {string} title - The title of the page.
 */
function trackPageView(path, title) {
    if (typeof gtag === 'function') {
        gtag('event', 'page_view', {
            page_path: path,
            page_title: title,
            page_location: window.location.href
        });
    } else {
        console.log(`Analytics disabled: gtag not found. Page view for ${path} not tracked.`);
    }
}
