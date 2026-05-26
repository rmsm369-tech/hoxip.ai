/**
 * ==========================================================================
 * ORACLE PROTOCOL: DETERMINISTIC OFFLINE & HYBRID ENGINE
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
    entropyCredits: 0,
    intervals: {},
    animFrames: {},
    mediaStream: null,
    geoCoords: { lat: 26.4499, lon: 80.3319 } // Default fallback coordinates
};

const DOM = {
    layers: {
        boot: document.getElementById('layer-boot'),
        auth: document.getElementById('layer-auth'),
        dashboard: document.getElementById('layer-dashboard'),
        modules: document.getElementById('layer-modules')
    },
    auth: {
        form: document.getElementById('auth-form'),
        email: document.getElementById('auth-email'),
        indicator: document.getElementById('god-mode-indicator')
    },
    ui: {
        toast: document.getElementById('global-toast-container'),
        moduleTitle: document.getElementById('active-module-title'),
        balance: document.getElementById('entropy-balance')
    }
};

// --- Toast Notification Protocol ---
function showToast(message, type = 'gold') {
    const toast = document.createElement('div');
    toast.className = `glass-panel bg-void-trans border-${type} p-15 mb-10 fade-in-up font-terminal text-sm`;
    toast.style.boxShadow = `0 0 15px var(--accent-${type}-glow)`;
    toast.innerText = `>> ${message}`;
    DOM.ui.toast.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// ==========================================
// 2. CORE ROUTING & BOOTSTRAP
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

function initOracleEngine() {
    initSacredGeometry();
    bindGlobalEvents();
    requestGeolocation();
}

function requestGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                STATE.geoCoords.lat = pos.coords.latitude;
                STATE.geoCoords.lon = pos.coords.longitude;
            },
            () => { console.warn("Geo-lock denied. Using default anchor."); }
        );
    }
}

// ==========================================
// 3. PHASE 1: SACRED GEOMETRY BOOT
// ==========================================
function initSacredGeometry() {
    const canvas = document.getElementById('sacred-geometry-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    let angle = 0;
    
    function draw() {
        ctx.fillStyle = 'rgba(3, 3, 5, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle);
        
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.15)';
        ctx.lineWidth = 1;
        
        // Draw rotating Metatron's Cube abstract
        for(let i = 0; i < 6; i++) {
            ctx.rotate((Math.PI * 2) / 6);
            ctx.beginPath();
            ctx.arc(100, 0, 50, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(100, 0);
            ctx.lineTo(-50, 86.6);
            ctx.stroke();
        }
        
        ctx.restore();
        angle += 0.005;
        STATE.animFrames.boot = requestAnimationFrame(draw);
    }
    draw();

    document.getElementById('btn-enter-oracle')?.addEventListener('click', () => {
        cancelAnimationFrame(STATE.animFrames.boot);
        switchLayer('auth');
    });
}

// ==========================================
// 4. PHASE 2: AUTH & ROOT ACCESS
// ==========================================
DOM.auth.form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = DOM.auth.email.value.trim().toLowerCase();
    
    if (email === 'rmsm369@gmail.com') {
        STATE.isGodMode = true;
        STATE.uid = 'ROOT_ORACLE';
        STATE.entropyCredits = 999999;
        DOM.auth.indicator.classList.remove('hidden');
        showToast('Root Alignment Achieved.', 'gold');
        setTimeout(() => completeAuth(), 1500);
        return;
    }

    STATE.isGodMode = false;
    STATE.uid = email;
    
    // Read local balance
    const savedBalance = localStorage.getItem(`hox_entropy_${email}`);
    STATE.entropyCredits = savedBalance ? parseInt(savedBalance) : 1000;
    
    showToast('Identity Synchronized.', 'cyan');
    completeAuth();
});

function completeAuth() {
    DOM.ui.balance.innerText = STATE.entropyCredits;
    localStorage.setItem(`hox_entropy_${STATE.uid}`, STATE.entropyCredits);
    switchLayer('dashboard');
}

function updateBalance(amount) {
    if(STATE.isGodMode) amount = Math.abs(amount); // Root never loses
    STATE.entropyCredits += amount;
    if(STATE.entropyCredits < 0) STATE.entropyCredits = 0;
    DOM.ui.balance.innerText = STATE.entropyCredits;
    localStorage.setItem(`hox_entropy_${STATE.uid}`, STATE.entropyCredits);
}

// ==========================================
// 5. PHASE 3: DASHBOARD ROUTING
// ==========================================
function bindGlobalEvents() {
    document.querySelectorAll('.oracle-card').forEach(card => {
        card.addEventListener('click', () => {
            const target = card.getAttribute('data-target');
            if (target) openModule(target);
        });
    });

    document.querySelectorAll('.btn-close-module').forEach(btn => {
        btn.addEventListener('click', closeModule);
    });

    document.getElementById('btn-return-hub')?.addEventListener('click', () => {
        window.location.href = 'hub.html';
    });
}

function openModule(moduleId) {
    STATE.activeModule = moduleId;
    switchLayer('modules');
    
    document.querySelectorAll('.sub-module-view').forEach(mod => mod.classList.add('hidden'));
    
    const target = document.getElementById(moduleId);
    if(target) target.classList.remove('hidden');

    const titles = {
        'module-astral': 'I. Astral Sync',
        'module-familiar': 'II. The Familiar',
        'module-panopticon': 'III. The Panopticon',
        'module-chronos': 'IV. Chronos Mapping',
        'module-ramanujan': 'V. Ramanujan\'s Gamble',
        'module-dirac': 'VI. Dirac Entanglement',
        'module-halflife': 'VII. Atomic Half-Life',
        'module-gematria': 'VIII. Gematria Cipher',
        'module-aura': 'IX. Aura Scry',
        'module-sync': 'X. Synchronicity Gate'
    };
    DOM.ui.moduleTitle.innerText = titles[moduleId] || 'Unknown Vector';

    switch(moduleId) {
        case 'module-astral': initAstralSync(); break;
        case 'module-familiar': initFamiliar(); break;
        case 'module-panopticon': initPanopticon(); break;
        case 'module-chronos': initChronos(); break;
        case 'module-ramanujan': initRamanujan(); break;
        case 'module-dirac': initDirac(); break;
        case 'module-halflife': initHalfLife(); break;
        case 'module-gematria': initGematria(); break;
        case 'module-aura': initAura(); break;
        case 'module-sync': initSync(); break;
    }
}

function closeModule() {
    STATE.activeModule = null;
    
    // Cleanup Routines
    Object.keys(STATE.intervals).forEach(k => clearInterval(STATE.intervals[k]));
    Object.keys(STATE.animFrames).forEach(k => cancelAnimationFrame(STATE.animFrames[k]));
    
    if (STATE.mediaStream) {
        STATE.mediaStream.getTracks().forEach(track => track.stop());
        STATE.mediaStream = null;
    }

    switchLayer('dashboard');
}

// ==========================================
// 6. MODULE I: ASTRAL SYNC
// ==========================================
const ZODIACS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const VIBES = ["Kinetic", "Stagnant", "Resonant", "Chaotic", "Lucid"];
const STATICS = ["High Friction", "Null Void", "Magnetic", "Repulsive"];
const AXES = ["Inward (Self)", "Outward (Creation)", "Upward (Ascension)", "Downward (Grounding)"];

function initAstralSync() {
    const container = document.getElementById('zodiac-wheel-container');
    const output = document.getElementById('zodiac-output');
    container.innerHTML = '';
    output.classList.add('hidden');

    const radius = 120;
    const center = 150;

    ZODIACS.forEach((sign, index) => {
        const angle = (index / 12) * Math.PI * 2;
        const x = center + radius * Math.cos(angle) - 20;
        const y = center + radius * Math.sin(angle) - 20;

        const node = document.createElement('div');
        node.className = 'zodiac-sign-node';
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        node.innerText = sign.substring(0,3).toUpperCase();
        
        node.onclick = () => {
            document.querySelectorAll('.zodiac-sign-node').forEach(n => n.style.background = 'var(--bg-void-dark)');
            node.style.background = 'var(--accent-purple)';
            
            // Deterministic daily pseudo-random based on sign + date
            const dateStr = new Date().toDateString();
            const seed = hashString(sign + dateStr);
            
            document.getElementById('zodiac-sign-title').innerText = sign.toUpperCase();
            document.getElementById('zodiac-vibe').innerText = VIBES[seed % VIBES.length];
            document.getElementById('zodiac-static').innerText = STATICS[(seed >> 2) % STATICS.length];
            document.getElementById('zodiac-axis').innerText = AXES[(seed >> 4) % AXES.length];
            
            output.classList.remove('hidden');
        };
        container.appendChild(node);
    });
}

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

// ==========================================
// 7. MODULE II: THE FAMILIAR (Anime Nexus)
// ==========================================
function initFamiliar() {
    document.querySelectorAll('.familiar-tab').forEach(tab => {
        tab.onclick = (e) => {
            document.querySelectorAll('.familiar-tab').forEach(t => t.classList.remove('active', 'text-cyan'));
            e.target.classList.add('active', 'text-cyan');
            
            document.querySelectorAll('.fam-view').forEach(v => v.classList.add('hidden'));
            document.getElementById(e.target.getAttribute('data-target')).classList.remove('hidden');
        };
    });

    // Sub-Module: Portal (Jikan API)
    document.getElementById('btn-scry-entity').onclick = async () => {
        const input = document.getElementById('anime-search-input').value.trim();
        const out = document.getElementById('anime-data-output');
        if(!input) return;
        
        out.innerHTML = '<p class="text-cyan font-terminal">Pinging MyAnimeList Database...</p>';
        try {
            const res = await fetch(`https://api.jikan.moe/v4/characters?q=${encodeURIComponent(input)}&limit=1`);
            const data = await res.json();
            
            if(!data.data || data.data.length === 0) {
                out.innerHTML = '<p class="text-danger font-terminal">Entity not found in the collective unconscious.</p>';
                return;
            }
            
            const char = data.data[0];
            out.innerHTML = `
                <div class="glass-panel p-20 bg-void border-cyan flex-row gap-20">
                    <img src="${char.images.jpg.image_url}" class="border-radius-8 border-glass" style="width:100px; height:150px; object-fit:cover;">
                    <div>
                        <h3 class="text-cyan font-terminal text-xl mb-10">${char.name}</h3>
                        <p class="text-muted text-xs font-terminal line-height-1-5" style="max-height: 100px; overflow-y: auto;">
                            ${char.about ? char.about.replace(/\n/g, '<br>') : 'Classified Lore.'}
                        </p>
                    </div>
                </div>
            `;
        } catch(e) {
            out.innerHTML = '<p class="text-danger font-terminal">API Rate Limit Exceeded. The void is closed.</p>';
        }
    };

    // Sub-Module: Manifest
    document.getElementById('btn-draw-card').onclick = async () => {
        const img = document.getElementById('drawn-card-img');
        const overlay = document.querySelector('.glitch-overlay');
        const btnShare = document.getElementById('btn-share-card');
        
        overlay.classList.remove('hidden');
        
        // Fetch random Pokemon TCG Card
        try {
            // Using page randomization to get a random card
            const randomPage = Math.floor(Math.random() * 250) + 1; 
            const res = await fetch(`https://api.pokemontcg.io/v2/cards?page=${randomPage}&pageSize=1`);
            const data = await res.json();
            
            const card = data.data[0];
            img.src = card.images.large;
            img.onload = () => {
                overlay.classList.add('hidden');
                img.classList.remove('hidden');
                btnShare.classList.remove('hidden');
            };
        } catch(e) {
            overlay.innerHTML = '<span class="text-danger">CONNECTION FAILED</span>';
        }
    };
}

// ==========================================
// 8. MODULE III: THE PANOPTICON
// ==========================================
function initPanopticon() {
    const skyOut = document.getElementById('sky-output');
    const earthOut = document.getElementById('earth-output');
    const iceOut = document.getElementById('ice-output');
    const borderOut = document.getElementById('border-output');

    document.getElementById('btn-ping-sky').onclick = async () => {
        skyOut.innerHTML = 'Scanning vectors...';
        try {
            // Calculate a 2-degree bounding box around user's location
            const latMin = (STATE.geoCoords.lat - 1).toFixed(2);
            const latMax = (STATE.geoCoords.lat + 1).toFixed(2);
            const lonMin = (STATE.geoCoords.lon - 1).toFixed(2);
            const lonMax = (STATE.geoCoords.lon + 1).toFixed(2);
            
            const res = await fetch(`https://opensky-network.org/api/states/all?lamin=${latMin}&lomin=${lonMin}&lamax=${latMax}&lomax=${lonMax}`);
            const data = await res.json();
            
            if(!data.states || data.states.length === 0) {
                skyOut.innerHTML = '<span class="text-muted">Airspace vacant in your grid.</span>';
                return;
            }
            const flight = data.states[0]; // Pick closest/first
            skyOut.innerHTML = `
                <div class="text-cyan">Callsign: ${flight[1] || 'UNKNOWN'}</div>
                <div class="text-muted">Velocity: ${flight[9] ? (flight[9]*3.6).toFixed(0) : '0'} km/h</div>
                <div class="text-muted">Altitude: ${flight[7] || 0} m</div>
            `;
        } catch(e) {
            skyOut.innerHTML = '<span class="text-danger">OpenSky API Locked.</span>';
        }
    };

    document.getElementById('btn-ping-earth').onclick = async () => {
        earthOut.innerHTML = 'Scanning crust...';
        try {
            const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson');
            const data = await res.json();
            if(data.features.length === 0) {
                earthOut.innerHTML = '<span class="text-matrix">Tectonic silence globally.</span>';
                return;
            }
            const quake = data.features[0];
            earthOut.innerHTML = `
                <div class="text-danger">Mag: ${quake.properties.mag}</div>
                <div class="text-muted">Loc: ${quake.properties.place}</div>
            `;
        } catch(e) {
            earthOut.innerHTML = '<span class="text-danger">USGS Severed.</span>';
        }
    };

    document.getElementById('btn-ping-border').onclick = async () => {
        borderOut.innerHTML = 'Decypting geology...';
        try {
            const res = await fetch('https://restcountries.com/v3.1/all');
            const data = await res.json();
            const country = data[Math.floor(Math.random() * data.length)];
            borderOut.innerHTML = `
                <div class="text-gold">Entity: ${country.name.common}</div>
                <div class="text-muted">Capital: ${country.capital ? country.capital[0] : 'None'}</div>
                <div class="text-muted">Pop: ${country.population.toLocaleString()}</div>
            `;
        } catch(e) {
            borderOut.innerHTML = '<span class="text-danger">RestCountries Severed.</span>';
        }
    };
    
    document.getElementById('btn-ping-ice').onclick = () => {
        // NSIDC doesn't have a simple public JSON endpoint without auth/complex queries.
        // We simulate the deterministic decay math for the UI payload.
        iceOut.innerHTML = `
            <div class="text-cyan">Glacial Index: Offline</div>
            <div class="text-muted">Simulated Mass Loss: ${(Math.random() * 5 + 250).toFixed(2)} Gt/yr</div>
        `;
    };
}

// ==========================================
// 9. MODULE IV: CHRONOS (Biorhythm Math)
// ==========================================
function initChronos() {
    const canvas = document.getElementById('chronos-canvas');
    const ctx = canvas.getContext('2d');
    const warning = document.getElementById('chronos-warning');

    document.getElementById('btn-plot-chronos').onclick = () => {
        const dobInput = document.getElementById('chronos-dob').value;
        if(!dobInput) return showToast("Birth parameter required.", "danger");

        const dob = new Date(dobInput);
        const now = new Date();
        const diffTime = Math.abs(now - dob);
        const daysLived = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw Center Line
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.stroke();

        let criticalTroughs = 0;

        const drawWave = (period, color) => {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;

            for(let i = 0; i <= canvas.width; i++) {
                // Map x pixel to a day offset (showing -15 days to +15 days)
                const dayOffset = (i / canvas.width) * 30 - 15;
                const t = daysLived + dayOffset;
                
                // y(t) = sin(2 * PI * t / P)
                const yVal = Math.sin((2 * Math.PI * t) / period);
                
                // Convert y (-1 to 1) to canvas height
                const y = (canvas.height / 2) - (yVal * (canvas.height / 2 - 20));
                
                if(i === 0) ctx.moveTo(i, y);
                else ctx.lineTo(i, y);

                // Check center line (current day) for critical troughs
                if(i === canvas.width / 2 && yVal < -0.8) criticalTroughs++;
            }
            ctx.stroke();
        };

        drawWave(23, '#ff0055'); // Physical
        drawWave(28, '#00e5ff'); // Emotional
        drawWave(33, '#ffd700'); // Intellectual

        if(criticalTroughs >= 2) warning.classList.remove('hidden');
        else warning.classList.add('hidden');
    };
}

// ==========================================
// 10. MODULE V: RAMANUJAN'S GAMBLE
// ==========================================
function initRamanujan() {
    const stakeDisplay = document.getElementById('ramanujan-stake');
    const depthDisplay = document.getElementById('ramanujan-depth');
    const btnStake = document.getElementById('btn-ram-stake');
    const btnPull = document.getElementById('btn-ram-pull');
    
    let currentStake = 0;
    let iterations = 0;
    let sequenceActive = false;

    // Reset UI
    stakeDisplay.innerText = 0;
    depthDisplay.innerText = 0;
    btnStake.innerText = "Initiate Sequence (-10 EC)";

    btnStake.onclick = () => {
        if(!sequenceActive) {
            // Start new sequence
            if(STATE.entropyCredits < 10 && !STATE.isGodMode) return showToast("Insufficient Entropy.", "danger");
            updateBalance(-10);
            currentStake = 10;
            iterations = 1;
            sequenceActive = true;
            btnStake.innerText = "Push Sequence (Compound)";
            btnPull.classList.remove('disabled');
        } else {
            // Push Mock Theta calculation
            // Simplified risk algorithm simulating infinite series divergence
            iterations++;
            const collapseProbability = 0.1 * Math.pow(1.5, iterations - 1);
            
            if(Math.random() < collapseProbability && !STATE.isGodMode) {
                // Sequence Collapses
                showToast(`Sequence Diverged at depth ${iterations}. Void consumes ${currentStake} EC.`, "danger");
                resetGamble();
            } else {
                // Sequence Compounds
                currentStake = Math.floor(currentStake * 1.618); // Golden ratio multiplier
            }
        }
        
        stakeDisplay.innerText = currentStake;
        depthDisplay.innerText = iterations;
    };

    btnPull.onclick = () => {
        if(!sequenceActive) return;
        updateBalance(currentStake);
        showToast(`Extracted ${currentStake} EC.`, "gold");
        resetGamble();
    };

    function resetGamble() {
        sequenceActive = false;
        currentStake = 0;
        iterations = 0;
        stakeDisplay.innerText = 0;
        depthDisplay.innerText = 0;
        btnStake.innerText = "Initiate Sequence (-10 EC)";
        btnPull.classList.add('disabled');
    }
}

// ==========================================
// 11. MODULE VI: DIRAC ENTANGLEMENT
// ==========================================
function initDirac() {
    document.getElementById('btn-dirac-calc').onclick = () => {
        const a = document.getElementById('dirac-val-a').value.trim();
        const b = document.getElementById('dirac-val-b').value.trim();
        const result = document.getElementById('dirac-result');
        const prob = document.getElementById('dirac-prob');

        if(!a || !b) return showToast("Both variables required for function.", "danger");

        // Deterministic hash of both strings
        const combined = (a < b ? a + b : b + a).toLowerCase();
        let hash = 0;
        for (let i = 0; i < combined.length; i++) {
            const char = combined.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }

        // Map hash to a percentage between 0.00 and 99.99
        const percentage = (Math.abs(hash) % 10000) / 100;
        
        prob.innerText = `${percentage.toFixed(2)}%`;
        result.classList.remove('hidden');
    };
}

// ==========================================
// 12. MODULE VII: HALF-LIFE
// ==========================================
function initHalfLife() {
    const input = document.getElementById('halflife-input');
    const outZone = document.getElementById('decay-output-zone');
    const btn = document.getElementById('btn-trigger-decay');

    btn.onclick = () => {
        const text = input.value.trim();
        if(!text) return;
        
        input.value = '';
        outZone.innerHTML = '';
        outZone.classList.remove('hidden');
        
        // Wrap each character in a span
        for(let i=0; i<text.length; i++) {
            const span = document.createElement('span');
            span.className = 'isotope-char';
            span.innerText = text[i];
            outZone.appendChild(span);
        }

        const chars = document.querySelectorAll('.isotope-char');
        let remaining = chars.length;
        const lambda = 0.1; // Decay constant

        if(STATE.intervals.halfLife) clearInterval(STATE.intervals.halfLife);

        STATE.intervals.halfLife = setInterval(() => {
            if(remaining <= 0) {
                clearInterval(STATE.intervals.halfLife);
                setTimeout(() => outZone.classList.add('hidden'), 2000);
                return;
            }

            chars.forEach(char => {
                if(!char.classList.contains('decayed')) {
                    // N(t) = N0 * e^(-lambda * t) simulation per frame
                    if(Math.random() < lambda) {
                        char.classList.add('decayed');
                        remaining--;
                    }
                }
            });
        }, 300); // Step every 300ms
    };
}

// ==========================================
// 13. MODULE VIII: GEMATRIA CIPHER
// ==========================================
function initGematria() {
    document.getElementById('btn-gematria-solve').onclick = () => {
        let text = document.getElementById('gematria-input').value.trim().toUpperCase();
        if(!text) return;

        text = text.replace(/[^A-Z]/g, ''); // Strip non-letters
        let sum = 0;
        for(let i=0; i<text.length; i++) {
            sum += (text.charCodeAt(i) - 64); // A=1, B=2...
        }

        // Reduce to single digit or master number
        while(sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
            let temp = 0;
            let str = sum.toString();
            for(let j=0; j<str.length; j++) temp += parseInt(str[j]);
            sum = temp;
        }

        const descs = {
            1: "The Monad. Absolute origination. Leadership, isolation, pure kinetic energy.",
            2: "The Dyad. Duality. Balance, reflection, inner conflict.",
            3: "The Triad. Synthesis. Creation, expression, chaos structured.",
            4: "The Tetrad. Materiality. Foundation, rigidity, earthly borders.",
            5: "The Pentad. Motion. Instability, sensory overload, adaptation.",
            6: "The Hexad. Equilibrium. Harmony, responsibility, static symmetry.",
            7: "The Heptad. The Void. Seeking, philosophy, isolation from the material.",
            8: "The Ogdoad. Infinity. Power, cycles, karmic loops.",
            9: "The Ennead. Completion. The end of the cycle, dissolution.",
            11: "Master Number. Illumination. High frequency intuition, nervous energy.",
            22: "Master Number. The Architect. Manifestation of abstract into physical.",
            33: "Master Number. The Catalyst. Pure altruistic sacrifice."
        };

        document.getElementById('gematria-number').innerText = sum;
        document.getElementById('gematria-desc').innerText = descs[sum] || "Anomalous Resonance.";
        document.getElementById('gematria-result').classList.remove('hidden');
    };
}

// ==========================================
// 14. MODULE IX: AURA SCRY (WebGL Mirror)
// ==========================================
function initAura() {
    const video = document.getElementById('aura-video');
    const canvas = document.getElementById('aura-canvas-hidden');
    const ctx = canvas.getContext('2d');
    const outHex = document.getElementById('aura-hex-output');
    const btnStart = document.getElementById('btn-start-aura');
    const btnCap = document.getElementById('btn-capture-aura');

    btnStart.onclick = async () => {
        try {
            STATE.mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            video.srcObject = STATE.mediaStream;
            video.classList.remove('hidden');
            btnStart.classList.add('hidden');
            btnCap.classList.remove('disabled');
        } catch(e) {
            showToast("Camera optics denied.", "danger");
        }
    };

    btnCap.onclick = () => {
        if(!STATE.mediaStream) return;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Sample center pixel block (10x10)
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const frame = ctx.getImageData(cx - 5, cy - 5, 10, 10);
        
        let r=0, g=0, b=0;
        for(let i=0; i<frame.data.length; i+=4) {
            r += frame.data[i];
            g += frame.data[i+1];
            b += frame.data[i+2];
        }
        
        const count = frame.data.length / 4;
        r = Math.floor(r/count); g = Math.floor(g/count); b = Math.floor(b/count);
        
        // Apply algorithmic manipulation to simulate the CSS filter effect
        r = 255 - r; // Simulate invert
        g = Math.min(255, g * 1.5); // Contrast bump
        
        const hex = "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
        outHex.innerText = hex;
        outHex.style.color = hex;
        outHex.style.textShadow = `0 0 20px ${hex}`;
    };
}

// ==========================================
// 15. MODULE X: SYNCHRONICITY GATE
// ==========================================
function initSync() {
    const timeDisplay = document.getElementById('sync-current-time');
    const btnBreach = document.getElementById('btn-sync-breach');
    
    if(STATE.intervals.sync) clearInterval(STATE.intervals.sync);

    STATE.intervals.sync = setInterval(() => {
        const now = new Date();
        const h = now.getHours().toString().padStart(2, '0');
        const m = now.getMinutes().toString().padStart(2, '0');
        const s = now.getSeconds().toString().padStart(2, '0');
        
        timeDisplay.innerText = `${h}:${m}:${s}`;

        // Check for specific deterministic alignments (e.g., 11:11, 22:22, 00:00)
        const isAligned = (h === m) || (h === '03' && m === '33') || (h === '12' && m === '34');

        if(isAligned || STATE.isGodMode) {
            timeDisplay.classList.add('sync-unlocked');
            btnBreach.classList.remove('disabled');
            btnBreach.innerText = "BREACH THE GATE";
            btnBreach.style.borderColor = "var(--accent-white)";
            btnBreach.style.color = "var(--accent-white)";
        } else {
            timeDisplay.classList.remove('sync-unlocked');
            btnBreach.classList.add('disabled');
            btnBreach.innerText = "GATE LOCKED";
            btnBreach.style.borderColor = "var(--glass-border)";
            btnBreach.style.color = "var(--text-muted)";
        }
    }, 1000);

    btnBreach.onclick = () => {
        showToast("Artifact extracted from the timeline. Balance +500 EC.", "white");
        updateBalance(500);
        btnBreach.classList.add('disabled');
        btnBreach.innerText = "GATE DEPLETED";
    };
}

// ==========================================
// 16. EXECUTE PROTOCOL
// ==========================================
document.addEventListener('DOMContentLoaded', initOracleEngine);