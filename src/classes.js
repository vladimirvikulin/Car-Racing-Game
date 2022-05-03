'use strict';

class Road {
  constructor(image, y) {
    this.x = 0;
    this.y = y;
    this.loaded = false;
    this.image = new Image();
    let obj = this;
    this.image.addEventListener('load', () => obj.loaded = true);
    this.image.src = image;
  }

  update(road) {
    this.y += gameSpeed;
    if (this.y > window.innerHeight) {
      this.y = road.y - canvas.width + gameSpeed;
    }
  }
}

