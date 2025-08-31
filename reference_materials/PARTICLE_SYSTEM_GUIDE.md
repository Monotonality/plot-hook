# Particle Collision System Guide

## Overview
This guide explains the particle collision system used in Plot Hook, which creates an animated background with floating particles that collide with each other and bounce off walls. The system is implemented using HTML5 Canvas and JavaScript.

## How It Works

### Core Concepts
1. **Particles**: Small circular objects with position, velocity, size, and opacity
2. **Collision Detection**: Detecting when two particles touch each other
3. **Collision Response**: Calculating how particles bounce off each other
4. **Wall Bouncing**: Particles bounce off the canvas boundaries
5. **Animation Loop**: Continuous update and rendering cycle

## Implementation

### 1. Basic Setup

```javascript
// Create canvas element
const canvas = document.createElement('canvas');
canvas.className = 'particle-canvas';
canvas.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
`;

// Get 2D context
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
}
```

### 2. Particle Class

```javascript
class Particle {
    constructor(x, y, size, opacity) {
        this.x = x;                    // X position
        this.y = y;                    // Y position
        this.size = size;              // Radius
        this.opacity = opacity;        // Transparency (0-1)
        this.vx = (Math.random() - 0.5) * 0.6;  // X velocity
        this.vy = (Math.random() - 0.5) * 0.6;  // Y velocity
        this.originalSize = size;      // Store original size
        this.originalOpacity = opacity; // Store original opacity
    }
    
    update() {
        // Update position based on velocity
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off walls
        this.handleWallCollision();
        
        // Add slight random movement
        this.addRandomMovement();
        
        // Limit velocity to prevent excessive speed
        this.limitVelocity();
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
```

### 3. Wall Collision Detection

```javascript
handleWallCollision() {
    // Bounce off left and right walls
    if (this.x <= this.size || this.x >= canvas.width - this.size) {
        this.vx = -this.vx;
        this.x = Math.max(this.size, Math.min(canvas.width - this.size, this.x));
    }
    
    // Bounce off top and bottom walls
    if (this.y <= this.size || this.y >= canvas.height - this.size) {
        this.vy = -this.vy;
        this.y = Math.max(this.size, Math.min(canvas.height - this.size, this.y));
    }
}
```

### 4. Particle Collision Detection

```javascript
collidesWith(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (this.size + other.size);
}
```

**How it works:**
- Calculate the distance between particle centers
- If distance < sum of radii, particles are colliding
- Uses Pythagorean theorem: `√(dx² + dy²)`

### 5. Collision Response (Elastic Collision)

```javascript
handleCollision(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance === 0) return; // Prevent division by zero
    
    // Calculate collision normal (direction from other to this)
    const nx = dx / distance;
    const ny = dy / distance;
    
    // Calculate relative velocity
    const relativeVelocityX = this.vx - other.vx;
    const relativeVelocityY = this.vy - other.vy;
    
    // Calculate speed along collision normal
    const speed = relativeVelocityX * nx + relativeVelocityY * ny;
    
    if (speed < 0) return; // Particles are already moving apart
    
    // Elastic collision formula
    const impulse = 2 * speed / (this.size + other.size);
    
    // Apply impulse to velocities
    this.vx -= impulse * other.size * nx;
    this.vy -= impulse * other.size * ny;
    other.vx += impulse * this.size * nx;
    other.vy += impulse * this.size * ny;
    
    // Separate particles to prevent sticking
    this.separateParticles(other, nx, ny, distance);
}
```

### 6. Particle Separation

```javascript
separateParticles(other, nx, ny, distance) {
    const overlap = (this.size + other.size) - distance;
    const separationX = nx * overlap * 0.5;
    const separationY = ny * overlap * 0.5;
    
    this.x += separationX;
    this.y += separationY;
    other.x -= separationX;
    other.y -= separationY;
}
```

### 7. Animation Loop

```javascript
function animate() {
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw all particles
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Check collisions with other particles
        for (let j = i + 1; j < particles.length; j++) {
            if (particles[i].collidesWith(particles[j])) {
                particles[i].handleCollision(particles[j]);
            }
        }
    }
    
    // Continue animation
    requestAnimationFrame(animate);
}
```

## Configuration Options

### Particle Properties
```javascript
// Size range (in pixels)
const size = Math.random() * 1.0 + 0.15; // 0.15 to 1.15

// Opacity range (0-1)
const opacity = Math.random() * 0.15 + 0.025; // 0.025 to 0.175

// Velocity range
const vx = (Math.random() - 0.5) * 0.6; // -0.3 to 0.3
const vy = (Math.random() - 0.5) * 0.6; // -0.3 to 0.3
```

### Density Control
```javascript
const targetParticleDensity = 0.0001; // particles per pixel
const targetParticleCount = Math.floor(canvasArea * targetParticleDensity);
```

### Performance Settings
```javascript
// Maximum velocity to prevent excessive speed
const maxVelocity = 0.8;

// Random movement factor
const randomMovementFactor = 0.01;

