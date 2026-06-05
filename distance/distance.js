// ── distance.js  ─  floor(sqrt(x²+y²)) % 4  ─────────────────────────────────
// Slots 0-6: original .png shapes
// Slots 7-9: Thai fabric .jpg images
// Thai keys: rem0=u/v/w, rem1=x/y/z, rem2=0(slot7), rem3=9(slot7)

const SLOT_FILES = {
    0: ['0','4','a','e','i','m','q',
        'thaifabric/0','thaifabric/4','thaifabric/a'],
    1: ['1','5','b','f','j','n','r',
        'thaifabric/1','thaifabric/5','thaifabric/b'],
    2: ['2','6','c','g','k','o','s',
        'thaifabric/2','thaifabric/6','thaifabric/c'],
    3: ['3','7','d','h','l','p','t',
        'thaifabric/3','thaifabric/7','thaifabric/d'],
};

const SLOT_EXT = (slot) => slot < 7 ? 'png' : 'jpg';

const KEY_TO_REM = {
    '1':0,'5':0,'a':0,'e':0,'i':0,'m':0,'q':0, 'u':0,'v':0,'w':0,
    '2':1,'6':1,'b':1,'f':1,'j':1,'n':1,'r':1, 'x':1,'y':1,'z':1,
    '3':2,'7':2,'c':2,'g':2,'k':2,'o':2,'s':2, '0':2,'9':2,'*':2,
    '4':3,'8':3,'d':3,'h':3,'l':3,'p':3,'t':3,'=':3,'+':3,'-':3,
};
const KEY_TO_SLOT = {
    '1':0,'5':1,'a':2,'e':3,'i':4,'m':5,'q':6, 'u':7,'v':8,'w':9,
    '2':0,'6':1,'b':2,'f':3,'j':4,'n':5,'r':6, 'x':7,'y':8,'z':9,
    '3':0,'7':1,'c':2,'g':3,'k':4,'o':5,'s':6, '0':7,'9':8,'*':9,
    '4':0,'8':1,'d':2,'h':3,'l':4,'p':5,'t':6,'=':7,'+':8,'-':9,
};

window.visibleSlot = { 0: -1, 1: -1, 2: -1, 3: -1 };
let gridSize = 6;

const undoStack = [];
function pushUndo() { undoStack.push({ ...window.visibleSlot }); if (undoStack.length > 50) undoStack.shift(); }
function undo() {
    if (!undoStack.length) return;
    const prev = undoStack.pop();
    [0,1,2,3].forEach(rem => {
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
            const rem = Math.floor(Math.sqrt(x*x + y*y)) % 4;
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
    const dist = Math.sqrt(x*x + y*y);
    if (Array.from(cell.querySelectorAll('img')).some(i => !i.classList.contains('hide'))) {
        cell.querySelector('.cell-mathBehind').classList.add('visible');
        infoCalc.textContent  = `√(${x}²+${y}²) = ${dist.toFixed(2)} R ${Math.floor(dist)%4}`;
        infoCalc2.textContent = `Remainder = ${Math.floor(dist)%4}`;
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
        a.download = 'distance-pattern.png'; a.href = canvas.toDataURL('image/png'); a.click();
    });
});

window.buildGrid(6);