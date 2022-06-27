'use strict';

const canvas = document.getElementById('canvas');

const ctx = canvas.getContext('2d');

window.addEventListener('resize', resize);

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resize();

const game = {
  gameSpeed: 5,
  fps: 1000 / 60,
  timer: null,
  scale: 0.12,
  players: 0,
  round: 0,
  font: 'Comic Sans MS',
  directionPlayer1: undefined,
  directionPlayer2: undefined,
};

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

const codesDirections = {
  'ArrowLeft': 'left',
  'ArrowRight': 'right',
  'ArrowUp': 'up',
  'ArrowDown': 'down',
  'KeyA': 'left',
  'KeyD': 'right',
  'KeyW': 'up',
  'KeyS': 'down',
};

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

window.addEventListener('keydown', (e) => {
  const key = e.code;
  codes[key] = true;
  if (key === 'KeyA' || key === 'KeyD' || key === 'KeyW' || key === 'KeyS') {
    game.directionPlayer1 = codesDirections[key];
  }
  if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
    game.directionPlayer2 = codesDirections[key];
  }
});
window.addEventListener('keyup', (e) => {
  codes[e.code] = false;
});


function start() {
  if (game.round === 0) backgroundMusic();
  setStartSettings();
  showRound();
  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.timer = setInterval(update, game.fps);
  }, 2000);
}

function reload() {
  clearInterval(game.timer);
  game.timer = null;
  setTimeout(() => {
    location.reload();
  }, 5000);
}

function update() {
  roads[0].update(roads[1]);
  roads[1].update(roads[0]);
  player1.update();
  player2.update();
  checkEnemyDead();
  collision(player1);
  collision(player2);
  draw();
  spawnEnemies();
  moveEnemy();
  moveCar(game.directionPlayer1, game.directionPlayer2);
  gameDifficulty();
  if (player1.dead && player2.dead && game.round === 3) {
    endScore();
    reload();
  }
  if (player1.dead && player2.dead && game.round < 3) {
    nextRound();
  }
}

function backgroundMusic() {
  const gameMusic = new Audio();
  gameMusic.src = './audio/gameMusic.mp3';
  gameMusic.play();
}

function collision(player) {
  for (const object of objects) {
    const hit = player.collision(object);
    if (hit) {
      player.dead = true;
      player.isPlayer = false;
      if (game.gameSpeed !== 5) game.gameSpeed -= 5;
      collisionSound();
      break;
    }
  }
}

function checkEnemyDead() {
  for (let i = 0; i < objects.length; i++) {
    objects[i].update();
    if (objects[i].dead) {
      objects.splice(i, 1);
    }
  }
}

function spawnEnemies() {
  if (randomNum(0, 10) > 9) {
    const ENEMY_CARS = Car.createEnemy();
    const carIndex = randomNum(0, 3);
    if (carIndex < 2) {
      objects.push(ENEMY_CARS[carIndex]);
    } else {
      if ((player1.roundScore >= 1000 || player2.roundScore >= 1000) && carIndex === 2) {
        objects.push(ENEMY_CARS[carIndex]);
      } else if ((player1.roundScore >= 1500 || player2.roundScore >= 1500) && carIndex === 3) {
        objects.push(ENEMY_CARS[carIndex]);
      }
    }
  }
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

  for (const object of objects) {
    drawCar(object);
  }
  const BOTTOM_SHIFT = 20;
  ctx.fillStyle = '#ffffff';
  ctx.font = `30px ${game.font}`;
  ctx.fillText('Счет игрока №1: ' + player1.roundScore,
    canvas.width / 40, canvas.height - BOTTOM_SHIFT);
  ctx.fillText('Счет игрока №2: ' + player2.roundScore,
    canvas.width / 1.25, canvas.height - BOTTOM_SHIFT);
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
    car.image.width * game.scale,
    car.image.height * game.scale
  );
}

function collisionSound() {
  const collision = new Audio();
  collision.src = './audio/collision.wav';
  collision.play();
}

function moveCar(directionPlayer1, directionPlayer2) {
  if (player1.isPlayer) {
    if (codes['KeyA'] || codes['KeyD']) player1.move('x', directionPlayer1);
    if (codes['KeyW'] || codes['KeyS']) player1.move('y', directionPlayer1);
  }
  if (player2.isPlayer) {
    if (codes['ArrowLeft'] || codes['ArrowRight']) player2.move('x', directionPlayer2);
    if (codes['ArrowUp'] || codes['ArrowDown']) player2.move('y', directionPlayer2);
  }
  if (codes['Escape']) {
    if (game.timer === null) start();
    else reload();
  }
}

function randomNum(min, max) {
  const rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

function endScore() {
  const congrag1 = 'Поздравляю, игрок №1 набрал больше очков. Его счет:';
  const congrag2 = 'Поздравляю, игрок №2 набрал больше очков. Его счет:';
  player1.totalScore += player1.roundScore;
  player2.totalScore += player2.roundScore;
  if (player1.totalScore > player2.totalScore) {
    ctx.font = `40px ${game.font}`;
    ctx.fillStyle = '#00ffff';
    ctx.fillText(congrag1 + player1.totalScore,
      (canvas.width - ctx.measureText(congrag1).width) / 2,
      canvas.height / 2);
  }
  if (player2.totalScore > player1.totalScore) {
    ctx.font = `40px ${game.font}`;
    ctx.fillStyle = '#00ffff';
    ctx.fillText(congrag2 + player2.totalScore,
      (canvas.width - ctx.measureText(congrag2).width) / 2,
      canvas.height / 2);
  }
}

function gameDifficulty() {
  if (player1.roundScore % 1000 === 0 || player2.roundScore % 1000 === 0) {
    game.gameSpeed += 5;
  }
}

function showRound() {
  const MIDDLE_SHIFT = 100;
  game.round++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `40px ${game.font}`;
  ctx.fillStyle = '#00ffff';
  ctx.fillText('Round №' + game.round,
    (canvas.width - ctx.measureText('Round №').width) / 2,
    canvas.height / 2);
  ctx.font = `30px ${game.font}`;
  ctx.fillText('Общий счет игрока №1: ' + player1.totalScore,
    canvas.width / 10, canvas.height / 2 + MIDDLE_SHIFT);
  ctx.fillText('Общий счет игрока №2: ' + player2.totalScore,
    canvas.width / 1.5, canvas.height / 2 + MIDDLE_SHIFT);
}

function nextRound() {
  clearInterval(game.timer);
  game.timer = null;
  start();
}

function setStartSettings() {
  player1.dead = false;
  player1.isPlayer = true;
  player2.dead = false;
  player2.isPlayer = true;
  game.gameSpeed = 5;
  objects.length = 0;
  const CAR_SHIFT = 100;
  player1.x = canvas.width / 2 - CAR_SHIFT;
  player1.y = canvas.height / 2;
  player2.x = canvas.width / 2 + CAR_SHIFT;
  player2.y = canvas.height / 2;
  player1.totalScore += player1.roundScore;
  player2.totalScore += player2.roundScore;
  player1.roundScore = 0;
  player2.roundScore = 0;
}


