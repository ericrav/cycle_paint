import Color from 'color';


const startColor = Color('#FF0000');

export default class Palette {

  constructor() {
    const colors = [];
    for (let i = 0; i < 360; i += 360/256) {
      colors.push(startColor.hue(i));
    }
    this.colors = colors;
    this.colorIndex = 0;

    const incrementColor = () => {
      this.colorIndex = (this.colorIndex + 1) % this.getSize();
      requestAnimationFrame(incrementColor);
    };
    requestAnimationFrame(incrementColor);
  }

  getSize() {
    return this.colors.length;
  }

  getColorIndex() {
    return this.colorIndex;
  }

  getCurrentColor() {
    return this.getColor(this.getColorIndex());
  }

  getColor(i) {
    return this.colors[i % this.getSize()].rgb().string();
  }
}