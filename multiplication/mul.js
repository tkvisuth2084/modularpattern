// ── mul.js  ─  (x * y) % 3  ─────────────────────────────────────────────────

const SLOT_FILES = {
    0: ['0','4','a','e','i','m','q'],
    1: ['1','5','b','f','j','n','r'],
    2: ['2','6','c','g','k','o','s'],
};

const KEY_TO_SLOT = {
    '0':0, '3':1, 'a':2, 'd':3, 'g':4, 'j':5, 'm':6,
    '1':0, '4':1, 'b':2, 'e':3, 'h':4, 'k':5, 'n':6,
    '2':0, '5':1, 'c':2, 'f':3, 'i':4, 'l':5, 'o':6,
};

const KEY_TO_REM = {
    '0':0,'3':0,'a':0,'d':0,'g':0,'j':0,'m':0,
    '1':1,'4':1,'b':1,'e':1,'h':1,'k':1,'n':1,
    '2':2,'5':2,'c':2,'f':2,'i':2,'l':2,'o':2,
};

let gridSize = 6;
const visibleSlot = { 0: -1, 1: -1, 2: -1 };

function buildGrid(n) {
    gridSize = n;
    const game = document.querySelector('.game');
    game.innerHTML = '';
    game.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
    game.style.gridTemplateRows    = `repeat(${n}, 1fr)`;

    for (let row = 0; row < n; row++) {
        const y = n - row;
        for (let col = 0; col < n; col++) {
            const x = col + 1;
            const rem = (x * y) % 3;

            const cell = document.createElement('div');
            cell.className = 'game-cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.dataset.rem = rem;

            SLOT_FILES[rem].forEach((file, slotIdx) => {
                const img = document.createElement('img');
                img.src = `../src/${file}.png`;
                img.dataset.rem  = rem;
                img.dataset.slot = slotIdx;
                if (visibleSlot[rem] !== slotIdx) img.classList.add('hide');
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
}

const infoCalc  = document.querySelector('.info-calc');
const infoCalc2 = document.querySelector('.info-calc2');

function onCellEnter(e) {
    const cell = e.currentTarget;
    const x = +cell.dataset.x, y = +cell.dataset.y;
    const hasVisible = Array.from(cell.querySelectorAll('img'))
        .some(img => !img.classList.contains('hide'));
    if (hasVisible) {
        cell.querySelector('.cell-mathBehind').classList.add('visible');
        infoCalc.textContent  = `(${x} × ${y}) / 3 = ${Math.floor((x*y)/3)} R ${(x*y)%3}`;
        infoCalc2.textContent = `Remainder = ${(x*y)%3}`;
    }
}
function onCellLeave(e) {
    e.currentTarget.querySelector('.cell-mathBehind').classList.remove('visible');
}

document.addEventListener('keydown', function(e) {
    const key = e.key.toLowerCase();
    if (!(key in KEY_TO_REM)) return;

    const rem  = KEY_TO_REM[key];
    const slot = KEY_TO_SLOT[key];
    const alreadyVisible = (visibleSlot[rem] === slot);
    visibleSlot[rem] = alreadyVisible ? -1 : slot;

    document.querySelectorAll(`.game-cell[data-rem="${rem}"] img[data-rem="${rem}"]`)
        .forEach(img => {
            img.classList.toggle('hide', +img.dataset.slot !== visibleSlot[rem]);
        });
});

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

document.getElementById('download-btn').addEventListener('click', () => {
    html2canvas(document.querySelector('.game')).then(canvas => {
        const a = document.createElement('a');
        a.download = 'mul-pattern.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
    });
});

buildGrid(6);