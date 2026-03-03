// ── Camera / selfie layer feature ──────────────────────────────────────────
// Injects a camera panel into .side-panel and lets the user take a photo
// that replaces whichever layer they choose (0, 1, or 2).
// The captured image is shown/hidden by the same key as that layer.

(function () {

    // ── 1. Build the UI panel ────────────────────────────────────────────────
    const panel = document.createElement('div');
    panel.className = 'camera-panel';
    panel.innerHTML = `
    <h2>Camera Layer</h2>
    <div class="camera-layer-pick">
      <label>Replace layer:</label>
      <div class="layer-btns">
        <button class="layer-btn active" data-layer="0">0</button>
        <button class="layer-btn" data-layer="1">1</button>
        <button class="layer-btn" data-layer="2">2</button>
      </div>
    </div>
    <div class="camera-preview-wrap">
      <video id="cam-video" autoplay playsinline muted></video>
      <canvas id="cam-canvas" style="display:none"></canvas>
      <img id="cam-snapshot" style="display:none" alt="snapshot">
    </div>
    <div class="camera-controls">
      <button id="cam-start-btn">📷 Open Camera</button>
      <button id="cam-snap-btn" disabled>Capture</button>
      <button id="cam-clear-btn" disabled>Clear</button>
    </div>
    <p class="camera-hint">Toggle with same key as chosen layer</p>
  `;

    // Insert after the color-picker-panel
    const colorPanel = document.querySelector('.color-picker-panel');
    colorPanel.parentNode.insertBefore(panel, colorPanel.nextSibling);

    // ── 2. Inject styles ─────────────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
    .camera-panel {
      background: white;
       border: 2px solid #111;
      padding: 14px;
      margin-top: 14px;
    }
    .camera-panel h2 {
      font-size: 11px;
      letter-spacing: .1em;
      text-transform: uppercase;
      color: #888;
      margin: 0 0 10px;
    }
    .camera-layer-pick {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }
    .camera-layer-pick label {
      font-size: 11px;
      color: #aaa;
      white-space: nowrap;
    }
    .layer-btns {
      display: flex;
      gap: 5px;
    }
    .layer-btn {
      width: 28px;
      height: 28px;
      border-radius: 4px;
      border: 1px solid #444;
      background: #222;
      color: #aaa;
      font-size: 12px;
      cursor: pointer;
      transition: all .15s;
    }
    .layer-btn.active {
      background: #e07060;
      border-color: #e07060;
      color: #fff;
    }
    .camera-preview-wrap {
      width: 100%;
      aspect-ratio: 4/3;
      background: #111;
      border-radius: 4px;
      overflow: hidden;
      position: relative;
      margin-bottom: 8px;
    }
    #cam-video, #cam-snapshot {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .camera-controls {
      display: flex;
      gap: 6px;
      margin-bottom: 6px;
    }
    .camera-controls button {
      flex: 1;
      padding: 6px 4px;
      font-size: 11px;
      border-radius: 4px;
      border: 1px solid #444;
      background: #222;
      color: #ccc;
      cursor: pointer;
      transition: background .15s;
    }
    .camera-controls button:hover:not(:disabled) {
      background: #333;
    }
    .camera-controls button:disabled {
      opacity: .35;
      cursor: not-allowed;
    }
    #cam-snap-btn:not(:disabled) {
      background: #2a4a2a;
      border-color: #4caf7d;
      color: #4caf7d;
    }
    .camera-hint {
      font-size: 10px;
      color: #555;
      margin: 0;
      text-align: center;
    }

    /* The injected camera images inside cells */
    .cam-layer-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .cam-layer-img.hide {
      display: none;
    }
  `;
    document.head.appendChild(style);

    // ── 3. State ─────────────────────────────────────────────────────────────
    let chosenLayer = '0';   // which layer key ('0', '1', '2')
    let stream = null;
    let capturedDataURL = null;

    // ── 4. Layer picker ──────────────────────────────────────────────────────
    const layerBtns = panel.querySelectorAll('.layer-btn');
    layerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            layerBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            chosenLayer = btn.dataset.layer;
        });
    });

    // ── 5. Camera controls ───────────────────────────────────────────────────
    const video      = panel.querySelector('#cam-video');
    const canvas     = panel.querySelector('#cam-canvas');
    const snapshot   = panel.querySelector('#cam-snapshot');
    const startBtn   = panel.querySelector('#cam-start-btn');
    const snapBtn    = panel.querySelector('#cam-snap-btn');
    const clearBtn   = panel.querySelector('#cam-clear-btn');

    startBtn.addEventListener('click', async () => {
        if (stream) {
            // Camera already open — stop it
            stopCamera();
            return;
        }
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
            video.srcObject = stream;
            video.style.display = 'block';
            snapshot.style.display = 'none';
            startBtn.textContent = '✕ Close Camera';
            snapBtn.disabled = false;
        } catch (err) {
            alert('Could not access camera: ' + err.message);
        }
    });

    snapBtn.addEventListener('click', () => {
        // Draw current video frame onto hidden canvas
        canvas.width  = video.videoWidth  || 320;
        canvas.height = video.videoHeight || 240;
        const ctx = canvas.getContext('2d');
        // Mirror horizontally (selfie feel)
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0);

        capturedDataURL = canvas.toDataURL('image/jpeg', 0.85);

        // Show the snapshot preview
        snapshot.src = capturedDataURL;
        snapshot.style.display = 'block';
        video.style.display = 'none';

        stopCamera();
        startBtn.textContent = '📷 Retake';
        snapBtn.disabled = true;
        clearBtn.disabled = false;

        injectIntoGrid();
    });

    clearBtn.addEventListener('click', () => {
        removeFromGrid();
        capturedDataURL = null;
        snapshot.src = '';
        snapshot.style.display = 'none';
        video.style.display = 'block';
        startBtn.textContent = '📷 Open Camera';
        snapBtn.disabled = true;
        clearBtn.disabled = true;
    });

    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(t => t.stop());
            stream = null;
        }
        video.srcObject = null;
    }

    // ── 6. Inject / remove images in grid cells ──────────────────────────────

    // Map layer key → the existing image selectors it corresponds to
    // (so we can mirror show/hide behaviour)
    const layerKeyMap = {
        '0': ['patt-img0', 'patt-img4', 'patt-imga', 'patt-imge', 'patt-imgi', 'patt-imgm', 'patt-imgq'],
        '1': ['patt-img1', 'patt-img5', 'patt-imgb', 'patt-imgf', 'patt-imgj', 'patt-imgn', 'patt-imgr'],
        '2': ['patt-img2', 'patt-img6', 'patt-imgc', 'patt-imgg', 'patt-imgk', 'patt-imgo', 'patt-imgs'],
    };

    function injectIntoGrid() {
        // Remove any previous camera images first
        removeFromGrid();

        const cells = document.querySelectorAll('.game-cell');

        // Figure out initial visibility by checking if layer 0 images in
        // the first type-matching cell are hidden or not
        const sampleClass = layerKeyMap[chosenLayer][0];
        const sampleImg = document.querySelector('.' + sampleClass);
        const startHidden = sampleImg ? sampleImg.classList.contains('hide') : true;

        cells.forEach(cell => {
            // Only inject into cells that belong to this layer
            // (i.e. the cell contains an img with one of the layer classes)
            const hasLayer = layerKeyMap[chosenLayer].some(cls => cell.querySelector('.' + cls));
            if (!hasLayer) return;

            const img = document.createElement('img');
            img.src = capturedDataURL;
            img.className = 'cam-layer-img';
            img.dataset.camLayer = chosenLayer;
            if (startHidden) img.classList.add('hide');
            cell.appendChild(img);
        });
    }

    function removeFromGrid() {
        document.querySelectorAll('.cam-layer-img').forEach(img => img.remove());
    }

    // ── 7. Hook into existing keydown to toggle camera images too ────────────
    // We listen at capture phase so we run alongside add.js's listener
    const keyToLayer = { '0': '0', '1': '1', '2': '2' };

    document.addEventListener('keydown', function (event) {
        const layer = keyToLayer[event.key];
        if (layer === undefined) return;
        // Toggle all cam images that belong to this layer
        document.querySelectorAll(`.cam-layer-img[data-cam-layer="${layer}"]`).forEach(img => {
            img.classList.toggle('hide');
        });
    }, true); // capture phase so it fires even if add.js stops propagation

})();