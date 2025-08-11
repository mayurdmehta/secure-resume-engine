// This function now handles opening and closing modals,
// and also manages the URL hash for deep-linking.

function openModalBySlug(slug) {
    const card = document.querySelector(`.project-card[data-project-slug="${slug}"]`);
    if (card) {
        const modalId = card.dataset.modalTarget;
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }
}

function closeModal(modal) {
    modal.classList.add('hidden');
    // When closing a modal, reset the URL back to the main projects page.
    history.pushState(null, '', '#projects');
}

export function initProjects() {
    // Listen for the page-switched event to handle deep links on initial load.
    document.addEventListener('page-switched', (event) => {
        const { pageId, fullPath } = event.detail;
        if (pageId === 'projects') {
            const [, slug] = fullPath.split('/');
            if (slug) {
                openModalBySlug(slug);
            }
        }
    });

    // Main event listener for clicks on project cards and close buttons.
    document.body.addEventListener('click', function(event) {
        const card = event.target.closest('.project-card[data-project-slug]');
        const closeButton = event.target.closest('.close-modal-btn');
        const modalBackdrop = event.target.closest('.modal-backdrop');

        // Handle clicking on a project card.
        if (card) {
            const slug = card.dataset.projectSlug;
            // Update the URL to include the project's slug.
            history.pushState(null, '', `#projects/${slug}`);
            openModalBySlug(slug);
        }

        // Handle clicking the close button inside a modal.
        if (closeButton) {
            const modal = closeButton.closest('.modal-backdrop');
            if (modal) {
                closeModal(modal);
            }
        }
        
        // Handle clicking on the modal backdrop to close it.
        if (modalBackdrop && event.target === modalBackdrop) {
             closeModal(modalBackdrop);
        }
    });
}
