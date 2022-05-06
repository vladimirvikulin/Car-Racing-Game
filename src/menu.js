'use strict';

window.Game = class {
  constructor() {
    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.setScene(IntroScene);
    this.initInput();
    this.start();
  }
  initInput() {
    this.keys = {};
    document.addEventListener('keydown', e => { this.keys[e.which] = true; });
    document.addEventListener('keyup', e => { this.keys[e.which] = false; });
  }
  checkKeyPress(keyCode) {
    let isKeyPressed = this.keys[keyCode];
    this.lastKeyState = this.lastKeyState || {};
    if (typeof this.lastKeyState[keyCode] === 'undefined') {
      this.lastKeyState[keyCode] = isKeyPressed;
      return false;
    }

    if (this.lastKeyState[keyCode] !== isKeyPressed) {
      this.lastKeyState[keyCode] = isKeyPressed;
      return isKeyPressed;
    } else {
      return false;
    }
  }
  setScene(Scene) {
    this.activeScene = new Scene(this);
  }
  update(dt) {
    this.activeScene.update(dt);
  }
  render(dt) {
    this.ctx.save();
    this.activeScene.render(dt, this.ctx, this.canvas);
    this.ctx.restore();
  }

  start() {
    let last = performance.now();
    const step = 1 / 60;
    let dt = 0;
    let now;
    const frame = () => {
      now = performance.now();
      dt += (now - last) / 1000;
      while (dt > step) {
        dt -= step;
        this.update(step);
      }
      last = now;
      this.render(dt);
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
};

