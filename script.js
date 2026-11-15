/* ============================================================
   Ricky Criss Portfolio — script.js
   Features: Fade-in observer · Poe status · Jarvis splash
             Jarvis chat widget · Guided tour · Analytics events
   ============================================================ */

function boot() {
    try { initMotion(); } catch (e) { console.error('initMotion error:', e); }
    try { initPoeAgentStatus(); } catch (e) { console.error('initPoeAgentStatus error:', e); }
    try { initJarvisSplash(); } catch (e) { console.error('initJarvisSplash error:', e); }
    try { initJarvisChat(); } catch (e) { console.error('initJarvisChat error:', e); }
    try { initJarvisCarousel(); } catch (e) { console.error('initJarvisCarousel error:', e); }
    try { initAnalyticsEvents(); } catch (e) { console.error('initAnalyticsEvents error:', e); }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}

/* ── Fade-in intersection observer ──────────────────────────── */
function initMotion() {
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
}

/* ── Poe agent status probe ─────────────────────────────────── */
async function initPoeAgentStatus() {
    const statusPill = document.getElementById('hero-agent-status-pill');
    const statusText = document.getElementById('hero-agent-status-text');
    if (!statusPill || !statusText) return;

    // ── State helpers ──────────────────────────────────────────
    function setChecking() {
        statusPill.classList.remove('status-offline');
        statusPill.classList.add('status-checking');
        statusText.textContent = 'Checking…';
        statusPill.setAttribute('title', 'Probing local GPU server…');
    }

    function setOnline(label, tooltip) {
        statusPill.classList.remove('status-checking', 'status-offline');
        statusText.textContent = label;
        statusPill.setAttribute('title', tooltip);
    }

    function setOffline() {
        statusPill.classList.remove('status-checking');
        statusPill.classList.add('status-offline');
        statusText.textContent = 'Offline';
        statusPill.setAttribute('title', 'Local GPU server (port 8088) is not reachable. The Poe bridge is likely idle.');
    }

    // ── Probe ──────────────────────────────────────────────────
    setChecking();

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);

        // no-cors: resolves if the TCP connection succeeds, throws on refused/timeout
        const res = await fetch('http://127.0.0.1:8088/v1/models', {
            method: 'GET',
            mode: 'no-cors',
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        // Connection succeeded — local RTX node is up → bridge is live
        setOnline(
            'Active · RTX Node Online',
            'Local GPU model server (port 8088) is running — Poe bridge is live.'
        );
    } catch (err) {
        // AbortError = timeout, TypeError = connection refused — either way: offline
        setOffline();
    }
}

