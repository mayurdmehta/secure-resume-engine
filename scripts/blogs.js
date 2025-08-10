// This module now listens for a custom 'page-switched' event
// to know when to render its content, solving the race condition.

export function initBlogs() {
    // Listen for the custom event dispatched by the navigation module.
    document.addEventListener('page-switched', (event) => {
        const { pageId, fullPath } = event.detail;

        // Only act if the new page is the blog page.
        if (pageId === 'blogs') {
            handleBlogRoute(fullPath);
        }
    });

    // Handle clicks on the "back" link within the blog detail view.
    document.addEventListener('click', (e) => {
        const backLink = e.target.closest('[data-blog-back]');
        if (backLink) {
            e.preventDefault();
            window.location.hash = '#blogs';
        }
    });
}

/**
 * Determines whether to show the list or detail view based on the path.
 * @param {string} path - The full path from the URL hash (e.g., 'blogs/my-slug').
 */
async function handleBlogRoute(path) {
    // The path is now passed from the event detail.
    const [, slug] = (path || '').split('/');

    if (!slug || slug.trim() === '') {
        await renderListView();
    } else {
        await renderDetailView(slug);
    }
}

async function renderListView() {
    const listEl = document.getElementById('blogs-list');
    const detailEl = document.getElementById('blogs-detail');
    const errEl = document.getElementById('blogs-error');
    if (!listEl || !detailEl || !errEl) return;

    detailEl.classList.add('hidden');
    listEl.classList.remove('hidden');
    errEl.classList.add('hidden');

    try {
        const posts = await loadIndex();
        if (!posts || posts.length === 0) {
            listEl.innerHTML = `<div class="text-center text-gray-400 py-10"><p>No posts yet. Check back soon!</p></div>`;
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
    errEl.classList.add('hidden');

    try {
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
            <a href="#blogs" data-blog-back class="text-brand-primary hover:underline">← Back to all posts</a>
            <h1 class="mt-2">${escapeHtml(meta.title)}</h1>
            <div class="text-sm text-gray-400 mb-6">${formatDate(meta.date)} • ${meta.tags.map(escapeHtml).join(', ')}</div>
            <div class="markdown-body">${html}</div>`;
        
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
<a href="#blogs/${encodeURIComponent(post.slug)}" class="block bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:bg-gray-800 transition-all duration-300 hover:border-brand-primary/50 hover:shadow-lg">
  <h3 class="text-2xl font-bold text-brand-primary mb-1">${escapeHtml(post.title)}</h3>
  <div class="text-sm text-gray-400 mb-3">${formatDate(post.date)} • ${post.tags.map(escapeHtml).join(', ')}</div>
  <p class="text-gray-300">${escapeHtml(post.excerpt)}</p>
</a>`;
}

function formatDate(iso) {
    try {
        const d = new Date(iso);
        return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
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
