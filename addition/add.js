// ── add.js  ─  (x + y) % 3  ─────────────────────────────────────────────────
// Dynamically builds the grid for any size N (4–15).
// Image sets cycle through 7 "palette slots" as the user assigns images via keys.

// ── Image slot definitions ────────────────────────────────────────────────────
// Each remainder (0, 1, 2) maps to a list of 7 slots.
// Slot index advances each time the user presses a new key.
const SLOT_FILES = {
    0: ['0','4','a','e','i','m','q'],
    1: ['1','5','b','f','j','n','r'],
    2: ['2','6','c','g','k','o','s'],
};

// Key → slot index (cycles 0–6)
const KEY_TO_SLOT = {
    '0':0, '3':1, 'a':2, 'd':3, 'g':4, 'j':5, 'm':6,   // remainder 0
    '1':0, '4':1, 'b':2, 'e':3, 'h':4, 'k':5, 'n':6,   // remainder 1
    '2':0, '5':1, 'c':2, 'f':3, 'i':4, 'l':5, 'o':6,   // remainder 2
};

// Which remainder does each key belong to?
const KEY_TO_REM = {
    '0':0,'3':0,'a':0,'d':0,'g':0,'j':0,'m':0,
    '1':1,'4':1,'b':1,'e':1,'h':1,'k':1,'n':1,
    '2':2,'5':2,'c':2,'f':2,'i':2,'l':2,'o':2,
};

// ── State ─────────────────────────────────────────────────────────────────────
let gridSize = 6;          // current N
const GRID_PX = 500;       // fixed pixel size of the game board

// visibleSlot[rem] = which slot index is currently shown (-1 = none)
const visibleSlot = { 0: -1, 1: -1, 2: -1 };

// ── Build / rebuild the grid ──────────────────────────────────────────────────
function buildGrid(n) {
    gridSize = n;
    const game = document.querySelector('.game');
    game.innerHTML = '';
    game.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
    game.style.gridTemplateRows    = `repeat(${n}, 1fr)`;

    for (let row = 0; row < n; row++) {
        const y = n - row;          // y counts from bottom (1 = bottom row)
        for (let col = 0; col < n; col++) {
            const x = col + 1;
            const rem = (x + y) % 3;

            const cell = document.createElement('div');
            cell.className = 'game-cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.dataset.rem = rem;

            // Build one <img> per slot for this remainder
            SLOT_FILES[rem].forEach((file, slotIdx) => {
                const img = document.createElement('img');
                img.src = `../src/${file}.png`;
                img.dataset.rem  = rem;
                img.dataset.slot = slotIdx;
                // Show only if this slot is currently visible
                if (visibleSlot[rem] !== slotIdx) img.classList.add('hide');
                cell.appendChild(img);
            });

            // Tooltip
            const tip = document.createElement('div');
            tip.className = 'cell-mathBehind';
            tip.textContent = `(${x},${y})`;
            cell.appendChild(tip);

            cell.addEventListener('mouseenter', onCellEnter);
            cell.addEventListener('mouseleave', onCellLeave);

            game.appendChild(cell);
        }
    }

    // Re-apply current grid line colour
    applyGridColor(currentGridColor);
    updateSizeLabel();
}

// ── Cell hover ────────────────────────────────────────────────────────────────
const infoCalc  = document.querySelector('.info-calc');
const infoCalc2 = document.querySelector('.info-calc2');

function onCellEnter(e) {
    const cell = e.currentTarget;
    const x = +cell.dataset.x, y = +cell.dataset.y;
    const hasVisible = Array.from(cell.querySelectorAll('img'))
        .some(img => !img.classList.contains('hide'));
    if (hasVisible) {
        cell.querySelector('.cell-mathBehind').classList.add('visible');
        infoCalc.textContent  = `(${x} + ${y}) / 3 = ${Math.floor((x+y)/3)} R ${(x+y)%3}`;
        infoCalc2.textContent = `Remainder = ${(x+y)%3}`;
    }
}
function onCellLeave(e) {
    e.currentTarget.querySelector('.cell-mathBehind').classList.remove('visible');
}

// ── Key handling ──────────────────────────────────────────────────────────────
document.addEventListener('keydown', function(e) {
    const key = e.key.toLowerCase();
    if (!(key in KEY_TO_REM)) return;

    const rem  = KEY_TO_REM[key];
    const slot = KEY_TO_SLOT[key];

    // Toggle: if this slot is already visible, hide all; otherwise show this slot
    const alreadyVisible = (visibleSlot[rem] === slot);
    visibleSlot[rem] = alreadyVisible ? -1 : slot;

    // Update every cell that has this remainder
    document.querySelectorAll(`.game-cell[data-rem="${rem}"] img[data-rem="${rem}"]`)
        .forEach(img => {
            const s = +img.dataset.slot;
            img.classList.toggle('hide', s !== visibleSlot[rem]);
        });
});

// ── Grid-size control ─────────────────────────────────────────────────────────
function updateSizeLabel() {
    const label = document.getElementById('size-label');
    if (label) label.textContent = `${gridSize} × ${gridSize}`;
}

document.getElementById('size-down').addEventListener('click', () => {
    if (gridSize > 4) buildGrid(gridSize - 1);
});
document.getElementById('size-up').addEventListener('click', () => {
    if (gridSize < 15) buildGrid(gridSize + 1);
});

// ── Grid line colour ──────────────────────────────────────────────────────────
let currentGridColor = '#cccccc';

function applyGridColor(color) {
    currentGridColor = color;
    const game = document.querySelector('.game');
    game.style.borderColor = color;
    document.querySelectorAll('.game-cell').forEach(c => c.style.borderColor = color);
}

document.querySelectorAll('.swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
        document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        const color = swatch.dataset.color;
        document.getElementById('custom-color').value = color;
        applyGridColor(color);
    });
});
document.getElementById('custom-color').addEventListener('input', e => {
    document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    applyGridColor(e.target.value);
});

// ── Download ──────────────────────────────────────────────────────────────────
document.getElementById('download-btn').addEventListener('click', () => {
    html2canvas(document.querySelector('.game')).then(canvas => {
        const a = document.createElement('a');
        a.download = 'add-pattern.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
    });
});

// ── Init ──────────────────────────────────────────────────────────────────────
buildGrid(6);

