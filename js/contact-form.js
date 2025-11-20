/**
 * Professional Contact Form Handler with Enhanced Security
 * Features:
 * - Real-time validation
 * - Character counter
 * - Loading states
 * - Success/error handling
 * - Formspree integration
 * - Rate limiting
 * - Origin validation
 * - Enhanced input sanitization
 * - Security event logging
 */
(function() {
    'use strict';
    
    // Security Configuration
    const ALLOWED_ORIGINS = [
        'https://richardmussell.github.io',
        'http://localhost:8080',
        'http://localhost:1313',
        'http://127.0.0.1:8080',
        'http://127.0.0.1:1313'
    ];
    
    const RATE_LIMIT_KEY = 'form_submission_time';
    const RATE_LIMIT_DURATION = 60000; // 1 minute
    const MAX_SUBMISSIONS_PER_HOUR = 5;
    const SUBMISSION_COUNT_KEY = 'form_submission_count';
    const SUBMISSION_HOUR_KEY = 'form_submission_hour';
    
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('form-success');
    const errorMessage = document.getElementById('form-error');
    const errorText = document.getElementById('error-text');
    const messageField = document.getElementById('message');
    const charCount = document.getElementById('char-count');
    const submitButton = form?.querySelector('button[type="submit"]');
    const resetButton = form?.querySelector('button[type="reset"]');
    
    if (!form) return;
    
    /**
     * Validate origin to prevent unauthorized submissions
     * @returns {boolean} True if origin is allowed
     */
    function validateOrigin() {
        const currentOrigin = window.location.origin;
        return ALLOWED_ORIGINS.includes(currentOrigin);
    }
    
    /**
     * Check rate limiting to prevent spam/DoS
     * @returns {boolean} True if submission is allowed
     */
    function checkRateLimit() {
        const now = Date.now();
        const currentHour = Math.floor(now / 3600000); // Hours since epoch
        
        // Check per-minute rate limit
        const lastSubmission = localStorage.getItem(RATE_LIMIT_KEY);
        if (lastSubmission) {
            const timeSince = now - parseInt(lastSubmission);
            if (timeSince < RATE_LIMIT_DURATION) {
                const remaining = Math.ceil((RATE_LIMIT_DURATION - timeSince) / 1000);
                showError(`Please wait ${remaining} seconds before submitting again.`);
                logSecurityEvent('rate_limit_violation', {
                    timeSince: timeSince,
                    remaining: remaining
                });
                return false;
            }
        }
        
        // Check per-hour submission limit
        const submissionHour = localStorage.getItem(SUBMISSION_HOUR_KEY);
        const submissionCount = parseInt(localStorage.getItem(SUBMISSION_COUNT_KEY) || '0');
        
        if (submissionHour === currentHour.toString()) {
            if (submissionCount >= MAX_SUBMISSIONS_PER_HOUR) {
                showError('Too many submissions. Please try again later.');
                logSecurityEvent('hourly_rate_limit_violation', {
                    count: submissionCount,
                    max: MAX_SUBMISSIONS_PER_HOUR
                });
                return false;
            }
        } else {
            // Reset counter for new hour
            localStorage.setItem(SUBMISSION_COUNT_KEY, '0');
            localStorage.setItem(SUBMISSION_HOUR_KEY, currentHour.toString());
        }
        
        return true;
    }
    
    /**
     * Update rate limit tracking after successful submission
     */
    function updateRateLimit() {
        const now = Date.now();
        localStorage.setItem(RATE_LIMIT_KEY, now.toString());
        
        const currentHour = Math.floor(now / 3600000);
        const submissionHour = localStorage.getItem(SUBMISSION_HOUR_KEY);
        const submissionCount = parseInt(localStorage.getItem(SUBMISSION_COUNT_KEY) || '0');
        
        if (submissionHour === currentHour.toString()) {
            localStorage.setItem(SUBMISSION_COUNT_KEY, (submissionCount + 1).toString());
        } else {
            localStorage.setItem(SUBMISSION_COUNT_KEY, '1');
            localStorage.setItem(SUBMISSION_HOUR_KEY, currentHour.toString());
        }
    }
    
    /**
     * Enhanced sanitize user input to prevent XSS and injection attacks
     * @param {string} input - User input string
     * @param {string} fieldType - Type of field ('text', 'email', 'message')
     * @returns {string} Sanitized string
     */
    function sanitizeInput(input, fieldType = 'text') {
        if (typeof input !== 'string') return '';
        
        // Normalize Unicode to prevent homoglyph attacks
        let sanitized = input.normalize('NFKC').trim();
        
        if (fieldType === 'email') {
            // Validate email format first
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            if (!emailRegex.test(sanitized)) {
                return '';
            }
            // Only remove dangerous characters, preserve email format
            sanitized = sanitized
                .replace(/[<>'"]/g, '')
                .replace(/javascript:/gi, '')
                .replace(/data:/gi, '')
                .replace(/vbscript:/gi, '');
        } else {
            // For text fields, more aggressive sanitization
            sanitized = sanitized
                .replace(/[<>'"]/g, '') // Remove HTML tags and quotes
                .replace(/javascript:/gi, '') // Remove javascript: protocol
                .replace(/data:/gi, '') // Remove data: protocol
                .replace(/vbscript:/gi, '') // Remove vbscript: protocol
                .replace(/on\w+\s*=/gi, '') // Remove event handlers
                .replace(/&#x?[0-9a-f]+;/gi, '') // Remove HTML entities
                .replace(/[\r\n]+/g, ' ') // Prevent CRLF injection
                .replace(/[^\w\s@.,!?;:()\-]/g, ''); // Allow common punctuation
        }
        
        return sanitized;
    }
    
    /**
     * Validate email format
     * @param {string} email - Email address
     * @returns {boolean} True if valid
     */
    function isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(email) && email.length <= 254;
    }
    
    /**
     * Log security events (client-side logging)
     * @param {string} eventType - Type of security event
     * @param {object} details - Event details
     */
    function logSecurityEvent(eventType, details) {
        // Log to console in development
        if (typeof console !== 'undefined' && console.warn) {
            console.warn('Security Event:', {
                type: eventType,
                details: details,
                timestamp: new Date().toISOString(),
                origin: window.location.origin
            });
        }
        
        // In production, you could send to a secure logging endpoint
        // fetch('/api/log', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         type: eventType,
        //         details: details,
        //         timestamp: new Date().toISOString(),
        //         userAgent: navigator.userAgent,
        //         origin: window.location.origin
        //     })
        // }).catch(() => {
        //     // Fail silently if logging fails
        // });
    }
    
    // Character Counter for Message Field
    if (messageField && charCount) {
        function updateCharCount() {
            const currentLength = messageField.value.length;
            const maxLength = messageField.getAttribute('maxlength') || 2000;
            charCount.textContent = currentLength;
            
            // Update counter color based on usage
            const counter = document.getElementById('message-counter');
            if (currentLength > maxLength * 0.9) {
                counter.classList.add('warning');
            } else {
                counter.classList.remove('warning');
            }
        }
        
        messageField.addEventListener('input', updateCharCount);
        messageField.addEventListener('paste', function() {
            setTimeout(updateCharCount, 10);
        });
        updateCharCount(); // Initial count
    }
    
    // Form Reset Handler
    if (resetButton) {
        resetButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to clear all form fields?')) {
                form.reset();
                hideMessages();
                resetFormState();
                if (charCount) charCount.textContent = '0';
            }
        });
    }
    
    // Real-time Field Validation
    const requiredFields = form.querySelectorAll('input[required], textarea[required]');
    requiredFields.forEach(function(field) {
        // Validate on blur
        field.addEventListener('blur', function() {
            validateField(field);
        });
        
        // Clear errors on input (for better UX)
        field.addEventListener('input', function() {
            if (field.classList.contains('error') || field.closest('.form-group').classList.contains('error')) {
                validateField(field);
            }
        });
    });
    
    // Form Submission Handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Hide previous messages
        hideMessages();
        
        // Validate origin
        if (!validateOrigin()) {
            showError('Invalid origin. Submission rejected for security reasons.');
            logSecurityEvent('invalid_origin', {
                origin: window.location.origin
            });
            return;
        }
        
        // Check rate limiting
        if (!checkRateLimit()) {
            return;
        }
        
        // Validate all required fields
        if (!validateForm()) {
            // Focus first invalid field
            const firstError = form.querySelector('.form-group.error input, .form-group.error textarea');
            if (firstError) {
                firstError.focus();
            }
            logSecurityEvent('form_validation_failed', {
                fields: Array.from(requiredFields).filter(f => !f.validity.valid).map(f => f.id)
            });
            return;
        }
        
        // Disable submit button and show loading state
        setLoadingState(true);
        
        // Sanitize all inputs before submission
        const nameField = form.querySelector('#name');
        const emailField = form.querySelector('#email');
        const subjectField = form.querySelector('#subject');
        const messageField = form.querySelector('#message');
        
        if (nameField) nameField.value = sanitizeInput(nameField.value, 'text');
        if (emailField) emailField.value = sanitizeInput(emailField.value, 'email');
        if (subjectField) subjectField.value = sanitizeInput(subjectField.value, 'text');
        if (messageField) messageField.value = sanitizeInput(messageField.value, 'message');
        
        // Prepare form data
        const formData = new FormData(form);
        
        // Submit to Formspree with enhanced security headers
        const formOrigin = window.location.origin;
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'Origin': formOrigin,
                'Referer': formOrigin + '/contact/',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'same-origin',
            mode: 'cors'
        })
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(function(data) {
                    throw new Error(data.error || 'Submission failed');
                });
            }
        })
        .then(function(data) {
            // Success!
            updateRateLimit();
            showSuccess();
            form.reset();
            resetFormState();
            if (charCount) charCount.textContent = '0';
            logSecurityEvent('form_submission_success', {
                timestamp: new Date().toISOString()
            });
        })
        .catch(function(error) {
            // Log detailed error (not exposed to user)
            logSecurityEvent('form_submission_error', {
                message: error.message,
                timestamp: new Date().toISOString()
            });
            
            // Show generic user-friendly message (no info disclosure)
            showError('Failed to send message. Please try again or contact me directly via email.');
            setLoadingState(false);
        });
    });
    
    /**
     * Validate entire form
     * @returns {boolean} True if form is valid
     */
    function validateForm() {
        let isValid = true;
        requiredFields.forEach(function(field) {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        return isValid;
    }
    
    /**
     * Validate individual field with enhanced security
     * @param {HTMLElement} field - Input or textarea element
     * @returns {boolean} True if field is valid
     */
    function validateField(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup?.querySelector('.form-error');
        
        if (!formGroup || !errorElement) return true;
        
        // Remove previous validation states
        formGroup.classList.remove('error', 'success');
        
        // Skip validation for optional fields
        if (formGroup.classList.contains('optional') && !field.value.trim()) {
            return true;
        }
        
        // Sanitize and validate length
        const fieldType = field.type === 'email' ? 'email' : (field.id === 'message' ? 'message' : 'text');
        const sanitized = sanitizeInput(field.value, fieldType);
        
        // Length validation
        if (field.id === 'name' && sanitized.length > 100) {
            formGroup.classList.add('error');
            errorElement.textContent = 'Name must be 100 characters or less.';
            return false;
        }
        
        if (field.id === 'subject' && sanitized.length > 200) {
            formGroup.classList.add('error');
            errorElement.textContent = 'Subject must be 200 characters or less.';
            return false;
        }
        
        if (field.id === 'message' && sanitized.length > 2000) {
            formGroup.classList.add('error');
            errorElement.textContent = 'Message must be 2000 characters or less.';
            return false;
        }
        
        // Email validation
        if (field.type === 'email') {
            if (!isValidEmail(sanitized)) {
                formGroup.classList.add('error');
                errorElement.textContent = 'Please enter a valid email address.';
                return false;
            }
        }
        
        // Standard HTML5 validation
        if (!field.validity.valid) {
            formGroup.classList.add('error');
            
            // Set appropriate error message
            if (field.validity.valueMissing) {
                errorElement.textContent = 'This field is required.';
            } else if (field.validity.typeMismatch && field.type === 'email') {
                errorElement.textContent = 'Please enter a valid email address (e.g., name@example.com).';
            } else if (field.validity.patternMismatch && field.type === 'email') {
                errorElement.textContent = 'Please enter a valid email address.';
            } else if (field.validity.tooShort) {
                errorElement.textContent = 'This field is too short.';
            } else if (field.validity.tooLong) {
                errorElement.textContent = 'This field is too long.';
            } else {
                errorElement.textContent = 'Please check this field.';
            }
            
            // Announce error to screen readers
            errorElement.setAttribute('role', 'alert');
            
            return false;
        } else {
            formGroup.classList.add('success');
            errorElement.textContent = '';
            return true;
        }
    }
    
    /**
     * Show success message
     * Messages removed per user request - form will just reset on success
     */
    function showSuccess() {
        setLoadingState(false);
        // Form will reset automatically, no message display needed
    }
    
    /**
     * Show error message
     * Messages removed per user request - errors will be shown via field validation
     * @param {string} message - Error message to display (not used, kept for compatibility)
     */
    function showError(message) {
        setLoadingState(false);
        // Errors will be shown via individual field validation
        // Log error for debugging
        logSecurityEvent('form_submission_error', {
            message: message || 'Unknown error',
            timestamp: new Date().toISOString()
        });
    }
    
    /**
     * Hide all messages
     * Messages removed - function kept for compatibility
     */
    function hideMessages() {
        // No messages to hide
    }
    
    /**
     * Set loading state
     * @param {boolean} isLoading - Whether form is loading
     */
    function setLoadingState(isLoading) {
        if (!submitButton) return;
        
        const submitText = submitButton.querySelector('.submit-text');
        const submitLoading = submitButton.querySelector('.submit-loading');
        
        if (isLoading) {
            submitButton.disabled = true;
            if (submitText) submitText.style.display = 'none';
            if (submitLoading) submitLoading.style.display = 'inline-flex';
            form.classList.add('form-loading');
        } else {
            submitButton.disabled = false;
            if (submitText) submitText.style.display = 'inline';
            if (submitLoading) submitLoading.style.display = 'none';
            form.classList.remove('form-loading');
        }
    }
    
    /**
     * Reset form visual state
     */
    function resetFormState() {
        const formGroups = form.querySelectorAll('.form-group');
        formGroups.forEach(function(group) {
            group.classList.remove('error', 'success');
        });
    }
})();

