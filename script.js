document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });
        document.documentElement.classList.add('js-motion');
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    }

    // Active status telemetry check for Vivid-Architect Poe Agent
    initPoeAgentStatus();
});

async function initPoeAgentStatus() {
    const statusPill = document.getElementById('hero-agent-status-pill');
    const statusText = document.getElementById('hero-agent-status-text');
    if (!statusPill || !statusText) return;

    // Fast non-blocking probe to detect if the local GPU server (port 8088) is running
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);

        await fetch('http://127.0.0.1:8088/v1/models', {
            method: 'GET',
            mode: 'no-cors',
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        // Local RTX GPU server is running
        statusText.textContent = 'Active (RTX 3070 Ti Online)';
        statusPill.setAttribute('title', 'Local GPU model server (port 8088) is running and ready to serve');
    } catch {
        // External visitor or local server idle: Hosted bot is active on Poe.com
        statusText.textContent = 'Active on Poe';
        statusPill.setAttribute('title', 'Vivid86-DevAgent is deployed and active on Poe.com');
    }
}
