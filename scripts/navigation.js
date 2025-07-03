export function initNavigation() {
    document.body.addEventListener('click', (e) => {
        const navLink = e.target.closest('a[data-page]');
        if (navLink) {
            e.preventDefault();
            switchPage(navLink.dataset.page);
        }

        const mobileMenuButton = e.target.closest('#mobile-menu-button');
        if (mobileMenuButton) {
            document.getElementById('mobile-menu').classList.toggle('hidden');
        }
    });
}

function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    const activePage = document.getElementById(pageId);
    if (activePage) activePage.classList.remove('hidden');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageId) link.classList.add('active');
    });
    
    const mobileMenu = document.getElementById('mobile-menu');
    if(mobileMenu) mobileMenu.classList.add('hidden');
}