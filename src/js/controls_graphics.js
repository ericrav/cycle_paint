import { drawTriangle, drawRoundedRect } from './graphics_helpers';

export default class ControlsGraphics {

  constructor(ctx, x, y, width, height) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  // draw bar show palette and current color
  // @param width: width of the bar
  drawPalette(palette, x, y, width) {
    const size = palette.getSize(); // number of colors in palette
    const height = 30; // height of palette indicator
    const depth = width / size; // width of each color drawn

    // draw palette indicator
    for (let i = 0; i < size; i++) {
      this.ctx.fillStyle = palette.getColor(i);
      this.ctx.fillRect(i * depth + x, y, Math.ceil(depth), height);
    }

    // draw triangle indicator
    this.ctx.fillStyle = '#fff';
    drawTriangle(this.ctx, palette.getColorIndex() * depth + x, y, 30);
    // draw border
    this.ctx.fillStyle = '#ddd';
    drawRoundedRect(this.ctx, x, y, width, height);
    // remove parts of drawing outside border
    this.ctx.clearRect(x + width, y, 16, height);
    this.ctx.clearRect(x - 16, y, 16, height);
  }

  drawIcon(img, x, y, iconSize, boxSize, active) {
    const padding = (boxSize - iconSize) / 2;
    this.ctx.drawImage(img, x + padding, y + padding, iconSize, iconSize);

    if (active) {
      this.ctx.fillStyle = '#ddd';
      drawRoundedRect(this.ctx, x, y, boxSize, boxSize, false);
    }
    
  }

  drawTextIcon(text, x, y, fontSize, boxSize) {
    const padding = (boxSize - fontSize) / 2;
    this.ctx.fillStyle = '#ddd';
    this.ctx.font = fontSize + 'px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'hanging';
    this.ctx.fillText(text, x + boxSize/2, y + padding);
    drawRoundedRect(this.ctx, x, y, boxSize, boxSize, false);
  }

  drawBoxIcon(x, y, innerSize, boxSize) {
    const padding = (boxSize - innerSize) / 2;
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(x + padding, y + padding, innerSize, innerSize);
    this.ctx.fillStyle = '#ddd';
    drawRoundedRect(this.ctx, x, y, boxSize, boxSize, false);
  }
}