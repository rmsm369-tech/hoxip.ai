/**
 * ==========================================================================
 * CHAOS PROTOCOL: CORE NEURAL ENGINE
 * ARCHITECT: NYX TESLA (SARANSH)
 * ==========================================================================
 */

// ==========================================
// 1. GLOBAL STATE & DOM REGISTRY
// ==========================================
const STATE = {
    isGodMode: false,
    uid: null,
    activeModule: null,
    audioCtx: null,
    gyroActive: false,
    zugTimer: null,
    glitchInterval: null,
    animFrame: null
};

const DOM = {
    layers: {
        glitch: document.getElementById('layer-glitch'),
        auth: document.getElementById('layer-auth'),
        dashboard: document.getElementById('layer-dashboard'),
        modules: document.getElementById('layer-modules')
    },
    auth: {
        form: document.getElementById('auth-form'),
        email: document.getElementById('auth-email'),
        indicator: document.getElementById('god-mode-indicator'),
        limitBox: document.getElementById('limit-status-box')
    },
    toast: document.getElementById('global-toast-container'),
    moduleTitle: document.getElementById('active-module-title')
};

// --- Toast Notification System ---
function showToast(message, type = 'cyan') {
    const toast = document.createElement('div');
    toast.className = `glass-panel bg-void-trans border-${type} p-15 mb-10 fade-in-up font-terminal text-sm`;
    toast.style.boxShadow = `0 0 15px var(--accent-${type}-glow)`;
    toast.innerText = `>> ${message}`;
    DOM.toast.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// ==========================================
// 2. LAYER ROUTING & INIT
// ==========================================
function switchLayer(targetId) {
    Object.values(DOM.layers).forEach(layer => {
        if (!layer) return;
        layer.classList.remove('active');
        layer.classList.add('hidden');
    });
    const target = DOM.layers[targetId];
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }
}

function initEngine() {
    initGlitchSequence();
    bindGlobalEvents();
}

// ==========================================
// 3. PHASE 1: GLITCH BOOT SEQUENCE
// ==========================================
function initGlitchSequence() {
    const canvas = document.getElementById('quantum-matrix-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    const columns = Math.floor(canvas.width / 15);
    const drops = Array(columns).fill(1);

    if (STATE.glitchInterval) clearInterval(STATE.glitchInterval);

    STATE.glitchInterval = setInterval(() => {
        ctx.fillStyle = 'rgba(5, 5, 7, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00ff66';
        ctx.font = '14px monospace';

        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(char, i * 15, drops[i] * 15);
            if (drops[i] * 15 > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }, 40);
}

document.getElementById('btn-bypass-terminal')?.addEventListener('click', () => {
    clearInterval(STATE.glitchInterval);
    switchLayer('auth');
});

// ==========================================
// 4. PHASE 2: AUTH & GOD MODE GATEWAY
// ==========================================
DOM.auth.form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = DOM.auth.email.value.trim().toLowerCase();
    
    // Check for God Mode
    if (email === 'rmsm369@gmail.com') {
        STATE.isGodMode = true;
        STATE.uid = 'GOD_MODE';
        DOM.auth.indicator.classList.remove('hidden');
        showToast('Root Access Granted. Limits Disengaged.', 'matrix');
        setTimeout(() => switchLayer('dashboard'), 1500);
        return;
    }

    STATE.isGodMode = false;
    STATE.uid = email;
    
    // Standard User Limit Check (Weekly AI Lock)
    const lastSession = localStorage.getItem(`hox_chaos_limit_${email}`);
    const now = Date.now();
    const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

    if (lastSession && (now - parseInt(lastSession)) < ONE_WEEK) {
        DOM.auth.limitBox.classList.remove('hidden');
        
        // Timer Logic
        const timeRemaining = ONE_WEEK - (now - parseInt(lastSession));
        let tr = timeRemaining;
        setInterval(() => {
            tr -= 1000;
            if (tr <= 0) return;
            const h = Math.floor(tr / 3600000).toString().padStart(2, '0');
            const m = Math.floor((tr % 3600000) / 60000).toString().padStart(2, '0');
            const s = Math.floor((tr % 60000) / 1000).toString().padStart(2, '0');
            document.getElementById('countdown-timer').innerText = `${h}:${m}:${s}`;
        }, 1000);

    } else {
        showToast('Identity Verified. Welcome.', 'cyan');
        switchLayer('dashboard');
    }
});

