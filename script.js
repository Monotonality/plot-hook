document.addEventListener('DOMContentLoaded', function() {
    // Initialize dropdown functionality
    initializeDropdowns();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize campaign card interactions
    initializeCampaignCards();
    
    // Initialize animated background
    initializeAnimatedBackground();
});

function initializeDropdowns() {
    // Get all nav items that have dropdowns
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const arrow = item.querySelector('.nav-item-arrow');
        const subNav = item.nextElementSibling;
        
        // Only add click handlers to items that have dropdowns
        if (arrow && subNav && (subNav.classList.contains('sub-nav') || subNav.classList.contains('sub-sub-nav'))) {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                toggleDropdown(item, subNav);
            });
        }
    });
    
    // Handle sub-nav items that have their own dropdowns
    const subNavItems = document.querySelectorAll('.sub-nav-item');
    subNavItems.forEach(item => {
        const arrow = item.querySelector('.nav-item-arrow');
        const subSubNav = item.nextElementSibling;
        
        if (arrow && subSubNav && subSubNav.classList.contains('sub-sub-nav')) {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                toggleDropdown(item, subSubNav);
            });
        }
    });
}

function toggleDropdown(parentItem, dropdownElement) {
    const isExpanded = dropdownElement.classList.contains('expanded');
    
    // Close all other dropdowns at the same level
    const siblings = dropdownElement.parentElement.children;
    Array.from(siblings).forEach(sibling => {
        if (sibling !== dropdownElement && sibling.classList.contains(dropdownElement.className)) {
            sibling.classList.remove('expanded');
            const siblingParent = sibling.previousElementSibling;
            if (siblingParent && siblingParent.classList.contains('nav-item')) {
                siblingParent.classList.remove('expanded');
            }
        }
    });
    
    // Toggle current dropdown
    if (isExpanded) {
        dropdownElement.classList.remove('expanded');
        parentItem.classList.remove('expanded');
    } else {
        dropdownElement.classList.add('expanded');
        parentItem.classList.add('expanded');
    }
}

function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const addButton = document.querySelector('.add-button');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            performSearch(searchTerm);
        });
        
        // Add placeholder animation
        searchInput.addEventListener('focus', function() {
            this.style.borderColor = '#8b7355';
        });
        
        searchInput.addEventListener('blur', function() {
            this.style.borderColor = 'transparent';
        });
    }
    
    if (addButton) {
        addButton.addEventListener('click', function() {
            // Handle add button click
            console.log('Add button clicked');
            // You can add modal or form logic here
        });
    }
}

function performSearch(searchTerm) {
    // Get all navigation items
    const navItems = document.querySelectorAll('.nav-item, .sub-nav-item, .sub-sub-nav-item');
    
    navItems.forEach(item => {
        const text = item.querySelector('.nav-item-text').textContent.toLowerCase();
        const shouldShow = text.includes(searchTerm);
        
        if (searchTerm === '') {
            item.style.display = 'flex';
            item.style.opacity = '1';
        } else {
            if (shouldShow) {
                item.style.display = 'flex';
                item.style.opacity = '1';
                // Highlight the matching text
                highlightText(item, searchTerm);
            } else {
                item.style.opacity = '0.3';
            }
        }
    });
}

function highlightText(element, searchTerm) {
    const textElement = element.querySelector('.nav-item-text');
    if (textElement) {
        const text = textElement.textContent;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        textElement.innerHTML = text.replace(regex, '<mark style="background-color: #8b7355; color: white; padding: 1px 2px; border-radius: 2px;">$1</mark>');
    }
}

function initializeCampaignCards() {
    const campaignCards = document.querySelectorAll('.campaign-card');
    const createCard = document.querySelector('.create-card');
    
    campaignCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('.campaign-title').textContent;
            console.log(`Campaign clicked: ${title}`);
            // Add navigation logic here
        });
        
        // Handle menu button clicks
        const menuButton = card.querySelector('.campaign-menu');
        if (menuButton) {
            menuButton.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent card click
                const title = card.querySelector('.campaign-title').textContent;
                console.log(`Menu clicked for: ${title}`);
                // Add dropdown menu logic here
            });
        }
    });
    
    if (createCard) {
        createCard.addEventListener('click', function() {
            console.log('Create new campaign clicked');
            // Add create campaign logic here
        });
    }
}

// Utility function to handle navigation state
function setActiveNavItem(activeElement) {
    // Remove active class from all nav items
    const allNavItems = document.querySelectorAll('.nav-item, .sub-nav-item, .sub-sub-nav-item');
    allNavItems.forEach(item => item.classList.remove('active'));
    
    // Add active class to clicked item
    if (activeElement) {
        activeElement.classList.add('active');
    }
}

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
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
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
    const particleCount = 500; // Increased from 350 for maximum density
    
    for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 1.0 + 0.15; // Even smaller: 0.15 to 1.15 pixels
        const opacity = Math.random() * 0.15 + 0.025; // Higher: 0.025 to 0.175 for better visibility
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        particles.push(new Particle(x, y, size, opacity));
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

// Export functions for potential use in other scripts
window.PlotHook = {
    setActiveNavItem,
    performSearch,
    toggleDropdown,
    initializeAnimatedBackground
};
