function initializeAnimatedBackground() {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    
    // Create canvas for particle system
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
    
    // Insert canvas before the first child
    mainContent.insertBefore(canvas, mainContent.firstChild);
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = mainContent.offsetWidth;
        canvas.height = mainContent.offsetHeight;
    }
    
    // Function to create a new particle
    function createParticle() {
        const size = Math.random() * 1.0 + 0.15; // 0.15 to 1.15 pixels
        const opacity = Math.random() * 0.15 + 0.025; // 0.025 to 0.175
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        return new Particle(x, y, size, opacity);
    }
    
    // Function to add particles if needed after resize
    function addParticlesIfNeeded() {
        const currentArea = canvas.width * canvas.height;
        const targetParticleDensity = 0.0001; // particles per pixel
        const targetParticleCount = Math.floor(currentArea * targetParticleDensity);
        
        // Reposition existing particles to fill the new canvas area
        particles.forEach(particle => {
            particle.x = Math.random() * canvas.width;
            particle.y = Math.random() * canvas.height;
        });
        
        // Add particles if we have fewer than the target
        while (particles.length < targetParticleCount) {
            particles.push(createParticle());
        }
    }
    
    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        addParticlesIfNeeded();
    });
    
    // Particle class
    class Particle {
        constructor(x, y, size, opacity) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.opacity = opacity;
            this.vx = (Math.random() - 0.5) * 0.6; // Increased velocity X (-0.3 to 0.3)
            this.vy = (Math.random() - 0.5) * 0.6; // Increased velocity Y (-0.3 to 0.3)
            this.originalSize = size;
            this.originalOpacity = opacity;
        }
        
        update() {
            // Update position
            this.x += this.vx;
            this.y += this.vy;
            
            // Bounce off walls
            if (this.x <= this.size || this.x >= canvas.width - this.size) {
                this.vx = -this.vx;
                this.x = Math.max(this.size, Math.min(canvas.width - this.size, this.x));
            }
            
            if (this.y <= this.size || this.y >= canvas.height - this.size) {
                this.vy = -this.vy;
                this.y = Math.max(this.size, Math.min(canvas.height - this.size, this.y));
            }
            
            // Add slight random movement
            this.vx += (Math.random() - 0.5) * 0.01;
            this.vy += (Math.random() - 0.5) * 0.01;
            
            // Limit velocity
            this.vx = Math.max(-0.8, Math.min(0.8, this.vx));
            this.vy = Math.max(-0.8, Math.min(0.8, this.vy));
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
        
        // Check collision with another particle
        collidesWith(other) {
            const dx = this.x - other.x;
            const dy = this.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < (this.size + other.size);
        }
        
        // Handle collision
        handleCollision(other) {
            const dx = this.x - other.x;
            const dy = this.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance === 0) return;
            
            // Normalize
            const nx = dx / distance;
            const ny = dy / distance;
            
            // Relative velocity
            const relativeVelocityX = this.vx - other.vx;
            const relativeVelocityY = this.vy - other.vy;
            
            // Calculate impulse
            const speed = relativeVelocityX * nx + relativeVelocityY * ny;
            
            if (speed < 0) return; // Already moving apart
            
            // Elastic collision
            const impulse = 2 * speed / (this.size + other.size);
            
            this.vx -= impulse * other.size * nx;
            this.vy -= impulse * other.size * ny;
            other.vx += impulse * this.size * nx;
            other.vy += impulse * this.size * ny;
            
            // Separate particles to prevent sticking
            const overlap = (this.size + other.size) - distance;
            const separationX = nx * overlap * 0.5;
            const separationY = ny * overlap * 0.5;
            
            this.x += separationX;
            this.y += separationY;
            other.x -= separationX;
            other.y -= separationY;
        }
    }
    
    // Create particles with varying sizes and opacities
    const particles = [];
    
    // Initial particle creation
    for (let i = 0; i < 500; i++) {
        particles.push(createParticle());
    }
    
    // Animation loop
    function animate() {
        // Clear canvas with darker background
        ctx.fillStyle = '#1a1a1a'; // Darker background for better particle visibility
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
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
        
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimatedBackground();
});