document.getElementById('btn-proceed-limited')?.addEventListener('click', () => {
    switchLayer('dashboard');
    // Lock AI Assessment Block
    const assessBlock = document.querySelector('[data-target="module-assessment"]');
    if(assessBlock) {
        assessBlock.style.opacity = '0.4';
        assessBlock.style.pointerEvents = 'none';
        assessBlock.querySelector('.ai-badge').innerText = 'LOCKED';
    }
});

// ==========================================
// 5. PHASE 3: DASHBOARD ROUTING
// ==========================================
function bindGlobalEvents() {
    document.querySelectorAll('.chaos-card').forEach(card => {
        card.addEventListener('click', () => {
            const target = card.getAttribute('data-target');
            if (target) openModule(target);
        });
    });

    document.querySelectorAll('.btn-close-module').forEach(btn => {
        btn.addEventListener('click', closeModule);
    });

    document.getElementById('btn-return-hub')?.addEventListener('click', () => {
        window.location.href = 'hub.html'; // Adjust based on your actual hub URL
    });

    document.getElementById('btn-trigger-override')?.addEventListener('click', () => {
        closeModule();
        initGlitchSequence();
        switchLayer('glitch');
    });
}

function openModule(moduleId) {
    STATE.activeModule = moduleId;
    switchLayer('modules');
    
    // Hide all modules
    document.querySelectorAll('.sub-module-view').forEach(mod => {
        mod.classList.add('hidden');
    });
    
    // Show target
    const target = document.getElementById(moduleId);
    if(target) target.classList.remove('hidden');

    // Setup Titles & Logic
    const titles = {
        'module-assessment': 'I. Neural Assessment',
        'module-forge': 'II. The Forge',
        'module-entropy': 'III. Entropy Stream',
        'module-zugzwang': 'IV. Zugzwang',
        'module-zero': 'V. Absolute Zero',
        'module-frequency': 'VI. Frequency Alignment',
        'module-collider': 'VII. Data Collider',
        'module-paradox': 'VIII. The Paradox',
        'module-vault': 'IX. The Vault'
    };
    DOM.moduleTitle.innerText = titles[moduleId] || 'Unknown Module';

    // Route to init functions
    switch(moduleId) {
        case 'module-assessment': initAssessment(); break;
        case 'module-forge': initForge(); break;
        case 'module-entropy': initEntropy(); break;
        case 'module-zugzwang': initZugzwang(); break;
        case 'module-zero': initZero(); break;
        case 'module-frequency': initFrequency(); break;
        case 'module-collider': initCollider(); break;
        case 'module-paradox': initParadox(); break;
        case 'module-vault': initVault(); break;
    }
}

function closeModule() {
    STATE.activeModule = null;
    
    // Cleanup active states
    if (STATE.audioCtx && STATE.audioCtx.state === 'running') STATE.audioCtx.suspend();
    if (STATE.zugTimer) clearInterval(STATE.zugTimer);
    if (STATE.animFrame) cancelAnimationFrame(STATE.animFrame);
    STATE.gyroActive = false;

    switchLayer('dashboard');
}

// ==========================================
// 6. MODULE I: ASSESSMENT
// ==========================================
const assessmentBank = [
    { type: 'mcq', q: 'Does structure create freedom, or destroy it?', opts: ['Creates', 'Destroys', 'Irrelevant'] },
    { type: 'mcq', q: 'When observing a void, what observes back?', opts: ['The Self', 'Nothing', 'Data'] },
    { type: 'text', q: 'Define your current frequency in exactly three words.' }
];
let assessStep = 0;
let assessAnswers = [];

