/* navigation.js — SPA navigation, mobile menu, and hash routing
   Requirements:
   - index.html contains: <main id="page-content"></main>
   - main.js defines: window.renderHome, window.renderProjects, window.renderBlogsList (optional),
                      window.renderBlogPost (async or sync; returns HTML string)
   - Sections that behave like pages have class="page" and IDs like #home, #projects, #blogs
*/

(function () {
  'use strict';

  // -------------------------------
  // Utilities
  // -------------------------------
  const qs  = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function hideAllPages() {
    qsa('.page').forEach(el => el.classList.add('hidden'));
  }

  function setActiveNav(targetKey, isBlogPost) {
    qsa('header .nav-link, #mobile-menu .nav-link').forEach(link => {
      link.classList.remove('active');
      const linkId = (link.hash || '').replace(/^#/, '');
      if (isBlogPost) {
        if (linkId === 'blogs') link.classList.add('active');
      } else if (linkId === targetKey) {
        link.classList.add('active');
      }
    });
  }

  function closeMobileMenu() {
    const mm = qs('#mobile-menu');
    if (mm && !mm.classList.contains('hidden')) mm.classList.add('hidden');
    const btn = qs('#mobile-menu-button');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  function openMobileMenu() {
    const mm = qs('#mobile-menu');
    if (mm) mm.classList.toggle('hidden');
    const isOpen = mm && !mm.classList.contains('hidden');
    const btn = qs('#mobile-menu-button');
    if (btn) btn.setAttribute('aria-expanded', String(!!isOpen));
  }

  function isHashLink(href) {
    return typeof href === 'string' && href.startsWith('#');
  }

  function getHash() {
    return window.location.hash || '#home';
  }

  function scrollToTop() {
    try { window.scrollTo({ top: 0, behavior: 'instant' }); } catch (_) {
      window.scrollTo(0, 0);
    }
  }

  // -------------------------------
  // Page switching (simple pages)
  // -------------------------------
  function switchPage(pageId) {
    const key = pageId || 'home';
    hideAllPages();

    // Fallback to home if target page doesn't exist
    let targetKey = key;
    if (!qs(`#${CSS.escape(targetKey)}`)) targetKey = 'home';

    const activePage = qs(`#${CSS.escape(targetKey)}`);
    if (activePage) activePage.classList.remove('hidden');

    setActiveNav(targetKey, /*isBlogPost*/ false);
    closeMobileMenu();
    // ensure the mount for single-post view is cleared when on simple pages
    const mount = qs('#page-content');
    if (mount) mount.innerHTML = '';

    scrollToTop();
  }

  // -------------------------------
  // Blog article route (#blogs/<slug>)
  // -------------------------------
  async function renderBlogRoute(slug) {
    const mount = qs('#page-content');
    if (!mount) return;

    // Hide section pages so only the article is visible
    hideAllPages();
    setActiveNav('blogs', /*isBlogPost*/ true);

    // Render article (sync or async).
    // renderBlogPost may be async (if it fetches markdown), so await if it returns a promise.
    try {
      const out = window.renderBlogPost && window.renderBlogPost(slug);
      const html = out && typeof out.then === 'function' ? await out : out;
      mount.innerHTML = html || `<div class="py-10 text-gray-400">Post not found.</div>`;
    } catch (err) {
      mount.innerHTML = `<div class="py-10 text-red-400">Failed to load post: ${String(err)}</div>`;
    }

    // Focus the first heading for a11y after navigation
    const h1 = mount.querySelector('h1');
    if (h1) {
      h1.setAttribute('tabindex', '-1');
      try { h1.focus({ preventScroll: true }); } catch(_) { h1.focus(); }
    }
    scrollToTop();
  }

  // -------------------------------
  // Router
  // -------------------------------
  async function handleRouting() {
    const hash = getHash();
    const pageId = hash.replace(/^#/, '');

    // blogs/<slug>
    const blogMatch = pageId.match(/^blogs\/([^/]+)$/);
    if (blogMatch) {
      const slug = decodeURIComponent(blogMatch[1]);
      await renderBlogRoute(slug);
      return;
    }

    // Simple pages (#home, #projects, #blogs)
    switchPage(pageId || 'home');
  }

  // -------------------------------
  // Global click handling
  //  - internal hash links (including .blog-card)
  //  - mobile menu toggle
  //  - action links (e.g., data-action="open-chatbot")
  // -------------------------------
  document.addEventListener('click', (e) => {
    const target = e.target;

    // Mobile menu toggle
    const mobileMenuButton = target.closest('#mobile-menu-button');
    if (mobileMenuButton) {
      e.preventDefault();
      openMobileMenu();
      return;
    }

    // Action links (e.g., open chatbot)
    const actionLink = target.closest('[data-action]');
    if (actionLink) {
      const action = actionLink.getAttribute('data-action');
      if (action === 'open-chatbot') {
        e.preventDefault();
        const chatbotFab = qs('#chatbot-fab');
        if (chatbotFab) chatbotFab.click();
      }
      // allow other actions to fall through if needed
    }

    // Internal navigation links
    const a = target.closest('a');
    if (!a) return;

    const href = a.getAttribute('href') || '';
    if (!isHashLink(href)) return; // External or non-hash link → let browser handle it

    e.preventDefault();

    // If the hash is changing, set it (this will fire 'hashchange')
    if (window.location.hash !== href) {
      window.location.hash = href;
    } else {
      // Same-hash click (e.g., re-clicking current card) → force a reroute
      handleRouting();
    }

    closeMobileMenu();
  });

  // -------------------------------
  // History & lifecycle events
  // -------------------------------
  window.addEventListener('hashchange', handleRouting);
  window.addEventListener('popstate', handleRouting);
  window.addEventListener('load', handleRouting);

  // Expose a tiny API if you need to call it elsewhere
  window.__nav = {
    switchPage,
    handleRouting,
  };
})();
