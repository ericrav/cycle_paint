import ControlsGraphics from './controls_graphics';
import markerSrc from '../img/marker.png';
import eraserSrc from '../img/eraser.png';

const maxDrawSize = 5;

export default class Controls {
  constructor(ctx, palette, drawingGraphics, x, y, width, height) {
    this.ctx = ctx;
    this.drawingGraphics = drawingGraphics;
    this.graphics = new ControlsGraphics(ctx, x, y, width, height);
    this.area = { x: x, y: y, width: width, height: height };
    this.palette = palette;

    this.drawSize = 1;

    this.setupGraphics();

    this.ctx.canvas.addEventListener('click', (e) => this.handleClick(e.offsetX, e.offsetY));
  }

  setupGraphics() {
    // set up icons
    this.marker = new Image();
    this.marker.src = markerSrc;
    this.eraser = new Image();
    this.eraser.src = eraserSrc;
    this.activeTool = this.marker;

    const elements = [];

    let paletteWidth = 300;
    const horizontalPadding = 16;
    const textBoxSize = 30;
    const boxSize = 40;
    
    if (this.area.width < 600) paletteWidth = this.area.width - (horizontalPadding * 5.5) - (textBoxSize * 2) - (boxSize * 3);

    let x = this.area.x;
    x += horizontalPadding;

    const paletteCycle = (self, amt) => {
      self.palette.incrementColorOffset(amt);
      self.drawingGraphics.redrawBlocks();
    };
    elements.push(this.getTextIconSetup('-', x, this.area.y, textBoxSize, (self) => paletteCycle(self, -8)));
    x += horizontalPadding / 2 + textBoxSize;
    elements.push(this.getTextIconSetup('+', x, this.area.y, textBoxSize, (self) => paletteCycle(self, 8)));
    x += horizontalPadding + textBoxSize;

    if (paletteWidth > 0) {
      elements.push(this.getPaletteSetup(x, this.area.y, paletteWidth));
      x += paletteWidth + horizontalPadding;
    }

    // set up tool icons
    elements.push(this.getIconSetup(this.marker, x, this.area.y, boxSize));
    x += boxSize;
    elements.push(this.getIconSetup(this.eraser, x, this.area.y, boxSize));
    x += boxSize + horizontalPadding;

    // draw size toggle
    elements.push(this.getDrawSizeIconSetup(x, this.area.y, boxSize));
    x += boxSize + horizontalPadding;

    this.elements = elements;
  }

  getPaletteSetup(x, y, width) {
    y = y + (this.area.height - 30) / 2; // center 30px palette in height of controls

    return {
      draw: (self) => self.graphics.drawPalette(self.palette, x, y, width),
      redraw: () => true,
      minX: x,
      maxX: x + width,
      minY: y,
      maxY: y + 30
    };
  }

  getTextIconSetup(text, x, y, boxSize, click) {
    const iconSize = 0.65 * boxSize;
    y = y + (this.area.height - boxSize) / 2;

    return {
      draw: (self) => self.graphics.drawTextIcon(text, x, y, iconSize, boxSize),
      redraw: () => false,
      click: click,
      minX: x,
      maxX: x + boxSize,
      minY: y,
      maxY: y + boxSize
    };
  }

  getDrawSizeIconSetup(x, y, boxSize) {
    y = y + (this.area.height - boxSize) / 2;

    return {
      draw: (self) => self.graphics.drawBoxIcon(x, y, self.getDrawSize() * (30 / maxDrawSize), boxSize),
      redraw: () => true,
      click: (self) => self.toggleDrawSize(),
      minX: x,
      maxX: x + boxSize,
      minY: y,
      maxY: y + boxSize
    };
  }

  getIconSetup(icon, x, y, boxSize) {
    const iconSize = 0.65 * boxSize;
    y = y + (this.area.height - boxSize) / 2;

    return {
      draw: (self) => self.graphics.drawIcon(icon, x, y, iconSize, boxSize, self.activeTool === icon),
      redraw: () => true,
      click: (self) => self.selectTool(icon),
      minX: x,
      maxX: x + boxSize,
      minY: y,
      maxY: y + boxSize
    };
  }

  // increment drawsize, restarting at 1 if it goes over max size
  toggleDrawSize() {
    // mod by max draw size, so max size would be 0 which is falsy
    // if mod value is 0, evaluate to maxDrawSize
    this.drawSize = ((this.drawSize + 1) % maxDrawSize) || maxDrawSize;
  }

  setDrawSize(size) {
    this.drawSize = parseInt(size) || this.drawSize;
  }

  getDrawSize() {
    return this.drawSize;
  }

  selectTool(icon) {
    this.activeTool = icon;
  }

  selectMarker() {
    this.selectTool(this.marker);
  }

  selectEraser() {
    this.selectTool(this.eraser);
  }

  isEraserSelected() {
    return this.activeTool === this.eraser;
  }

  draw() {
    // clear all controls
    this.ctx.clearRect(this.area.x, this.area.y, this.area.width, this.area.height);

    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].draw(this);
    }
  }

  handleClick(x, y) {
    // ignore clicks outside controls area
    if (y > this.area.height) return;

    for (let i = 0; i < this.elements.length; i++) {
      const element = this.elements[i];
      if (x >= element.minX && x <= element.maxX && y >= element.minY && y <= element.maxY) {
        element.click(this);
        break;
      }
    }
  }
}