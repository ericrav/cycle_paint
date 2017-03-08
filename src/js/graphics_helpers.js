export const drawTriangle = (ctx, x, y, size) => {
  const corner = 4;
  for (let i = 0; i < size / 2; i += corner) {
    ctx.fillRect(x - (size / 2) + i, y + i, size - i*2, corner);
  }
};

export const drawRoundedRect = (ctx, x, y, width, height, rounded=true) => {
  const radius = rounded ? 8 : 4;
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
  if (rounded) ctx.fillRect(x + width - radius, y + borderWidth, borderWidth, borderWidth);
  // right
  ctx.fillRect(x + width - borderWidth, y + radius, borderWidth, height - radius*2);
  // BR corner
  if (rounded) ctx.fillRect(x + width - radius, y + height - radius, borderWidth, borderWidth);
  // bottom
  ctx.fillRect(x + radius, y + height - borderWidth, width - radius*2, borderWidth);
  // BL corner
  if (rounded) ctx.fillRect(x + borderWidth, y + height - radius, borderWidth, borderWidth);
  // left
  ctx.fillRect(x, y + radius, borderWidth, height - radius*2);
  // TL corner
  if (rounded) ctx.fillRect(x + borderWidth, y + borderWidth, borderWidth, borderWidth);
};