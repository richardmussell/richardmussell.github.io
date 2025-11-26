/**
 * Main JavaScript Module - Enterprise Portfolio Interactivity
 * 
 * Features:
 * - Mobile Navigation Toggle
 * - Header Scroll Observer (Glassmorphism effect)
 * - Active Link Highlighter
 * - Code Block Copy-to-Clipboard
 * - Smooth Scroll
 * 
 * Performance:
 * - Non-blocking, deferred loading
 * - Event delegation where possible
 * - IntersectionObserver for scroll detection
 * - RequestAnimationFrame for smooth animations
 */

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function to limit function execution rate
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (func, wait = 100) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @param {number} threshold - Visibility threshold (0-1)
 * @returns {boolean} True if element is visible
 */
const isInViewport = (element, threshold = 0.5) => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    return (
        rect.top >= -rect.height * threshold &&
        rect.left >= -rect.width * threshold &&
        rect.bottom <= windowHeight + rect.height * threshold &&
        rect.right <= windowWidth + rect.width * threshold
    );
};

// ============================================
// MOBILE NAVIGATION
// ============================================

/**
 * Mobile Navigation Toggle Module
 * Handles hamburger menu toggle, ARIA states, and body scroll lock
 */
class MobileNavigation {
    constructor() {
        this.nav = document.querySelector('.nav-menu');
        this.header = document.querySelector('.header');
        this.body = document.body;
        this.isActive = false;
        
        if (!this.nav) {
            console.warn('MobileNavigation: Navigation element not found');
            return;
        }
        
        // Create hamburger button if it doesn't exist
        this.createHamburgerButton();
        this.hamburger = document.querySelector('.nav-toggle');
        
        if (!this.hamburger) {
            console.warn('MobileNavigation: Hamburger button not found or could not be created');
            return;
        }
        
        this.init();
    }
    
    /**
     * Create hamburger menu button
     */
    createHamburgerButton() {
        // Check if button already exists
        if (document.querySelector('.nav-toggle')) return;
        
        const hamburger = document.createElement('button');
        hamburger.className = 'nav-toggle';
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-controls', 'main-navigation');
        hamburger.innerHTML = `
            <span class="nav-toggle-icon" aria-hidden="true">
                <span class="nav-toggle-line"></span>
                <span class="nav-toggle-line"></span>
                <span class="nav-toggle-line"></span>
            </span>
        `;
        
        // Insert before navigation in header container
        const headerContainer = document.querySelector('.header-container');
        if (headerContainer && this.nav) {
            // Insert hamburger before nav menu
            headerContainer.insertBefore(hamburger, this.nav);
        }
        
        // Add ID to nav for aria-controls
        if (this.nav && !this.nav.id) {
            this.nav.id = 'main-navigation';
        }
    }
    
    /**
     * Initialize event listeners
     */
    init() {
        this.hamburger.addEventListener('click', () => this.toggle());
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isActive && 
                !this.nav.contains(e.target) && 
                !this.hamburger.contains(e.target)) {
                this.close();
            }
        });
        
        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isActive) {
                this.close();
                this.hamburger.focus(); // Return focus to button
            }
        });
        
        // Close menu when clicking nav links (for single-page navigation)
        const navLinks = this.nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isActive) {
                    // Small delay to allow navigation
                    setTimeout(() => this.close(), 100);
                }
            });
        });
    }
    
    /**
     * Toggle mobile menu
     */
    toggle() {
        this.isActive ? this.close() : this.open();
    }
    
    /**
     * Open mobile menu
     */
    open() {
        this.isActive = true;
        this.nav.classList.add('is-active');
        this.hamburger.classList.add('is-active');
        this.body.classList.add('no-scroll');
        this.hamburger.setAttribute('aria-expanded', 'true');
        
        // Prevent body scroll on mobile
        document.documentElement.style.overflow = 'hidden';
    }
    
    /**
     * Close mobile menu
     */
    close() {
        this.isActive = false;
        this.nav.classList.remove('is-active');
        this.hamburger.classList.remove('is-active');
        this.body.classList.remove('no-scroll');
        this.hamburger.setAttribute('aria-expanded', 'false');
        
        // Restore body scroll
        document.documentElement.style.overflow = '';
    }
}

// ============================================
// HEADER SCROLL OBSERVER
// ============================================

