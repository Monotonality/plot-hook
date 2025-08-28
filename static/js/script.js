document.addEventListener('DOMContentLoaded', function() {
    // Initialize dropdown functionality
    initializeDropdowns();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize campaign card interactions
    initializeCampaignCards();
    
    // Initialize animated background
    initializeAnimatedBackground();
    
    // Initialize user dropdown functionality
    initializeUserDropdown();
    
    // Initialize sidebar toggle functionality
    initializeSidebarToggle();
});

function initializeDropdowns() {
    // Get all nav items that have dropdowns
    const navItems = document.querySelectorAll('.nav-item');
    
    console.log('Found nav items:', navItems.length);
    
    navItems.forEach(item => {
        const arrow = item.querySelector('.nav-item-arrow');
        const text = item.querySelector('.nav-item-text').textContent;
        
        console.log('Checking nav item:', text, 'Arrow:', !!arrow);
        
        // Only add click handlers to items that have arrows (indicating dropdowns)
        if (arrow) {
            console.log('Adding click handler to:', text);
            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('Clicked on:', text);
                
                // Find the next sibling that is a sub-nav
                let nextSibling = item.nextElementSibling;
                while (nextSibling && !nextSibling.classList.contains('sub-nav')) {
                    nextSibling = nextSibling.nextElementSibling;
                }
                
                if (nextSibling && nextSibling.classList.contains('sub-nav')) {
                    toggleDropdown(item, nextSibling);
                }
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
                e.stopPropagation();
                toggleDropdown(item, subSubNav);
            });
        }
    });
}

function toggleDropdown(parentItem, dropdownElement) {
    const isExpanded = dropdownElement.classList.contains('expanded');
    
    console.log('Toggling dropdown:', parentItem.querySelector('.nav-item-text').textContent, 'Current state:', isExpanded);
    
    // Toggle current dropdown (allow multiple to be open)
    if (isExpanded) {
        dropdownElement.classList.remove('expanded');
        parentItem.classList.remove('expanded');
    } else {
        dropdownElement.classList.add('expanded');
        parentItem.classList.add('expanded');
    }
    
    console.log('New state:', dropdownElement.classList.contains('expanded'));
}

function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const addButton = document.querySelector('.add-button');
    const joinInput = document.querySelector('.join-input');
    const joinButton = document.querySelector('.join-button');
    
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
    
    if (joinInput) {
        joinInput.addEventListener('focus', function() {
            this.style.borderColor = '#8b7355';
        });
        
        joinInput.addEventListener('blur', function() {
            this.style.borderColor = 'transparent';
        });
        
        // Handle Enter key press
        joinInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleJoinCode();
            }
        });
    }
    
    if (joinButton) {
        joinButton.addEventListener('click', function(e) {
            e.preventDefault();
            handleJoinCode();
        });
    }
    
    // Handle form submission
    const joinForm = document.getElementById('joinWorldForm');
    if (joinForm) {
        joinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleJoinCode();
        });
    }
}

