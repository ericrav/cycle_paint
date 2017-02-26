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

  let drawSize = 1;

  document.addEventListener('keyup', e => drawSize = parseInt(e.key) || drawSize);

  canvas.addEventListener('mousedown', e => { drawAtEvent(e, drawSize); clicking = true; });
  canvas.addEventListener('mouseup', () => clicking = false);

  canvas.addEventListener('mousemove', function(e) {
    if (clicking) drawAtEvent(e, drawSize);
  });

  const drawAtEvent = (e, drawSize = 1) => {
    const xSide = e.offsetX % blockSize;
    const ySide = e.offsetY % blockSize;
    const x = e.offsetX - xSide;
    const y = e.offsetY - ySide;

    ctx.fillStyle = palette.getCurrentColor();
    if (drawSize % 2 === 0) drawBlock(x - (xSide < blockSize / 2 ? blockSize*(drawSize/2) : 0), y - (ySide < blockSize / 2 ? blockSize*(drawSize/2) : 0), drawSize);
    else if (drawSize % 2 === 1) drawBlock(x - (drawSize-1)*blockSize/2, y - (drawSize-1)*blockSize/2, drawSize);
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