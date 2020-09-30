/** @format */

// full screen example -  https://www.yofla.com/black-screen/#

// todo : shoot function , add new graphics for enemies and they should shoot too

let player;
let enemies = [];
let enemy;
let laser = [];
let boundX;
let isShooting = false;
let gameCanvas = {
  canvas: document.createElement("Canvas"),

  start: function () {
    (this.canvas.width = 1920),
      (this.canvas.height = 1280),
      (this.context = this.canvas.getContext("2d"));
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(update, 20);

    window.addEventListener("keydown", (e) => {
      gameCanvas.key = e.keyCode;
    });

    window.addEventListener("keyup", (e) => {
      gameCanvas.key = false;
    });
  },

  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  stop: function () {
    clearInterval(this.interval);
  },
};

function checkInterval(n) {
  if ((gameCanvas.frameNo / n) % 1 === 0) return true;
  else return false;
}

function startGame() {
  gameCanvas.start();
  player = new compontent(100, 100, "img/Spaceship.png", 1000, 700, "image");
  boundX = gameCanvas.canvas.width;
  // enemy = new compontent(100, 100, "red", 100, 200);
}

window.addEventListener("DOMContentLoaded", startGame);

function compontent(width, height, color, x, y, type, isPlayer) {
  this.type = type;
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.speed = 0;
  if (type == "image") {
    this.image = new Image();
    this.image.src = color;
  }

  this.update = function () {
    let ctx = gameCanvas.context;

    if (type == "image") {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = color;
    }
  };

  this.newPos = function () {
    this.x += this.speed;
  };

  this.bounds = function () {
    if (this.x > boundX - this.width + 15) {
      let result = boundX - this.width + 15;
      this.x = result;
    } else if (this.x <= -8) {
      let result = -8;
      this.x = result;
    }
  };

  this.collideWith = function (otherObj) {
    let myLeft = this.x;
    let myRight = this.x + this.width;
    let myTop = this.y;
    let myBottom = this.y + this.height;
    let otherLeft = otherObj.x;
    let otherRight = otherObj.x + otherObj.width;
    let otherTop = otherObj.y;
    let otherBottom = otherObj.y + otherObj.height;
    let crash = true;

    if (
      myBottom < otherTop ||
      myTop > otherBottom ||
      myRight < otherLeft ||
      myLeft > otherRight
    ) {
      crash = false;
    }

    return crash;
  };
}

function update() {
  let x, y;

  // check collision
  for (let i = 0; i < enemies.length; i++) {
    if (player.collideWith(enemies[i])) {
      gameCanvas.stop();
    }
  }

  for (let x = 0; x < laser.length; x++) {}

  stopMovement();
  gameCanvas.clear();

  gameCanvas.frameNo += 1;

  input();

  player.newPos();
  player.update();
  player.bounds();

  if (isShooting === true) {
    setTimeout(() => {
      let y = player.y + player.height - 50;
      laser.push(new compontent(50, 50, "blue", player.x, y));
      isShooting = false;
    }, 2000);
  }

  for (let i = 0; i < laser.length; i++) {
    laser[i].update();
    laser[i].y -= 5;
  }

  console.log(gameCanvas.frameNo);

  // spawn enemies at random position
  if (gameCanvas.frameNo == 1 || checkInterval(150)) {
    x = gameCanvas.canvas.width;

    let minXPos = 20;
    let maxXPos = 1200;

    let randX = Math.floor(Math.random() * (maxXPos - minXPos + 1) + minXPos);

    console.log(`random x axis position is : ${randX}`);

    enemies.push(new compontent(100, 100, "red", randX, 50));
  }

  for (let i = 0; i < enemies.length; i++) {
    enemies[i].y += 1;
    enemies[i].update();
  }
}

stopMovement = () => (player.speed = 0);

function input() {
  if (
    (gameCanvas.key && gameCanvas.key == 37) ||
    (gameCanvas.key && gameCanvas.key == 65)
  ) {
    player.speed = -8;
  }

  if (
    (gameCanvas.key && gameCanvas.key == 39 && gameCanvas.key) ||
    gameCanvas.key == 68
  ) {
    player.speed = 8;
  }

  // space key
  if (gameCanvas.key && gameCanvas.key == 32) {
    isShooting = true;
  }
}
