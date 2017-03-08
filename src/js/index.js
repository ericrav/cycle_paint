// import Color from 'color';
import Palette from './palette';
import Controls from './controls';
import * as graphics from './graphics';

(() => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');


  const width = screen.width;
  const height = screen.height;
  const blockSize = 12;
  const controlsHeight = 60;

  canvas.width = width;
  canvas.height = height;
  
  // adjust canvas resolution
  // src: http://jsfiddle.net/4xe4d/
  const devicePixelRatio = window.devicePixelRatio || 1;
  const backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                            ctx.mozBackingStorePixelRatio ||
                            ctx.msBackingStorePixelRatio ||
                            ctx.oBackingStorePixelRatio ||
                            ctx.backingStorePixelRatio || 1;
  // upscale canvas if the two ratios don't match
  if (devicePixelRatio !== backingStoreRatio) {

    const ratio = devicePixelRatio / backingStoreRatio;
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;
    canvas.width = Math.round(oldWidth * ratio);
    canvas.height = Math.round(oldHeight * ratio);
    canvas.style.width = oldWidth + 'px';
    canvas.style.height = oldHeight + 'px';
    // now scale the context to counter
    // the fact that we've manually scaled
    // our canvas element
    ctx.scale(ratio, ratio);
  }

  const palette = new Palette();

  let blockIndex = {};
  window.blockIndex = blockIndex;


  const controls = new Controls(ctx, 0, 0, width, controlsHeight, palette);

  const drawControls = () => {
    // graphics.drawControls(canvas, 300, 10, 80, 40, erasing ? 1 : 0);
    controls.draw();
    requestAnimationFrame(drawControls);
  };
  drawControls();

  const clearCanvas = () => {
    ctx.clearRect(0, controlsHeight, width, height - controlsHeight);
    blockIndex = {};
  };

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

  let drawSize = 1;

  window.setDrawSize = size => drawSize = parseInt(size) || drawSize; // change draw size from console

  document.addEventListener('keyup', e => {
    if (parseInt(e.key)) drawSize = parseInt(e.key) || drawSize;
    else if (e.key.toLowerCase() === 'e') controls.selectEraser();
    else if (e.key.toLowerCase() === 'd') controls.selectMarker();
    else if (e.key.toLowerCase() === 'c') clearCanvas();
    else if (e.key.toLowerCase() === '=') { palette.incrementColorOffset(); redrawBlocks(); }
    else if (e.key.toLowerCase() === '-') { palette.incrementColorOffset(-1); redrawBlocks(); }
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
    const yBounds = y < 0 ? 0 - y : 0;
    if (controls.isEraserSelected()) ctx.clearRect(x*blockSize, (y + yBounds)*blockSize + controlsHeight, blockSize*drawSize, blockSize*(drawSize - yBounds));
    else ctx.fillRect(x*blockSize, (y + yBounds)*blockSize + controlsHeight, blockSize*drawSize, blockSize*(drawSize - yBounds));
    // store block info
    for (let ix = x; ix < x + drawSize; ix++) {
      for (let iy = y; iy < y + drawSize; iy++) {
        if (ix < 0 || iy < 0) continue; // don't add block outside bounds
        if (controls.isEraserSelected()) delete blockIndex[ix + ',' + iy];
        else blockIndex[ix + ',' + iy] = colorIndex;
      }
    }
  };
})();