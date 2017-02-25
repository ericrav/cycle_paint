import Color from 'color';

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var width = screen.width;
var height = screen.height;
var blockSize = 16;
const hues = 360;

canvas.width = width;
canvas.height = height;

let currentColor = Color('#FF0000');

setInterval(() => {
  currentColor = currentColor.hue(currentColor.hue() + hues/256);
}, 20);

canvas.addEventListener('mousemove', function(e) {
  var x = e.x - (e.x % blockSize);
  var y = e.y - (e.y % blockSize);
  ctx.fillStyle = currentColor.string();
  ctx.fillRect(x, y, blockSize, blockSize);
});

setInterval(() => {
  for (let x = 0; x < width; x+=blockSize) {
    for (let y = 0; y < height; y+=blockSize) {
      const imgData = ctx.getImageData(x, y, 1, 1).data;
      if (imgData[0] + imgData[1] + imgData[2] !== 0) {
        const thisColor = Color.rgb(imgData[0], imgData[1], imgData[2]).hsl();
        const newColor = thisColor.hue(thisColor.hue() + hues/256);
        ctx.fillStyle = newColor.string();
        ctx.fillRect(x, y, blockSize, blockSize);
      }
    }
  }
}, 20);