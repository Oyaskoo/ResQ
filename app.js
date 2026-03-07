document.addEventListener('DOMContentLoaded', () => {
    const selectionView = document.getElementById('selection-view');
    const reportView = document.getElementById('report-view');
    const successOverlay = document.getElementById('success-message');
    
    const emergencyBtns = document.querySelectorAll('.emergency-btn');
    const backBtn = document.getElementById('back-to-selection');
    const submitBtn = document.getElementById('submit-report');
    const successClose = document.getElementById('success-close');
    
    const typeInput = document.getElementById('emergency-type-input');
    const titleHeader = document.getElementById('selected-title');

    // Handle Category Selection
    emergencyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            typeInput.value = category;
            titleHeader.innerText = `Report ${category}`;
            
            selectionView.classList.remove('active');
            reportView.classList.add('active');
        });
    });

    // Handle Back Button
    backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        reportView.classList.remove('active');
        selectionView.classList.add('active');
    });

    // Handle Form Submission
    submitBtn.addEventListener('click', () => {
        successOverlay.style.display = 'flex';
    });

    // Handle Success Close
    successClose.addEventListener('click', () => {
        successOverlay.style.display = 'none';
        reportView.classList.remove('active');
        selectionView.classList.add('active');
    });
});
