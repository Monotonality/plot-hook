document.addEventListener('DOMContentLoaded', function() {
    // Initialize particle background
    initializeLandingParticleBackground();
    
    // Initialize hero particle background
    initializeHeroParticleBackground();
    
    // Initialize demo particle background
    initializeDemoParticleBackground();
    
    // Initialize smooth scrolling for navigation links
    initializeSmoothScrolling();
    
    // Initialize scroll effects
    initializeScrollEffects();
});

function initializeLandingParticleBackground() {
    const landingMain = document.querySelector('.landing-main');
    if (!landingMain) return;
    
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
    landingMain.insertBefore(canvas, landingMain.firstChild);
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = landingMain.offsetWidth;
        canvas.height = landingMain.offsetHeight;
    }
    
    // Function to create a new particle
    function createParticle() {
        const size = Math.random() * 1.0 + 0.15;
        const opacity = Math.random() * 0.15 + 0.025;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        return new Particle(x, y, size, opacity);
    }
    
    // Function to add particles if needed after resize
    function addParticlesIfNeeded() {
        const currentArea = canvas.width * canvas.height;
        const targetParticleDensity = 0.0003;
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
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
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
            this.vy -= impulse * this.size * ny;
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
    
    // Create particles
    const particles = [];
    
    // Initial particle creation
    for (let i = 0; i < 1500; i++) {
        particles.push(createParticle());
    }
    
    // Animation loop
    function animate() {
        // Clear canvas with darker background
        ctx.fillStyle = '#1a1a1a';
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

function initializeHeroParticleBackground() {
    const heroParticles = document.getElementById('hero-particles');
    if (!heroParticles) {
        console.log('Hero particles container not found');
        return;
    }
    console.log('Initializing hero particle background');
    
    // Create canvas for hero particle system
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    `;
    
    heroParticles.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = heroParticles.offsetWidth;
        canvas.height = heroParticles.offsetHeight;
        console.log('Hero canvas size:', canvas.width, 'x', canvas.height);
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Hero particle class
    class HeroParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.0 + 0.15;
            this.opacity = Math.random() * 0.15 + 0.025;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.originalSize = this.size;
            this.originalOpacity = this.opacity;
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
            this.vy -= impulse * this.size * ny;
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
    
    // Create hero particles
    const heroParticleArray = [];
    for (let i = 0; i < 200; i++) {
        heroParticleArray.push(new HeroParticle());
    }
    
    // Hero animation loop
    function animateHero() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < heroParticleArray.length; i++) {
            heroParticleArray[i].update();
            heroParticleArray[i].draw();
            
            // Check collisions with other particles
            for (let j = i + 1; j < heroParticleArray.length; j++) {
                if (heroParticleArray[i].collidesWith(heroParticleArray[j])) {
                    heroParticleArray[i].handleCollision(heroParticleArray[j]);
                }
            }
        }
        
        requestAnimationFrame(animateHero);
    }
    
    // Start hero animation
    animateHero();
}

function initializeDemoParticleBackground() {
    const demoParticles = document.getElementById('demo-particles');
    if (!demoParticles) {
        console.log('Demo particles container not found');
        return;
    }
    console.log('Initializing demo particle background');
    
    // Create canvas for demo particle system
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    `;
    
    demoParticles.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = demoParticles.offsetWidth;
        canvas.height = demoParticles.offsetHeight;
        console.log('Demo canvas size:', canvas.width, 'x', canvas.height);
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Demo particle class
    class DemoParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.0 + 0.15;
            this.opacity = Math.random() * 0.15 + 0.025;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.originalSize = this.size;
            this.originalOpacity = this.opacity;
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
            this.vy -= impulse * this.size * ny;
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
    
    // Create demo particles
    const demoParticleArray = [];
    for (let i = 0; i < 150; i++) {
        demoParticleArray.push(new DemoParticle());
    }
    
    // Demo animation loop
    function animateDemo() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < demoParticleArray.length; i++) {
            demoParticleArray[i].update();
            demoParticleArray[i].draw();
            
            // Check collisions with other particles
            for (let j = i + 1; j < demoParticleArray.length; j++) {
                if (demoParticleArray[i].collidesWith(demoParticleArray[j])) {
                    demoParticleArray[i].handleCollision(demoParticleArray[j]);
                }
            }
        }
        
        requestAnimationFrame(animateDemo);
    }
    
    // Start demo animation
    animateDemo();
}

function initializeSmoothScrolling() {
    // Get all navigation links that should scroll smoothly
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initializeScrollEffects() {
    // Add scroll-based animations for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.feature-card, .demo-content, .cta-content');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Add header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.landing-header');
    if (header) {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(26, 26, 26, 0.95)';
        } else {
            header.style.background = 'rgba(32, 32, 32, 0.95)';
        }
    }
});
