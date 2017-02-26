export const drawPalette = (canvas, palette) => {
  const ctx = canvas.getContext('2d');
  const size = palette.getSize();
  const width = canvas.width / size;
  // draw spectrum
  for (let i = 0; i < size; i++) {
    ctx.fillStyle = palette.getColor(i);
    ctx.fillRect(i * width, 0, width + 1, canvas.height);
  }

  // draw border
  ctx.fillStyle = '#fff';
  drawTriangle(ctx, palette.getColorIndex() * width, 0, 30);
  ctx.fillStyle = '#ddd';
  drawRoundedRect(ctx, 0, 0, canvas.width, canvas.height);
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

const drawTriangle = (ctx, x, y, size) => {
  const corner = 4;
  for (let i = 0; i < size / 2; i += corner) {
    ctx.fillRect(x - (size / 2) + i, y + i, size - i*2, corner);
  }
};

const drawRoundedRect = (ctx, x, y, width, height) => {
  const radius = 8;
  const borderWidth = 4;
  const fill = ctx.fillStyle; // preserve fill style

  // erase corners with black
  ctx.fillStyle = '#000';
  ctx.fillRect(x, y, radius, radius);
  ctx.fillRect(x + width - radius, y, radius, radius);
  ctx.fillRect(x + width - radius, y + height - radius, radius, radius);
  ctx.fillRect(x, y + height - radius, radius, radius);

  ctx.fillStyle = fill;
  // top
  ctx.fillRect(x + radius, y, width - radius*2, borderWidth);
  // TR corner
  ctx.fillRect(x + width - radius, y + borderWidth, borderWidth, borderWidth);
  // right
  ctx.fillRect(x + width - borderWidth, y + radius, borderWidth, height - radius*2);
  // BR corner
  ctx.fillRect(x + width - radius, y + height - radius, borderWidth, borderWidth);
  // bottom
  ctx.fillRect(x + radius, y + height - borderWidth, width - radius*2, borderWidth);
  // BL corner
  ctx.fillRect(x + borderWidth, y + height - radius, borderWidth, borderWidth);
  // left
  ctx.fillRect(x, y + radius, borderWidth, height - radius*2);
  // TL corner
  ctx.fillRect(x + borderWidth, y + borderWidth, borderWidth, borderWidth);
};