function handleJoinCode() {
    const joinForm = document.getElementById('joinWorldForm');
    const joinInput = document.querySelector('.join-input');
    const joinMessage = document.getElementById('joinMessage');
    
    if (joinForm && joinInput) {
        const joinCode = joinInput.value.trim();
        if (joinCode) {
            console.log('Joining world with code:', joinCode);
            
            // Show loading state
            const joinButton = joinForm.querySelector('.join-button');
            const originalText = joinButton.textContent;
            joinButton.textContent = 'Joining...';
            joinButton.disabled = true;
            
            // Clear previous messages
            joinMessage.className = 'join-message';
            joinMessage.style.display = 'none';
            
            // Get CSRF token
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            
            // Make AJAX request
            fetch('/api/join-world/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': csrfToken,
                },
                body: `join_code=${encodeURIComponent(joinCode)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show success message
                    joinMessage.textContent = data.message;
                    joinMessage.className = 'join-message success';
                    joinMessage.style.display = 'block';
                    
                    // Clear input
                    joinInput.value = '';
                    
                    // Reload page after a short delay to show the new world
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    // Show error message
                    joinMessage.textContent = data.error;
                    joinMessage.className = 'join-message error';
                    joinMessage.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error joining world:', error);
                joinMessage.textContent = 'An error occurred while joining the world.';
                joinMessage.className = 'join-message error';
                joinMessage.style.display = 'block';
            })
            .finally(() => {
                // Reset button state
                joinButton.textContent = originalText;
                joinButton.disabled = false;
            });
        }
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
    
    // Check if we're on a page with campaign cards (dashboard)
    if (campaignCards.length === 0 && !createCard) {
        console.log('Campaign cards not found, skipping initialization');
        return;
    }
    
    campaignCards.forEach(card => {
        // Handle card click (navigate to world)
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking on menu button
            if (e.target.closest('.campaign-menu')) {
                return;
            }
            
            const menuButton = this.querySelector('.campaign-menu');
            if (menuButton) {
                const worldId = menuButton.getAttribute('data-world-id');
                if (worldId) {
                    window.location.href = `/worlds/${worldId}/`;
                }
            }
        });
        
        // Handle menu button clicks
        const menuButton = card.querySelector('.campaign-menu');
        if (menuButton) {
            menuButton.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent card click
                showWorldMenu(this);
            });
        }
    });
    
    if (createCard) {
        createCard.addEventListener('click', function() {
            showCreateWorldModal();
        });
    }
    
    // Initialize world menu functionality
    initializeWorldMenu();
    
    // Initialize create world functionality
    initializeCreateWorld();
    
    // Initialize confirmation modal functionality
    initializeConfirmationModal();
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

// Confirmation Modal Functions
function showDeleteConfirmation(worldId, csrfToken) {
    const modal = document.getElementById('confirmationModal');
    const overlay = document.getElementById('confirmationOverlay');
    const message = document.getElementById('confirmationMessage');
    const confirmBtn = document.getElementById('confirmationConfirm');
    
    // Get world name from the menu title
    const worldName = document.getElementById('worldMenuTitle').textContent;
    
    message.textContent = `Are you sure you want to delete "${worldName}"? This action cannot be undone.`;
    confirmBtn.textContent = 'Delete World';
    confirmBtn.className = 'btn-danger';
    
    // Show modal
    modal.classList.add('active');
    overlay.classList.add('active');
    
    // Store data for confirmation
    modal.dataset.worldId = worldId;
    modal.dataset.csrfToken = csrfToken;
    modal.dataset.action = 'delete';
}

function showLeaveConfirmation(worldId, csrfToken) {
    const modal = document.getElementById('confirmationModal');
    const overlay = document.getElementById('confirmationOverlay');
    const message = document.getElementById('confirmationMessage');
    const confirmBtn = document.getElementById('confirmationConfirm');
    
    // Get world name from the menu title
    const worldName = document.getElementById('worldMenuTitle').textContent;
    
    message.textContent = `Are you sure you want to leave "${worldName}"?`;
    confirmBtn.textContent = 'Leave World';
    confirmBtn.className = 'btn-danger';
    
    // Show modal
    modal.classList.add('active');
    overlay.classList.add('active');
    
    // Store data for confirmation
    modal.dataset.worldId = worldId;
    modal.dataset.csrfToken = csrfToken;
    modal.dataset.action = 'leave';
}

function hideConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    const overlay = document.getElementById('confirmationOverlay');
    
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

function initializeConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    const overlay = document.getElementById('confirmationOverlay');
    const closeBtn = document.getElementById('confirmationClose');
    const cancelBtn = document.getElementById('confirmationCancel');
    const confirmBtn = document.getElementById('confirmationConfirm');
    
    // Check if all required elements exist (only on dashboard page)
    if (!modal || !overlay || !closeBtn || !cancelBtn || !confirmBtn) {
        console.log('Confirmation modal elements not found, skipping initialization');
        return;
    }
    
    // Close modal events
    closeBtn.addEventListener('click', hideConfirmationModal);
    cancelBtn.addEventListener('click', hideConfirmationModal);
    overlay.addEventListener('click', hideConfirmationModal);
    
    // Confirm button event
    confirmBtn.addEventListener('click', function() {
        const worldId = modal.dataset.worldId;
        const csrfToken = modal.dataset.csrfToken;
        const action = modal.dataset.action;
        
        // Hide modal first
        hideConfirmationModal();
        
        if (action === 'delete') {
            // Perform delete action
            fetch(`/api/worlds/${worldId}/delete/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': csrfToken,
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Reload page to reflect changes
                    window.location.reload();
                                 } else {
                     // Show error message in console for debugging
                     console.error('Error deleting world:', data.error);
                 }
             })
             .catch(error => {
                 console.error('Error deleting world:', error);
             });
        } else if (action === 'leave') {
            // Perform leave action
            fetch(`/api/worlds/${worldId}/leave/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': csrfToken,
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Reload page to reflect changes
                    window.location.reload();
                } else {
                    console.error('Error leaving world:', data.error);
                }
            })
            .catch(error => {
                console.error('Error leaving world:', error);
            });
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            hideConfirmationModal();
        }
    });
}

// World Menu Functions
function showWorldMenu(menuButton) {
    const worldId = menuButton.getAttribute('data-world-id');
    const worldName = menuButton.getAttribute('data-world-name');
    const userRole = menuButton.getAttribute('data-user-role');
    
    const dropdown = document.getElementById('worldMenuDropdown');
    const overlay = document.getElementById('worldMenuOverlay');
    const title = document.getElementById('worldMenuTitle');
    
    // Set world info
    title.textContent = worldName;
    dropdown.setAttribute('data-world-id', worldId);
    dropdown.setAttribute('data-user-role', userRole);
    
    // Show menu and overlay
    dropdown.classList.add('active');
    overlay.classList.add('active');
}

function hideWorldMenu() {
    const dropdown = document.getElementById('worldMenuDropdown');
    const overlay = document.getElementById('worldMenuOverlay');
    
    dropdown.classList.remove('active');
    overlay.classList.remove('active');
}

function initializeWorldMenu() {
    const dropdown = document.getElementById('worldMenuDropdown');
    const overlay = document.getElementById('worldMenuOverlay');
    const closeButton = document.getElementById('worldMenuClose');
    const viewButton = document.getElementById('worldMenuView');
    const deleteButton = document.getElementById('worldMenuDelete');
    const leaveButton = document.getElementById('worldMenuLeave');
    
    // Check if all required elements exist (only on dashboard page)
    if (!dropdown || !overlay || !closeButton || !viewButton || !deleteButton || !leaveButton) {
        console.log('World menu elements not found, skipping initialization');
        return;
    }
    
    // Close menu when clicking overlay or close button
    overlay.addEventListener('click', hideWorldMenu);
    closeButton.addEventListener('click', hideWorldMenu);
    
    // Handle view action
    viewButton.addEventListener('click', function() {
        const worldId = dropdown.getAttribute('data-world-id');
        if (worldId) {
            window.location.href = `/worlds/${worldId}/`;
        }
        hideWorldMenu();
    });
    
    // Handle delete action (owner only)
    deleteButton.addEventListener('click', function() {
        const worldId = dropdown.getAttribute('data-world-id');
        const worldName = document.getElementById('worldMenuTitle').textContent;
        
        // Show custom confirmation modal
        showDeleteConfirmation(worldId, document.querySelector('[name=csrfmiddlewaretoken]').value);
        hideWorldMenu();
    });
    
    // Handle leave action (player only)
    leaveButton.addEventListener('click', function() {
        const worldId = dropdown.getAttribute('data-world-id');
        const worldName = document.getElementById('worldMenuTitle').textContent;
        
        // Show custom confirmation modal for leaving
        showLeaveConfirmation(worldId, document.querySelector('[name=csrfmiddlewaretoken]').value);
        hideWorldMenu();
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && dropdown.classList.contains('active')) {
            hideWorldMenu();
        }
    });
}

function deleteWorld(worldId) {
    // Get CSRF token
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
    // Show custom confirmation modal
    showDeleteConfirmation(worldId, csrfToken);
}

function leaveWorld(worldId) {
    // Get CSRF token
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
    fetch(`/api/worlds/${worldId}/leave/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrfToken,
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Reload page to reflect changes
            window.location.reload();
        } else {
            console.error('Error leaving world:', data.error);
        }
    })
    .catch(error => {
        console.error('Error leaving world:', error);
    });
}

