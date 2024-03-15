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
    this.y += game.gameSpeed;
    if (this.y > window.innerHeight) {
      this.y = road.y - canvas.width + game.gameSpeed;
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
    this.roundScore = 0;
    this.totalScore = 0;
    this.image = new Image();
    this.image.addEventListener('load', () => this.loaded = true);
    this.image.src = image;
  }
  update() {
    const BORDER_SHIFT = 50;
    if (this.isPlayer) this.roundScore++;
    if (!this.isPlayer) {
      this.y += game.gameSpeed;
    }
    if (this.y > canvas.height + BORDER_SHIFT) {
      this.dead = true;
    }
  }

  collision(car) {
    const collisionTop = this.y < car.y + car.image.height * game.scale;
    const collisionBottom = this.y + this.image.height * game.scale > car.y;
    const collisionLeft = this.x + this.image.width * game.scale > car.x;
    const collisionRight = this.x < car.x + car.image.width * game.scale;
    return (collisionTop && collisionBottom && collisionLeft && collisionRight);
  }

  move(coord, direction) {
    if (coord === 'x') {
      this.moveX(direction);
    } else {
      this.moveY(direction)
    }
  }

  moveX(direction) {
    if (direction === 'right') this.x += this.speed;
    else if (direction === 'left') this.x -= this.speed;
    const carX = this.x + this.image.width * game.scale;
    if (carX > canvas.width) this.x -= this.speed;
    if (this.x < 0) this.x = 0;
  }

  moveY(direction) {
    if (direction === 'down') this.y += this.speed;
    else if (direction === 'up') this.y -= this.speed;
    const carY = this.y + this.image.height * game.scale;
    if (!this.isEnemy && carY > canvas.height) this.y -= this.speed;
    if (!this.isEnemy && this.y < 0) this.y = 0;
  }

  pickCar1() {
    player1 = this;
    this.checkPlayer(player2);
  }

  pickCar2() {
    player2 = this;
    this.checkPlayer(player1);
  }

  checkPlayer(player) {
    if (player.hasOwnProperty('isPlayer')) {
      document.getElementById('p1').remove();
      document.getElementById('p2').remove();
      start();
    }
  }

  static createPlayer() {
    game.players++;
    const CAR_SHIFT = 100;
    const halfCanvasWidth = canvas.width / 2;
    return PLAYER_DATA.map(([color, speed]) => {
      let x = 0;
      if (game.players === 1) {
        x = halfCanvasWidth - CAR_SHIFT;
      } else {
        x = halfCanvasWidth + CAR_SHIFT;
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

