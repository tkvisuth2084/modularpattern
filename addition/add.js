// ── add.js  ─  (x + y) % 3  ─────────────────────────────────────────────────
// Slots 0-6: original .png shapes
// Slots 7-9: Thai fabric .jpg images (keys p/q/r, s/t/u, v/w/x)

const SLOT_FILES = {
    0: ['0','4','a','e','i','m','q',           // original (png)
        'thaifabric/0','thaifabric/4','thaifabric/a','thaifabric/3'],  // Thai (jpg)
    1: ['1','5','b','f','j','n','r',
        'thaifabric/1','thaifabric/5','thaifabric/b','thaifabric/7'],
    2: ['2','6','c','g','k','o','s',
        'thaifabric/2','thaifabric/6','thaifabric/c','thaifabric/d'],
};

const SLOT_EXT = (slot) => slot < 7 ? 'png' : 'jpg';

const KEY_TO_SLOT = {
    '0':0,'3':1,'a':2,'d':3,'g':4,'j':5,'m':6, 'p':7,'q':8,'r':9,'y':10,
    '1':0,'4':1,'b':2,'e':3,'h':4,'k':5,'n':6, 's':7,'t':8,'u':9,'z':10,
    '2':0,'5':1,'c':2,'f':3,'i':4,'l':5,'o':6, 'v':7,'w':8,'x':9,'*':10,
};
const KEY_TO_REM = {
    '0':0,'3':0,'a':0,'d':0,'g':0,'j':0,'m':0,'p':0,'q':0,'r':0,'y':0,
    '1':1,'4':1,'b':1,'e':1,'h':1,'k':1,'n':1,'s':1,'t':1,'u':1,'z':1,
    '2':2,'5':2,'c':2,'f':2,'i':2,'l':2,'o':2,'v':2,'w':2,'x':2,'*':2,
};

window.visibleSlot = { 0: -1, 1: -1, 2: -1 };
let gridSize = 6;

const undoStack = [];
function pushUndo() { undoStack.push({ ...window.visibleSlot }); if (undoStack.length > 50) undoStack.shift(); }
function undo() {
    if (!undoStack.length) return;
    const prev = undoStack.pop();
    [0,1,2].forEach(rem => {
        window.visibleSlot[rem] = prev[rem];
        document.querySelectorAll(`.game-cell[data-rem="${rem}"] img[data-rem="${rem}"]`)
            .forEach(img => img.classList.toggle('hide', +img.dataset.slot !== window.visibleSlot[rem]));
    });
}

window.buildGrid = function(n) {
    gridSize = n;
    const game = document.querySelector('.game');
    game.innerHTML = '';
    game.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
    game.style.gridTemplateRows    = `repeat(${n}, 1fr)`;
    for (let row = 0; row < n; row++) {
        const y = n - row;
        for (let col = 0; col < n; col++) {
            const x = col + 1;
            const rem = (x + y) % 3;
            const cell = document.createElement('div');
            cell.className = 'game-cell';
            cell.dataset.x = x; cell.dataset.y = y; cell.dataset.rem = rem;
            SLOT_FILES[rem].forEach((file, si) => {
                const img = document.createElement('img');
                img.src = `../src/${file}.${SLOT_EXT(si)}`;
                img.dataset.rem = rem; img.dataset.slot = si;
                if (window.visibleSlot[rem] !== si) img.classList.add('hide');
                cell.appendChild(img);
            });
            const tip = document.createElement('div');
            tip.className = 'cell-mathBehind';
            tip.textContent = `(${x},${y})`;
            cell.appendChild(tip);
            cell.addEventListener('mouseenter', onCellEnter);
            cell.addEventListener('mouseleave', onCellLeave);
            game.appendChild(cell);
        }
    }
    applyGridColor(currentGridColor);
    updateSizeLabel();
};

const infoCalc  = document.querySelector('.info-calc');
const infoCalc2 = document.querySelector('.info-calc2');
function onCellEnter(e) {
    const cell = e.currentTarget;
    const x = +cell.dataset.x, y = +cell.dataset.y;
    if (Array.from(cell.querySelectorAll('img')).some(i => !i.classList.contains('hide'))) {
        cell.querySelector('.cell-mathBehind').classList.add('visible');
        infoCalc.textContent  = `(${x} + ${y}) / 3 = ${Math.floor((x+y)/3)} R ${(x+y)%3}`;
        infoCalc2.textContent = `Remainder = ${(x+y)%3}`;
    }
}
function onCellLeave(e) { e.currentTarget.querySelector('.cell-mathBehind').classList.remove('visible'); }

document.addEventListener('keydown', function(e) {
    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); undo(); return; }
    const key = e.key.toLowerCase();
    if (!(key in KEY_TO_REM)) return;
    pushUndo();
    const rem = KEY_TO_REM[key], slot = KEY_TO_SLOT[key];
    window.visibleSlot[rem] = (window.visibleSlot[rem] === slot) ? -1 : slot;
    document.querySelectorAll(`.game-cell[data-rem="${rem}"] img[data-rem="${rem}"]`)
        .forEach(img => img.classList.toggle('hide', +img.dataset.slot !== window.visibleSlot[rem]));
});

function updateSizeLabel() { const l = document.getElementById('size-label'); if (l) l.textContent = `${gridSize} × ${gridSize}`; }
document.getElementById('size-down').addEventListener('click', () => { if (gridSize > 4) window.buildGrid(gridSize - 1); });
document.getElementById('size-up').addEventListener('click',   () => { if (gridSize < 15) window.buildGrid(gridSize + 1); });

let currentGridColor = '#cccccc';
function applyGridColor(color) {
    currentGridColor = color;
    document.querySelector('.game').style.borderColor = color;
    document.querySelectorAll('.game-cell').forEach(c => c.style.borderColor = color);
}
document.querySelectorAll('.swatch').forEach(s => s.addEventListener('click', () => {
    document.querySelectorAll('.swatch').forEach(x => x.classList.remove('active'));
    s.classList.add('active');
    document.getElementById('custom-color').value = s.dataset.color;
    applyGridColor(s.dataset.color);
}));
document.getElementById('custom-color').addEventListener('input', e => {
    document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    applyGridColor(e.target.value);
});

document.getElementById('download-btn').addEventListener('click', () => {
    html2canvas(document.querySelector('.game'), { scale: 3 }).then(canvas => {
        const a = document.createElement('a');
        a.download = 'add-pattern.png'; a.href = canvas.toDataURL('image/png'); a.click();
    });
});

window.buildGrid(6);