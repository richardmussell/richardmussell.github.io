(() => {
  // <stdin>
  (function() {
    "use strict";
    const DARK_MODE_KEY = "theme";
    const DARK_THEME = "dark";
    const LIGHT_THEME = "light";
    const getThemePreference = () => {
      try {
        const savedTheme = localStorage.getItem(DARK_MODE_KEY);
        if (savedTheme === DARK_THEME || savedTheme === LIGHT_THEME) {
          return savedTheme;
        }
      } catch (e) {
        console.warn("localStorage not available:", e);
      }
      return DARK_THEME;
    };
    const applyTheme = (theme) => {
      const root = document.documentElement;
      if (theme === DARK_THEME) {
        root.classList.add("dark-mode");
        root.setAttribute("data-theme", DARK_THEME);
      } else {
        root.classList.remove("dark-mode");
        root.setAttribute("data-theme", LIGHT_THEME);
      }
      try {
        localStorage.setItem(DARK_MODE_KEY, theme);
      } catch (e) {
        console.warn("Could not save theme preference:", e);
      }
    };
    const updateIcon = (theme) => {
      const button = document.querySelector('button[aria-label="Toggle dark mode"], button[title="Toggle dark mode"]');
      if (!button) {
        setTimeout(() => updateIcon(theme), 100);
        return;
      }
      const svg = button.querySelector("svg");
      if (!svg) return;
      svg.innerHTML = "";
      if (theme === DARK_THEME) {
        const sunPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        sunPath.setAttribute("stroke-linecap", "round");
        sunPath.setAttribute("stroke-linejoin", "round");
        sunPath.setAttribute("stroke-width", "2");
        sunPath.setAttribute("d", "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z");
        svg.appendChild(sunPath);
      } else {
        const moonPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        moonPath.setAttribute("stroke-linecap", "round");
        moonPath.setAttribute("stroke-linejoin", "round");
        moonPath.setAttribute("stroke-width", "2");
        moonPath.setAttribute("d", "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z");
        svg.appendChild(moonPath);
      }
    };
    const toggleTheme = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const currentTheme = document.documentElement.getAttribute("data-theme") || getThemePreference();
      const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
      applyTheme(newTheme);
      updateIcon(newTheme);
    };
    const initTheme = () => {
      const theme = getThemePreference();
      applyTheme(theme);
      updateIcon(theme);
    };
    const attachToggleListener = () => {
      const button = document.querySelector('button[aria-label="Toggle dark mode"], button[title="Toggle dark mode"]');
      if (button) {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        newButton.addEventListener("click", toggleTheme);
        newButton.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleTheme(e);
          }
        });
      } else {
        setTimeout(attachToggleListener, 100);
      }
    };
    const setupSystemThemeListener = () => {
    };
    const initialize = () => {
      initTheme();
      attachToggleListener();
      setupSystemThemeListener();
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initialize);
    } else {
      initialize();
    }
    window.toggleDarkMode = toggleTheme;
    window.getCurrentTheme = () => document.documentElement.getAttribute("data-theme") || getThemePreference();
  })();
  (function() {
    "use strict";
    const protectImage = () => {
      const avatar = document.querySelector(".about-avatar");
      if (!avatar) {
        setTimeout(protectImage, 100);
        return;
      }
      avatar.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }, true);
      avatar.addEventListener("dragstart", (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }, true);
      avatar.addEventListener("selectstart", (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }, true);
      avatar.addEventListener("copy", (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }, true);
      avatar.addEventListener("cut", (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }, true);
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", protectImage);
    } else {
      protectImage();
    }
  })();
})();
