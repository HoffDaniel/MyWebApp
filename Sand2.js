const canvas = document.getElementById("sand-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(x, y, radius) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = "#c2b280";
      this.velocity = {
        x: Math.random() - 0.5,
        y: Math.random() - 0.5
      };
    }
  
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = 'white';
      ctx.fill();
    }
  
    update() {
      this.x += this.velocity.x;
      this.y += this.velocity.y;
    }
  
    // Calculate the distance between two particles
    distance(particle) {
      const dx = this.x - particle.x;
      const dy = this.y - particle.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  
    // Apply a force to the particle based on its position relative to the mouse
    applyForce(mouseX, mouseY, power) {
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 25) {
        this.velocity.x += (dx / distance) * power;
        this.velocity.y += (dy / distance) * power;
      }
    }
  
    // Apply a force to the particle based on its position relative to another particle
    applyRepulsionForce(particle, power) {
      const distance = this.distance(particle);
      if (distance < 25) {
        const dx = this.x - particle.x;
        const dy = this.y - particle.y;
        this.velocity.x += (dx / distance) * power;
        this.velocity.y += (dy / distance) * power;
      }
    }
  }
  
const particles = [];
const particleCount = 1000;
console.log(particleCount);
for (let i = 0; i < particleCount; i++) {
    console.log("Particle [" + i + "]");
    const particle = new Particle(
    Math.random() * canvas.width,
    Math.random() * canvas.height,
    5
  );
  particles.push(particle);
}

update()

function update() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Apply a force to each particle based on the mouse position
    canvas.addEventListener('mousemove', e => {
      particles.forEach(particle => {
        particle.applyForce(e.clientX, e.clientY, 0.01);
      });
    });
  
    // Apply a repulsive force to each particle based on its distance to other particles
    particles.forEach(particle1 => {
      particles.forEach(particle2 => {
        if (particle1 !== particle2) {
          particle1.applyRepulsionForce(particle2, -0.01);
        }
      });
    });
  
    // Update and draw each particle
    particles.forEach(particle => {
      particle.update();
      particle.draw(ctx);
    });
  
    // Schedule the next update
    requestAnimationFrame(update);
  }
  