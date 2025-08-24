// Authentication Pages JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize particle background for auth pages
    initializeAuthParticleBackground();
    
    // Initialize form interactions
    initializeFormInteractions();
});

function initializeAuthParticleBackground() {
    const authParticles = document.getElementById('auth-particles');
    if (!authParticles) return;
    
    // Create canvas for auth particle system
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    `;
    
    authParticles.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = authParticles.offsetWidth;
        canvas.height = authParticles.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Auth particle class
    class AuthParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 0.8 + 0.1; // Smaller particles for auth pages
            this.opacity = Math.random() * 0.1 + 0.02; // More subtle
            this.vx = (Math.random() - 0.5) * 0.4; // Slower movement
            this.vy = (Math.random() - 0.5) * 0.4;
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
            this.vx += (Math.random() - 0.5) * 0.005;
            this.vy += (Math.random() - 0.5) * 0.005;
            
            // Limit velocity
            this.vx = Math.max(-0.6, Math.min(0.6, this.vx));
            this.vy = Math.max(-0.6, Math.min(0.6, this.vy));
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
    
    // Create auth particles (fewer for subtlety)
    const authParticleArray = [];
    for (let i = 0; i < 80; i++) {
        authParticleArray.push(new AuthParticle());
    }
    
    // Auth animation loop
    function animateAuth() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < authParticleArray.length; i++) {
            authParticleArray[i].update();
            authParticleArray[i].draw();
        }
        
        requestAnimationFrame(animateAuth);
    }
    
    // Start auth animation
    animateAuth();
}

function initializeFormInteractions() {
    // Add focus effects to form inputs
    const formInputs = document.querySelectorAll('.form-control');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // Password strength indicator
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    passwordInputs.forEach(input => {
        input.addEventListener('input', function() {
            const strength = calculatePasswordStrength(this.value);
            updatePasswordStrengthIndicator(this, strength);
        });
    });
    
    // Form validation feedback
    const forms = document.querySelectorAll('.auth-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Add loading state to submit button
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="loading-spinner"></span> Processing...';
            }
        });
    });
}

function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]/)) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 1;
    
    return Math.min(strength, 5);
}

function updatePasswordStrengthIndicator(input, strength) {
    // Remove existing indicator
    const existingIndicator = input.parentElement.querySelector('.password-strength');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    if (input.value.length === 0) return;
    
    // Create strength indicator
    const indicator = document.createElement('div');
    indicator.className = 'password-strength';
    
    const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
    
    indicator.innerHTML = `
        <div class="strength-bar">
            <div class="strength-fill" style="width: ${(strength / 5) * 100}%; background-color: ${strengthColors[strength - 1]};"></div>
        </div>
        <span class="strength-text" style="color: ${strengthColors[strength - 1]};">${strengthText[strength - 1]}</span>
    `;
    
    input.parentElement.appendChild(indicator);
}

// Add CSS for password strength indicator
const style = document.createElement('style');
style.textContent = `
    .password-strength {
        margin-top: 8px;
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .strength-bar {
        flex: 1;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        overflow: hidden;
    }
    
    .strength-fill {
        height: 100%;
        transition: width 0.3s ease, background-color 0.3s ease;
    }
    
    .strength-text {
        font-size: 0.8rem;
        font-weight: 500;
        min-width: 80px;
    }
    
    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: #ffffff;
        animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .form-group.focused .form-control {
        border-color: #8b7355;
        box-shadow: 0 0 0 3px rgba(139, 115, 85, 0.1);
    }
`;
document.head.appendChild(style);
