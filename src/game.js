'use strict';

const canvas = document.getElementById('canvas');

const ctx = canvas.getContext('2d');

window.addEventListener('resize', resize);

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resize();

let gameSpeed = 5;
const objects = [];
const codes = {
  'ArrowLeft': false,
  'ArrowRight': false,
  'ArrowUp': false,
  'ArrowDown': false,
  'KeyA': false,
  'KeyD': false,
  'KeyW': false,
  'KeyS': false,
  'Escape': false,
};
const UPDATE_TIME = 1000 / 60;
let timer = null;
const scale = 0.12;
let players = 0;
const CAR_SHIFT = 100;
const PLAYER_DATA = [
  ['yellow', 10],
  ['red', 9],
  ['black', 8],
  ['purple', 6],
];
const ENEMY_DATA = [
  ['enemyCar1', 9],
  ['enemyCar2', 10],
  ['enemyCar3', 7],
  ['enemyCar4', 6],
];

let player1 = {};
let player2 = {};

const PLAYER1_CARS = Car.createPlayer();
const PLAYER2_CARS = Car.createPlayer();

const roads = [
  new Road('./images/road.png', 0),
  new Road('./images/road.png', canvas.width)
];

function start() {
  timer = setInterval(update, UPDATE_TIME);
}

function reload() {
  setTimeout(() => {
    clearInterval(timer);
    timer = null;
    location.reload();
  }, 7000);
}

function update() {
  roads[0].update(roads[1]);
  roads[1].update(roads[0]);
  player1.update();
  player2.update();

  for (let i = 0; i < objects.length; i++) {
    objects[i].update();
    if (objects[i].dead) {
      objects.splice(i, 1);
    }
  }
  let hit = false;

  for (let i = 0; i < objects.length; i++) {
    hit = player1.collision(objects[i]);
    if (hit) {
      player1.dead = true;
      player1.isPlayer = false;
      if (gameSpeed !== 5) gameSpeed -= 5;
      soundEfects();
      break;
    }

    hit = player2.collision(objects[i]);
    if (hit) {
      player2.dead = true;
      player2.isPlayer = false;
      if (gameSpeed !== 5) gameSpeed -= 5;
      soundEfects();
      break;
    }
  }
  draw();
  if (player1.dead && player2.dead) {
    endScore();
    reload();
  }
  spawnEnemies();
  moveEnemy();
  moveCar();
  gameDifficulty();
}

function spawnEnemies() {
  if (randomNum(0, 10) > 9) {
    const ENEMY_CARS = Car.createEnemy();
    switch (randomNum(1, 4)) {
    case 1:
      objects.push(ENEMY_CARS[0]);
      break;
    case 2:
      objects.push(ENEMY_CARS[1]);
      break;
    case 3:
      if (player1.score >= 1000 || player2.score >= 1000) {
        objects.push(ENEMY_CARS[2]);
      }
      break;
    case 4:
      if (player1.score >= 1500 || player2.score >= 1500) {
        objects.push(ENEMY_CARS[3]);
      }
      break;
    }
  }
  console.log(objects);
}

function moveEnemy() {
  for (const car of objects) {
    car.move('y', 'down');
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < roads.length; i++) {
    ctx.drawImage(
      roads[i].image,
      0,
      0,
      roads[i].image.width,
      roads[i].image.height,
      roads[i].x,
      roads[i].y,
      canvas.width,
      canvas.width
    );
  }

  drawCar(player1);
  drawCar(player2);

  for (let i = 0; i < objects.length; i++) {
    drawCar(objects[i]);
  }
  ctx.fillStyle = 'white';
  ctx.font = '30px Comic Sans MS';
  ctx.fillText('Счет игрока №1: ' + player1.score, canvas.width / 40, canvas.height - 20);
  ctx.fillText('Счет игрока №2: ' + player2.score,  canvas.width / 1.25 , canvas.height - 20);
}

function drawCar(car) {
  ctx.drawImage(
    car.image,
    0,
    0,
    car.image.width,
    car.image.height,
    car.x,
    car.y,
    car.image.width * scale,
    car.image.height * scale
  );
}

function soundEfects() {
  const collision = new Audio();
  collision.src = './audio/collision.wav';
  collision.play();
}

function moveCar() {
  window.addEventListener('keydown', (e) => {
    codes[e.code] = true;
  });
  window.addEventListener('keyup', (e) => {
    codes[e.code] = false;
  });
  if (player1.isPlayer) {
    if (codes['KeyA']) player1.move('x', 'left');
    if (codes['KeyD']) player1.move('x', 'right');
    if (codes['KeyW']) player1.move('y', 'up');
    if (codes['KeyS']) player1.move('y', 'down');
  }
  if (player2.isPlayer) {
    if (codes['ArrowLeft']) player2.move('x', 'left');
    if (codes['ArrowRight']) player2.move('x', 'right');
    if (codes['ArrowUp']) player2.move('y', 'up');
    if (codes['ArrowDown']) player2.move('y', 'down');
  }
  if (codes['Escape']) {
    if (timer === null) start();
    else reload();
  }
}

function randomNum(min, max) {
  const rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

function endScore() {
  const congrag1 = 'Поздравляю игрок №1 набрал больше очков. Его счет:';
  const congrag2 = 'Поздравляю игрок №2 набрал больше очков. Его счет:';
  if (player1.score > player2.score) {
    ctx.font = '40px Comic Sans MS';
    ctx.fillStyle = '#00ffff';
    ctx.fillText(congrag1 + player1.score,
      (canvas.width - ctx.measureText(congrag1).width) / 2,
      canvas.height / 2);
  }
  if (player2.score > player1.score) {
    ctx.font = '40px Comic Sans MS';
    ctx.fillStyle = '#00ffff';
    ctx.fillText(congrag2 + player2.score,
      (canvas.width - ctx.measureText(congrag2).width) / 2,
      canvas.height / 2);
  }
}

function gameDifficulty() {
  if (player1.score === 1000 || player2.score === 1000 ||
    player1.score === 2000 || player2.score === 2000 ||
    player1.score === 3000 || player2.score === 3000 ||
    player1.score === 4000 || player2.score === 4000 ||
    player1.score === 5000 || player2.score === 5000) {
    gameSpeed += 5;
  }
}
