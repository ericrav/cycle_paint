// import Color from 'color';
import Palette from './palette';
import Controls from './controls';
import Graphics from './graphics';

(() => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');


  const width = window.innerWidth;
  const height = window.innerHeight;
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
  const graphics = new Graphics(ctx, palette, width, height, blockSize, controlsHeight);
  const controls = new Controls(ctx, palette, graphics, 0, 0, width, controlsHeight);

  const drawControls = () => {
    controls.draw();
    requestAnimationFrame(drawControls);
  };
  drawControls();

  let clicking = false;

  window.setDrawSize = (amt) => controls.setDrawSize(amt); // change draw size from console

  document.addEventListener('keyup', e => {
    console.log(e.keyCode);
    if (e.keyCode >= 49 && e.keyCode <= 57) controls.setDrawSize(e.keyCode - 48);
    else if (e.keyCode === 69) controls.selectEraser(); // e
    else if (e.keyCode === 68) controls.selectMarker(); // d
    else if (e.keyCode === 67) graphics.clearCanvas(); // c
    else if (e.keyCode === 187) { palette.incrementColorOffset(); graphics.redrawBlocks(); } // +
    else if (e.keyCode === 189) { palette.incrementColorOffset(-1); graphics.redrawBlocks(); } // -
  });

  const getTouchOffsets = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.targetTouches[0].pageX - rect.left;
    const y = e.targetTouches[0].pageY - rect.top;
    return { offsetX: x, offsetY: y};
  };

  canvas.addEventListener('mousedown', e => { handleTool(e); clicking = true; });
  canvas.addEventListener('touchstart', e => { handleTool(getTouchOffsets(e)); clicking = true; });
  canvas.addEventListener('mouseup', () => clicking = false);
  canvas.addEventListener('touchend', () => clicking = false);

  const handleTool = (e) => {
    if (controls.isEraserSelected()) graphics.eraseBlock(e, controls.getDrawSize());
    else graphics.drawBlock(e, controls.getDrawSize());
  };

  canvas.addEventListener('mousemove', function(e) {
    if (clicking) handleTool(e);
  });

  canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
    if (clicking) handleTool(getTouchOffsets(e));
  });

})();