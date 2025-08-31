function initializeUserDropdown() {
    const dropdownTrigger = document.getElementById('userDropdownTrigger');
    const userUsername = document.querySelector('.user-username');
    const dropdownMenu = document.getElementById('userDropdownMenu');
    
    if (!dropdownTrigger || !dropdownMenu) return;
    
    // Toggle dropdown on click (either avatar or username)
    function toggleDropdown(e) {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
    }
    
    // Add click handlers to both avatar and username
    dropdownTrigger.addEventListener('click', toggleDropdown);
    if (userUsername) {
        userUsername.addEventListener('click', toggleDropdown);
        userUsername.style.cursor = 'pointer'; // Make username look clickable
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!dropdownTrigger.contains(e.target) && !userUsername.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    });
    
    // Close dropdown when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            dropdownMenu.classList.remove('show');
        }
    });
    
    // Prevent dropdown from closing when clicking inside it
    dropdownMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeUserDropdown();
});
