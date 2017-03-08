import { drawTriangle, drawRoundedRect } from './graphics_helpers';
import markerSrc from '../img/marker.png';
import eraserSrc from '../img/eraser.png';
const marker = new Image();
marker.src = markerSrc;
const eraser = new Image();
eraser.src = eraserSrc;

export const drawControls = (canvas, x, y, width, height, selectedIconIndex) => {
  const ctx = canvas.getContext('2d');
  const iconSize = 26;
  const boxSize = height;
  const padding = (boxSize - iconSize) / 2;
  // ctx.clearRect(x, y, 2 * boxSize, height);
  ctx.drawImage(marker, x + padding, y + padding, iconSize, iconSize);
  ctx.drawImage(eraser, x + boxSize + padding*2, y + padding, iconSize, iconSize);
  ctx.fillStyle = '#ddd';
  drawRoundedRect(ctx, x + selectedIconIndex * (boxSize + padding), y, boxSize, boxSize, false);
};

export const drawPalette = (canvas, x, y, width, height, palette) => {
  const ctx = canvas.getContext('2d');
  const size = palette.getSize();
  const depth = width / size;
  // draw spectrum
  for (let i = 0; i < size; i++) {
    ctx.fillStyle = palette.getColor(i);
    ctx.fillRect(i * depth + x, y, Math.ceil(depth), height);
  }

  // draw border
  ctx.fillStyle = '#fff';
  drawTriangle(ctx, palette.getColorIndex() * depth + x, y, 30);
  ctx.fillStyle = '#ddd';
  drawRoundedRect(ctx, x, y, width, height);
  ctx.clearRect(x + width, y, 16, height);
  ctx.clearRect(x - 16, y, 16, height);
};

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