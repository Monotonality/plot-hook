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
    
    // Password strength indicator and show/hide functionality (only on signup page)
    const isSignupPage = window.location.pathname.includes('/signup/');
    console.log('Is signup page:', isSignupPage);
    
    if (isSignupPage) {
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        console.log('Found password inputs:', passwordInputs.length);
        
        passwordInputs.forEach((input, index) => {
            console.log('Processing password input', index);
            
            // Add show/hide password button FIRST (before strength indicator)
            addShowHidePasswordButton(input);
            
            // Only show strength indicator for the first password field (not confirm password)
            if (index === 0) {
                console.log('Creating strength indicator for first password field');
                // Create the strength indicator immediately (always visible)
                createPasswordStrengthIndicator(input);
                
                input.addEventListener('input', function() {
                    const strength = calculatePasswordStrength(this.value);
                    updatePasswordStrengthIndicator(this, strength);
                });
            }
            
            // Prevent pasting in confirm password field
            if (index === 1) { // Confirm password field
                input.addEventListener('paste', function(e) {
                    e.preventDefault();
                });
            }
        });
    }
    
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

function createPasswordStrengthIndicator(input) {
    console.log('Creating password strength indicator');
    // Create the initial strength indicator (always visible)
    const indicator = document.createElement('div');
    indicator.className = 'password-strength';
    
    indicator.innerHTML = `
        <div class="strength-bar">
            <div class="strength-fill" style="width: 0%; background-color: #a0a0a0;"></div>
        </div>
        <span class="strength-text" style="color: #a0a0a0;">Enter password</span>
    `;
    
    const formGroup = input.parentElement;
    console.log('Appending to form group:', formGroup);
    formGroup.appendChild(indicator);
    console.log('Strength indicator created and appended');
}

function updatePasswordStrengthIndicator(input, strength) {
    const existingIndicator = input.parentElement.querySelector('.password-strength');
    if (!existingIndicator) return;
    
    const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
    
    if (input.value.length === 0) {
        // Reset to initial state
        existingIndicator.querySelector('.strength-fill').style.width = '0%';
        existingIndicator.querySelector('.strength-fill').style.backgroundColor = '#a0a0a0';
        existingIndicator.querySelector('.strength-text').textContent = 'Enter password';
        existingIndicator.querySelector('.strength-text').style.color = '#a0a0a0';
    } else {
        // Update with actual strength
        existingIndicator.querySelector('.strength-fill').style.width = `${(strength / 5) * 100}%`;
        existingIndicator.querySelector('.strength-fill').style.backgroundColor = strengthColors[strength - 1];
        existingIndicator.querySelector('.strength-text').textContent = strengthText[strength - 1];
        existingIndicator.querySelector('.strength-text').style.color = strengthColors[strength - 1];
    }
}

function addShowHidePasswordButton(input) {
    console.log('Adding show/hide password button');
    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'password-toggle-container';
    
    // Create show/hide button
    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'password-toggle-btn';
    toggleButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>';
    toggleButton.title = 'Show password';
    
    // Ensure the form group has relative positioning
    const formGroup = input.parentElement;
    console.log('Form group:', formGroup);
    if (!formGroup.style.position) {
        formGroup.style.position = 'relative';
    }
    
    // Set input padding to make room for the button
    input.style.paddingRight = '40px';
    
    // Add click event
    toggleButton.addEventListener('click', function() {
        if (input.type === 'password') {
            input.type = 'text';
            toggleButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>';
            toggleButton.title = 'Hide password';
        } else {
            input.type = 'password';
            toggleButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>';
            toggleButton.title = 'Show password';
        }
    });
    
    // Append button to container and container to form group
    buttonContainer.appendChild(toggleButton);
    formGroup.appendChild(buttonContainer);
    console.log('Show/hide button added');
}

// Add loading spinner CSS
const style = document.createElement('style');
style.textContent = `
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
