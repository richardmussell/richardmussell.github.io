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
     * Sanitize user input to prevent XSS attacks
     * @param {string} input - User input string
     * @returns {string} Sanitized string
     */
    function sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        return input
            .replace(/[<>'"]/g, '') // Remove HTML tags and quotes
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+=/gi, '') // Remove event handlers
            .replace(/[^\w\s@.-]/g, ''); // Remove special characters except safe ones
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
});


