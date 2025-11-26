/**
 * Enhanced Email Obfuscation Module
 * Prevents email scraping through multiple obfuscation techniques
 * 
 * Security Features:
 * - Base64 encoding in HTML
 * - Client-side decoding only
 * - Hex encoding fallback
 * - Time-delayed rendering (prevents simple scrapers)
 */

(function() {
    'use strict';
    
    /**
     * Decode base64 encoded email
     * @param {string} encoded - Base64 encoded email
     * @returns {string} Decoded email address
     */
    function decodeEmail(encoded) {
        try {
            return atob(encoded);
        } catch (e) {
            console.warn('Email decoding failed:', e);
            return null;
        }
    }
    
    /**
     * Decode hex encoded email
     * @param {string} hex - Hex encoded email
     * @returns {string} Decoded email address
     */
    function decodeHex(hex) {
        try {
            const parts = hex.match(/.{2}/g);
            return parts.map(part => String.fromCharCode(parseInt(part, 16))).join('');
        } catch (e) {
            return null;
        }
    }
    
    /**
     * Create email link element
     * @param {string} email - Email address
     * @param {HTMLElement} container - Container element
     */
    function createEmailLink(email, container) {
        const link = document.createElement('a');
        link.href = 'mailto:' + email;
        link.textContent = email;
        link.className = 'email-link';
        link.setAttribute('rel', 'nofollow noopener');
        link.setAttribute('aria-label', 'Send email to ' + email);
        
        // Clear container and add link
        container.textContent = '';
        container.appendChild(link);
        
        // Add click tracking (optional)
        link.addEventListener('click', function() {
            // Email opened, could log analytics here
            this.setAttribute('data-clicked', 'true');
        });
    }
    
    /**
     * Process all obfuscated email elements
     */
    function processObfuscatedEmails() {
        // Base64 encoded emails
        const base64Elements = document.querySelectorAll('.email-obfuscated[data-email]');
        base64Elements.forEach(el => {
            const encoded = el.dataset.email;
            if (encoded) {
                const decoded = decodeEmail(encoded);
                if (decoded) {
                    // Small delay to prevent simple scrapers
                    setTimeout(() => createEmailLink(decoded, el), 100);
                } else {
                    el.textContent = '[Email protected]';
                }
            }
        });
        
        // Hex encoded emails (legacy support)
        const hexElements = document.querySelectorAll('.email-obfuscated[data-email-hex]');
        hexElements.forEach(el => {
            const hex = el.dataset.emailHex;
            if (hex) {
                const decoded = decodeHex(hex);
                if (decoded) {
                    setTimeout(() => createEmailLink(decoded, el), 100);
                } else {
                    el.textContent = '[Email protected]';
                }
            }
        });
        
        // ROT13 obfuscated (legacy support)
        const rot13Elements = document.querySelectorAll('.email-obfuscated[data-email-rot]');
        rot13Elements.forEach(el => {
            const rot = el.dataset.emailRot;
            if (rot) {
                const decoded = rot.replace(/[a-zA-Z]/g, function(char) {
                    const code = char.charCodeAt(0);
                    const base = code <= 90 ? 65 : 97;
                    return String.fromCharCode((code - base + 13) % 26 + base);
                });
                setTimeout(() => createEmailLink(decoded, el), 100);
            }
        });
    }
    
    /**
     * Initialize email obfuscation
     */
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', processObfuscatedEmails);
        } else {
            // DOM already ready, process immediately
            processObfuscatedEmails();
        }
    }
    
    // Initialize
    init();
    
    // Re-process on dynamic content load (for SPAs)
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    // Check if any new nodes contain obfuscated emails
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            if (node.classList && node.classList.contains('email-obfuscated')) {
                                processObfuscatedEmails();
                            } else if (node.querySelector && node.querySelector('.email-obfuscated')) {
                                processObfuscatedEmails();
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();

