document.addEventListener('DOMContentLoaded', () => {
    // Views
    const selectionView = document.getElementById('selection-view');
    const reportView = document.getElementById('report-view');
    const successOverlay = document.getElementById('success-message');
    
    // Components
    const emergencyCards = document.querySelectorAll('.emergency-card');
    const backBtn = document.getElementById('back-to-selection');
    const submitBtn = document.getElementById('submit-report');
    const successClose = document.getElementById('success-close');
    
    const typeInput = document.getElementById('emergency-type-input');
    const titleHeader = document.getElementById('selected-title');

    // Handle Card Selection
    emergencyCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            typeInput.value = category;
            titleHeader.innerText = `Report ${category.replace(/[🚓🚑🚒🚗👩👶🌪️]/g, '').trim()}`;
            
            selectionView.style.display = 'none';
            reportView.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Handle Back Button
    backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        reportView.classList.remove('active');
        selectionView.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Handle Form Submission
    submitBtn.addEventListener('click', () => {
        successOverlay.style.display = 'flex';
    });

    // Handle Success Close
    successClose.addEventListener('click', () => {
        successOverlay.style.display = 'none';
        reportView.classList.remove('active');
        selectionView.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
