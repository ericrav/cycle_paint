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

  window.setDrawSize = controls.setDrawSize; // change draw size from console

  document.addEventListener('keyup', e => {
    if (parseInt(e.key)) controls.setDrawSize(e.key);
    else if (e.key.toLowerCase() === 'e') controls.selectEraser();
    else if (e.key.toLowerCase() === 'd') controls.selectMarker();
    else if (e.key.toLowerCase() === 'c') graphics.clearCanvas();
    else if (e.key.toLowerCase() === '=') { palette.incrementColorOffset(); graphics.redrawBlocks(); }
    else if (e.key.toLowerCase() === '-') { palette.incrementColorOffset(-1); graphics.redrawBlocks(); }
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