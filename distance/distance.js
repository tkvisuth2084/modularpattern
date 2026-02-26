// 1. Select all pattern images in the grid
// const allImages = document.querySelectorAll(".patt-img");
const allImages0 = document.querySelectorAll(".patt-img0");
const allImages1 = document.querySelectorAll(".patt-img1");
const allImages2 = document.querySelectorAll(".patt-img2");
const allImages3 = document.querySelectorAll(".patt-img3");

const allImages4 = document.querySelectorAll(".patt-img4");
const allImages5 = document.querySelectorAll(".patt-img5");
const allImages6 = document.querySelectorAll(".patt-img6");
const allImages7 = document.querySelectorAll(".patt-img7");


const allImagesA = document.querySelectorAll(".patt-imga");
const allImagesB = document.querySelectorAll(".patt-imgb");
const allImagesC = document.querySelectorAll(".patt-imgc");
const allImagesD = document.querySelectorAll(".patt-imgd");

const allImagesE = document.querySelectorAll(".patt-imge");
const allImagesF = document.querySelectorAll(".patt-imgf");
const allImagesG = document.querySelectorAll(".patt-imgg");
const allImagesH = document.querySelectorAll(".patt-imgh");

const allImagesI = document.querySelectorAll(".patt-imgi");
const allImagesJ = document.querySelectorAll(".patt-imgj");
const allImagesK = document.querySelectorAll(".patt-imgk");
const allImagesL = document.querySelectorAll(".patt-imgl");

const allImagesM = document.querySelectorAll(".patt-imgm");
const allImagesN = document.querySelectorAll(".patt-imgn");
const allImagesO = document.querySelectorAll(".patt-imgo");
const allImagesP = document.querySelectorAll(".patt-imgp");

const allImagesQ = document.querySelectorAll(".patt-imgq");
const allImagesR = document.querySelectorAll(".patt-imgr");
const allImagesS = document.querySelectorAll(".patt-imgs");
const allImagesT = document.querySelectorAll(".patt-imgt");



document.addEventListener('keydown', function(event) {

    // Check if the user pressed the '1' key
    if (event.key === '1') {

        allImages0.forEach(image => {
            image.classList.toggle('hide');
        });
    }
    // You can add more keys here!
    if (event.key === '2') {

        allImages1.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === '3') {

        allImages2.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === '4') {

        allImages3.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === '5') {

        allImages4.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === '6') {

        allImages5.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === '7') {

        allImages6.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === '8') {

        allImages7.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'a' || event.key === 'A') {

        allImagesA.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'b' || event.key === 'B') {

        allImagesB.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'c' || event.key === 'C') {

        allImagesC.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'd' || event.key === 'D') {

        allImagesD.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'e' || event.key === 'E') {

        allImagesE.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'f' || event.key === 'F') {

        allImagesF.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'g' || event.key === 'G') {

        allImagesG.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'h' || event.key === 'H') {

        allImagesH.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'i' || event.key === 'I') {

        allImagesI.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'j' || event.key === 'J') {

        allImagesJ.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'k' || event.key === 'K') {

        allImagesK.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'l' || event.key === 'L') {

        allImagesL.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'm' || event.key === 'M') {

        allImagesM.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'n' || event.key === 'N') {

        allImagesN.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'o' || event.key === 'O') {

        allImagesO.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'p' || event.key === 'P') {

        allImagesP.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'q' || event.key === 'Q') {

        allImagesQ.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'r' || event.key === 'R') {

        allImagesR.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 's' || event.key === 'S') {

        allImagesS.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 't' || event.key === 'T') {

        allImagesT.forEach(image => {
            image.classList.toggle('hide');
        });
    }



});

document.getElementById('download-btn').addEventListener('click', function() {
    const gameBoard = document.querySelector('.game');

    // We use html2canvas to "capture" the grid
    html2canvas(gameBoard).then(canvas => {
        const link = document.createElement('a');
        link.download = 'my-arithmetic-pattern.png';
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
});

const cells = document.querySelectorAll('.game-cell');
const totalRows = 6;
const infoCalc = document.querySelector('.info-calc');
const infoCalc2 = document.querySelector('.info-calc2');

cells.forEach((cell, index) => {
    const x = (index % 6) + 1;
    const y = (totalRows) - Math.floor((index / 6));

    // Create tooltip
    const mathBehind = document.createElement('div');
    mathBehind.classList.add('cell-mathBehind');
    mathBehind.textContent = `(x,y) = (${x},${y})`;
    cell.appendChild(mathBehind);

    cell.addEventListener('mouseenter', () => {
        const hasVisible = Array.from(cell.querySelectorAll('img')).some(
            img => !img.classList.contains('hide')
        );
        if (hasVisible) {
            // Show tooltip
            mathBehind.classList.add('visible');
            // Update side panel
            infoCalc.textContent = `${Math.sqrt(x**2 + y**2)} / 4 = ${Math.floor(Math.sqrt(x**2 + y**2) / 4)} R ${Math.sqrt(x**2 + y**2) % 4}`;
            infoCalc2.textContent =`Remainder = ${Math.floor(Math.sqrt(x**2 + y**2) % 4)}`;
        }
    });

    cell.addEventListener('mouseleave', () => {
        mathBehind.classList.remove('visible');
    });
});

const game = document.querySelector('.game');
const swatches = document.querySelectorAll('.swatch');
const customColor = document.getElementById('custom-color');

function setGridLineColor(color) {
    game.style.borderColor = color;
    document.querySelectorAll('.game-cell').forEach(cell => {
        cell.style.borderColor = color;
    });
}

swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
        swatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        const color = swatch.dataset.color;
        customColor.value = color;
        setGridLineColor(color);
    });
});

customColor.addEventListener('input', () => {
    swatches.forEach(s => s.classList.remove('active'));
    setGridLineColor(customColor.value);
});