/* ── Jarvis splash screen ───────────────────────────────────── */
function initJarvisSplash() {
    const splash = document.getElementById('jarvis-splash');
    const msgEl = document.getElementById('jarvis-splash-msg');
    const skipBtn = document.getElementById('jarvis-skip');
    const audioBtn = document.getElementById('jarvis-audio-btn');
    const bootLog = document.getElementById('jarvis-boot-log');
    const dataStream = document.getElementById('jarvis-data-stream');
    if (!splash) return;

    // Allow user to bypass via ?skipintro or if already seen this session
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('skipintro') || (sessionStorage.getItem('jarvis-splash-seen') && !urlParams.has('splash'))) {
        splash.remove();
        document.body.style.overflow = '';
        return;
    }

    splash.focus();
    document.body.style.overflow = 'hidden';
    let muted = false;
    let dismissed = false;
    let currentAudio = null;

    // ── Quips with Studio TTS Audio ───────────────────────────
    const quipList = [
        {
            text: "All systems nominal. Portfolio initialised. Good evening, sir.",
            audio: "assets/audio/quip-1.wav"
        },
        {
            text: "I've scanned your intentions. Mostly harmless. Proceeding to credentials.",
            audio: "assets/audio/quip-2.wav"
        },
        {
            text: "Sir, the portfolio is fully compiled. Shall I prepare the workshop?",
            audio: "assets/audio/quip-3.wav"
        },
        {
            text: "Rendering architectural telemetry. Do try not to break anything on your way in.",
            audio: "assets/audio/quip-4.wav"
        },
        {
            text: "Diagnostics complete. Your choice in engineering talent appears statistically optimal.",
            audio: "assets/audio/quip-5.wav"
        }
    ];
    const chosenQuip = quipList[Math.floor(Math.random() * quipList.length)];

    // ── Boot log lines ─────────────────────────────────────────
    const bootLines = [
        '> kernel.jarvis loaded',
        '> memory check …… OK',
        '> persona module …… active',
        '> sarcasm engine …… calibrated',
        '> portfolio.db …… indexed',
        '> awaiting visitor…'
    ];

    function runBootLog() {
        if (!bootLog) return;
        bootLines.forEach((line, i) => {
            setTimeout(() => {
                const span = document.createElement('span');
                span.className = 'log-line';
                span.textContent = line;
                span.style.animationDelay = '0s';
                bootLog.appendChild(span);
            }, 300 + i * 280);
        });
    }

    // ── Data stream ────────────────────────────────────────────
    function runDataStream() {
        if (!dataStream) return;
        const hex = () => Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
        const labels = ['SYS', 'MEM', 'CPU', 'NET', 'RAG', 'GPU', 'TKN'];
        let tick = 0;
        const id = setInterval(() => {
            if (dismissed) { clearInterval(id); return; }
            const label = labels[tick % labels.length];
            const val = `${hex()} ${hex()}`;
            const line = document.createElement('div');
            line.textContent = `${label} ░ ${val}`;
            dataStream.appendChild(line);
            if (dataStream.children.length > 10) dataStream.removeChild(dataStream.firstChild);
            tick++;
        }, 280);
    }

    let ambientCtx = null;

    // ── Low Ambient Diagnostic Arc Hum (Gentle Audio Presence) ──
    function playAmbientBootHum() {
        if (muted) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            ambientCtx = new AudioCtx();
            
            const osc = ambientCtx.createOscillator();
            const gain = ambientCtx.createGain();
            const filter = ambientCtx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(90, ambientCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(140, ambientCtx.currentTime + 1.8);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(320, ambientCtx.currentTime);

            gain.gain.setValueAtTime(0.001, ambientCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.045, ambientCtx.currentTime + 0.8);
            gain.gain.exponentialRampToValueAtTime(0.015, ambientCtx.currentTime + 3.0);
            gain.gain.exponentialRampToValueAtTime(0.0001, ambientCtx.currentTime + 4.5);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ambientCtx.destination);

            osc.start();
            osc.stop(ambientCtx.currentTime + 4.6);
        } catch { }
    }

    // ── Typewriter effect ──────────────────────────────────────
    function typewriterSpeak(text, el, onDone) {
        el.textContent = '';
        el.classList.add('visible');

        // Blinking cursor
        const cursor = document.createElement('span');
        cursor.className = 'jarvis-cursor';
        cursor.setAttribute('aria-hidden', 'true');
        el.appendChild(cursor);

        let i = 0;
        const speed = 36; // ms per character (slightly more measured pacing)
        function tick() {
            if (dismissed) return;
            if (i < text.length) {
                cursor.before(text[i]);
                i++;
                setTimeout(tick, speed + (Math.random() * 14 - 7));
            } else {
                setTimeout(() => { cursor.remove(); if (onDone) onDone(); }, 1200);
            }
        }
        setTimeout(tick, 80);
    }

    // ── Play Pre-rendered Studio Audio ─────────────────────────
    function playQuipAudio(audioSrc) {
        if (muted) return;
        try {
            if (!currentAudio) {
                currentAudio = new Audio(audioSrc);
                currentAudio.volume = 0.62;
                currentAudio.playbackRate = 0.93;

                // Dismiss only AFTER sentence finishes cleanly + buffer
                currentAudio.addEventListener('ended', () => {
                    setTimeout(() => dismissSplash(), 1100);
                });
            }
            const playPromise = currentAudio.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Browser autoplay blocked audio until user interaction
                    let hint = document.getElementById('jarvis-audio-hint');
                    if (!hint && splash && !dismissed) {
                        hint = document.createElement('div');
                        hint.id = 'jarvis-audio-hint';
                        hint.className = 'jarvis-audio-hint';
                        hint.textContent = '🔊 CLICK TO UNMUTE J.A.R.V.I.S.';
                        splash.appendChild(hint);
                    }

                    const unlockAudio = () => {
                        if (hint) hint.remove();
                        if (!dismissed && currentAudio && !muted) {
                            currentAudio.play().catch(() => {});
                        }
                        window.removeEventListener('pointerdown', unlockAudio);
                        window.removeEventListener('keydown', unlockAudio);
                    };
                    window.addEventListener('pointerdown', unlockAudio, { once: true });
                    window.addEventListener('keydown', unlockAudio, { once: true });
                });
            }
        } catch { }
    }

    // ── Mute toggle ────────────────────────────────────────────
    if (audioBtn) {
        audioBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            muted = !muted;
            audioBtn.textContent = muted ? '🔇' : '🔊';
            audioBtn.classList.toggle('muted', muted);
            if (muted && currentAudio) {
                currentAudio.pause();
            } else if (!muted && currentAudio) {
                currentAudio.play().catch(() => {});
            }
        });
    }

    // ── Sequence ───────────────────────────────────────────────
    playAmbientBootHum();
    runBootLog();
    runDataStream();

    // 2.2s: show quip via typewriter + studio voice track
    setTimeout(() => {
        if (dismissed) return;
        typewriterSpeak(`"${chosenQuip.text}"`, msgEl, null);
        playQuipAudio(chosenQuip.audio);
    }, 2200);

    // Fast auto-dismiss fallback (3.2s)
    const fallbackDismiss = setTimeout(() => dismissSplash(), 3200);

    function dismissSplash() {
        if (dismissed) return;
        dismissed = true;
        clearTimeout(fallbackDismiss);
        if (ambientCtx) {
            try { ambientCtx.close(); } catch { }
        }
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }
        splash.classList.add('jarvis-hidden');
        splash.style.pointerEvents = 'none';
        document.body.style.overflow = '';
        sessionStorage.setItem('jarvis-splash-seen', '1');
        setTimeout(() => { if (splash && splash.parentNode) splash.remove(); }, 600);
        plausibleTrack('Jarvis Splash Seen');
    }

    splash.addEventListener('click', () => dismissSplash());

    skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dismissSplash();
    });
    
    document.addEventListener('keydown', function onEsc(e) {
        if (e.key === 'Escape') {
            dismissSplash();
            document.removeEventListener('keydown', onEsc);
        }
    });
}

