document.addEventListener('DOMContentLoaded', () => {
    // Views
    const selectionView = document.getElementById('selection-view');
    const reportView = document.getElementById('report-view');
    const successOverlay = document.getElementById('success-overlay');
    
    // Components
    const emergencyCards = document.querySelectorAll('.emergency-card');
    const backBtn = document.getElementById('back-to-selection');
    const submitBtn = document.getElementById('submit-report');
    const closeSuccessBtn = document.getElementById('close-success');
    const getLocationBtn = document.getElementById('get-location');
    
    const typeInput = document.getElementById('emergency-type-input');
    const titleHeader = document.getElementById('selected-title');
    const messageArea = document.getElementById('additional-message');

    let map;
    let marker;

    // Initialize Leaflet Map
    function initMap() {
        if (map) return;
        
        // Default center (New York or similar fallback)
        map = L.map('map').setView([40.7128, -74.0060], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add a default marker
        marker = L.marker([40.7128, -74.0060]).addTo(map)
            .bindPopup('Reporting Area')
            .openPopup();
    }

    // Handle Card Selection
    emergencyCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            typeInput.value = category;
            
            // Extract text without emojis for the header
            const cleanTitle = category.replace(/[🚓🚑🚒🚗👩👶🌪️]/g, '').trim();
            titleHeader.innerText = cleanTitle;
            
            selectionView.style.display = 'none';
            reportView.classList.add('active');
            
            // Initialize map after selection to ensure container size is correct
            setTimeout(() => {
                initMap();
                map.invalidateSize();
            }, 100);

            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Geolocation Feature
    getLocationBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        getLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Locating...';

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const userLoc = [latitude, longitude];

                map.setView(userLoc, 15);
                
                if (marker) {
                    marker.setLatLng(userLoc)
                        .setPopupContent('Your Current Location')
                        .openPopup();
                } else {
                    marker = L.marker(userLoc).addTo(map)
                        .bindPopup('Your Current Location')
                        .openPopup();
                }

                getLocationBtn.innerHTML = '<i class="fas fa-location-dot"></i> Location Captured';
                getLocationBtn.style.background = 'rgba(16, 185, 129, 0.1)';
                getLocationBtn.style.color = '#10b981';
                getLocationBtn.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            },
            (error) => {
                console.error('Error fetching location:', error);
                alert('Could not capture location. Please ensure GPS is enabled.');
                getLocationBtn.innerHTML = '<i class="fas fa-location-crosshairs"></i> Try Again';
            }
        );
    });

    // Handle Back Button
    backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        reportView.classList.remove('active');
        selectionView.style.display = 'block';
        
        // Reset location button state
        getLocationBtn.innerHTML = '<i class="fas fa-location-crosshairs"></i> Send Current Location';
        getLocationBtn.style.background = '';
        getLocationBtn.style.color = '';
        getLocationBtn.style.borderColor = '';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Handle Form Submission
    submitBtn.addEventListener('click', () => {
        successOverlay.style.display = 'flex';
        // Clear message area for next time
        if (messageArea) messageArea.value = '';
    });

    // Handle Success Close
    closeSuccessBtn.addEventListener('click', () => {
        successOverlay.style.display = 'none';
        reportView.classList.remove('active');
        selectionView.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
