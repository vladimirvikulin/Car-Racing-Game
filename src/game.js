'use strict';

const canvas = document.getElementById('canvas');

const ctx = canvas.getContext('2d');

window.addEventListener('resize', resize);

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resize();


