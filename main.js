// setup canvas
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// function to generate random number
function random(min, max) {
  //return a number between min and max
  let num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

//Objects definitions
function Shape(x, y, velX, velY, exist) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exist = exist; //boolean
}

function Ball(x, y, velX, velY, exist, color, size) {
  Shape.call(this, x, y, velX, velY, exist);
  this.color = color;
  this.size = size;

  //method to draw the ball
  this.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  //method to update and see the velocity + edge bouncing
  this.update = function() {
    if ((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  // balls change color if they hit each others
  this.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
      if (!(this === balls[j])) {
        let dx = this.x - balls[j].x;
        let dy = this.y - balls[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + balls[j].size && balls[j].exist) {
          balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
        }
      }
    }
  }
}

function EvilCircle(x, y, velX, velY, exist) {
  Shape.call(this, x, y, 20, 20, exist);
  this.color = 'white';
  this.size = 10;

  this.draw = function() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 5;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }
  
  //window borders are limits
  this.checkBounds = function() {
    if ((this.x + this.size) >= width) {
      this.x = width - (this.size);
    }

    if ((this.x - this.size) <= 0) {
      this.x = (this.size);
    }

    if ((this.y + this.size) >= height) {
      this.y = height - (this.size);
    }

    if ((this.y - this.size) <= 0) {
      this.y = (this.size);
    }

  }

  this.setControls = function() {
    let _this = this;
    window.onkeydown = function(e) {
      if (e.keyCode === 65) {
        _this.x -= _this.velX;
      } else if (e.keyCode === 68) {
        _this.x += _this.velX;
      } else if (e.keyCode === 87) {
        _this.y -= _this.velY;
      } else if (e.keyCode === 83) {
        _this.y += _this.velY;
      }
    }
  }

  this.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
      if (balls[j].exist === true) {
        let dx = this.x - balls[j].x;
        let dy = this.y - balls[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + balls[j].size) {
          balls[j].exist = false;
        }
      }
    }
  }
}

let balls = [];
let evilCircle = new EvilCircle(width/2, height/2, true);
evilCircle.setControls();
let ballCountDisplay = document.getElementById("ballCount");

//time spent to catch all the balls, continued after the game loop invocation
let timer = document.getElementById("timer");
let startTime = new Date();


function loop() {

  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

  while (balls.length < 25) {
    let size = random(10, 20);
    let ball = new Ball(
      random(0 + size, width - size),
      random(0 + size, height - size),
      random(-7, 7),
      random(-7, 7),
      true,
      'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
      size
    );
    balls.push(ball);

  }

  for (let i = 0; i < balls.length; i++) {
    if (balls[i].exist === true) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }

  let ballCountValue = 0;
  for (let i = 0; i < balls.length; i++) {
    if (balls[i].exist === true) {
      ballCountValue += 1;
    }
  }
  ballCountDisplay.textContent = 'Ball count: ' + ballCountValue;

  requestAnimationFrame(loop);
}

loop();

//time spent continued
let timing = setInterval(elapsedTime, 1000);

function elapsedTime() {
  let existCount = 25;
  let currentTime = new Date();
  timer.textContent = 'Timer: ' + Math.round((currentTime - startTime)/1000);
  for (let i = 0; i < balls.length; i++) {
    if (balls[i].exist === false) {
      existCount -= 1;
    }
  }
  if (existCount === 0) {
    clearInterval(timing);
  }
}
