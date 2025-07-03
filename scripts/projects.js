export function initProjects() {
    document.body.addEventListener('click', function(event) {
        const card = event.target.closest('[data-modal-target]');
        if (card) {
            const modalId = card.dataset.modalTarget;
            const modal = document.getElementById(modalId);
            if(modal) modal.classList.remove('hidden');
        }

        const closeButton = event.target.closest('.close-modal-btn');
        if (closeButton) {
            closeButton.closest('.modal-backdrop').classList.add('hidden');
        }
        
        const modalBackdrop = event.target.closest('.modal-backdrop');
        if (modalBackdrop && event.target === modalBackdrop) {
             modalBackdrop.classList.add('hidden');
        }
    });
}