/* ── Jarvis FAQ responses ───────────────────────────────────── */
const JARVIS_KB = [
    {
        keys: ['who', 'ricky', 'about', 'you', 'person'],
        response: "Ricky Criss — developer, AI engineering student, and recovering metalworker. Twenty years turning raw material into finished product. Now he does the same thing, just with code and considerably less ear protection required."
    },
    {
        keys: ['hire', 'available', 'work', 'job', 'freelance', 'remote', 'opportunity'],
        response: "He's open to remote developer roles and scoped freelance projects. Best approach: GitHub is the public contact route. Slide into the issues tab with a coherent brief and he'll respond. No recruiters pitching blockchain opportunities, please."
    },
    {
        keys: ['jarvis', 'ai', 'you are', 'are you'],
        response: "I'm Jarvis — the on-site AI for this portfolio. I answer questions, run tours, and occasionally make deadpan remarks at no extra charge. I'm not sentient. Probably."
    },
    {
        keys: ['poe', 'agent', 'vivid', 'architect', 'ue5', 'unreal'],
        response: "Vivid-Architect (vivid_ue5) is a live Poe agent fine-tuned on Unreal Engine 5. It scaffolds C++ actors, validates Hungarian naming, and manages Build.cs — running on a local RTX 3070 Ti. Chat with it on Poe: poe.com/Vivid86-DevAgent"
    },
    {
        keys: ['proeval', 'rlhf', 'evaluation', 'studio'],
        response: "ProEval Studio is an interactive RLHF sparring workbench. Timed bug-hunt sprints, in-browser Python WASM execution, A/B model audits, and Gemini-powered adversarial QA. It's what you'd build if you studied AI evaluation seriously."
    },
    {
        keys: ['stack', 'tech', 'tools', 'language', 'framework'],
        response: "On the web side: HTML, CSS, JS, React. AI: Python, Gemini SDK, LoRA fine-tuning, FastAPI, RAG pipelines. Infrastructure: local GPU compute (RTX 3070 Ti), GitHub Pages, Firebase. He builds things, then builds the things that build things."
    },
    {
        keys: ['contact', 'email', 'reach', 'connect', 'message'],
        response: "GitHub is the main contact route right now — github.com/Vivid86. Drop into the issues or discussions tab with your project brief. No CVs by DM. No equity-only offers. Yes, he's heard your brilliant idea."
    },
    {
        keys: ['tour', 'show', 'walk', 'around', 'guide'],
        response: "Great idea — click the '⬡ Tour' button up top and I'll walk you through the highlights. It's efficient, opinionated, and I promise not to ramble. Much."
    },
    {
        keys: ['metal', 'industry', 'background', 'experience', 'history'],
        response: "Twenty years in the metal industry — real materials, real constraints, real deadlines. It turns out that engineering principles transfer surprisingly well to software. The main difference is that software rarely falls on your foot."
    },
    {
        keys: ['corner14', 'react', 'vite', 'ai studio'],
        response: "Corner14 is a React + Vite learning project built with Google AI Studio. It explores structured AI application interfaces and state management. Early work — honest, documented, and functional."
    }
];

