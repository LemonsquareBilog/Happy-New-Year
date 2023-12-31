console.clear();

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const startBtn = document.querySelector('#start-button');
let btnOpacity = 1;
startBtn.style.opacity = btnOpacity;
let timer = 0;

const greetingText = document.querySelector('#greeting-container');
const secretMessageText = document.querySelector('#greeting-container p');
let greetingOpacity = 0;
let secretMsgOpacity = 0;
let flag = false;
let secretMsg = false;

let fireworksArr = [];
let explosionsArr = [];

class Firework {
  constructor(x, y, xVel, yVel, size, color) {
    this.x = x;
    this.y = y;
    this.xVel = xVel;
    this.yVel = yVel;
    this.size = size;
    this.hue = color;
    this.color = `hsla(${color}, 100%, 75%, 1)`;
    this.gravity = 0.2;
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
  update() {
    this.x += this.xVel;
    this.y += this.yVel;
    this.yVel += this.gravity;
    
    if (this.xVel > 0.1 && this.xVel < -0.1) {
      if (this.xVel > 0) {
        this.xVel -= 0.05;
      } else {
        this.xVel += 0.05;
      }
    }
  }
}

class Explosion {
  constructor(x, y, xVel, yVel, color) {
    this.x = x;
    this.y = y;
    this.xVel = xVel;
    this.yVel = yVel;
    this.size = 0;
    this.opacity = 1;
    this.hue = color;
    this.color = `hsla(${this.hue}, 100%, 75%, ${this.opacity})`;
    this.gravity = 0.1;
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
  update() {
    this.x += this.xVel;
    this.y += this.yVel;
    this.yVel += this.gravity;
    this.opacity -= Math.random() * 0.03;
    
    this.color = `hsla(${this.hue}, 100%, 75%, ${this.opacity})`;
    
    if (this.xVel > 0.1 && this.xVel < -0.1) {
      if (this.xVel > 0) {
        this.xVel -= 0.05;
      } else {
        this.xVel += 0.05;
      }
    }
    
    if (this.size < Math.random() * 3 + 1) {
      this.size += 0.05;
    }
  }
}

window.onload = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const showGreeting = () => {
    if (greetingText.style.opacity < 1) {
      greetingOpacity += 0.01;
      greetingText.style.opacity = greetingOpacity;
      requestAnimationFrame(showGreeting);
    }
    if (greetingText.style.opacity > 1) greetingText.style.opacity = 1;
  }
  
  const showSecretMsg = () => {
    console.log('secret message');
    if (secretMessageText.style.opacity < 1) {
      secretMsgOpacity += 0.01;
      secretMessageText.style.opacity = secretMsgOpacity;
      requestAnimationFrame(showSecretMsg);
    }
    if (greetingText.style.opacity > 1) greetingText.style.opacity = 1;
  }
  
  const getYVelocity = () => {
    let yVel = Math.random() * (canvas.height / -80 - 10);
    if (yVel > -12 && yVel < -16) {
      yVel = Math.random() * -6 - 12;
      console.log(yVel);
      return yVel;
    } else {
      console.log(yVel);
      return yVel;
    }
  }
  
  const startTheShow = () => {
    ctx.fillStyle= 'rgba(0,0,0,0.1)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    if (timer % Math.trunc(Math.random() * 25 + 30) === 0) {
      const size = Math.random() * 2 + 1;
      const x = Math.random() * (canvas.width * 0.5) + (canvas.width * 0.25);
      const y = canvas.height + size;
      const xVel = Math.random() * 4 - 2;
      const yVel = getYVelocity();
      const color = Math.floor(Math.random() * 360);
      fireworksArr.push(new Firework(x, y, xVel, yVel, size, color));
    }
    
    for (let i = 0; i < fireworksArr.length; i++) {
      fireworksArr[i].update();
      fireworksArr[i].draw();
      
      if (fireworksArr[i].yVel > Math.random() * 3) {
        for (let j = 0; j < Math.random() * 50 + 30; j++) {
          const x = fireworksArr[i].x;
          const y = fireworksArr[i].y;
          const xVel = Math.random() * 6 - 3;
          const yVel = Math.random() * 6 - 5;
          const color = fireworksArr[i].hue;
          explosionsArr.push(new Explosion(x, y, xVel, yVel, color));
        }
        fireworksArr.splice(i, 1);
        i--;
      }
    }
    
    
    for (let i = 0; i < explosionsArr.length; i++) {
      explosionsArr[i].update();
      explosionsArr[i].draw();
      
      if (explosionsArr[i].opacity < 0.01) {
        explosionsArr.splice(i, 1);
        //i--;
      }
    }
    
    if (timer > 500 && !flag) {
      flag = true;
      showGreeting();
    }
    
