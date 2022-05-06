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

// Intro scene
window.IntroScene = class {
  constructor(game) {
    this.logoRevealTime = 2;
    this.textTypingTime = 2;
    this.sceneDisplayTime = 6;
    this.elapsedTime = 0;
    this.bigText = 'Car-Racing';
    this.infoText = 'This is game for two players, just dodge enemies and beat your opponent';
    this.game = game;
  }
  update(dt) {
    this.elapsedTime += dt;
    if (this.elapsedTime >= this.sceneDisplayTime || this.game.checkKeyPress(13)) { //press Enter to skip IntroScene
      this.game.setScene(MenuScene);
    }
  }
  render(dt, ctx, canvas) {
    // fill background
    const backgroundImage = new Image();
    backgroundImage.src = './images/introBackground.png';
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 650, 50);
    // draw big logo text
    ctx.globalAlpha = Math.min(1, this.elapsedTime / this.logoRevealTime);
    ctx.font = '80px Comic Sans MS';
    ctx.fillStyle = '#000';
    ctx.fillText(this.bigText, (canvas.width - ctx.measureText(this.bigText).width) / 2, canvas.height / 2);
    // draw typing text
    if (this.elapsedTime >= this.logoRevealTime) {
    let textProgress = Math.min(1, (this.elapsedTime - this.logoRevealTime) / this.textTypingTime);
      ctx.font = '20px Comic Sans MS';
      ctx.fillStyle = '#000';
      ctx.fillText(this.infoText.substr(0, Math.floor(this.infoText.length * textProgress)),
        (canvas.width - ctx.measureText(this.infoText).width) / 2, canvas.height / 2 + 80);
    }
  }
};