function jarvisRespond(input) {
    const lower = input.toLowerCase();
    const match = JARVIS_KB.find(item => item.keys.some(k => lower.includes(k)));
    if (match) return match.response;
    return "I didn't quite catch that. Try asking about Ricky's work, background, the Vivid-Architect agent, or type 'tour' and I'll walk you around.";
}

/* ── Jarvis chat widget ─────────────────────────────────────── */
function initJarvisChat() {
    const fab = document.getElementById('jarvis-fab');
    const chat = document.getElementById('jarvis-chat');
    const closeBtn = document.getElementById('jarvis-close');
    const input = document.getElementById('jarvis-input');
    const sendBtn = document.getElementById('jarvis-send');
    const tourBtn = document.getElementById('jarvis-tour-btn');
    const msgArea = document.getElementById('jarvis-messages');
    if (!fab || !chat) return;

    let isOpen = false;

    function openChat() {
        isOpen = true;
        chat.hidden = false;
        input.focus();
        if (!msgArea.children.length) {
            addMessage('jarvis', "Hello. I'm Jarvis — your guide to this portfolio. Ask me anything about Ricky's work, or type 'tour' and I'll walk you around. Fair warning: I have opinions.");
        }
        plausibleTrack('Jarvis Chat Opened');
    }

    function closeChat() {
        isOpen = false;
        chat.hidden = true;
        fab.focus();
    }

    fab.addEventListener('click', () => isOpen ? closeChat() : openChat());
    fab.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); isOpen ? closeChat() : openChat(); } });
    closeBtn.addEventListener('click', closeChat);

    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;
        addMessage('user', text);
        input.value = '';
        plausibleTrack('Jarvis Message Sent');

        // Check for tour trigger
        if (/\btour\b/i.test(text)) {
            addMessage('jarvis', "Excellent choice. Starting the grand tour — it covers the hero, services, work, and contact sections. You can bail out at any time.");
            setTimeout(() => startTour(), 600);
            return;
        }

        // Show typing indicator then respond
        const typing = addTyping();
        setTimeout(() => {
            typing.remove();
            addMessage('jarvis', jarvisRespond(text));
        }, 700 + Math.random() * 400);
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
    tourBtn.addEventListener('click', () => {
        openChat();
        setTimeout(() => {
            addMessage('jarvis', "Right. Tour mode engaged. Follow the highlights.");
            setTimeout(() => startTour(), 500);
        }, 100);
    });

    // Keyboard close
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && isOpen) closeChat();
    });
}

