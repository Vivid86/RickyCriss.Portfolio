document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for fade-in animations on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply a tiny delay if specified in inline style for staggered children
                const delay = entry.target.style.getPropertyValue('--delay') || '0s';
                entry.target.style.transitionDelay = delay;
                
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible if you don't want repeat animations
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