/**
 * Header Scroll Observer Module
 * Adds 'scrolled' class to header when user scrolls down
 * Enables glassmorphism/backdrop blur effects
 */
class HeaderScrollObserver {
    constructor() {
        this.header = document.querySelector('.header');
        this.scrollThreshold = 50; // Pixels scrolled before applying effect
        this.lastScrollY = window.scrollY;
        this.isScrolled = false;
        
        if (!this.header) {
            console.warn('HeaderScrollObserver: Header element not found');
            return;
        }
        
        this.init();
    }
    
    /**
     * Initialize scroll observer
     */
    init() {
        // Use IntersectionObserver for better performance
        const observerOptions = {
            root: null,
            rootMargin: `${this.scrollThreshold}px 0px 0px 0px`,
            threshold: 0
        };
        
        // Create a sentinel element at the top of the page
        const sentinel = document.createElement('div');
        sentinel.className = 'scroll-sentinel';
        sentinel.style.position = 'absolute';
        sentinel.style.top = '0';
        sentinel.style.left = '0';
        sentinel.style.width = '1px';
        sentinel.style.height = `${this.scrollThreshold}px`;
        sentinel.style.pointerEvents = 'none';
        sentinel.style.visibility = 'hidden';
        
        document.body.insertBefore(sentinel, document.body.firstChild);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    // Scrolled past threshold
                    if (!this.isScrolled) {
                        this.addScrolledClass();
                    }
                } else {
                    // At or above threshold
                    if (this.isScrolled) {
                        this.removeScrolledClass();
                    }
                }
            });
        }, observerOptions);
        
        observer.observe(sentinel);
        
        // Fallback: Direct scroll listener with throttling
        const handleScroll = debounce(() => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > this.scrollThreshold && !this.isScrolled) {
                this.addScrolledClass();
            } else if (currentScrollY <= this.scrollThreshold && this.isScrolled) {
                this.removeScrolledClass();
            }
            
            this.lastScrollY = currentScrollY;
        }, 10);
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Initial check
        handleScroll();
    }
    
    /**
     * Add scrolled class to header
     */
    addScrolledClass() {
        this.header.classList.add('scrolled');
        this.isScrolled = true;
    }
    
    /**
     * Remove scrolled class from header
     */
    removeScrolledClass() {
        this.header.classList.remove('scrolled');
        this.isScrolled = false;
    }
}

// ============================================
// ACTIVE LINK HIGHLIGHTER
// ============================================

/**
 * Active Link Highlighter Module
 * Highlights navigation links based on current viewport section
 */
class ActiveLinkHighlighter {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-menu-link');
        this.sections = [];
        
        if (this.navLinks.length === 0) {
            console.warn('ActiveLinkHighlighter: Navigation links not found');
            return;
        }
        
        this.init();
    }
    
    /**
     * Initialize link highlighter
     */
    init() {
        // Get all sections that correspond to nav links
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const sectionId = href.substring(1);
                const section = document.getElementById(sectionId);
                if (section) {
                    this.sections.push({
                        link,
                        section,
                        id: sectionId
                    });
                }
            }
        });
        
        if (this.sections.length === 0) {
            // Fallback: Highlight based on current page
            this.highlightCurrentPage();
            return;
        }
        
        // Use IntersectionObserver for efficient scroll detection
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const sectionData = this.sections.find(s => s.section === entry.target);
                if (sectionData) {
                    if (entry.isIntersecting) {
                        this.setActiveLink(sectionData.link);
                    }
                }
            });
        }, observerOptions);
        
        // Observe all sections
        this.sections.forEach(({ section }) => {
            observer.observe(section);
        });
        
        // Highlight current page on load
        this.highlightCurrentPage();
    }
    
    /**
     * Set active link
     * @param {HTMLElement} activeLink - Link to activate
     */
    setActiveLink(activeLink) {
        // Remove active class from all links
        this.navLinks.forEach(link => {
            link.classList.remove('nav-menu-link--active');
            link.removeAttribute('aria-current');
        });
        
        // Add active class to current link
        activeLink.classList.add('nav-menu-link--active');
        activeLink.setAttribute('aria-current', 'page');
    }
    
    /**
     * Highlight link based on current page URL
     */
    highlightCurrentPage() {
        const currentPath = window.location.pathname;
        this.navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            if (linkPath === currentPath || 
                (currentPath === '/' && linkPath === '/') ||
                (currentPath !== '/' && currentPath.startsWith(linkPath) && linkPath !== '/')) {
                this.setActiveLink(link);
            }
        });
    }
}