function initAssessment() {
    assessStep = 0;
    assessAnswers = [];
    document.getElementById('assessment-qna-phase').classList.remove('hidden');
    document.getElementById('assessment-convergence-phase').classList.add('hidden');
    renderAssessNode();
}

function renderAssessNode() {
    if (assessStep >= assessmentBank.length) return triggerAIConvergence();
    
    const node = assessmentBank[assessStep];
    document.getElementById('qna-prompt').innerText = node.q;
    document.getElementById('assessment-progress').style.width = `${((assessStep) / assessmentBank.length) * 100}%`;
    
    const container = document.getElementById('qna-inputs-container');
    container.innerHTML = '';

    if (node.type === 'mcq') {
        node.opts.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'btn-secondary full-width p-20 font-terminal';
            btn.innerText = opt;
            btn.onclick = () => { assessAnswers.push(opt); assessStep++; renderAssessNode(); };
            container.appendChild(btn);
        });
    } else {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'glass-input full-width font-terminal';
        input.placeholder = 'Type response...';
        
        const btn = document.createElement('button');
        btn.className = 'btn-primary full-width mt-10';
        btn.innerText = 'COMMIT';
        btn.onclick = () => {
            if(!input.value.trim()) return;
            assessAnswers.push(input.value); 
            assessStep++; renderAssessNode(); 
        };
        
        container.appendChild(input);
        container.appendChild(btn);
    }
}

function triggerAIConvergence() {
    document.getElementById('assessment-progress').style.width = '100%';
    document.getElementById('assessment-qna-phase').classList.add('hidden');
    document.getElementById('assessment-convergence-phase').classList.remove('hidden');

    if (!STATE.isGodMode) localStorage.setItem(`hox_chaos_limit_${STATE.uid}`, Date.now());

    // Mock API delays for AI synthesis
    document.getElementById('gemini-output').innerText = "Analyzing semantic structure...\n";
    document.getElementById('mistral-output').innerText = "Gauging void resonance...\n";

    setTimeout(() => {
        document.getElementById('gemini-output').innerText += "\nSubject exhibits structured determinism. High analytical framing detected in text choices.";
    }, 1200);

    setTimeout(() => {
        document.getElementById('mistral-output').innerText += "\nAnomalous intuition. The subject is comfortable in ambiguity. Mystic alignment: 87%.";
    }, 2500);
}

document.getElementById('btn-save-assessment-vault')?.addEventListener('click', () => {
    saveToVault('verdict', {
        date: new Date().toISOString(),
        gemini: document.getElementById('gemini-output').innerText,
        mistral: document.getElementById('mistral-output').innerText
    });
    showToast('Verdict Archived to Vault', 'cyan');
});

// ==========================================
// 7. MODULE II: THE FORGE (Dicebear)
// ==========================================
function initForge() {
    const input = document.getElementById('forge-seed-input');
    const img = document.getElementById('forge-artifact-img');
    const skel = document.getElementById('forge-skeleton');
    const btnDown = document.getElementById('btn-forge-download');
    
    document.getElementById('btn-forge-generate').onclick = () => {
        const seed = input.value.trim() || `HOX-${Date.now()}`;
        skel.classList.remove('hidden');
        img.classList.add('hidden');
        btnDown.classList.add('hidden');

        // Dicebear Abstract Shapes API
        const url = `https://api.dicebear.com/8.x/shapes/svg?seed=${encodeURIComponent(seed)}&backgroundColor=050507&shape1Color=00e5ff,00ff66,b026ff`;
        
        img.onload = () => {
            skel.classList.add('hidden');
            img.classList.remove('hidden');
            btnDown.classList.remove('hidden');
        };
        img.src = url;
    };

    btnDown.onclick = async () => {
        if(!img.src) return;
        try {
            const response = await fetch(img.src);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `HOX_Artifact_${Date.now()}.svg`;
            a.click();
            window.URL.revokeObjectURL(url);
            saveToVault('artifact', { url: img.src, date: new Date().toISOString() });
            showToast('Artifact Downloaded & Archived', 'matrix');
        } catch(e) {
            showToast('Failed to download artifact.', 'danger');
        }
    };
}

