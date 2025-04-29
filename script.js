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
            
            // Force social links to be visible
            document.querySelectorAll('.social-link').forEach(link => {
                link.style.opacity = '1';
            });
            
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
    
    // Handle name and bio display based on location
    function setNameBasedOnLocation() {
        const nameDisplay = document.getElementById('name-display');
        nameDisplay.classList.add('loading');
        
        // Language toggle functionality
        const languageToggle = document.getElementById('language-toggle');
        
        // Function to set language
        function setLanguage(lang) {
            const primaryName = document.getElementById('primary-name');
            const alternateName = document.getElementById('alternate-name');
            const primaryBio = document.getElementById('primary-bio');
            const alternateBio = document.getElementById('alternate-bio');
            
            // Update the language toggle to show the opposite language
            function updateLanguageToggleText(lang) {
                const langIndicator = document.querySelector('.language-toggle .lang-indicator');
                if (langIndicator) {
                    // If current language is Hungarian (hu), show EN as the option
                    // If current language is English (en), show HU as the option
                    langIndicator.textContent = lang === 'hu' ? 'EN' : 'HU';
                }
            }
            
            if (lang === 'hu') {
                primaryName.textContent = 'Balla Botond';
                alternateName.textContent = 'Botond Balla';
                document.title = 'Balla Botond';
                
                if (primaryBio) primaryBio.style.display = 'none';
                if (alternateBio) alternateBio.style.display = 'block';
                
                document.documentElement.setAttribute('data-language', 'hu');
                updateLanguageToggleText('hu');
            } else {
                primaryName.textContent = 'Botond Balla';
                alternateName.textContent = 'Balla Botond';
                document.title = 'Botond Balla';
                
                if (primaryBio) primaryBio.style.display = 'block';
                if (alternateBio) alternateBio.style.display = 'none';
                
                document.documentElement.setAttribute('data-language', 'en');
                updateLanguageToggleText('en');
            }
            
            // Store the user's language preference
            localStorage.setItem('language', lang);
        }
        
        // Check for user's language preference
        const userLanguage = localStorage.getItem('language');
        
        // Add language toggle event listener
        if (languageToggle) {
            languageToggle.addEventListener('click', function() {
                const currentLang = document.documentElement.getAttribute('data-language') || 'en';
                setLanguage(currentLang === 'en' ? 'hu' : 'en');
            });
        }
        
        // Use IP-based geolocation API if no user preference exists
        if (!userLanguage) {
            fetch('https://ipapi.co/json/')
                .then(response => response.json())
                .then(data => {
                    // If the user is in Hungary, display Hungarian name format and bio
                    if (data.country_code === 'HU') {
                        setLanguage('hu');
                    } else {
                        setLanguage('en');
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
                    
                    // Default to English bio
                    if (primaryBio) primaryBio.style.display = 'block';
                    if (alternateBio) alternateBio.style.display = 'none';
                    
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
        } else {
            // Use user's stored language preference
            setLanguage(userLanguage);
            
            // Show the name with a fade-in effect
            setTimeout(() => {
                nameDisplay.classList.remove('loading');
                nameDisplay.classList.add('loaded');
            }, 100);
            
            // Mark location loaded
            locationLoaded = true;
            
            // Check if all content is loaded
            if (locationLoaded) {
                hideLoadingOverlay();
            }
        }
    }
    
    // Call the function to set name based on location
    setNameBasedOnLocation();
    
    // More aggressive fallback in case something fails
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
            
            // Force social links to be visible after delay
            document.querySelectorAll('.social-link').forEach(link => {
                link.style.opacity = '1';
            });
        }
    }, 3000); // Reduce fallback time from 5s to 3s for better user experience
    
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
    
    // Add CSS for the alternate bio
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .alternate-bio {
                display: none;
            }
        </style>
    `);
});
