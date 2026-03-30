// ── distance-camera.js ────────────────────────────────────────────────────────
// Camera panel on the RIGHT side. 4 remainders (mod 4: 0,1,2,3).
(function () {

    // ── 1. Right panel ────────────────────────────────────────────────────────
    let rightPanel = document.querySelector('.right-panel');
    if (!rightPanel) {
        rightPanel = document.createElement('div');
        rightPanel.className = 'right-panel';
        document.querySelector('.main-row').appendChild(rightPanel);
    }

    const gsp = document.querySelector('.side-panel .grid-size-panel');
    if (gsp) rightPanel.appendChild(gsp);

    // ── 2. Camera panel markup ────────────────────────────────────────────────
    const camPanel = document.createElement('div');
    camPanel.className = 'camera-panel';
    camPanel.innerHTML = `
        <h2 class="cam-heading">Camera Layer</h2>
        <div class="cam-rem-row">
            <span class="cam-label">Remainder</span>
            <div class="cam-rem-btns">
                <button type="button" class="cam-rem-btn cam-rem-active" data-rem="0">R=0</button>
                <button type="button" class="cam-rem-btn" data-rem="1">R=1</button>
                <button type="button" class="cam-rem-btn" data-rem="2">R=2</button>
                <button type="button" class="cam-rem-btn" data-rem="3">R=3</button>
            </div>
        </div>
        <div class="cam-preview">
            <video id="cam-video" autoplay playsinline muted></video>
            <canvas id="cam-canvas" style="display:none"></canvas>
            <img id="cam-snapshot" style="display:none" alt="">
        </div>
        <div class="cam-btns">
            <button type="button" id="cam-open">📷 Open</button>
            <button type="button" id="cam-snap" disabled>Capture</button>
            <button type="button" id="cam-clear" disabled>Clear</button>
        </div>
        <p class="cam-hint">Toggles with same keys as remainder</p>
    `;
    rightPanel.appendChild(camPanel);

    // ── 3. Styles ─────────────────────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
        .right-panel {
            display: flex; flex-direction: column; gap: 12px;
            min-width: 220px; max-width: 240px; padding-top: 8px; flex-shrink: 0;
        }
        .right-panel .grid-size-panel {
            font-size: 12px; border: 2px solid #111; padding: 16px; background: white;
        }
        .right-panel .grid-size-panel h2 {
            font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 10px;
        }
        .camera-panel { background: white; border: 2px solid #111; padding: 14px; font-family: "Roboto Mono", monospace; }
        .cam-heading { font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #888; margin: 0 0 12px; }
        .cam-rem-row { display: flex; flex-direction: column; gap: 5px; margin-bottom: 10px; }
        .cam-label { font-size: 10px; color: #aaa; text-transform: uppercase; letter-spacing: .05em; }
        .cam-rem-btns { display: flex; gap: 4px; }
        .cam-rem-btn {
            all: unset; box-sizing: border-box; flex: 1; height: 28px;
            border-radius: 4px; border: 1px solid #ccc; background: #f5f5f5;
            color: #555; font-size: 10px; font-family: "Roboto Mono", monospace;
            font-weight: 600; cursor: pointer; text-align: center; transition: all .15s;
        }
        .cam-rem-btn:hover { background: #ebebeb; }
        .cam-rem-active { background: #e07060 !important; border-color: #e07060 !important; color: #fff !important; }
        .cam-preview {
            width: 100%; aspect-ratio: 4/3; background: #1a1a1a;
            border-radius: 4px; overflow: hidden; position: relative; margin-bottom: 8px;
        }
        .cam-preview video, .cam-preview img {
            width: 100%; height: 100%; object-fit: cover; display: block; position: absolute; top: 0; left: 0;
        }
        .cam-btns { display: flex; gap: 5px; margin-bottom: 6px; }
        .cam-btns button {
            all: unset; box-sizing: border-box; flex: 1; padding: 6px 2px;
            font-size: 10px; font-family: "Roboto Mono", monospace; font-weight: 600;
            border-radius: 4px; border: 1px solid #ccc; background: #f5f5f5;
            color: #555; cursor: pointer; text-align: center; transition: background .15s;
        }
        .cam-btns button:hover:not(:disabled) { background: #e8e8e8; }
        .cam-btns button:disabled { opacity: .35; cursor: not-allowed; }
        #cam-snap:not(:disabled) { background: #e8f5e9 !important; border-color: #4caf7d !important; color: #2e7d52 !important; }
        #cam-clear:not(:disabled) { background: #fce8e8 !important; border-color: #e07060 !important; color: #c0392b !important; }
        .cam-hint { font-size: 10px; color: #999; margin: 0; text-align: center; line-height: 1.4; font-family: "Roboto Mono", monospace; }
        .cam-layer-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 2; }
        .cam-layer-img.hide { display: none; }
    `;
    document.head.appendChild(style);

    // ── 4. State ──────────────────────────────────────────────────────────────
    let chosenRem = 0, stream = null, capturedDataURL = null;

    // ── 5. Remainder picker ───────────────────────────────────────────────────
    camPanel.querySelectorAll('.cam-rem-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            camPanel.querySelectorAll('.cam-rem-btn').forEach(b => b.classList.remove('cam-rem-active'));
            btn.classList.add('cam-rem-active');
            chosenRem = +btn.dataset.rem;
        });
    });

    // ── 6. Camera controls ────────────────────────────────────────────────────
    const video    = camPanel.querySelector('#cam-video');
    const canvas   = camPanel.querySelector('#cam-canvas');
    const snapshot = camPanel.querySelector('#cam-snapshot');
    const openBtn  = camPanel.querySelector('#cam-open');
    const snapBtn  = camPanel.querySelector('#cam-snap');
    const clearBtn = camPanel.querySelector('#cam-clear');

    openBtn.addEventListener('click', async () => {
        if (stream) { stopCamera(); return; }
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Camera not available. Make sure you are on HTTPS or localhost.');
            return;
        }
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
            video.srcObject = stream;
            video.style.display = 'block';
            snapshot.style.display = 'none';
            openBtn.textContent = '✕ Close';
            snapBtn.disabled = false;
        } catch (err) {
            alert('Could not access camera: ' + err.message);
        }
    });

    snapBtn.addEventListener('click', () => {
        canvas.width  = video.videoWidth  || 320;
        canvas.height = video.videoHeight || 240;
        const ctx = canvas.getContext('2d');
        ctx.translate(canvas.width, 0); ctx.scale(-1, 1); ctx.drawImage(video, 0, 0);
        capturedDataURL = canvas.toDataURL('image/jpeg', 0.85);
        snapshot.src = capturedDataURL;
        snapshot.style.display = 'block';
        video.style.display = 'none';
        stopCamera();
        openBtn.textContent = '📷 Retake';
        snapBtn.disabled = true;
        clearBtn.disabled = false;
        injectIntoGrid();
    });

    clearBtn.addEventListener('click', () => {
        removeFromGrid(); capturedDataURL = null;
        snapshot.src = ''; snapshot.style.display = 'none'; video.style.display = 'block';
        openBtn.textContent = '📷 Open'; snapBtn.disabled = true; clearBtn.disabled = true;
    });

    function stopCamera() {
        if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
        video.srcObject = null;
    }

    // ── 7. Inject into grid ───────────────────────────────────────────────────
    function injectIntoGrid() {
        removeFromGrid();
        // Always show camera images when first injected.
        document.querySelectorAll(`.game-cell[data-rem="${chosenRem}"]`).forEach(cell => {
            const img = document.createElement('img');
            img.src = capturedDataURL;
            img.className = 'cam-layer-img';
            img.dataset.camRem = chosenRem;
            // visible by default — no 'hide' class
            cell.appendChild(img);
        });
    }

    function removeFromGrid() { document.querySelectorAll('.cam-layer-img').forEach(i => i.remove()); }

    // ── 8. Sync visibility with key toggles ───────────────────────────────────
    const remMap = {
        '1':0,'5':0,'a':0,'e':0,'i':0,'m':0,'q':0,
        '2':1,'6':1,'b':1,'f':1,'j':1,'n':1,'r':1,
        '3':2,'7':2,'c':2,'g':2,'k':2,'o':2,'s':2,
        '4':3,'8':3,'d':3,'h':3,'l':3,'p':3,'t':3,
    };
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
            setTimeout(syncAllCamImages, 0); return;
        }
        const rem = remMap[e.key.toLowerCase()];
        if (rem === undefined) return;
        setTimeout(() => syncCamImages(rem), 0);
    }, true);

    function syncCamImages(rem) {
        const isVisible = window.visibleSlot && window.visibleSlot[rem] >= 0;
        document.querySelectorAll(`.cam-layer-img[data-cam-rem="${rem}"]`)
            .forEach(img => img.classList.toggle('hide', !isVisible));
    }
    function syncAllCamImages() { [0,1,2,3].forEach(rem => syncCamImages(rem)); }

    // ── 9. Re-inject after grid resize ───────────────────────────────────────
    const _origBuild = window.buildGrid;
    window.buildGrid = function(n) { _origBuild(n); if (capturedDataURL) injectIntoGrid(); };

})();