function addMessage(from, text) {
    const msgArea = document.getElementById('jarvis-messages');
    const wrapper = document.createElement('div');
    wrapper.className = `jarvis-msg jarvis-msg-${from}`;

    if (from === 'jarvis') {
        const label = document.createElement('div');
        label.className = 'jarvis-msg-label';
        label.textContent = 'JARVIS';
        wrapper.appendChild(label);
    }

    const body = document.createElement('div');
    body.textContent = text;
    wrapper.appendChild(body);
    msgArea.appendChild(wrapper);
    msgArea.scrollTop = msgArea.scrollHeight;
    return wrapper;
}

function addTyping() {
    const msgArea = document.getElementById('jarvis-messages');
    const el = document.createElement('div');
    el.className = 'jarvis-typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    msgArea.appendChild(el);
    msgArea.scrollTop = msgArea.scrollHeight;
    return el;
}

/* ── Guided tour ─────────────────────────────────────────────── */
const TOUR_STEPS = [
    {
        selector: '#home .hero-content',
        title: 'Start here',
        text: "This is the hero — Ricky's elevator pitch, minus the elevator. Practical problems, purpose-built software."
    },
    {
        selector: '#jarvis-carousel-container',
        title: 'J.A.R.V.I.S. 3D Deck',
        text: "The main presentation deck. Features live Poe agent Vivid-Architect, ProEval Studio, and more in an interactive 3D orbit."
    },
    {
        selector: '#services',
        title: 'Services',
        text: "Two focused offerings: website launches and workflow integrations. Scoped, agreed upfront, no scope creep surprises."
    },
    {
        selector: '#projects',
        title: 'Selected Work',
        text: "Real projects with documented architecture — not lorem ipsum placeholders. ProEval Studio, Vivid-Architect, and more."
    },
    {
        selector: '#about',
        title: 'About',
        text: "Twenty years of metal industry experience, now applied to software. Practical builder. Always learning. No buzzwords were harmed."
    },
    {
        selector: '#contact .contact-panel',
        title: 'Contact',
        text: "GitHub is the front door. If you've got a real project brief, that's where to start. And that's the tour — efficient, as promised."
    }
];

