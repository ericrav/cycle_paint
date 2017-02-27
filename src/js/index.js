// import Color from 'color';
import Palette from './palette';
import * as graphics from './graphics';

(() => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const width = screen.width;
  const height = screen.height;
  const blockSize = 12;
  const controlsHeight = 50;

  canvas.width = width;
  canvas.height = height;

  const palette = new Palette();

  const blockIndex = {};
  window.blockIndex = blockIndex;

  const drawPalette = () => {
    graphics.drawPalette(canvas, 10, 10, 256, 30, palette);
    requestAnimationFrame(drawPalette);
  };
  drawPalette();

  const redrawBlocks = () => {

    ctx.clearRect(0, controlsHeight, width, height - controlsHeight);

    // draw all blocks
    for (let key of Object.keys(blockIndex)) {
      const coord = key.split(',');
      ctx.fillStyle = palette.getColor(blockIndex[key]);
      ctx.fillRect(coord[0] * blockSize, coord[1] * blockSize + controlsHeight, blockSize, blockSize);
    }
  };

  let clicking = false;
  let erasing = false;

  let drawSize = 1;

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
    if (e.offsetY <= controlsHeight) return;
    const xSide = e.offsetX % blockSize;
    const ySide = e.offsetY % blockSize;
    const x = Math.floor(e.offsetX / blockSize);
    const y = Math.floor((e.offsetY - controlsHeight) / blockSize);

    if (drawSize % 2 === 0) drawBlock(x - (xSide < blockSize / 2 ? (drawSize/2) : 0), y - (ySide < blockSize / 2 ? (drawSize/2) : 0), drawSize);
    else if (drawSize % 2 === 1) drawBlock(x - (drawSize-1)/2, y - (drawSize-1)/2, drawSize);

    // graphics.drawGrid(canvas, blockSize);
  };

  // const drawBlock = (ix, iy, drawSize = 1) => ctx.fillRect(ix, iy, blockSize*drawSize, blockSize*drawSize);
  const drawBlock = (x, y, drawSize = 1) => {
    const colorIndex = palette.getColorIndex();
    ctx.fillStyle = palette.getColor(colorIndex);
    if (erasing) ctx.clearRect(x*blockSize, y*blockSize + controlsHeight, blockSize*drawSize, blockSize*drawSize);
    else ctx.fillRect(x*blockSize, y*blockSize + controlsHeight, blockSize*drawSize, blockSize*drawSize);
    // store block info
    for (let ix = x; ix < x + drawSize; ix++) {
      for (let iy = y; iy < y + drawSize; iy++) {
        if (ix < 0 || iy < 0) continue; // don't add block outside bounds
        if (erasing) delete blockIndex[ix + ',' + iy];
        else blockIndex[ix + ',' + iy] = colorIndex;
      }
    }
  };
})();