/* cursor.js - Custom desktop cursor tracking logic */

class CustomCursor {
  constructor() {
    this.dot = document.getElementById('custom-cursor');
    this.ring = document.getElementById('custom-cursor-ring');
    
    if (!this.dot || !this.ring) return;
    
    // Position coordinates
    this.mouse = { x: -100, y: -100 };
    this.ringPos = { x: -100, y: -100 };
    
    this.init();
  }
  
  init() {
    // Only run on desktop devices
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      window.addEventListener('mousemove', (e) => this.onMouseMove(e));
      this.setupHoverTriggers();
      this.animate();
    } else {
      // Hide cursor elements completely on touch screens
      this.dot.style.display = 'none';
      this.ring.style.display = 'none';
    }
  }
  
  onMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    
    // Move dot immediately
    this.dot.style.left = `${this.mouse.x}px`;
    this.dot.style.top = `${this.mouse.y}px`;
    
    // Make sure they are visible once moved
    if (this.dot.style.opacity === '0' || this.dot.style.opacity === '') {
      this.dot.style.opacity = '1';
      this.ring.style.opacity = '1';
    }
  }
  
  setupHoverTriggers() {
    // Selector for interactive elements
    const clickables = 'a, button, input, textarea, select, .clickable, .social-link-item';
    
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(clickables)) {
        document.body.classList.add('cursor-hovering');
      }
    });
    
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(clickables)) {
        document.body.classList.remove('cursor-hovering');
      }
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      this.dot.style.opacity = '0';
      this.ring.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
      this.dot.style.opacity = '1';
      this.ring.style.opacity = '1';
    });
  }
  
  animate() {
    // Interpolate outer ring position (lerp) for smooth tracking drag
    const ease = 0.15;
    
    this.ringPos.x += (this.mouse.x - this.ringPos.x) * ease;
    this.ringPos.y += (this.mouse.y - this.ringPos.y) * ease;
    
    this.ring.style.left = `${this.ringPos.x}px`;
    this.ring.style.top = `${this.ringPos.y}px`;
    
    requestAnimationFrame(() => this.animate());
  }
}

// Instantiate cursor on load
window.addEventListener('DOMContentLoaded', () => {
  new CustomCursor();
});
