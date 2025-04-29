document.addEventListener('DOMContentLoaded', function() {
    const loadingOverlay = document.getElementById('loading-overlay');
    const contentContainer = document.querySelector('.container');
    
    // Start time to ensure minimum loading duration
    const startTime = Date.now();
    const minLoadTime = 1500; // Minimum loading time in ms
    
    // Function to hide loading overlay with minimum duration
    function hideLoadingOverlay() {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadTime - elapsedTime);
        
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            contentContainer.classList.add('loaded');
            
            // Remove overlay from DOM after transition completes
            setTimeout(() => {
                if (loadingOverlay.parentNode) {
                    loadingOverlay.parentNode.removeChild(loadingOverlay);
                }
            }, 600);
        }, remainingTime);
    }
    
    // Theme handling
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Function to set the theme
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }
    
    // Function to toggle the theme
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }
    
    // Initialize theme
    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
            // Use saved preference if available
            setTheme(savedTheme);
        } else {
            // Otherwise use OS preference
            if (prefersDarkScheme.matches) {
                setTheme('dark');
            } else {
                setTheme('light');
            }
        }
    }
    
    // Set up event listeners
    themeToggle.addEventListener('click', toggleTheme);
    
    // Listen for OS theme changes
    prefersDarkScheme.addEventListener('change', function(e) {
        // Only auto-change if user hasn't set a preference
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                setTheme('dark');
            } else {
                setTheme('light');
            }
        }
    });
    
    // Initialize theme on load
    initializeTheme();
    
    // Track loading states
    let locationLoaded = false;
    
    // Handle name display based on location
    function setNameBasedOnLocation() {
        const nameDisplay = document.getElementById('name-display');
        const primaryName = document.getElementById('primary-name');
        const alternateName = document.getElementById('alternate-name');
        
        // Add loading class to hide the name initially
        nameDisplay.classList.add('loading');
        
        // Use IP-based geolocation API
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                // If the user is in Hungary, display Hungarian name format
                if (data.country_code === 'HU') {
                    primaryName.textContent = 'Balla Botond';
                    alternateName.textContent = 'Botond Balla';
                    document.title = 'Balla Botond';
                } else {
                    primaryName.textContent = 'Botond Balla';
                    alternateName.textContent = 'Balla Botond';
                    document.title = 'Botond Balla';
                }
                
                // Show the name with a fade-in effect once it's ready
                setTimeout(() => {
                    nameDisplay.classList.remove('loading');
                    nameDisplay.classList.add('loaded');
                }, 100);
                
                // Mark location as loaded
                locationLoaded = true;
                
                // Check if all content is loaded
                if (locationLoaded) {
                    hideLoadingOverlay();
                }
            })
            .catch(error => {
                console.error('Error detecting location:', error);
                // Default to international format if there's an error
                primaryName.textContent = 'Botond Balla';
                alternateName.textContent = 'Balla Botond';
                document.title = 'Botond Balla';
                
                // Show the name even in case of error
                setTimeout(() => {
                    nameDisplay.classList.remove('loading');
                    nameDisplay.classList.add('loaded');
                }, 100);
                
                // Mark location as loaded even in case of error
                locationLoaded = true;
                
                // Check if all content is loaded
                if (locationLoaded) {
                    hideLoadingOverlay();
                }
            });
    }
    
    // Call the function to set name based on location
    setNameBasedOnLocation();
    
    // Fallback in case something fails
    setTimeout(() => {
        if (!locationLoaded) {
            locationLoaded = true;
            hideLoadingOverlay();
            
            // Show default name if location failed
            const nameDisplay = document.getElementById('name-display');
            if (nameDisplay.classList.contains('loading')) {
                nameDisplay.classList.remove('loading');
                nameDisplay.classList.add('loaded');
            }
        }
    }, 5000); // 5-second fallback
    
    // Add subtle hover effect to social links
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Create a ripple effect when clicked
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});
