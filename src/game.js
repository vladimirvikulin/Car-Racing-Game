'use strict';

const canvas = document.getElementById('canvas');

const ctx = canvas.getContext('2d');

window.addEventListener('resize', resize);

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resize();

const gameSpeed = 5;
const objects = [];
const events = {};
const UPDATE_TIME = 1000 / 60;
let timer = null;
const scale = 0.12;

window.addEventListener('keydown', (e) => {
  events[e.code] = true;
  moveCar();
});

window.addEventListener('keyup', (e) => {
  events[e.code] = false;
});

let player1 = new Car(
  'images/yellowCar.png',
  canvas.width - 1460, canvas.height / 2,
  true,
  15,);

let player2 = new Car(
  'images/redCar.png',
  canvas.width - 500, canvas.height / 2,
  true,
  15,);

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
  }, 2000);
}

function update() {
  roads[0].update(roads[1]);
  roads[1].update(roads[0]);
  draw();
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

function moveCar() {
  if (player1.isPlayer) {
    if (events['ArrowLeft']) {
      player1.move('x', 0);
    }
    if (events['ArrowRight']) {
      player1.move('x', 1);
    }
    if (events['ArrowUp']) {
      player1.move('y', 0);
    }
    if (events['ArrowDown']) {
      player1.move('y', 1);
    }
  }
  if (player2.isPlayer) {
    if (events['KeyA']) {
      player2.move('x', 0);
    }
    if (events['KeyD']) {
      player2.move('x', 1);
    }
    if (events['KeyW']) {
      player2.move('y', 0);
    }
    if (events['KeyS']) {
      player2.move('y', 1);
    }
  }
  if (events['Escape']) {
    if (timer === null) {
      start();
    } else {
      reload();
    }
  }
}

function randomNum(min, max) {
  const rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}


start();