function startTour() {
    let step = 0;
    let currentHighlight = null;
    let tooltip = null;

    function playTourChirp() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(580, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.13);
        } catch {}
    }

    function showStep(i) {
        cleanup();
        if (i >= TOUR_STEPS.length) {
            addMessage('jarvis', "And that's the tour. Efficient, wasn't it. If you have questions, I'm right here.");
            plausibleTrack('Jarvis Tour Completed');
            return;
        }

        const { selector, title, text } = TOUR_STEPS[i];
        const target = document.querySelector(selector);
        if (!target) { showStep(i + 1); return; }

        // Play gentle HUD chirp on transition
        playTourChirp();

        // Scroll into view
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Highlight
        setTimeout(() => {
            target.classList.add('jarvis-tour-highlight');
            currentHighlight = target;

            // Tooltip
            const rect = target.getBoundingClientRect();
            tooltip = document.createElement('div');
            tooltip.id = 'jarvis-tour-tooltip';
            tooltip.innerHTML = `
                <div class="tour-header-bar">
                    <span class="tour-badge">
                        <span class="tour-badge-dot"></span>
                        J.A.R.V.I.S. TELEMETRY
                    </span>
                    <span class="tour-step-counter">${i + 1} / ${TOUR_STEPS.length}</span>
                </div>
                <div class="tour-body-text">
                    <strong style="color:#00f0ff; display:block; margin-bottom:0.25rem;">${title}</strong>
                    ${text}
                </div>
                <div class="tour-controls">
                    <button class="tour-btn tour-btn-skip">Skip</button>
                    <button class="tour-btn tour-btn-next">${i < TOUR_STEPS.length - 1 ? 'Next →' : 'Finish ✓'}</button>
                </div>`;

            // Position tooltip relative to viewport (pure fixed coordinates)
            const approxHeight = 210;
            const approxWidth = Math.min(340, window.innerWidth - 32);
            let top = rect.bottom + 16;
            
            // If placing below exceeds screen bottom, place above
            if (top + approxHeight > window.innerHeight - 20) {
                top = Math.max(20, rect.top - approxHeight - 16);
            }
            
            // Center horizontally relative to target, clamped to screen
            let left = rect.left + (rect.width / 2) - (approxWidth / 2);
            left = Math.min(Math.max(left, 16), window.innerWidth - approxWidth - 16);

            tooltip.style.top = `${Math.round(top)}px`;
            tooltip.style.left = `${Math.round(left)}px`;
            tooltip.style.width = `${approxWidth}px`;
            document.body.appendChild(tooltip);

            tooltip.querySelector('.tour-btn-next').addEventListener('click', (e) => {
                e.stopPropagation();
                step++;
                showStep(step);
            });
            tooltip.querySelector('.tour-btn-skip').addEventListener('click', (e) => {
                e.stopPropagation();
                cleanup();
                addMessage('jarvis', "Tour cancelled. Sensible. I'll be here if you need anything.");
                plausibleTrack('Jarvis Tour Skipped');
            });
        }, 400);
    }

    function cleanup() {
        if (currentHighlight) currentHighlight.classList.remove('jarvis-tour-highlight');
        if (tooltip) tooltip.remove();
        currentHighlight = null;
        tooltip = null;
    }

    showStep(0);
    plausibleTrack('Jarvis Tour Started');
}

/* ── Analytics event helpers ─────────────────────────────────── */
function plausibleTrack(eventName, props) {
    if (typeof window.plausible === 'function') {
        window.plausible(eventName, props ? { props } : undefined);
    }
}

function initAnalyticsEvents() {
    // Track CTA clicks
    document.querySelectorAll('.btn-primary, .btn-secondary, .btn-emerald').forEach(btn => {
        btn.addEventListener('click', () => {
            plausibleTrack('CTA Click', { label: btn.textContent.trim().slice(0, 40) });
        });
    });

    // Track project link clicks
    document.querySelectorAll('.project-link, .project-links a').forEach(link => {
        link.addEventListener('click', () => {
            plausibleTrack('Project Link Click', { href: link.getAttribute('href') });
        });
    });
}