// Create World Functions
function showCreateWorldModal() {
    const modal = document.getElementById('createWorldModal');
    const overlay = document.getElementById('createWorldOverlay');
    
    // Generate initial color palette
    generateColorPalette();
    
    // Show modal and overlay
    modal.classList.add('active');
    overlay.classList.add('active');
    
    // Focus on the world name input
    document.getElementById('worldName').focus();
}

function hideCreateWorldModal() {
    const modal = document.getElementById('createWorldModal');
    const overlay = document.getElementById('createWorldOverlay');
    
    modal.classList.remove('active');
    overlay.classList.remove('active');
    
    // Reset form
    document.getElementById('createWorldForm').reset();
    document.getElementById('selectedColor').value = '';
    
    // Clear color selection
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => option.classList.remove('selected'));
}

function generateColorPalette() {
    const palette = document.getElementById('colorPalette');
    palette.innerHTML = '';
    
    // Generate 8 random colors
    const colors = [];
    for (let i = 0; i < 8; i++) {
        colors.push(generateRandomColor());
    }
    
    // Create color options
    colors.forEach(color => {
        const colorOption = document.createElement('div');
        colorOption.className = 'color-option';
        colorOption.style.backgroundColor = color;
        colorOption.setAttribute('data-color', color);
        
        colorOption.addEventListener('click', function() {
            // Remove selection from other colors
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            
            // Select this color
            this.classList.add('selected');
            document.getElementById('selectedColor').value = color;
        });
        
        palette.appendChild(colorOption);
    });
}

