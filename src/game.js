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

let PLAYER1 = {};
let PLAYER2 = {};

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
  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

start();



