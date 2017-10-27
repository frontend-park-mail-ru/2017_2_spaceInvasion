export default class Sprite {
  constructor(xPosition, yPosition, srcOfImage, width, height) {
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.image = new Image();
    this.image.src = srcOfImage;
    this.width = width;
    this.height = height;
  }
}