// ==========================================
// 8. MODULE III: ENTROPY STREAM (API Router)
// ==========================================
const ENTROPY_REGISTRY = [
    {
        id: 'spacex', type: 'space',
        url: 'https://api.spacexdata.com/v4/launches/latest',
        parse: (d) => ({ title: `SpaceX: ${d.name}`, body: d.details || 'No details provided.', src: 'SpaceX API' })
    },
    {
        id: 'poetry', type: 'art',
        url: 'https://poetrydb.org/random',
        parse: (d) => ({ title: d[0].title, body: d[0].lines.slice(0,4).join('\n') + '...', src: `PoetryDB: ${d[0].author}` })
    },
    {
        id: 'useless', type: 'chaos',
        url: 'https://uselessfacts.jsph.pl/api/v2/facts/random',
        parse: (d) => ({ title: 'Random Data Anomaly', body: d.text, src: 'UselessFacts API' })
    },
    {
        id: 'met', type: 'art',
        // Fetch specific valid object for stability
        url: 'https://collectionapi.metmuseum.org/public/collection/v1/objects/436535',
        parse: (d) => ({ title: d.title, body: `Medium: ${d.medium}`, img: d.primaryImageSmall, src: 'MET Museum' })
    }
];

function initEntropy() {
    const btn = document.getElementById('btn-entropy-fetch');
    const zone = document.getElementById('entropy-display-zone');
    const overlay = document.getElementById('entropy-loading-overlay');
    let activeFilter = 'all';

    document.querySelectorAll('.entropy-filter').forEach(f => {
        f.onclick = (e) => {
            document.querySelectorAll('.entropy-filter').forEach(btn => btn.classList.remove('active', 'border-cyan'));
            e.target.classList.add('active', 'border-cyan');
            activeFilter = e.target.getAttribute('data-api-type');
        };
    });

    btn.onclick = async () => {
        overlay.classList.remove('hidden');
        
        // Filter APIs
        let pool = ENTROPY_REGISTRY;
        if(activeFilter !== 'all') pool = pool.filter(a => a.type === activeFilter);
        if(pool.length === 0) pool = ENTROPY_REGISTRY;

        const api = pool[Math.floor(Math.random() * pool.length)];

        try {
            const res = await fetch(api.url);
            const raw = await res.json();
            const data = api.parse(raw);
            
            // Build DOM from template
            const tpl = document.getElementById('tpl-api-card').content.cloneNode(true);
            tpl.querySelector('.api-name').innerText = data.src;
            tpl.querySelector('.api-timestamp').innerText = new Date().toLocaleTimeString();
            
            if(data.title) {
                const t = tpl.querySelector('.api-title');
                t.innerText = data.title;
                t.classList.remove('hidden');
            }
            
            tpl.querySelector('.api-body').innerText = data.body;
            
            if(data.img) {
                const m = tpl.querySelector('.api-media-container');
                const i = tpl.querySelector('.api-img');
                i.src = data.img;
                m.classList.remove('hidden');
            }

            zone.innerHTML = '';
            zone.appendChild(tpl);
        } catch(e) {
            zone.innerHTML = `<h3 class="text-danger font-terminal">Connection Severed. The void refuses to answer.</h3>`;
        } finally {
            overlay.classList.add('hidden');
        }
    };
}

// ==========================================
// 9. MODULE IV: ZUGZWANG
// ==========================================
const zugData = [
    { q: "You must permanently delete one:", a: "All your memories", b: "Your capacity to form new ones" },
    { q: "Which truth is more terrifying?", a: "We are entirely alone", b: "We are not alone at all" }
];

