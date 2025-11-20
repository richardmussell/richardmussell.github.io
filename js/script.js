// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    const searchIconBtn = document.querySelector('.search-icon-btn');
    
    // Search input functionality
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }
    
    // Search icon button functionality
    if (searchIconBtn) {
        searchIconBtn.addEventListener('click', function() {
            const searchValue = searchInput ? searchInput.value : '';
            if (searchValue) {
                performSearch(searchValue);
            } else {
                searchInput?.focus();
            }
        });
    }
    
    /**
     * Perform search with XSS protection
     * Sanitizes input to prevent injection attacks
     */
    function performSearch(query) {
        if (query.trim()) {
            // Sanitize input to prevent XSS
            const sanitized = sanitizeInput(query.trim().substring(0, 100));
            
            // Navigate to search results page with sanitized query
            if (sanitized) {
                const searchUrl = '/search/?q=' + encodeURIComponent(sanitized);
                window.location.href = searchUrl;
            }
        }
    }
    
    /**
     * Enhanced sanitize user input to prevent XSS attacks
     * @param {string} input - User input string
     * @returns {string} Sanitized string
     */
    function sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        
        // Normalize Unicode to prevent homoglyph attacks
        let sanitized = input.normalize('NFKC');
        
        // Remove HTML tags and dangerous characters
        sanitized = sanitized
            .replace(/[<>'"]/g, '') // Remove HTML tags and quotes
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/data:/gi, '') // Remove data: protocol
            .replace(/vbscript:/gi, '') // Remove vbscript: protocol
            .replace(/on\w+\s*=/gi, '') // Remove event handlers
            .replace(/&#x?[0-9a-f]+;/gi, '') // Remove HTML entities
            .replace(/[^\w\s@.-]/g, ''); // Remove special characters except safe ones
        
        // Length limit
        return sanitized.substring(0, 100);
    }
    
    // Pagination functionality
    const pageButtons = document.querySelectorAll('.page-btn');
    const pageNav = document.querySelector('.page-nav');
    
    pageButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            pageButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Navigate to page
            const pageNumber = this.textContent;
            // Actual navigation handled by href attribute
        });
    });
    
    if (pageNav) {
        pageNav.addEventListener('click', function() {
            const activePage = document.querySelector('.page-btn.active');
            const currentPage = parseInt(activePage.textContent);
            const nextPage = currentPage + 1;
            
            // Check if next page exists
            const nextPageBtn = Array.from(pageButtons).find(btn => 
                btn.textContent === nextPage.toString()
            );
            
            if (nextPageBtn) {
                pageButtons.forEach(btn => btn.classList.remove('active'));
                nextPageBtn.classList.add('active');
                // Navigation handled by href attribute
            }
        });
    }
    
    // Category and tag click functionality
    const categoryTags = document.querySelectorAll('.category-tag, .series-tag, .tag-item');
    categoryTags.forEach(tag => {
        // Tag navigation handled by href attribute
    });
    
    // Recent posts navigation handled by href attribute (no preventDefault needed)
    
    // Read more buttons navigation handled by href attribute
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // All categories navigation handled by href attribute
    
    // Add hover effects for better UX
    const blogCards = document.querySelectorAll('.blog-post-card');
    blogCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Protect profile images from right-click and dragging
    const profileImages = document.querySelectorAll('.about-avatar img, .author-avatar img');
    profileImages.forEach(function(profileImage) {
        if (profileImage) {
            // Prevent right-click context menu
            profileImage.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            });
            
            // Prevent dragging
            profileImage.addEventListener('dragstart', function(e) {
                e.preventDefault();
                return false;
            });
            
            // Prevent selection
            profileImage.addEventListener('selectstart', function(e) {
                e.preventDefault();
                return false;
            });
            
            // Prevent opening image in new tab (middle click, Ctrl+click, etc.)
            profileImage.addEventListener('click', function(e) {
                if (e.ctrlKey || e.metaKey || e.button === 1) {
                    e.preventDefault();
                    return false;
                }
            });
            
            // Prevent keyboard shortcuts when focused on image
            profileImage.addEventListener('keydown', function(e) {
                if (e.key === 'F12' || 
                    (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                    (e.ctrlKey && e.shiftKey && e.key === 'C') ||
                    (e.ctrlKey && e.key === 'U')) {
                    e.preventDefault();
                    return false;
                }
            });
        }
    });
    
    // Prevent opening images via direct URL access attempts
    document.addEventListener('keydown', function(e) {
        // Block common shortcuts that might reveal image URLs
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
            const activeElement = document.activeElement;
            const profileImages = document.querySelectorAll('.about-avatar img, .author-avatar img');
            profileImages.forEach(function(img) {
                if (activeElement === img || img.contains(activeElement)) {
                    e.preventDefault();
                }
            });
        }
    });
});


