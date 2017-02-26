// import Color from 'color';
import Palette from './palette';
import * as graphics from './graphics';

(() => {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var width = screen.width;
  var height = screen.height;
  var blockSize = 12;

  canvas.width = width;
  canvas.height = height - 50;

  const palette = new Palette();

  const drawPalette = () => {
    graphics.drawPalette(document.getElementById('palette'), palette);
    requestAnimationFrame(drawPalette);
  };

  drawPalette();

  let clicking = false;
  let erasing = false;

  let drawSize = 3;

  window.setDrawSize = size => drawSize = parseInt(size) || drawSize; // change draw size from console

  document.addEventListener('keyup', e => {
    if (parseInt(e.key)) drawSize = parseInt(e.key) || drawSize;
    else if (e.key.toLowerCase() === 'e') erasing = true;
    else if (e.key.toLowerCase() === 'd') erasing = false;
  });

  const getTouchOffsets = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.targetTouches[0].pageX - rect.left;
    const y = e.targetTouches[0].pageY - rect.top;
    return { offsetX: x, offsetY: y};
  };

  canvas.addEventListener('mousedown', e => { drawAtEvent(e, drawSize); clicking = true; });
  canvas.addEventListener('touchstart', e => { drawAtEvent(getTouchOffsets(e), drawSize); clicking = true; });
  canvas.addEventListener('mouseup', () => clicking = false);
  canvas.addEventListener('touchend', () => clicking = false);

  canvas.addEventListener('mousemove', function(e) {
    if (clicking) drawAtEvent(e, drawSize);
  });

  canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
    if (clicking) drawAtEvent(getTouchOffsets(e), drawSize);
  });

  const drawAtEvent = (e, drawSize = 1) => {
    const xSide = e.offsetX % blockSize;
    const ySide = e.offsetY % blockSize;
    const x = e.offsetX - xSide;
    const y = e.offsetY - ySide;

    ctx.fillStyle = erasing ? '#000' : palette.getCurrentColor();
    if (drawSize % 2 === 0) drawBlock(x - (xSide < blockSize / 2 ? blockSize*(drawSize/2) : 0), y - (ySide < blockSize / 2 ? blockSize*(drawSize/2) : 0), drawSize);
    else if (drawSize % 2 === 1) drawBlock(x - (drawSize-1)*blockSize/2, y - (drawSize-1)*blockSize/2, drawSize);

    // graphics.drawGrid(canvas, blockSize);
  };

  const drawBlock = (ix, iy, drawSize = 1) => ctx.fillRect(ix, iy, blockSize*drawSize, blockSize*drawSize);
})();

// setInterval(() => {
//   for (let x = 0; x < width; x+=blockSize) {
//     for (let y = 0; y < height; y+=blockSize) {
//       const imgData = ctx.getImageData(x, y, 1, 1).data;
//       if (imgData[0] + imgData[1] + imgData[2] !== 0) {
//         const thisColor = Color.rgb(imgData[0], imgData[1], imgData[2]).hsl();
//         const newColor = thisColor.hue(thisColor.hue() + 360/256);
//         ctx.fillStyle = newColor.string();
//         ctx.fillRect(x, y, blockSize, blockSize);
//       }
//     }
//   }
// }, 20);