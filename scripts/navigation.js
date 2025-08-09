import { renderBlogPost } from './main.js';

/**
 * Switches the visible page based on the provided page ID.
 * @param {string} pageId The ID of the page to display, which can include a sub-route like 'blogs/my-first-post'.
 */
function switchPage(pageId) {
    const pages = document.querySelectorAll('.page');
    // Hide all page elements.
    pages.forEach(page => page.classList.add('hidden'));

    let targetPageId = pageId;
    let blogMatch = null;

    // Check if the pageId is a blog post slug.
    if (pageId) {
        blogMatch = pageId.match(/^blogs\/(.+)$/);
        if (blogMatch) {
             // If it's a blog post, the target container is the general #blogs page.
            targetPageId = 'blogs';
        }
    }

    // Default to 'home' if pageId is invalid or doesn't exist.
    if (!targetPageId || !document.getElementById(targetPageId)) {
        targetPageId = 'home';
    }

    // Show the target page.
    const activePage = document.getElementById(targetPageId);
    if (activePage) {
        activePage.classList.remove('hidden');
    }

    // ======================================================================= //
    // NEW LOGIC: Update the 'active' state for all navigation links.          //
    // ======================================================================= //
    document.querySelectorAll('header .nav-link, #mobile-menu .nav-link').forEach(link => {
        link.classList.remove('active');
        const linkId = link.hash.substring(1);

        if (blogMatch) {
            // For blog posts, activate the general 'blogs' link.
            if (linkId === 'blogs') {
                link.classList.add('active');
            }
        } else if (linkId === targetPageId) {
             // For all other pages, activate the specific link.
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
    console.log('Click event fired!');
    const navLink = e.target.closest('a.nav-link');
    const actionLink = e.target.closest('[data-action]');
    const mobileMenuButton = e.target.closest('#mobile-menu-button');

    // Handle clicks on internal navigation links (e.g., #projects).
    if (navLink && navLink.hash) {
        console.log('Nav link clicked. Hash:', navLink.hash);
        const pageId = navLink.hash.substring(1);
        
        // Check for a specific blog post link.
        const blogMatch = pageId.match(/^blogs\/(.+)$/);
        if (blogMatch) {
            console.log('Blog post link detected! Slug:', blogMatch[1]);
        }
		const navLink = e.target.closest('a.nav-link');
        const actionLink = e.target.closest('[data-action]');
        const mobileMenuButton = e.target.closest('#mobile-menu-button');

        // Handle clicks on internal navigation links (e.g., #projects).
        if (navLink && navLink.hash) {
            const pageId = navLink.hash.substring(1);

            // Check for a specific blog post link.
            const blogMatch = pageId.match(/^blogs\/(.+)$/);

            // Ensure the target page or a blog post container exists in the DOM.
            if (document.getElementById(pageId) || (blogMatch && document.getElementById('blogs'))) {
                e.preventDefault();
                // Only push a new state if the URL is actually changing.
                if (window.location.hash !== navLink.hash) {
                    history.pushState({ pageId }, '', navLink.hash);
                }
                
                // If it's a blog post link, we need to re-render the page content.
                if (blogMatch) {
                    // Call the imported renderBlogPost function to generate the content.
                    document.getElementById('page-content').innerHTML = renderBlogPost(blogMatch[1]);
                    switchPage(pageId);
                } else {
                    switchPage(pageId);
                }
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