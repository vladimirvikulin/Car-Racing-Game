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

class Car {
  constructor(image, x, y, isPlayer, isEnemy, speed) {
    this.x = x;
    this.y = y;
    this.loaded = false;
    this.dead = false;
    this.isPlayer = isPlayer;
    this.isEnemy = isEnemy;
    this.speed = speed;
    this.image = new Image();
    let obj = this;
    this.image.addEventListener('load', () => obj.loaded = true);
    this.image.src = image;
  }
  update() {
    if (!this.isPlayer) {
      this.y += gameSpeed;
    }
    if (this.y > canvas.height + 50) {
      this.dead = true;
    }
  }

  collision(car) {
    let hit = false;

    if (this.y < car.y + car.image.height * scale &&
      this.y + this.image.height * scale > car.y &&
      this.x + this.image.width * scale > car.x &&
      this.x < car.x + car.image.width * scale) {
      hit = true;
    }
    return hit;
  }

  move(coord, direction) {
    if (coord === 'x') {
      direction ? this.x += this.speed : this.x -= this.speed; 
      if (this.x + this.image.width * scale > canvas.width) {
        this.x -= this.speed;
      }
      if (this.x < 0) {
        this.x = 0;
      }
    } else {
      direction ? this.y += this.speed : this.y -= this.speed;
      if (!this.isEnemy) {
        if (this.y + this.image.height * scale > canvas.height) {
          this.y -= this.speed;
        }
        if (this.y < 0) {
          this.y = 0;
        }
      }
    }
  }
}