/* ── Jarvis 3D Round-Robin Carousel ──────────────────────────── */
function initJarvisCarousel() {
    const container = document.getElementById('jarvis-carousel-container');
    const viewport = document.getElementById('carousel-viewport');
    const cylinder = document.getElementById('carousel-cylinder');
    const prevBtn = document.getElementById('carousel-prev-btn');
    const nextBtn = document.getElementById('carousel-next-btn');
    const pipsContainer = document.getElementById('carousel-pips');
    const targetTitleEl = document.getElementById('hud-target-title');
    const btnModeCarousel = document.getElementById('btn-mode-carousel');
    const btnModeGrid = document.getElementById('btn-mode-grid');

    if (!container || !viewport || !cylinder) return;

    const cards = Array.from(cylinder.querySelectorAll('.project-card'));
    const totalCards = cards.length;
    if (totalCards === 0) return;

    const angleStep = 360 / totalCards;
    let currentIndex = 0;
    let currentAngle = 0;
    let currentScale = 0.78;
    let isDragging = false;
    let pointerMoved = false;
    let startX = 0;
    let lastX = 0;
    let velocity = 0;
    let lastTime = 0;
    let isPinching = false;
    let initialPinchDistance = null;
    let initialScale = 0.78;
    let wheelTimeout = null;

    function getRadius() {
        return window.innerWidth < 768 ? 220 : 340;
    }

    function setupCardPositions() {
        const radius = getRadius();
        cards.forEach((card, idx) => {
            const angle = idx * angleStep;
            card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
            card.dataset.index = idx;
        });
    }

    setupCardPositions();
    window.addEventListener('resize', () => {
        if (!container.classList.contains('mode-grid')) {
            setupCardPositions();
            applyTransform(false);
        }
    });

    // Generate Pips
    if (pipsContainer) {
        pipsContainer.innerHTML = '';
        cards.forEach((card, idx) => {
            const pip = document.createElement('button');
            pip.className = `carousel-pip ${idx === 0 ? 'active' : ''}`;
            pip.setAttribute('aria-label', `Go to ${card.dataset.title || `Card ${idx + 1}`}`);
            pip.setAttribute('role', 'tab');
            pip.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                rotateToIndex(idx, true);
            };
            pipsContainer.appendChild(pip);
        });
    }

    function applyTransform(animate = true) {
        if (animate) {
            cylinder.classList.add('is-animating');
        } else {
            cylinder.classList.remove('is-animating');
        }
        cylinder.style.transform = `scale(${currentScale}) rotateY(${currentAngle}deg)`;
        updateActiveStates();
    }

    function getNormalizedIndex() {
        const normalizedAngle = ((-currentAngle % 360) + 360) % 360;
        return Math.round(normalizedAngle / angleStep) % totalCards;
    }

    function updateActiveStates() {
        const activeIdx = getNormalizedIndex();
        cards.forEach((card, idx) => {
            if (idx === activeIdx) {
                card.classList.add('is-active-card');
                card.classList.remove('is-inactive-card');
                card.setAttribute('aria-hidden', 'false');
            } else {
                card.classList.remove('is-active-card');
                card.classList.add('is-inactive-card');
                card.setAttribute('aria-hidden', 'true');
            }
        });

        const activeCard = cards[activeIdx];
        if (activeCard && targetTitleEl) {
            targetTitleEl.textContent = activeCard.dataset.title || activeCard.querySelector('h3')?.textContent || 'Target';
        }

        if (pipsContainer) {
            const pips = pipsContainer.querySelectorAll('.carousel-pip');
            pips.forEach((pip, idx) => {
                if (idx === activeIdx) {
                    pip.classList.add('active');
                    pip.setAttribute('aria-selected', 'true');
                } else {
                    pip.classList.remove('active');
                    pip.setAttribute('aria-selected', 'false');
                }
            });
        }
    }

    function rotateToIndex(targetIndex, animate = true) {
        currentIndex = targetIndex;
        currentAngle = targetIndex * -angleStep;
        applyTransform(animate);
    }

    // Prev / Next Buttons (Direct, Bulletproof Click Handlers)
    if (prevBtn) {
        prevBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            rotateToIndex(Math.round(-currentAngle / angleStep) - 1, true);
        };
    }

    if (nextBtn) {
        nextBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            rotateToIndex(Math.round(-currentAngle / angleStep) + 1, true);
        };
    }

    // Mode Switcher (✦ 3D Deck vs ▦ Grid View)
    function setMode(mode) {
        if (mode === 'grid') {
            container.classList.add('mode-grid');
            if (btnModeGrid) btnModeGrid.classList.add('active');
            if (btnModeCarousel) btnModeCarousel.classList.remove('active');
        } else {
            container.classList.remove('mode-grid');
            if (btnModeCarousel) btnModeCarousel.classList.add('active');
            if (btnModeGrid) btnModeGrid.classList.remove('active');
            currentScale = 0.78;
            setupCardPositions();
            rotateToIndex(Math.round(-currentAngle / angleStep), false);
        }
    }

    if (btnModeCarousel) {
        btnModeCarousel.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setMode('carousel');
        };
    }

    if (btnModeGrid) {
        btnModeGrid.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setMode('grid');
        };
    }

    // Pointer Drag & Velocity Momentum
    viewport.addEventListener('pointerdown', (e) => {
        if (container.classList.contains('mode-grid')) return;
        if (e.target.closest('button, a, input, select, .carousel-hud-bar, .carousel-pips')) return;

        isDragging = true;
        pointerMoved = false;
        startX = e.clientX;
        lastX = e.clientX;
        lastTime = performance.now();
        velocity = 0;

        cylinder.classList.remove('is-animating');
    });

    window.addEventListener('pointermove', (e) => {
        if (!isDragging || container.classList.contains('mode-grid')) return;

        const deltaX = e.clientX - lastX;
        if (Math.abs(e.clientX - startX) > 6) {
            pointerMoved = true;
            viewport.classList.add('is-dragging');
            cylinder.classList.add('is-dragging');
            try {
                if (!viewport.hasPointerCapture(e.pointerId)) {
                    viewport.setPointerCapture(e.pointerId);
                }
            } catch (_) {}
        }

        if (pointerMoved) {
            const sensitivity = window.innerWidth < 768 ? 0.45 : 0.35;
            currentAngle += deltaX * sensitivity;

            const now = performance.now();
            const dt = now - lastTime;
            if (dt > 0) {
                velocity = (deltaX / dt) * 16;
            }

            lastX = e.clientX;
            lastTime = now;
            applyTransform(false);
        }
    });

    function endDrag(e) {
        if (!isDragging) return;
        isDragging = false;

        viewport.classList.remove('is-dragging');
        cylinder.classList.remove('is-dragging');

        try {
            if (e && e.pointerId && viewport.hasPointerCapture(e.pointerId)) {
                viewport.releasePointerCapture(e.pointerId);
            }
        } catch (_) {}

        if (pointerMoved) {
            // Apply momentum flick
            if (Math.abs(velocity) > 1.2) {
                currentAngle += velocity * 4;
            }
            const nearestIndex = Math.round(-currentAngle / angleStep);
            rotateToIndex(nearestIndex, true);
        }
    }

    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    // Touch Pinch-to-Zoom
    viewport.addEventListener('touchstart', (e) => {
        if (container.classList.contains('mode-grid')) return;
        if (e.touches.length === 2) {
            isPinching = true;
            isDragging = false;
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            initialPinchDistance = Math.hypot(dx, dy);
            initialScale = currentScale;
        }
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
        if (!isPinching || container.classList.contains('mode-grid') || e.touches.length !== 2) return;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        if (initialPinchDistance) {
            const factor = dist / initialPinchDistance;
            currentScale = Math.min(1.28, Math.max(0.72, initialScale * factor));
            applyTransform(false);
        }
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
        if (e.touches.length < 2) {
            isPinching = false;
            initialPinchDistance = null;
        }
    }, { passive: true });

    // Trackpad / Wheel Rotation
    viewport.addEventListener('wheel', (e) => {
        if (container.classList.contains('mode-grid')) return;
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
        if (delta !== 0) {
            e.preventDefault();
            currentAngle -= delta * 0.22;
            applyTransform(false);

            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                const nearest = Math.round(-currentAngle / angleStep);
                rotateToIndex(nearest, true);
            }, 120);
        }
    }, { passive: false });

    // Keyboard Arrow Keys
    viewport.addEventListener('keydown', (e) => {
        if (container.classList.contains('mode-grid')) return;
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            rotateToIndex(Math.round(-currentAngle / angleStep) - 1, true);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            rotateToIndex(Math.round(-currentAngle / angleStep) + 1, true);
        }
    });

    // Clicking Inactive Card Rotates Directly to Center
    cards.forEach((card, idx) => {
        card.addEventListener('click', (e) => {
            if (container.classList.contains('mode-grid')) return;
            if (pointerMoved) return; // don't trigger click if it was a drag
            const activeIdx = getNormalizedIndex();
            if (idx !== activeIdx) {
                e.preventDefault();
                e.stopPropagation();
                let diff = (idx - activeIdx + totalCards) % totalCards;
                if (diff > totalCards / 2) diff -= totalCards;
                const currentNearest = Math.round(-currentAngle / angleStep);
                rotateToIndex(currentNearest - diff, true);
            }
        });
    });

    // Initial focal rotation
    rotateToIndex(0, false);
}