    if (timer > 2500 && !secretMsg) {
      secretMsg = true;
      showSecretMsg();
    }
    
    // if (explosionsArr.length > 0) console.log(explosionsArr[0].opacity);
    
    timer++;
    requestAnimationFrame(startTheShow);
  }
  
  const decreaseOpacity = () => {
    if (startBtn.style.opacity > 0.05) {
      startBtn.style.opacity = Number.parseFloat(btnOpacity);
      btnOpacity -= 0.05;
      requestAnimationFrame(decreaseOpacity);
    } else {
      startBtn.style.display = 'none';
    }
  }
  
  const handleClick = () => {
    console.log('clicked');
    decreaseOpacity();
    startTheShow();
  }
  
  startBtn.addEventListener('click', handleClick);
  
  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log(canvas.height)
  })
  
}

var rnd = Math.random,
  flr = Math.floor;

let canvas1 = document.createElement('canvas');
document.getElementsByTagName('body')[0].appendChild(canvas);
canvas.style.position = 'absolute';
canvas.style.width = '100%';
canvas.style.height = '100%';

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

let ctx1 = canvas.getContext('2d');

function rndNum(num) {
  return rnd() * num + 1;
}

function vector(x, y) {
  this.x = x;
  this.y = y;

  this.add = function(vec2) {
    this.x = this.x + vec2.x;
    this.y = this.y + vec2.y;
  }
}

function particle(pos, vel) {
  this.pos = new vector(pos.x, pos.y);
  this.vel = vel;
  this.dead = false;
  this.start = 0;

  this.update = function(time) {
    let timeSpan = time - this.start;

    if (timeSpan > 500) {
      this.dead = true;
    }

    if (!this.dead) {
      this.pos.add(this.vel);
      this.vel.y = this.vel.y + gravity;
    }
  };

  this.draw = function() {
    if (!this.dead) {
      drawDot(this.pos.x, this.pos.y, 1);
    }
  }

}

function firework(x, y) {

  this.pos = new vector(x, y);
  this.vel = new vector(0, -rndNum(10) - 3);
  this.color = 'hsl(' + rndNum(360) + ', 100%, 50%)'
  this.size = 4;
  this.dead = false;
  this.start = 0;
  let exParticles = [],
    exPLen = 100;

  let rootShow = true;

  this.update = function(time) {
    if (this.dead) {
      return;
    }

    rootShow = this.vel.y < 0;

    if (rootShow) {
      this.pos.add(this.vel);
      this.vel.y = this.vel.y + gravity;
    } else {
      if (exParticles.length === 0) {
        flash = true;
        for (let i = 0; i < exPLen; i++) {
          exParticles.push(new particle(this.pos, new vector(-rndNum(10) + 5, -rndNum(10) + 5)));
          exParticles[exParticles.length - 1].start = time;
        }
      }
      let numOfDead = 0;
      for (let i = 0; i < exPLen; i++) {
        let p = exParticles[i];
        p.update(time);
        if (p.dead) {
          numOfDead++;
        }
      }

      if (numOfDead === exPLen) {
        this.dead = true;
      }

    }
  }

  this.draw = function() {
    if (this.dead) {
      return;
    }

    ctx.fillStyle = this.color;
    if (rootShow) {
      drawDot(this.pos.x, this.pos.y, this.size);
    } else {
      for (let i = 0; i < exPLen; i++) {
        let p = exParticles[i];
        p.draw();
      }
    }
  }

}

function drawDot(x, y, size) {
  ctx.beginPath();

  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();

  ctx.closePath();
}

var fireworks = [],
  gravity = 0.2,
  snapTime = 0,
  flash = false;

function init() {
  let numOfFireworks = 20;
  for (let i = 0; i < numOfFireworks; i++) {
    fireworks.push(new firework(rndNum(canvas.width), canvas.height));
  }
}

function update(time) {
  for (let i = 0, len = fireworks.length; i < len; i++) {
    let p = fireworks[i];
    p.update(time);
  }
}

function draw(time) {
  update(time);

  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  if (flash) {
    flash = false;
  }
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'white';
  ctx.font = "30px Arial";
  let newTime = time - snapTime;
  snapTime = time;

  //ctx.fillText(newTime,10,50);

  ctx.fillStyle = 'blue';
  for (let i = 0, len = fireworks.length; i < len; i++) {
    let p = fireworks[i];
    if (p.dead) {
      fireworks[i] = new firework(rndNum(canvas.width), canvas.height);
      p = fireworks[i];
      p.start = time;
    }
    p.draw();
  }

  window.requestAnimationFrame(draw);
}

window.addEventListener('resize', function() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
});

init();
draw();