// ============================================
// CODE BLOCK COPY-TO-CLIPBOARD
// ============================================

/**
 * Code Block Copy-to-Clipboard Module
 * Adds copy buttons to all code blocks
 */
class CodeBlockCopy {
    constructor() {
        this.codeBlocks = document.querySelectorAll('pre > code, pre code');
        this.init();
    }
    
    /**
     * Initialize copy buttons
     */
    init() {
        // Group code blocks by their parent <pre> element
        const preElements = new Set();
        this.codeBlocks.forEach(code => {
            const pre = code.closest('pre');
            if (pre && !preElements.has(pre)) {
                preElements.add(pre);
                this.addCopyButton(pre, code);
            }
        });
    }
    
    /**
     * Add copy button to code block
     * @param {HTMLElement} preElement - Parent <pre> element
     * @param {HTMLElement} codeElement - <code> element containing code
     */
    addCopyButton(preElement, codeElement) {
        // Create copy button container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'code-block-actions';
        
        const copyButton = document.createElement('button');
        copyButton.className = 'code-copy-button';
        copyButton.setAttribute('aria-label', 'Copy code to clipboard');
        copyButton.setAttribute('type', 'button');
        copyButton.innerHTML = `
            <span class="code-copy-icon" aria-hidden="true">📋</span>
            <span class="code-copy-text">Copy</span>
        `;
        
        // Add button to pre element
        preElement.style.position = 'relative';
        preElement.appendChild(buttonContainer);
        buttonContainer.appendChild(copyButton);
        
        // Copy functionality
        copyButton.addEventListener('click', async () => {
            await this.copyToClipboard(codeElement, copyButton);
        });
    }
    
    /**
     * Copy code to clipboard
     * @param {HTMLElement} codeElement - Code element to copy
     * @param {HTMLElement} button - Copy button element
     */
    async copyToClipboard(codeElement, button) {
        const codeText = codeElement.textContent || codeElement.innerText;
        
        try {
            // Use modern Clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(codeText);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = codeText;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            
            // Show success feedback
            this.showCopyFeedback(button, true);
        } catch (err) {
            console.error('Failed to copy code:', err);
            this.showCopyFeedback(button, false);
        }
    }
    
    /**
     * Show copy feedback
     * @param {HTMLElement} button - Copy button element
     * @param {boolean} success - Whether copy was successful
     */
    showCopyFeedback(button, success) {
        const originalHTML = button.innerHTML;
        const textSpan = button.querySelector('.code-copy-text');
        
        if (success) {
            textSpan.textContent = 'Copied!';
            button.classList.add('code-copy-button--success');
            
            // Reset after 2 seconds
            setTimeout(() => {
                textSpan.textContent = 'Copy';
                button.classList.remove('code-copy-button--success');
            }, 2000);
        } else {
            textSpan.textContent = 'Failed';
            button.classList.add('code-copy-button--error');
            
            setTimeout(() => {
                textSpan.textContent = 'Copy';
                button.classList.remove('code-copy-button--error');
            }, 2000);
        }
    }
}

// ============================================
// SMOOTH SCROLL ENHANCEMENT
// ============================================

/**
 * Enhanced Smooth Scroll Module
 * Respects prefers-reduced-motion
 */
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    /**
     * Initialize smooth scroll
     */
    init() {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            return; // Skip smooth scroll for accessibility
        }
        
        // Handle anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 100; // Account for sticky header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without triggering scroll
                history.pushState(null, null, href);
            }
        });
    }
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize all modules when DOM is ready
 */
const init = () => {
    // Use DOMContentLoaded if script is deferred
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        return;
    }
    
    // Initialize modules
    new MobileNavigation();
    new HeaderScrollObserver();
    new ActiveLinkHighlighter();
    new CodeBlockCopy();
    new SmoothScroll();
    
    console.log('✅ Portfolio interactivity initialized');
};

// Initialize immediately if DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 1);
} else {
    init();
}

// Export for potential module usage
export { MobileNavigation, HeaderScrollObserver, ActiveLinkHighlighter, CodeBlockCopy, SmoothScroll };
