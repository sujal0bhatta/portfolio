/* particles.js - Canvas Particle Animation Engine for Hero Section */

class ParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 60;
    this.connectionDistance = 120;
    this.mouse = { x: null, y: null, radius: 150 };
    
    this.init();
    this.animate();
    this.setupListeners();
  }
  
  init() {
    this.resizeCanvas();
    this.createParticles();
  }
  
  resizeCanvas() {
    this.canvas.width = this.canvas.parentElement.offsetWidth;
    this.canvas.height = this.canvas.parentElement.offsetHeight;
    
    // Adjust density based on screen size
    if (window.innerWidth < 768) {
      this.particleCount = 30;
      this.connectionDistance = 80;
    } else {
      this.particleCount = 65;
      this.connectionDistance = 120;
    }
  }
  
  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      const size = Math.random() * 2 + 1;
      const x = Math.random() * (this.canvas.width - size * 2) + size;
      const y = Math.random() * (this.canvas.height - size * 2) + size;
      // Soft velocity
      const directionX = (Math.random() - 0.5) * 0.4;
      const directionY = (Math.random() - 0.5) * 0.4;
      
      this.particles.push({
        x,
        y,
        directionX,
        directionY,
        size
      });
    }
  }
  
  setupListeners() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createParticles();
    });
    
    // Track mouse coordinates for interactive connections
    const heroSection = this.canvas.parentElement;
    heroSection.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
    
    heroSection.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Resolve theme-specific colors
    const isLightTheme = document.body.classList.contains('light-theme');
    const particleColor = isLightTheme ? 'rgba(139, 92, 246, 0.25)' : 'rgba(6, 182, 212, 0.25)';
    const lineColor = isLightTheme ? 'rgba(139, 92, 246, 0.08)' : 'rgba(6, 182, 212, 0.08)';
    
    // Update and draw particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      
      // Move particles
      p.x += p.directionX;
      p.y += p.directionY;
      
      // Bounce off borders
      if (p.x < 0 || p.x > this.canvas.width) p.directionX = -p.directionX;
      if (p.y < 0 || p.y > this.canvas.height) p.directionY = -p.directionY;
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particleColor;
      this.ctx.fill();
      
      // Draw line connections between particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < this.connectionDistance) {
          const alpha = (1 - dist / this.connectionDistance) * 0.55;
          this.ctx.strokeStyle = isLightTheme 
            ? `rgba(139, 92, 246, ${alpha * 0.15})` 
            : `rgba(6, 182, 212, ${alpha * 0.15})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
      
      // Mouse interactions: draw lines to mouse
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < this.mouse.radius) {
          const alpha = (1 - dist / this.mouse.radius) * 0.7;
          this.ctx.strokeStyle = isLightTheme 
            ? `rgba(139, 92, 246, ${alpha * 0.25})` 
            : `rgba(6, 182, 212, ${alpha * 0.25})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  new ParticleEngine('hero-particles');
});
