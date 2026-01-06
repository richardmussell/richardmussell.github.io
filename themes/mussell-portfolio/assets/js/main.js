// Enterprise Dark Mode Toggle - Robust Implementation
(function() {
  'use strict';

  const DARK_MODE_KEY = 'theme';
  const DARK_THEME = 'dark';
  const LIGHT_THEME = 'light';

  // Get theme preference with fallback
  const getThemePreference = () => {
    try {
      const savedTheme = localStorage.getItem(DARK_MODE_KEY);
      if (savedTheme === DARK_THEME || savedTheme === LIGHT_THEME) {
        return savedTheme; // Use saved preference if exists
      }
    } catch (e) {
      console.warn('localStorage not available:', e);
    }
    
    // Default to dark mode for new visitors
    return DARK_THEME;
  };

  // Apply theme to document
  const applyTheme = (theme) => {
    const root = document.documentElement;
    
    if (theme === DARK_THEME) {
      root.classList.add('dark-mode');
      root.setAttribute('data-theme', DARK_THEME);
    } else {
      root.classList.remove('dark-mode');
      root.setAttribute('data-theme', LIGHT_THEME);
    }
    
    try {
      localStorage.setItem(DARK_MODE_KEY, theme);
    } catch (e) {
      console.warn('Could not save theme preference:', e);
    }
  };

  // Update icon based on current theme
  const updateIcon = (theme) => {
    const button = document.querySelector('button[aria-label="Toggle dark mode"], button[title="Toggle dark mode"]');
    if (!button) {
      // Retry after a short delay if button not found
      setTimeout(() => updateIcon(theme), 100);
      return;
    }

    const svg = button.querySelector('svg');
    if (!svg) return;

    // Clear existing paths
    svg.innerHTML = '';

    if (theme === DARK_THEME) {
      // Show sun icon (clicking will switch to light)
      const sunPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      sunPath.setAttribute('stroke-linecap', 'round');
      sunPath.setAttribute('stroke-linejoin', 'round');
      sunPath.setAttribute('stroke-width', '2');
      sunPath.setAttribute('d', 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z');
      svg.appendChild(sunPath);
    } else {
      // Show moon icon (clicking will switch to dark)
      const moonPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      moonPath.setAttribute('stroke-linecap', 'round');
      moonPath.setAttribute('stroke-linejoin', 'round');
      moonPath.setAttribute('stroke-width', '2');
      moonPath.setAttribute('d', 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z');
      svg.appendChild(moonPath);
    }
  };

  // Toggle theme
  const toggleTheme = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const currentTheme = document.documentElement.getAttribute('data-theme') || getThemePreference();
    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    
    applyTheme(newTheme);
    updateIcon(newTheme);
  };

  // Initialize theme on load
  const initTheme = () => {
    const theme = getThemePreference();
    applyTheme(theme);
    updateIcon(theme);
  };

  // Attach event listener to button
  const attachToggleListener = () => {
    const button = document.querySelector('button[aria-label="Toggle dark mode"], button[title="Toggle dark mode"]');
    if (button) {
      // Remove any existing listeners
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      // Attach click listener
      newButton.addEventListener('click', toggleTheme);
      
      // Also support keyboard (Enter/Space)
      newButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTheme(e);
        }
      });
    } else {
      // Retry if button not found yet
      setTimeout(attachToggleListener, 100);
    }
  };

  // System theme listener removed - we default to dark mode
  // Users can manually toggle if they prefer light mode
  const setupSystemThemeListener = () => {
    // No longer listening to system preferences
    // Dark mode is the default, users can toggle to light if preferred
  };

  // Initialize everything
  const initialize = () => {
    initTheme();
    attachToggleListener();
    setupSystemThemeListener();
  };

  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    // DOM already loaded
    initialize();
  }

  // Expose for external use
  window.toggleDarkMode = toggleTheme;
  window.getCurrentTheme = () => document.documentElement.getAttribute('data-theme') || getThemePreference();
})();

// Image Protection - Prevent right-click, drag, and save
(function() {
  'use strict';
  
  const protectImage = () => {
    const avatar = document.querySelector('.about-avatar');
    const overlay = document.querySelector('.about-avatar-overlay');
    const wrapper = document.querySelector('.about-avatar-wrapper');
    
    if (!avatar || !overlay || !wrapper) {
      // Retry if elements not loaded yet
      setTimeout(protectImage, 100);
      return;
    }

    // Protection function for both image and overlay
    const applyProtection = (element) => {
      // Prevent right-click context menu
      element.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }, true);

      // Prevent drag
      element.addEventListener('dragstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }, true);

      // Prevent selection
      element.addEventListener('selectstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }, true);

      // Prevent copy
      element.addEventListener('copy', (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }, true);

      // Prevent cut
      element.addEventListener('cut', (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }, true);

      // Prevent mobile long-press
      element.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      }, { passive: false });

      element.addEventListener('touchmove', (e) => {
        e.preventDefault();
      }, { passive: false });

      element.addEventListener('touchend', (e) => {
        e.preventDefault();
      }, { passive: false });
    };

    // Apply protection to all elements
    applyProtection(avatar);
    applyProtection(overlay);
    applyProtection(wrapper);
  };

  // Apply protection when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', protectImage);
  } else {
    protectImage();
  }
})();
