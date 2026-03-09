import { db, storage } from './firebase.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

document.addEventListener('DOMContentLoaded', () => {
    const selectionView = document.getElementById('selection-view');
    const reportView = document.getElementById('report-view');
    const successOverlay = document.getElementById('success-overlay');
    
    // Components
    const emergencyCards = document.querySelectorAll('.emergency-card');
    const backBtn = document.getElementById('back-to-selection');
    const submitBtn = document.getElementById('submit-report');
    const cancelBtn = document.getElementById('cancel-report');
    const closeSuccessBtn = document.getElementById('close-success');
    const getLocationBtn = document.getElementById('get-location');
    
    const typeInput = document.getElementById('emergency-type-input');
    const titleHeader = document.getElementById('selected-title');
    const messageArea = document.getElementById('additional-message');
    const photoInput = document.getElementById('photo-upload');
    const photoPreview = document.getElementById('photo-preview');

    // Make simulateConnection available globally for inline onclick
    window.simulateConnection = function(btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-circle-check"></i> Connected';
            // Find the success message div within the same card
            const successMsg = btn.nextElementSibling;
            if (successMsg && successMsg.classList.contains('connection-success')) {
                successMsg.style.display = 'block';
            }
        }, 1500);
    };

    // Make toggleDevicePopup available globally
    window.toggleDevicePopup = function(show = true) {
        const popup = document.getElementById('device-popup');
        const overlay = document.getElementById('device-popup-overlay');
        
        if (show) {
            popup.classList.add('active');
            overlay.classList.add('active');
        } else {
            popup.classList.remove('active');
            overlay.classList.remove('active');
            
            // Optional: reset connection buttons when closed
            // setTimeout(() => {
            //     document.querySelectorAll('.btn-connect').forEach(btn => {
            //         btn.innerHTML = 'Connect';
            //         btn.disabled = false;
            //     });
            //     document.querySelectorAll('.connection-success').forEach(msg => {
            //         msg.style.display = 'none';
            //     });
            // }, 300);
        }
    };

    let map;
    let marker;
    let selectedLocation = { lat: 40.7128, lng: -74.0060 }; // Default fallback
    let photoFile = null;
    let selectedSeverity = "Moderate";

    // Severity Level Logic
    const severityCards = document.querySelectorAll('.severity-card');
    severityCards.forEach(card => {
        card.addEventListener('click', () => {
            severityCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            selectedSeverity = card.getAttribute('data-level');
        });
    });

    // Initialize Leaflet Map
    function initMap() {
        if (map) return;
        
        // Default center
        map = L.map('map').setView([selectedLocation.lat, selectedLocation.lng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add a default marker
        marker = L.marker([selectedLocation.lat, selectedLocation.lng]).addTo(map)
            .bindPopup('Initial Location')
            .openPopup();

        // Mark a Location on Map (Click/Tap)
        map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            updateMarker(lat, lng, 'Selected Emergency Location');
        });
    }

    function updateMarker(lat, lng, popupText) {
        selectedLocation = { lat, lng };
        if (marker) {
            marker.setLatLng([lat, lng])
                .setPopupContent(popupText)
                .openPopup();
        } else {
            marker = L.marker([lat, lng]).addTo(map)
                .bindPopup(popupText)
                .openPopup();
        }
        map.setView([lat, lng]);
    }

    // Handle Card Selection
    emergencyCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            typeInput.value = category;
            
            // Extract text without emojis for the header
            const cleanTitle = category.replace(/[🚓🚑🚒🚗🌪️👤🔥]/g, '').trim();
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
                updateMarker(latitude, longitude, 'Your Current Location');

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

    // Photo Preview Handle
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            photoFile = file;
            const reader = new FileReader();
            reader.onload = (event) => {
                photoPreview.src = event.target.result;
                photoPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle Back Button & Cancel Button
    const resetForm = () => {
        reportView.classList.remove('active');
        selectionView.style.display = 'block';
        
        // Reset location button state
        getLocationBtn.innerHTML = '<i class="fas fa-location-crosshairs"></i> Locate My Location';
        getLocationBtn.style.background = '';
        getLocationBtn.style.color = '';
        getLocationBtn.style.borderColor = '';

        // Reset inputs
        if (messageArea) messageArea.value = '';
        document.querySelectorAll('input[name="forward-to"]').forEach(cb => cb.checked = false);
        
        // Reset photo
        photoFile = null;
        photoPreview.style.display = 'none';
        photoPreview.src = '#';
        photoInput.value = '';

        // Reset Severity
        selectedSeverity = "Moderate";
        severityCards.forEach(c => {
            c.classList.remove('active');
            if (c.getAttribute('data-level') === "Moderate") c.classList.add('active');
        });

        // Reset map markers
        if (map && marker) {
            selectedLocation = { lat: 40.7128, lng: -74.0060 };
            marker.setLatLng([selectedLocation.lat, selectedLocation.lng]).setPopupContent('Initial Location');
            map.setView([selectedLocation.lat, selectedLocation.lng], 13);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        resetForm();
    });

    cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        resetForm();
    });

    submitBtn.addEventListener('click', async () => {
        const category = typeInput.value;
        const message = messageArea.value;
        const selectedResponders = Array.from(document.querySelectorAll('input[name="forward-to"]:checked'))
            .map(cb => cb.value);

        if (!selectedLocation) {
            alert("Please select a location on the map.");
            return;
        }

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;

        try {
            let photoURL = "";
            if (photoFile) {
                const storageRef = ref(storage, `emergency_photos/${Date.now()}_${photoFile.name}`);
                const snapshot = await uploadBytes(storageRef, photoFile);
                photoURL = await getDownloadURL(snapshot.ref);
            }

            const mapsLink = `https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}`;

            await addDoc(collection(db, "emergencyReports"), {
                emergencyType: category,
                severityLevel: selectedSeverity,
                latitude: selectedLocation.lat,
                longitude: selectedLocation.lng,
                mapsLink: mapsLink,
                additionalMessage: message,
                forwardedServices: selectedResponders,
                photoURL: photoURL,
                timestamp: serverTimestamp()
            });

            // Show success overlay
            successOverlay.style.display = 'flex';
            
            // Clear form
            messageArea.value = '';
            document.querySelectorAll('input[name="forward-to"]').forEach(cb => cb.checked = false);
            photoFile = null;
            photoPreview.style.display = 'none';
            photoInput.value = '';
        } catch (error) {
            console.error("Error submitting report:", error);
            alert("Submission failed. Check your internet connection.");
        } finally {
            submitBtn.innerHTML = 'Submit Emergency Report';
            submitBtn.disabled = false;
        }
    });

    // Handle Success Close
    closeSuccessBtn.addEventListener('click', () => {
        successOverlay.style.display = 'none';
        resetForm();
    });
});
