// ── Grid Size Control ────────────────────────────────────────────────────────
// Injects +/− buttons into .grid-size-panel and lets users resize the game grid.
// Works for add.html, mul.html, and distance.html.

(function () {
    const STEP = 50;
    const MIN  = 200;
    const MAX  = 900;

    const game = document.querySelector('.game');
    if (!game) return;

    // Read initial size from CSS (default 500)
    let currentSize = parseInt(getComputedStyle(game).width) || 500;
    currentSize = Math.round(currentSize / STEP) * STEP; // snap to step

    function applySize(size) {
        currentSize = Math.max(MIN, Math.min(MAX, size));
        game.style.width  = currentSize + 'px';
        game.style.height = currentSize + 'px';
        const label = document.getElementById('size-label');
        if (label) label.textContent = currentSize + ' px';
    }

    // Inject panel HTML if the placeholder div exists
    const panel = document.querySelector('.grid-size-panel');
    if (panel && !panel.querySelector('.size-slider-row')) {
        panel.innerHTML = `
            <h2>Grid Size</h2>
            <div class="size-slider-row">
                <button class="size-btn" id="size-down">−</button>
                <span id="size-label">${currentSize} px</span>
                <button class="size-btn" id="size-up">+</button>
            </div>`;
    }

    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
        .grid-size-panel {
            font-size: 12px;
            border: 2px solid #111;
            padding: 16px;
            background: white;
        }
        .grid-size-panel h2 {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 10px;
        }
        .size-slider-row {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .size-btn {
            width: 32px;
            height: 32px;
            border: 2px solid #111;
            border-radius: 4px;
            background: #fee6e3;
            font-size: 18px;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
            transition: background 0.15s;
            flex: 0 0 auto;
            /* override index.css button styles */
            padding: 0;
            height: 32px;
        }
        .size-btn:hover { background: #fdd5d0; }
        .size-btn::after { display: none !important; }
        #size-label {
            font-family: "Roboto Mono", monospace;
            font-size: 12px;
            color: #555;
            min-width: 56px;
            text-align: center;
        }
    `;
    document.head.appendChild(style);

    // Wire up buttons
    document.addEventListener('click', function (e) {
        if (e.target.id === 'size-up')   applySize(currentSize + STEP);
        if (e.target.id === 'size-down') applySize(currentSize - STEP);
    });

    // Set initial label
    applySize(currentSize);
})();