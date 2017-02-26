// import Color from 'color';
import Palette from './palette';
import * as graphics from './graphics';

document.addEventListener('DOMContentLoaded', () => {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var width = screen.width;
  var height = screen.height;
  var blockSize = 12;

  canvas.width = width;
  canvas.height = height - 40;

  const palette = new Palette();

  const drawPalette = () => {
    graphics.drawPalette(document.getElementById('palette'), palette);
    requestAnimationFrame(drawPalette);
  };

  drawPalette();

  let clicking = false;

  canvas.addEventListener('mousedown', e => { draw(e); clicking = true; });
  canvas.addEventListener('mouseup', () => clicking = false);

  canvas.addEventListener('mousemove', function(e) {
    if (clicking) draw(e);
  });

  const draw = (e) => {
    var x = e.offsetX - (e.offsetX % blockSize);
    var y = e.offsetY - (e.offsetY % blockSize);
    ctx.fillStyle = palette.getCurrentColor();
    ctx.fillRect(x, y, blockSize, blockSize);
  };
});

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