'use strict';

class Road {
  constructor(image, y) {
    this.x = 0;
    this.y = y;
    this.loaded = false;
    this.image = new Image();
    this.image.addEventListener('load', () => this.loaded = true);
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
    this.score = 0;
    this.image = new Image();
    this.image.addEventListener('load', () => this.loaded = true);
    this.image.src = image;
  }
  update() {
    const BORDER_SHIFT = 50;
    if (this.isPlayer) this.score++;
    if (!this.isPlayer) {
      this.y += gameSpeed;
    }
    if (this.y > canvas.height + BORDER_SHIFT) {
      this.dead = true;
    }
  }

  collision(car) {
    const collisionTop = this.y < car.y + car.image.height * scale;
    const collisionBottom = this.y + this.image.height * scale > car.y;
    const collisionLeft = this.x + this.image.width * scale > car.x;
    const collisionRight = this.x < car.x + car.image.width * scale;
    return (collisionTop && collisionBottom && collisionLeft && collisionRight);
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
  pickCar1() {
    player1 = this;
    if (player2.hasOwnProperty('isPlayer')) {
      document.getElementById('p1').remove();
      document.getElementById('p2').remove();
      start();
    }
  }

  pickCar2() {
    player2 = this;
    if (player1.hasOwnProperty('isPlayer')) {
      document.getElementById('p1').remove();
      document.getElementById('p2').remove();
      start();
    }
  }

  static createPlayer() {
    players++;
    return PLAYER_DATA.map(([color, speed]) => {
      let x = 0;
      if (players === 1) {
        x = canvas.width / 2 - CAR_SHIFT;
      } else {
        x = canvas.width / 2 + CAR_SHIFT;
      }
      const y = canvas.height / 2;
      const img = `./images/${color}Car.png`;
      return new this(img, x, y, true, false, speed);
    });
  }

  static createEnemy() {
    return ENEMY_DATA.map(([name, speed]) => {
      const x = randomNum(30, canvas.width - 50);
      const y = randomNum(250, 400) * -1;
      const img = `./images/${name}.png`;
      return new this(img, x, y, false, true, speed);
    });
  }
}