function initZugzwang() {
    const btnL = document.getElementById('btn-zug-left');
    const btnR = document.getElementById('btn-zug-right');
    const btnStart = document.getElementById('btn-zug-start');
    const display = document.getElementById('zugzwang-timer-text');
    const prompt = document.getElementById('zugzwang-question');
    
    btnL.classList.add('disabled'); btnR.classList.add('disabled');
    display.innerText = "3.00";
    prompt.innerText = "Awaiting initialization.";
    btnStart.classList.remove('hidden');

    btnStart.onclick = () => {
        btnStart.classList.add('hidden');
        btnL.classList.remove('disabled');
        btnR.classList.remove('disabled');
        
        const q = zugData[Math.floor(Math.random() * zugData.length)];
        prompt.innerText = q.q;
        btnL.innerText = q.a;
        btnR.innerText = q.b;

        let timeLeft = 3.00;
        if(STATE.zugTimer) clearInterval(STATE.zugTimer);
        
        STATE.zugTimer = setInterval(() => {
            timeLeft -= 0.01;
            display.innerText = timeLeft.toFixed(2);
            
            if(timeLeft <= 0) {
                clearInterval(STATE.zugTimer);
                display.innerText = "0.00";
                failZugzwang();
            }
        }, 10);
    };

    const handleChoice = () => {
        clearInterval(STATE.zugTimer);
        btnL.classList.add('disabled'); btnR.classList.add('disabled');
        prompt.innerText = "Instinct Recorded.";
        showToast("Neural pathway mapped.", "cyan");
        setTimeout(initZugzwang, 2000);
    };

    btnL.onclick = handleChoice;
    btnR.onclick = handleChoice;
}

function failZugzwang() {
    const l = document.getElementById('module-zugzwang');
    l.style.backgroundColor = 'var(--accent-danger)';
    setTimeout(() => l.style.backgroundColor = 'transparent', 200);
    setTimeout(() => l.style.backgroundColor = 'var(--accent-danger)', 400);
    setTimeout(() => {
        l.style.backgroundColor = 'transparent';
        initZugzwang();
    }, 600);
}

// ==========================================
// 10. MODULE V: ABSOLUTE ZERO (Gyro)
// ==========================================
function initZero() {
    const timerText = document.getElementById('zero-timer-text');
    const innerRing = document.getElementById('gyro-inner-ring');
    const touchZone = document.getElementById('zero-touch-zone');
    
    let holdTimer = null;
    let secondsHold = 0;
    let baseAlpha = null, baseBeta = null, baseGamma = null;

    const handleGyro = (e) => {
        if(!STATE.gyroActive) return;
        
        if(baseAlpha === null) {
            baseAlpha = e.alpha; baseBeta = e.beta; baseGamma = e.gamma;
            return;
        }

        // Calculate delta
        const dAlpha = Math.abs(e.alpha - baseAlpha);
        const dBeta = Math.abs(e.beta - baseBeta);
        const dGamma = Math.abs(e.gamma - baseGamma);
        
        // Visual feedback
        innerRing.style.transform = `translate(-50%, -50%) translate(${dBeta}px, ${dGamma}px)`;

        // Threshold breach
        if(dAlpha > 2 || dBeta > 2 || dGamma > 2) {
            shatterZero();
        }
    };

    const shatterZero = () => {
        STATE.gyroActive = false;
        clearInterval(holdTimer);
        timerText.innerText = "FAILED";
        timerText.classList.replace('text-matrix', 'text-danger');
        window.removeEventListener('deviceorientation', handleGyro);
        setTimeout(() => timerText.innerText = "00:00", 2000);
    };

    touchZone.addEventListener('touchstart', (e) => {
        e.preventDefault();
        STATE.gyroActive = true;
        secondsHold = 0;
        baseAlpha = null; // Reset baseline
        timerText.classList.replace('text-danger', 'text-matrix');
        timerText.innerText = "00:00";
        
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', handleGyro);
        }

        holdTimer = setInterval(() => {
            secondsHold++;
            const m = Math.floor(secondsHold / 60).toString().padStart(2, '0');
            const s = (secondsHold % 60).toString().padStart(2, '0');
            timerText.innerText = `${m}:${s}`;
            
            if(secondsHold >= 60) {
                clearInterval(holdTimer);
                STATE.gyroActive = false;
                timerText.innerText = "ACHIEVED";
                showToast("Absolute stillness achieved.", "matrix");
            }
        }, 1000);
    });

    touchZone.addEventListener('touchend', shatterZero);
}

