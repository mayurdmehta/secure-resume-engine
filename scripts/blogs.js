// Static Blogs: index JSON + Markdown posts rendered with Marked.js
// Public API
export function initBlogs() {
    // Render list immediately when user navigates to #blogs
    window.addEventListener('hashchange', handleBlogRoute);
    // Also handle the current hash on load (deep link support)
    handleBlogRoute();

    // If user clicks back to blogs via header/menu, ensure list shows
    document.addEventListener('click', (e) => {
        const backLink = e.target.closest('[data-blog-back]');
        if (backLink) {
            e.preventDefault();
            location.hash = '#blogs';
        }
    });
}

async function handleBlogRoute() {
    const hash = location.hash || '#home';
    const [, route, slug] = hash.split('/'); // e.g., "#blogs/slug" -> ["#blogs","blogs","slug"]

    // Only act when the Blogs page is the base route
    if (!hash.startsWith('#blogs')) return;

    // Make sure the Blogs page is visible; navigation.js supports nested routes
    ensurePageVisible('blogs');

    if (!slug || slug.trim() === '') {
        // List view
        await renderListView();
    } else {
        // Detail view
        await renderDetailView(slug);
    }
}

function ensurePageVisible(pageId) {
    const page = document.getElementById(pageId);
    if (!page) return;
    // Hide others, show this page (mirrors switchPage logic safely)
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    page.classList.remove('hidden');

    // Update active state on nav links
    document.querySelectorAll('header .nav-link, #mobile-menu .nav-link').forEach(link => {
        link.classList.toggle('active', link.hash === `#${pageId}`);
    });

    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) mobileMenu.classList.add('hidden');
}

async function renderListView() {
    const listEl = document.getElementById('blogs-list');
    const detailEl = document.getElementById('blogs-detail');
    const errEl = document.getElementById('blogs-error');
    if (!listEl || !detailEl || !errEl) return;

    detailEl.classList.add('hidden');
    listEl.classList.remove('hidden');

    try {
        errEl.classList.add('hidden');
        const posts = await loadIndex();
        if (!posts || posts.length === 0) {
            listEl.innerHTML = `
                <div class="text-center text-gray-400 py-10">
                    <p>No posts yet. Check back soon!</p>
                </div>`;
            return;
        }

        listEl.innerHTML = posts.map(cardHtml).join('');
    } catch (e) {
        console.error(e);
        showError(errEl, 'Could not load blog posts. Please try again later.');
    }
}

async function renderDetailView(slug) {
    const listEl = document.getElementById('blogs-list');
    const detailEl = document.getElementById('blogs-detail');
    const errEl = document.getElementById('blogs-error');
    if (!listEl || !detailEl || !errEl) return;

    listEl.classList.add('hidden');
    detailEl.classList.remove('hidden');

    try {
        errEl.classList.add('hidden');
        const index = await loadIndex();
        const meta = index.find(p => p.slug === slug);
        if (!meta) {
            detailEl.innerHTML = `
                <div class="text-red-300">Post not found.</div>
                <a href="#blogs" data-blog-back class="inline-block mt-4 text-brand-primary">← Back to all posts</a>`;
            return;
        }

        const md = await fetchMarkdown(slug);
        const markedLib = window.marked || (typeof marked !== 'undefined' ? marked : null);
        const html = markedLib ? markedLib.parse(md) : escapeHtml(md);

        detailEl.innerHTML = `
            <a href="#blogs" data-blog-back class="text-brand-primary">← Back to all posts</a>
            <h1 class="mt-2">${escapeHtml(meta.title)}</h1>
            <div class="text-sm text-gray-400 mb-6">${formatDate(meta.date)} • ${meta.tags.map(escapeHtml).join(', ')}</div>
            <div class="markdown-body">${html}</div>
        `;
        // Scroll to top for better UX on mobile
        detailEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e) {
        console.error(e);
        showError(errEl, 'Could not load this post. Please try again later.');
    }
}

async function loadIndex() {
    const res = await fetch('/data/blog-index.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load blog index');
    return res.json();
}

async function fetchMarkdown(slug) {
    const res = await fetch(`/posts/${slug}.md`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load markdown');
    return res.text();
}

function cardHtml(post) {
    return `
<a href="#blogs/${encodeURIComponent(post.slug)}" class="block bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:bg-gray-800 transition">
  <h3 class="text-2xl font-bold text-brand-primary mb-1">${escapeHtml(post.title)}</h3>
  <div class="text-sm text-gray-400 mb-3">${formatDate(post.date)} • ${post.tags.map(escapeHtml).join(', ')}</div>
  <p class="text-gray-300">${escapeHtml(post.excerpt)}</p>
</a>`;
}

function formatDate(iso) {
    try {
        const d = new Date(iso);
        return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
        return iso;
    }
}

function showError(el, msg) {
    el.textContent = msg;
    el.classList.remove('hidden');
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, s => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[s]));
}
