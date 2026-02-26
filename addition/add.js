
const allImages0 = document.querySelectorAll(".patt-img0");
const allImages1 = document.querySelectorAll(".patt-img1");
const allImages2 = document.querySelectorAll(".patt-img2");


const allImages4 = document.querySelectorAll(".patt-img4");
const allImages5 = document.querySelectorAll(".patt-img5");
const allImages6 = document.querySelectorAll(".patt-img6");

const allImagesA = document.querySelectorAll(".patt-imga");
const allImagesB = document.querySelectorAll(".patt-imgb");
const allImagesC = document.querySelectorAll(".patt-imgc");
const allImagesD = document.querySelectorAll(".patt-imgd");

const allImagesE = document.querySelectorAll(".patt-imge");
const allImagesF = document.querySelectorAll(".patt-imgf");
const allImagesG = document.querySelectorAll(".patt-imgg");

const allImagesI = document.querySelectorAll(".patt-imgi");
const allImagesJ = document.querySelectorAll(".patt-imgj");
const allImagesK = document.querySelectorAll(".patt-imgk");

const allImagesM = document.querySelectorAll(".patt-imgm");
const allImagesN = document.querySelectorAll(".patt-imgn");
const allImagesO = document.querySelectorAll(".patt-imgo");

const allImagesQ = document.querySelectorAll(".patt-imgq");
const allImagesR = document.querySelectorAll(".patt-imgr");
const allImagesS = document.querySelectorAll(".patt-imgs");


document.addEventListener('keydown', function(event) {

    // Check if the user pressed the '1' key
    if (event.key === '0') {

        allImages0.forEach(image => {
            image.classList.toggle('hide');
        });
    }
    // You can add more keys here!
    if (event.key === '1') {

        allImages1.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === '2') {

        allImages2.forEach(image => {
            image.classList.toggle('hide');
        });
    }


    if (event.key === '3') {

        allImages4.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === '4') {

        allImages5.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === '5') {

        allImages6.forEach(image => {
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

        allImagesE.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'e' || event.key === 'E') {

        allImagesF.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'f' || event.key === 'F') {

        allImagesG.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'g' || event.key === 'G') {

        allImagesI.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'h' || event.key === 'H') {

        allImagesJ.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'i' || event.key === 'I') {

        allImagesK.forEach(image => {
            image.classList.toggle('hide');
        });
    }


    if (event.key === 'j' || event.key === 'J') {

        allImagesM.forEach(image => {
            image.classList.toggle('hide');
        });
    }


    if (event.key === 'k' || event.key === 'K') {

        allImagesN.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'l' || event.key === 'L') {

        allImagesO.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'm' || event.key === 'M') {

        allImagesQ.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'n' || event.key === 'N') {

        allImagesR.forEach(image => {
            image.classList.toggle('hide');
        });
    }

    if (event.key === 'o' || event.key === 'O') {

        allImagesS.forEach(image => {
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
            infoCalc.textContent = `(${x} + ${y}) / 3 = ${Math.floor((x + y) / 3)} R ${(x + y) % 3}`;
            infoCalc2.textContent =`Remainder = ${(x + y) % 3}`;
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


