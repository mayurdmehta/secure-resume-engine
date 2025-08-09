/* navigation.js — hash router + internal link handling */

function setActiveNav(targetKey, isBlogPost) {
  document.querySelectorAll('header .nav-link, #mobile-menu .nav-link').forEach(link => {
    link.classList.remove('active');
    const linkId = (link.hash || '').substring(1);
    if (isBlogPost) {
      // For blog posts, show Blogs as active
      if (linkId === 'blogs') link.classList.add('active');
    } else if (linkId === targetKey) {
      link.classList.add('active');
    }
  });
}

function hideAllPages() {
  document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
}

/**
 * Switches visible "page" sections for simple routes (#home, #projects, #blogs).
 * Does NOT handle blog slugs; those are full-page renders into #page-content.
 */
function switchPage(pageId) {
  const key = pageId || 'home';
  hideAllPages();

  // Default to #home if target doesn't exist
  let targetKey = key;
  if (!document.getElementById(targetKey)) targetKey = 'home';

  const activePage = document.getElementById(targetKey);
  if (activePage) activePage.classList.remove('hidden');

  setActiveNav(targetKey, /*isBlogPost*/ false);

  // Close mobile menu if open
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) mobileMenu.classList.add('hidden');
}

/** Handle any route, including #blogs/<slug> */
function handleRouting() {
  const hash = window.location.hash || '#home';
  const pageId = hash.substring(1);

  // #blogs/<slug>
  const blogMatch = pageId.match(/^blogs\/([^/]+)$/);
  if (blogMatch) {
    const slug = decodeURIComponent(blogMatch[1]);
    const mount = document.getElementById('page-content');

    // Hide all section "pages" so only the article shows
    hideAllPages();
    setActiveNav('blogs', /*isBlogPost*/ true);

    if (mount && typeof window.renderBlogPost === 'function') {
      // renderBlogPost returns HTML string
      mount.innerHTML = window.renderBlogPost(slug);
    }
    return;
  }

  // Simple pages
  document.getElementById('page-content').innerHTML = ''; // clear article view
  switchPage(pageId || 'home');
}

/** Intercept all internal hash links (including .blog-card) */
document.addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if (!a) return;

  const href = a.getAttribute('href') || '';
  if (!href.startsWith('#')) return; // external or non-hash link → ignore

  // Handle action links (e.g., data-action)
  const actionLink = e.target.closest('[data-action]');
  if (actionLink) {
    e.preventDefault();
    const action = actionLink.dataset.action;
    if (action === 'open-chatbot') {
      const chatbotFab = document.getElementById('chatbot-fab');
      if (chatbotFab) chatbotFab.click();
    }
    return;
  }

  // Handle mobile menu toggle button
  const mobileMenuButton = e.target.closest('#mobile-menu-button');
  if (mobileMenuButton) {
    e.preventDefault();
    const mm = document.getElementById('mobile-menu');
    if (mm) mm.classList.toggle('hidden');
    return;
  }

  // Internal navigation
  e.preventDefault();
  if (location.hash !== href) {
    location.hash = href; // will trigger handleRouting via 'hashchange'
  } else {
    // Same-hash click (e.g., re-open same post) → force reroute
    handleRouting();
  }
});

// Route on first load and when hash changes
window.addEventListener('load', handleRouting);
window.addEventListener('hashchange', handleRouting);

// Optional: if elsewhere you call history.pushState, keep this too
window.addEventListener('popstate', handleRouting);