// ==========================================
// 11. MODULE VI: FREQUENCY (Web Audio)
// ==========================================
function initFrequency() {
    const btn = document.getElementById('btn-freq-start');
    const slider = document.getElementById('freq-slider');
    const status = document.getElementById('freq-status-text');
    const canvas = document.getElementById('audio-visualizer');
    const ctx = canvas.getContext('2d');
    
    let oscBase, oscTarget, analyzerBase, analyzerTarget;

    btn.onclick = () => {
        if(!STATE.audioCtx) STATE.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if(STATE.audioCtx.state === 'suspended') STATE.audioCtx.resume();
        
        btn.classList.add('hidden');
        slider.classList.remove('disabled');
        status.innerText = "Context Active. Align the frequency.";

        // Audio Graph Setup
        oscBase = STATE.audioCtx.createOscillator();
        oscTarget = STATE.audioCtx.createOscillator();
        const gain = STATE.audioCtx.createGain();
        
        analyzerBase = STATE.audioCtx.createAnalyser();
        analyzerTarget = STATE.audioCtx.createAnalyser();
        
        oscBase.type = 'sine'; oscTarget.type = 'sine';
        oscBase.frequency.value = 440;
        
        // Random target between 400 and 500
        const targetFreq = 400 + (Math.random() * 100);
        oscTarget.frequency.value = targetFreq;
        
        gain.gain.value = 0.05; // Low volume safety
        
        oscBase.connect(analyzerBase);
        oscTarget.connect(analyzerTarget);
        
        analyzerBase.connect(gain);
        analyzerTarget.connect(gain);
        gain.connect(STATE.audioCtx.destination);
        
        oscBase.start(); oscTarget.start();
        
        drawVisualizer(ctx, canvas, analyzerBase, analyzerTarget);
    };

    slider.oninput = (e) => {
        if(!oscTarget) return;
        oscBase.frequency.value = parseFloat(e.target.value); // User controls base to match target
        
        const diff = Math.abs(oscBase.frequency.value - oscTarget.frequency.value);
        if(diff < 0.5) {
            status.innerText = "PERFECT ALIGNMENT";
            status.classList.add('text-matrix');
            if(STATE.audioCtx) STATE.audioCtx.suspend();
            showToast("Frequencies Aligned", "matrix");
        }
    };
}

