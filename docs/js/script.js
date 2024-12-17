document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuItems = document.getElementById('menuItems');

    function toggleMenu() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        menuToggle.classList.toggle('open');
        menuItems.classList.toggle('active');
        
        // Prevent scrolling when the menu is open
        document.body.style.overflow = isExpanded ? 'visible' : 'hidden';
    }

    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
        const isClickInside = menuItems.contains(event.target) || menuToggle.contains(event.target);
        if (!isClickInside && menuItems.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && menuItems.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Handle window resize
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768 && menuItems.classList.contains('active')) {
            toggleMenu();
        }
    });
});