function generateRandomColor() {
    // Generate vibrant colors (avoiding too light or too dark)
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 40) + 60; // 60-100%
    const lightness = Math.floor(Math.random() * 30) + 35; // 35-65%
    
    // Convert HSL to hex for better compatibility
    return hslToHex(hue, saturation, lightness);
}

function hslToHex(h, s, l) {
    // Convert HSL to RGB first
    s /= 100;
    l /= 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    
    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    
    // Convert RGB to hex
    const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');
    
    return `#${rHex}${gHex}${bHex}`;
}

function initializeCreateWorld() {
    const modal = document.getElementById('createWorldModal');
    const overlay = document.getElementById('createWorldOverlay');
    const closeBtn = document.getElementById('createWorldClose');
    const cancelBtn = document.getElementById('cancelCreate');
    const regenerateBtn = document.getElementById('regenerateColors');
    const form = document.getElementById('createWorldForm');
    
    // Check if all required elements exist (only on dashboard page)
    if (!modal || !overlay || !closeBtn || !cancelBtn || !regenerateBtn || !form) {
        console.log('Create world modal elements not found, skipping initialization');
        return;
    }
    
    // Close modal when clicking overlay, close button, or cancel button
    overlay.addEventListener('click', hideCreateWorldModal);
    closeBtn.addEventListener('click', hideCreateWorldModal);
    cancelBtn.addEventListener('click', hideCreateWorldModal);
    
    // Regenerate colors
    regenerateBtn.addEventListener('click', function() {
        generateColorPalette();
        document.getElementById('selectedColor').value = '';
    });
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        createWorld();
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            hideCreateWorldModal();
        }
    });
}

function createWorld() {
    const form = document.getElementById('createWorldForm');
    const worldName = document.getElementById('worldName').value.trim();
    const themeColor = document.getElementById('selectedColor').value;
    
    if (!worldName) {
        console.error('World name is required');
        return;
    }
    
    if (!themeColor) {
        console.error('Theme color is required');
        return;
    }
    
    // Get CSRF token
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
    // Show loading state
    const submitBtn = form.querySelector('.btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating...';
    submitBtn.disabled = true;
    
    // Prepare form data
    const formData = new FormData();
    formData.append('world_name', worldName);
    formData.append('theme_color', themeColor);
    
    fetch('/api/create-world/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Hide modal
            hideCreateWorldModal();
            
            // Reload page to show the new world
            window.location.reload();
        } else {
            console.error('Error creating world:', data.error);
        }
    })
    .catch(error => {
        console.error('Error creating world:', error);
    })
    .finally(() => {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

// User Dropdown Functions
function initializeUserDropdown() {
    const trigger = document.getElementById('userDropdownTrigger');
    const menu = document.getElementById('userDropdownMenu');
    const userDropdown = trigger ? trigger.closest('.user-dropdown') : null;
    
    if (!trigger || !menu || !userDropdown) return;
    
    // Toggle dropdown when clicking on avatar or username area
    userDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleUserDropdown();
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!menu.contains(e.target) && !userDropdown.contains(e.target)) {
            hideUserDropdown();
        }
    });
    
    // Close dropdown with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            hideUserDropdown();
        }
    });
}