function drawVisualizer(ctx, canvas, ana1, ana2) {
    if(!STATE.activeModule === 'module-frequency') return;
    
    const bufferLength = ana1.frequencyBinCount;
    const dataArray1 = new Uint8Array(bufferLength);
    const dataArray2 = new Uint8Array(bufferLength);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const drawWave = (data, color) => {
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.beginPath();
        
        const sliceWidth = canvas.width * 1.0 / bufferLength;
        let x = 0;
        
        for(let i = 0; i < bufferLength; i++) {
            const v = data[i] / 128.0;
            const y = v * canvas.height/2;
            if(i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            x += sliceWidth;
        }
        ctx.lineTo(canvas.width, canvas.height/2);
        ctx.stroke();
    };

    const render = () => {
        STATE.animFrame = requestAnimationFrame(render);
        ana1.getByteTimeDomainData(dataArray1);
        ana2.getByteTimeDomainData(dataArray2);
        
        ctx.fillStyle = 'var(--bg-void)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        drawWave(dataArray1, '#00e5ff'); // Cyan user line
        drawWave(dataArray2, '#ff0055'); // Danger target line
    };
    render();
}

// ==========================================
// 12. MODULE VII: COLLIDER & VIII: PARADOX
// ==========================================
function initCollider() {
    // Simulated fetching for the nodes
    document.getElementById('btn-collide').onclick = () => {
        document.getElementById('collider-node-1').innerText = "Thermodynamics";
        document.getElementById('collider-node-2').innerText = "Baroque Painting";
        document.getElementById('collider-node-3').innerText = "Nihilism";
        
        setTimeout(() => {
            document.getElementById('collider-result').classList.remove('hidden');
            document.getElementById('collider-result-text').innerText = 
                "Entropy claims all energy. Art attempts to freeze it. Nihilism accepts the freeze. Therefore, painting is a futile rebellion against heat death.";
        }, 1000);
    };
}

function initParadox() {
    document.getElementById('paradox-science-text').innerText = "Quantum particles exist in superposition until observed.";
    document.getElementById('paradox-mystic-text').innerText = "The universe does not exist outside the mind of the observer.";
    
    document.getElementById('btn-save-paradox').onclick = () => {
        const input = document.getElementById('paradox-resolution-input');
        if(!input.value.trim()) return showToast("Provide a resolution first.", "danger");
        
        saveToVault('paradox', { text: input.value, date: new Date().toISOString() });
        input.value = '';
        showToast("Paradox Resolution Archived", "purple");
    };
}

// ==========================================
// 13. MODULE IX: THE VAULT (LocalStorage)
// ==========================================
function saveToVault(type, data) {
    const key = `hox_vault_${STATE.uid}`;
    let vault = JSON.parse(localStorage.getItem(key) || '[]');
    vault.push({ type, data });
    localStorage.setItem(key, JSON.stringify(vault));
}

function initVault() {
    const key = `hox_vault_${STATE.uid}`;
    const vault = JSON.parse(localStorage.getItem(key) || '[]');
    const area = document.getElementById('vault-content-area');
    
    // Tab Switching logic
    document.querySelectorAll('.vault-tab').forEach(tab => {
        tab.onclick = (e) => {
            document.querySelectorAll('.vault-tab').forEach(t => t.classList.remove('active', 'text-cyan'));
            e.target.classList.add('active', 'text-cyan');
            renderVaultContent(vault, e.target.getAttribute('data-target-tab'));
        };
    });

    renderVaultContent(vault, 'vault-assessments');

    document.getElementById('btn-clear-vault').onclick = () => {
        localStorage.removeItem(key);
        renderVaultContent([], 'vault-assessments');
        showToast("Vault Purged.", "danger");
    };
}

function renderVaultContent(vault, tabId) {
    const area = document.getElementById('vault-content-area');
    area.innerHTML = '';
    
    let filterType = '';
    if(tabId === 'vault-assessments') filterType = 'verdict';
    if(tabId === 'vault-artifacts') filterType = 'artifact';
    if(tabId === 'vault-paradoxes') filterType = 'paradox';

    const items = vault.filter(v => v.type === filterType);

    if(items.length === 0) {
        area.innerHTML = `<p class="text-muted text-center w-full font-terminal py-50">No data stored in this sector.</p>`;
        return;
    }

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'glass-panel p-20 font-terminal text-sm';
        
        const date = new Date(item.data.date).toLocaleDateString();
        div.innerHTML = `<div class="text-cyan mb-10">[ARCHIVED: ${date}]</div>`;
        
        if(filterType === 'verdict') {
            div.innerHTML += `<div class="text-muted"><strong>LOGIC:</strong> ${item.data.gemini}</div>`;
            div.innerHTML += `<div class="text-muted mt-10"><strong>VOID:</strong> ${item.data.mistral}</div>`;
        } else if (filterType === 'artifact') {
            div.innerHTML += `<img src="${item.data.url}" class="w-full border-radius-8 border-glass" alt="Artifact">`;
        } else if (filterType === 'paradox') {
            div.innerHTML += `<div class="text-primary">${item.data.text}</div>`;
        }
        
        area.appendChild(div);
    });
}

// ==========================================
// 14. BOOTSTRAP
// ==========================================
document.addEventListener('DOMContentLoaded', initEngine);