//ChatGPT
const canvas = document.getElementById("sand-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

// get mouse coordinates
let mouseX;
let mouseY;
window.addEventListener('mousemove', function(e){
  mouseX = e.x;
  mouseY = e.y;
});
/*
let isMouseInsideCanvas

// add event listeners
canvas.addEventListener("mouseenter", () => {
    isMouseInsideCanvas = true;
  });
  
  canvas.addEventListener("mouseleave", () => {
    isMouseInsideCanvas = false;
  });
*/

// create SandParticle class
class SandParticle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.opacity = 1;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
  }

  applyRepellentForce(x, y, radius, strength) {
    const dx = this.x - x;
    const dy = this.y - y;
    const distance = Math.sqrt(dx*dx + dy*dy);

    if (distance < radius) {
      const force = strength * (1 - distance / radius);
      const angle = Math.atan2(dy, dx);
      this.vx += force * Math.cos(angle);
      this.vy += force * Math.sin(angle);
    }
  }

  update() {
    //If dont want to influence the particles when outside canvas
    //if(!isMouseInsideCanvas) return;

    // apply repelling force from mouse cursor    
    this.applyRepellentForce(mouseX, mouseY, 100, 0.25);

    // update position and velocity based on acceleration
    this.vx += this.ax;
    this.vy += this.ay;
    this.x += this.vx;
    this.y += this.vy;

    // update opacity
    //Not neede atm
    //this.opacity = 1;
    //if (this.opacity < 0.1) {
    //  this.opacity = 0.1;
    //}
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

// create particles
function init() {
    particlesArray = [];
    for (let i = 0; i < 1000; i++) {
        const radius = Math.random() * 3;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const color = "#c2b280";
        particlesArray.push(new SandParticle(x, y, radius, color));
    }
 
  
}

// animate particles
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //tx.fillStyle = "#e6d4b8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach((particle) => {
    particle.update();
    particle.draw();
  });
}

init();
animate();