function toggleUserDropdown() {
    const menu = document.getElementById('userDropdownMenu');
    if (menu.classList.contains('active')) {
        hideUserDropdown();
    } else {
        showUserDropdown();
    }
}

function showUserDropdown() {
    const menu = document.getElementById('userDropdownMenu');
    menu.classList.add('active');
}

function hideUserDropdown() {
    const menu = document.getElementById('userDropdownMenu');
    menu.classList.remove('active');
}

// Sidebar Toggle Functions
function initializeSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    console.log('Sidebar init: Elements found:', {
        sidebarToggle: !!sidebarToggle,
        sidebar: !!sidebar,
        mainContent: !!mainContent
    });
    
    if (!sidebarToggle || !sidebar || !mainContent) {
        console.log('Sidebar init: Missing elements, returning');
        return;
    }
    
    // Check if we're on dashboard page
    const isDashboard = window.location.pathname === '/dashboard/' || window.location.pathname === '/';
    console.log('Sidebar init: Current pathname:', window.location.pathname);
    console.log('Sidebar init: isDashboard:', isDashboard);
    
    // Load saved state from localStorage
    const savedState = localStorage.getItem('sidebarCollapsed');
    console.log('Sidebar init: Saved state from localStorage:', savedState);
    
    if (isDashboard) {
        // On dashboard, use saved state or default to expanded
        if (savedState === 'true') {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('sidebar-collapsed');
            console.log('Sidebar init: Dashboard - collapsed (from saved state)');
        } else {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('sidebar-collapsed');
            console.log('Sidebar init: Dashboard - expanded (default or from saved state)');
        }
    } else {
        // Not on dashboard, auto-collapse unless user explicitly expanded it
        if (savedState === 'false') {
            // User explicitly expanded the sidebar on a non-dashboard page
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('sidebar-collapsed');
            console.log('Sidebar init: Non-dashboard - expanded (user preference)');
        } else {
            // Default to collapsed on non-dashboard pages
            sidebar.classList.add('collapsed');
            mainContent.classList.add('sidebar-collapsed');
            console.log('Sidebar init: Non-dashboard - collapsed (default)');
        }
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth < 768) {
            // On mobile, use mobile-open class instead of collapsed
            sidebar.classList.remove('collapsed');
            sidebar.classList.remove('mobile-open');
            mainContent.classList.remove('sidebar-collapsed');
        }
    });
    
    // Handle mobile sidebar toggle
    if (window.innerWidth < 768) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-open');
        });
        
        // Close mobile sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('mobile-open');
            }
        });
    } else {
        // Desktop behavior
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    if (!sidebar || !mainContent) {
        console.log('Sidebar toggle: Missing elements');
        return;
    }
    
    const isCollapsed = sidebar.classList.contains('collapsed');
    console.log('Sidebar toggle: Current state isCollapsed =', isCollapsed);
    
    if (isCollapsed) {
        // Expand sidebar
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('sidebar-collapsed');
        console.log('Sidebar toggle: Expanding sidebar');
    } else {
        // Collapse sidebar
        sidebar.classList.add('collapsed');
        mainContent.classList.add('sidebar-collapsed');
        console.log('Sidebar toggle: Collapsing sidebar');
    }
    
    // Save state to localStorage
    localStorage.setItem('sidebarCollapsed', !isCollapsed);
    console.log('Sidebar toggle: Saved state to localStorage:', !isCollapsed);
}

// Export functions for potential use in other scripts
window.PlotHook = {
    setActiveNavItem,
    performSearch,
    toggleDropdown,
    initializeAnimatedBackground,
    toggleSidebar
};
