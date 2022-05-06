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
    const isKeyPressed = this.keys[keyCode];
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
    ctx.drawImage(backgroundImage, canvas.width / 2 - backgroundImage.width / 2,
      canvas.height / 2 - backgroundImage.height / 2 - 150);
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

// Menu scene
window.MenuScene = class {
  constructor(game) {
    // set default values
    this.game = game;
    this.opacityDirection = 1;
    this.menuActiveOpacity = 0;
    this.menuIndex = 0;
    this.menuTitle = 'Game Menu';
    this.menuItems = [
      'Start',
      'Garage',
      'Exit'
    ];
  }
  update(dt) {
    // calculate active menu item opacity
    const opacityValue = this.menuActiveOpacity + dt * this.opacityDirection;
    if (opacityValue > 1 || opacityValue < 0) this.opacityDirection *= -1;
    this.menuActiveOpacity += dt * this.opacityDirection;

    // menu navigation
    if (this.game.checkKeyPress(83)) { // DOWN arrow
      this.menuIndex++;
      this.menuIndex %= this.menuItems.length;
    } else if (this.game.checkKeyPress(87)) { // UP arrow
      this.menuIndex--;
      if (this.menuIndex < 0) this.menuIndex = this.menuItems.length -1;
    }

    // menu item selected
    if (this.game.checkKeyPress(13)) {
      switch (this.menuIndex) {
      case 0: this.game.setScene(GameScene); break;
      case 1: this.game.setScene(Garage); break;
      case 2: this.game.setScene(ExitScene); break;
      }
    }
  }
  render(dt, ctx, canvas) {
    //fill menu background
    const backgroundImage = new Image();
    backgroundImage.src = './images/menuBackground.png';
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0);
    // draw menu title
    ctx.font = '60px Comic Sans MS';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#00ffff';
    ctx.fillText(this.menuTitle, (canvas.width - ctx.measureText(this.menuTitle).width) / 2, 10);

    // draw menu items
    const itemHeight = 50, fontSize = 30;
    ctx.font = fontSize + 'px Comic Sans MS';
    for (const [index, item] of this.menuItems.entries()) {
      if (index === this.menuIndex) {
        ctx.globalAlpha = this.menuActiveOpacity;
        ctx.fillStyle = '#089cd3';
        ctx.fillRect(0, canvas.height / 2 + index * itemHeight, canvas.width, itemHeight);
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff';
      ctx.fillText(item, (canvas.width - ctx.measureText(item).width) / 2, canvas.height / 2 + index * itemHeight + (itemHeight - fontSize) / 2);
    }
  }
};

// Main game scene
window.GameScene = function render() {
  const a = document.createElement('a');
  a.href = 'index.html';
  a.download = 'index.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

window.Garage = function render() {
  const a = document.createElement('a');
  a.href = 'garage.html';
  a.download = 'garage.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// Exit scene
window.ExitScene = function render() {
  window.close();
};

// launch game
const game = new Game();
