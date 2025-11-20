/**
 * Email Obfuscation Script
 * Prevents email scraping by obfuscating email addresses
 */
(function() {
    'use strict';
    
    // Obfuscated email parts (split to prevent easy scraping)
    const emailParts = ['Richard', 'Mussell', '@yahoo', '.com'];
    const email = emailParts.join('.');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', obfuscateEmails);
    } else {
        obfuscateEmails();
    }
    
    function obfuscateEmails() {
        // Find all elements with class 'email-link'
        const emailLinks = document.querySelectorAll('.email-link');
        
        emailLinks.forEach(function(link) {
            link.href = 'mailto:' + email;
            link.textContent = email;
        });
        
        // Also handle any remaining mailto links
        const mailtoLinks = document.querySelectorAll('a[href^="mailto:"]');
        mailtoLinks.forEach(function(link) {
            if (!link.classList.contains('email-link')) {
                link.href = 'mailto:' + email;
                if (link.textContent.includes('@') || link.textContent === 'Loading...') {
                    link.textContent = email;
                }
            }
        });
    }
})();