// Separation factor for collision response
const separationFactor = 0.5;
```

## Usage Examples

### 1. Basic Implementation

```javascript
function initializeParticleSystem(containerId) {
    const container = document.getElementById(containerId);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Setup canvas
    canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
    `;
    container.appendChild(canvas);
    
    // Create particles
    const particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 2 + 1,
            Math.random() * 0.5 + 0.1
        ));
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Check collisions
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                if (particles[i].collidesWith(particles[j])) {
                    particles[i].handleCollision(particles[j]);
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}
```

### 2. Responsive Implementation

```javascript
function createResponsiveParticleSystem(containerId) {
    const container = document.getElementById(containerId);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        
        // Recalculate particle density
        const area = canvas.width * canvas.height;
        const targetCount = Math.floor(area * 0.0001);
        
        // Adjust particle count
        while (particles.length < targetCount) {
            particles.push(createParticle());
        }
        
        // Reposition particles
        particles.forEach(particle => {
            particle.x = Math.random() * canvas.width;
            particle.y = Math.random() * canvas.height;
        });
    }
    
    function createParticle() {
        return new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 1.5 + 0.5,
            Math.random() * 0.2 + 0.05
        );
    }
    
    // Initial setup
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Animation loop
    function animate() {
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Collision detection
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                if (particles[i].collidesWith(particles[j])) {
                    particles[i].handleCollision(particles[j]);
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}
```

### 3. Customizable Particle System

```javascript
class ParticleSystem {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            particleCount: options.particleCount || 100,
            maxSize: options.maxSize || 2,
            minSize: options.minSize || 0.5,
            maxOpacity: options.maxOpacity || 0.3,
            minOpacity: options.minOpacity || 0.05,
            maxVelocity: options.maxVelocity || 0.8,
            backgroundColor: options.backgroundColor || '#1a1a1a',
            particleColor: options.particleColor || '#ffffff',
            ...options
        };
        
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.createParticles();
        this.startAnimation();
    }
    
    setupCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `;
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }
    
    createParticles() {
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push(new Particle(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                Math.random() * (this.options.maxSize - this.options.minSize) + this.options.minSize,
                Math.random() * (this.options.maxOpacity - this.options.minOpacity) + this.options.minOpacity
            ));
        }
    }
    
    startAnimation() {
        const animate = () => {
            this.ctx.fillStyle = this.options.backgroundColor;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.particles.forEach(particle => {
                particle.update();
                particle.draw(this.ctx, this.options.particleColor);
            });
            
            // Collision detection
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    if (this.particles[i].collidesWith(this.particles[j])) {
                        this.particles[i].handleCollision(this.particles[j]);
                    }
                }
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
}

// Usage
const particleSystem = new ParticleSystem('container', {
    particleCount: 200,
    maxSize: 3,
    minSize: 0.5,
    maxOpacity: 0.4,
    backgroundColor: '#0a0a0a',
    particleColor: '#8b7355'
});
```

## Performance Optimization

### 1. Spatial Partitioning
For large numbers of particles, use spatial partitioning to reduce collision checks:

```javascript
class SpatialGrid {
    constructor(cellSize) {
        this.cellSize = cellSize;
        this.grid = new Map();
    }
    
    getCell(x, y) {
        const cellX = Math.floor(x / this.cellSize);
        const cellY = Math.floor(y / this.cellSize);
        return `${cellX},${cellY}`;
    }
    
    addParticle(particle) {
        const cell = this.getCell(particle.x, particle.y);
        if (!this.grid.has(cell)) {
            this.grid.set(cell, []);
        }
        this.grid.get(cell).push(particle);
    }
    
    getNearbyParticles(particle) {
        const nearby = [];
        const cell = this.getCell(particle.x, particle.y);
        
        // Check current cell and adjacent cells
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const checkCell = `${Math.floor(particle.x / this.cellSize) + dx},${Math.floor(particle.y / this.cellSize) + dy}`;
                if (this.grid.has(checkCell)) {
                    nearby.push(...this.grid.get(checkCell));
                }
            }
        }
        
        return nearby;
    }
    
    clear() {
        this.grid.clear();
    }
}
```

### 2. Object Pooling
Reuse particle objects to reduce garbage collection:

```javascript
class ParticlePool {
    constructor(size) {
        this.pool = [];
        this.active = [];
        
        for (let i = 0; i < size; i++) {
            this.pool.push(new Particle(0, 0, 1, 0.1));
        }
    }
    
    get() {
        if (this.pool.length > 0) {
            const particle = this.pool.pop();
            this.active.push(particle);
            return particle;
        }
        return null;
    }
    
    release(particle) {
        const index = this.active.indexOf(particle);
        if (index > -1) {
            this.active.splice(index, 1);
            this.pool.push(particle);
        }
    }
}
```

## Troubleshooting

### Common Issues

1. **Particles sticking together**
   - Increase separation factor in `separateParticles()`
   - Add minimum distance check

2. **Performance issues with many particles**
   - Implement spatial partitioning
   - Reduce particle count
   - Use object pooling

3. **Particles escaping canvas**
   - Ensure proper wall collision detection
   - Add boundary checks in update loop

4. **Uneven particle distribution**
   - Adjust particle creation logic
   - Implement better random positioning

### Debug Mode

```javascript
class ParticleSystem {
    constructor(containerId, options = {}) {
        this.debug = options.debug || false;
        // ... rest of constructor
    }
    
    drawDebug() {
        if (!this.debug) return;
        
        this.ctx.strokeStyle = '#ff0000';
        this.ctx.lineWidth = 1;
        
        // Draw collision boundaries
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.stroke();
        });
        
        // Draw velocity vectors
        this.ctx.strokeStyle = '#00ff00';
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(particle.x + particle.vx * 10, particle.y + particle.vy * 10);
            this.ctx.stroke();
        });
    }
}
```

## Best Practices

1. **Use requestAnimationFrame** for smooth animation
2. **Limit particle count** based on device performance
3. **Implement proper cleanup** when removing particle systems
4. **Use appropriate collision detection** for your use case
5. **Optimize for mobile devices** with reduced particle counts
6. **Test performance** with different particle densities
7. **Use CSS transforms** for canvas positioning when possible

---

*This guide covers the complete particle collision system implementation. Adjust parameters and features based on your specific needs and performance requirements.*
