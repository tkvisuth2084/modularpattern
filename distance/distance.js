// ── distance.js  ─  floor(sqrt(x²+y²)) % 4  ─────────────────────────────────
// 4 remainders (0-3) → 4 image classes per cell

const SLOT_FILES = {
    0: ['0','4','a','e','i','m','q','u'],
    1: ['1','5','b','f','j','n','r','v'],
    2: ['2','6','c','g','k','o','s','w'],
    3: ['3','7','d','h','l','p','t','x'],
};

// Keys for remainder 0: 1,5,a,e,i,m,q,u
// Keys for remainder 1: 2,6,b,f,j,n,r,v
// Keys for remainder 2: 3,7,c,g,k,o,s,w
// Keys for remainder 3: 4,8,d,h,l,p,t,x
const KEY_TO_REM = {
    '1':0,'5':0,'a':0,'e':0,'i':0,'m':0,'q':0,'u':0,
    '2':1,'6':1,'b':1,'f':1,'j':1,'n':1,'r':1,'v':1,
    '3':2,'7':2,'c':2,'g':2,'k':2,'o':2,'s':2,'w':2,
    '4':3,'8':3,'d':3,'h':3,'l':3,'p':3,'t':3,'x':3,
};

const KEY_TO_SLOT = {
    '1':0,'5':1,'a':2,'e':3,'i':4,'m':5,'q':6,'u':7,
    '2':0,'6':1,'b':2,'f':3,'j':4,'n':5,'r':6,'v':7,
    '3':0,'7':1,'c':2,'g':3,'k':4,'o':5,'s':6,'w':7,
    '4':0,'8':1,'d':2,'h':3,'l':4,'p':5,'t':6,'x':7,
};

let gridSize = 6;
const visibleSlot = { 0: -1, 1: -1, 2: -1, 3: -1 };

function calcRem(x, y) {
    return Math.floor(Math.sqrt(x * x + y * y)) % 4;
}

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
            const rem = calcRem(x, y);

            const cell = document.createElement('div');
            cell.className = 'game-cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.dataset.rem = rem;

            // Only add slots that exist for this remainder
            const files = SLOT_FILES[rem] || [];
            files.forEach((file, slotIdx) => {
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
    const dist = Math.sqrt(x*x + y*y);
    const hasVisible = Array.from(cell.querySelectorAll('img'))
        .some(img => !img.classList.contains('hide'));
    if (hasVisible) {
        cell.querySelector('.cell-mathBehind').classList.add('visible');
        infoCalc.textContent  = `√(${x}²+${y}²) = ${dist.toFixed(2)} / 4 = ${Math.floor(dist/4)} R ${Math.floor(dist)%4}`;
        infoCalc2.textContent = `Remainder = ${Math.floor(dist)%4}`;
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
        a.download = 'distance-pattern.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
    });
});

buildGrid(6);


