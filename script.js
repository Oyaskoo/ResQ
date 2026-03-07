document.addEventListener('DOMContentLoaded', () => {
    // Reveal animations on scroll
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight / 5 * 4;

        reveals.forEach(reveal => {
            const revealTop = reveal.getBoundingClientRect().top;

            if (revealTop < triggerBottom) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add glass background to navbar on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 14, 20, 0.95)';
            navbar.style.padding = '1rem 0';
        } else {
            navbar.style.background = 'rgba(10, 14, 20, 0.8)';
            navbar.style.padding = '1.5rem 0';
        }
    });

    // Simple interaction for impact stats (count up effect simulation)
    const stats = document.querySelectorAll('.stat');
    const animateStats = () => {
        stats.forEach(stat => {
            const target = stat.innerText;
            if (stat.parentElement.parentElement.parentElement.classList.contains('active')) {
                // This is a simple reveal-based trigger, could be expanded to a real count-up
                stat.style.opacity = '1';
                stat.style.transform = 'scale(1)';
            }
        });
    };
    
    window.addEventListener('scroll', animateStats);
});
