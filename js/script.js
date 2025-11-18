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
    
    function performSearch(query) {
        if (query.trim()) {
            // In a real application, this would navigate to a search results page
            // For now, we'll just log it or show an alert
            console.log('Searching for:', query);
            // You can implement actual search functionality here
            alert(`Searching for: ${query}`);
        }
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
            
            // In a real application, this would load the corresponding page
            const pageNumber = this.textContent;
            console.log('Navigating to page:', pageNumber);
            // You can implement actual pagination here
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
                console.log('Navigating to page:', nextPage);
            }
        });
    }
    
    // Category and tag click functionality
    const categoryTags = document.querySelectorAll('.category-tag, .series-tag, .tag-item');
    categoryTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const tagText = this.textContent.replace(/\d+/g, '').trim();
            console.log('Filtering by:', tagText);
            // In a real application, this would filter posts by category/tag
            // You can implement actual filtering here
        });
    });
    
    // Recent posts click functionality
    const recentPostLinks = document.querySelectorAll('.recent-posts-list a');
    recentPostLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const postTitle = this.textContent;
            console.log('Opening post:', postTitle);
            // In a real application, this would navigate to the post
            // You can implement actual navigation here
        });
    });
    
    // Read more buttons functionality
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const postCard = this.closest('.blog-post-card') || this.closest('.author-profile');
            if (postCard) {
                const postTitle = postCard.querySelector('.post-title')?.textContent || 
                                 postCard.querySelector('.widget-title')?.textContent;
                console.log('Reading more about:', postTitle);
                // In a real application, this would navigate to the full post
                // You can implement actual navigation here
            }
        });
    });
    
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
    
    // All categories button functionality
    const allCategoriesBtn = document.querySelector('.all-categories-btn');
    if (allCategoriesBtn) {
        allCategoriesBtn.addEventListener('click', function() {
            console.log('Showing all categories');
            // In a real application, this would show all categories
            // You can implement actual functionality here
        });
    }
    
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


