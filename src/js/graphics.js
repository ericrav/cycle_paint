export const drawGrid = (canvas, blockSize) => {
  const ctx = canvas.getContext('2d');
  const strokeStyle = ctx.strokeStyle;
  const width = canvas.width;
  const height = canvas.height;
  ctx.strokeStyle = '#777';
  for (let x = blockSize; x < width; x+= blockSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = blockSize; y < height; y+= blockSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.strokeStyle = strokeStyle;
};

// let blockIndex = {};

export default class Graphics {
  constructor(ctx, palette, width, height, blockSize, offsetY) {
    this.ctx = ctx;
    this.palette = palette;
    this.blockSize = blockSize;
    this.width = width;
    this.height = height;
    this.offsetY = offsetY;
    this.blockIndex = {};
  }

  clearCanvas() {
    this.ctx.clearRect(0, this.offsetY, this.width, this.height - this.offsetY);
    this.blockIndex = {};
  }

  redrawBlocks() {
    // draw all blocks
    for (let key of Object.keys(this.blockIndex)) {
      const coord = key.split(',');
      this.ctx.fillStyle = this.palette.getColor(this.blockIndex[key]);
      this.ctx.fillRect(coord[0] * this.blockSize, coord[1] * this.blockSize + this.offsetY, this.blockSize, this.blockSize);
    }
  }

  getCoordsFromEvent(e, drawSize) {
    if (e.offsetY <= this.offsetY) return false; // outside bound of drawing canvas
    const xSide = e.offsetX % this.blockSize;
    const ySide = e.offsetY % this.blockSize;
    const x = Math.floor(e.offsetX / this.blockSize);
    const y = Math.floor((e.offsetY - this.offsetY) / this.blockSize);

    if (drawSize % 2 === 0) return [x - (xSide < this.blockSize / 2 ? (drawSize/2) : 0), y - (ySide < this.blockSize / 2 ? (drawSize/2) : 0)];
    else if (drawSize % 2 === 1) return [x - (drawSize-1)/2, y - (drawSize-1)/2];

    // graphics.drawGrid(canvas, this.blockSize);
  }

  eraseBlock(e, drawSize = 1) {
    const coords = this.getCoordsFromEvent(e, drawSize);
    if (!coords) return;
    const x = coords[0];
    const y = coords[1];
    const yBounds = y < 0 ? 0 - y : 0;

    this.ctx.clearRect(x*this.blockSize, (y + yBounds)*this.blockSize + this.offsetY, this.blockSize*drawSize, this.blockSize*(drawSize - yBounds));
    // store block info
    for (let ix = x; ix < x + drawSize; ix++) {
      for (let iy = y; iy < y + drawSize; iy++) {
        if (ix < 0 || iy < 0) continue; // don't add block outside bounds
        delete this.blockIndex[ix + ',' + iy];
      }
    }

  }

  drawBlock(e, drawSize = 1) {
    const coords = this.getCoordsFromEvent(e, drawSize);
    if (!coords) return;
    const x = coords[0];
    const y = coords[1];
    const colorIndex = this.palette.getColorIndex();
    this.ctx.fillStyle = this.palette.getColor(colorIndex);
    const yBounds = y < 0 ? 0 - y : 0;

    this.ctx.fillRect(x*this.blockSize, (y + yBounds)*this.blockSize + this.offsetY, this.blockSize*drawSize, this.blockSize*(drawSize - yBounds));
    // store block info
    for (let ix = x; ix < x + drawSize; ix++) {
      for (let iy = y; iy < y + drawSize; iy++) {
        if (ix < 0 || iy < 0) continue; // don't add block outside bounds
        this.blockIndex[ix + ',' + iy] = colorIndex;
      }
    }
  }

}