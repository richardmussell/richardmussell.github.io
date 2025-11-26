/**
 * Dark Mode Toggle
 * Lightweight script to toggle between light and dark themes
 * Uses data-theme attribute for manual override
 */

(function() {
  'use strict';

  // Configuration
  const THEME_STORAGE_KEY = 'theme-preference';
  const THEME_ATTRIBUTE = 'data-theme';
  const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto'
  };

  /**
   * Get current theme preference from localStorage or system
   */
  function getThemePreference() {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && Object.values(THEMES).includes(stored)) {
      return stored;
    }
    return THEMES.AUTO; // Default to system preference
  }

  /**
   * Get effective theme (resolves 'auto' to system preference)
   */
  function getEffectiveTheme() {
    const preference = getThemePreference();
    if (preference === THEMES.AUTO) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? THEMES.DARK
        : THEMES.LIGHT;
    }
    return preference;
  }

  /**
   * Apply theme to document
   */
  function applyTheme(theme) {
    const html = document.documentElement;
    if (theme === THEMES.AUTO) {
      html.removeAttribute(THEME_ATTRIBUTE);
    } else {
      html.setAttribute(THEME_ATTRIBUTE, theme);
    }
  }

  /**
   * Save theme preference
   */
  function saveThemePreference(theme) {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  /**
   * Initialize theme on page load
   */
  function initTheme() {
    const theme = getEffectiveTheme();
    applyTheme(getThemePreference());
    
    // Dispatch event for other scripts
    document.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme: theme, preference: getThemePreference() }
    }));
  }

  /**
   * Toggle between light and dark
   */
  function toggleTheme() {
    const currentPreference = getThemePreference();
    let newPreference;
    
    if (currentPreference === THEMES.LIGHT) {
      newPreference = THEMES.DARK;
    } else if (currentPreference === THEMES.DARK) {
      newPreference = THEMES.LIGHT;
    } else {
      // If auto, switch to opposite of current system preference
      newPreference = getEffectiveTheme() === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    }
    
    saveThemePreference(newPreference);
    applyTheme(newPreference);
    
    // Dispatch event
    document.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme: getEffectiveTheme(), preference: newPreference }
    }));
  }

  /**
   * Listen for system theme changes (when preference is 'auto')
   */
  function watchSystemTheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      if (getThemePreference() === THEMES.AUTO) {
        applyTheme(THEMES.AUTO);
        document.dispatchEvent(new CustomEvent('themechange', {
          detail: { theme: getEffectiveTheme(), preference: THEMES.AUTO }
        }));
      }
    });
  }

  /**
   * Create theme toggle button (optional)
   */
  function createToggleButton() {
    const button = document.createElement('button');
    button.setAttribute('aria-label', 'Toggle dark mode');
    button.setAttribute('title', 'Toggle dark mode');
    button.className = 'theme-toggle';
    button.innerHTML = `
      <span class="theme-toggle-icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
          <path class="theme-icon-light" d="M10 3V1M10 19v-2M17 10h2M1 10h2M15.657 4.343l1.414-1.414M2.929 17.071l1.414-1.414M15.657 15.657l1.414 1.414M2.929 2.929l1.414 1.414M13 10a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path class="theme-icon-dark" d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" style="display: none;"/>
        </svg>
      </span>
      <span class="sr-only">Toggle dark mode</span>
    `;
    
    button.addEventListener('click', toggleTheme);
    
    // Update icon based on current theme
    function updateIcon() {
      const isDark = getEffectiveTheme() === THEMES.DARK;
      const lightIcon = button.querySelector('.theme-icon-light');
      const darkIcon = button.querySelector('.theme-icon-dark');
      
      if (lightIcon && darkIcon) {
        lightIcon.style.display = isDark ? 'none' : 'block';
        darkIcon.style.display = isDark ? 'block' : 'none';
      }
    }
    
    // Listen for theme changes
    document.addEventListener('themechange', updateIcon);
    updateIcon();
    
    return button;
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initTheme();
      watchSystemTheme();
    });
  } else {
    initTheme();
    watchSystemTheme();
  }

  // Export for manual control
  window.themeToggle = {
    toggle: toggleTheme,
    setTheme: (theme) => {
      if (Object.values(THEMES).includes(theme)) {
        saveThemePreference(theme);
        applyTheme(theme);
        document.dispatchEvent(new CustomEvent('themechange', {
          detail: { theme: getEffectiveTheme(), preference: theme }
        }));
      }
    },
    getTheme: getEffectiveTheme,
    getPreference: getThemePreference,
    createButton: createToggleButton
  };

})();

