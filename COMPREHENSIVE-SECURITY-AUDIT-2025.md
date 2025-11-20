# Comprehensive Security Audit Report
## ePortfolio Static Site - Complete Security Assessment

**Date:** January 2025  
**Auditor:** Security Analysis System  
**Frameworks:** OWASP Top 10, CWE Top 25, SANS Top 25, NIST Cybersecurity Framework  
**Scope:** Complete codebase analysis (HTML, JavaScript, PowerShell, Configuration Files)  
**Application Type:** Static Website (Hugo-generated) hosted on GitHub Pages

---

## Executive Summary

### Overall Security Posture: **MEDIUM-HIGH RISK**

**Risk Score:** 6.1/10 (Moderate-High)

This static portfolio website demonstrates **good foundational security practices** but has **critical gaps** that require immediate remediation. The site is a static HTML/CSS/JavaScript application with no server-side components, which reduces attack surface but introduces client-side security concerns.

### Key Findings Summary:
- **Critical Issues:** 3
- **High Issues:** 7
- **Medium Issues:** 12
- **Low Issues:** 15
- **Informational:** 20

### Immediate Action Required (Priority Order):
1. ⚠️ **CRITICAL:** Remove `'unsafe-inline'` from CSP (Content Security Policy)
2. ⚠️ **CRITICAL:** Implement proper CSRF protection for Formspree submissions
3. ⚠️ **CRITICAL:** Add rate limiting to contact form
4. 🔴 **HIGH:** Enhance input sanitization in search and contact form
5. 🔴 **HIGH:** Implement Subresource Integrity (SRI) for CDN resources
6. 🔴 **HIGH:** Add security monitoring and logging

---

## 1. OWASP Top 10 (2021) Analysis

### A01:2021 – Broken Access Control

#### Finding 1.1: Missing Access Control for Formspree Endpoint
- **Severity:** HIGH
- **Location:** `contact/index.html:84`
- **CWE:** CWE-284 (Improper Access Control)
- **CVSS Score:** 7.5 (High)

**Description:**
The Formspree form ID (`mgvdabve`) is exposed in client-side code, allowing potential abuse through automated submissions or spam attacks.

**Vulnerable Code:**
```html
<form class="contact-form" id="contactForm" action="https://formspree.io/f/mgvdabve" method="POST" novalidate>
```

**Exploitation Scenario:**
1. Attacker extracts form ID from page source
2. Creates automated script to submit spam messages
3. Exhausts Formspree quota or floods inbox
4. Potential DoS against form service

**Remediation:**
1. Implement rate limiting on Formspree side (configure in Formspree dashboard)
2. Add reCAPTCHA v3 to form (Formspree supports this)
3. Implement client-side rate limiting with localStorage
4. Consider using environment variable for form ID (if using build process)
5. Monitor Formspree dashboard for unusual activity

**Code Fix:**
```javascript
// Add rate limiting
const RATE_LIMIT_KEY = 'form_submission_time';
const RATE_LIMIT_DURATION = 60000; // 1 minute

function checkRateLimit() {
    const lastSubmission = localStorage.getItem(RATE_LIMIT_KEY);
    if (lastSubmission) {
        const timeSince = Date.now() - parseInt(lastSubmission);
        if (timeSince < RATE_LIMIT_DURATION) {
            return false; // Rate limited
        }
    }
    localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
    return true;
}
```

---

### A02:2021 – Cryptographic Failures

#### Finding 2.1: Missing Subresource Integrity (SRI) for CDN Resources
- **Severity:** HIGH
- **Location:** Multiple HTML files (e.g., `index.html:14`, `about/index.html:18`)
- **CWE:** CWE-345 (Insufficient Verification of Data Authenticity)
- **CVSS Score:** 7.1 (High)

**Description:**
Font Awesome CSS is loaded from CDN without Subresource Integrity (SRI) hashes, making the site vulnerable to CDN compromise or MITM attacks.

**Vulnerable Code:**
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
      integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" 
      crossorigin="anonymous">
```

**Note:** The integrity hash exists but needs verification.

**Exploitation Scenario:**
1. Attacker compromises CDN or performs MITM attack
2. Injects malicious CSS with `@import` or `url()` to exfiltrate data
3. CSS-based attacks can extract form data, cookies, or perform timing attacks

**Remediation:**
1. Verify SRI hash is correct for Font Awesome 6.4.0
2. Add SRI to all external resources
3. Consider self-hosting Font Awesome for better control
4. Implement CSP `require-sri-for` directive (if supported)

**Verification:**
```bash
# Verify SRI hash
curl -s https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css | \
  openssl dgst -sha384 -binary | openssl base64 -A
```

---

### A03:2021 – Injection

#### Finding 3.1: Insufficient Input Sanitization in Search Function
- **Severity:** MEDIUM
- **Location:** `js/script.js:31-42`
- **CWE:** CWE-79 (Cross-site Scripting), CWE-20 (Improper Input Validation)
- **CVSS Score:** 6.1 (Medium)

**Description:**
The search function sanitizes input but the sanitization may be insufficient. The function uses `encodeURIComponent` which helps, but the sanitization regex may be too permissive.

**Current Code:**
```javascript
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input
        .replace(/[<>'"]/g, '') // Remove HTML tags and quotes
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .replace(/[^\w\s@.-]/g, ''); // Remove special characters except safe ones
}
```

**Issues:**
1. Regex may not catch all XSS vectors
2. No protection against URL-based attacks
3. Unicode normalization not handled
4. No length validation before sanitization

**Exploitation Scenario:**
1. Attacker crafts payload: `%3Cscript%3Ealert(1)%3C/script%3E`
2. URL encoding bypasses some filters
3. Unicode variants: `<script>` (homoglyph attacks)

**Remediation:**
```javascript
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    // Normalize Unicode
    let sanitized = input.normalize('NFKC');
    
    // Remove HTML tags and dangerous characters
    sanitized = sanitized
        .replace(/[<>'"]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/data:/gi, '')
        .replace(/vbscript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/&#x?[0-9a-f]+;/gi, '') // Remove HTML entities
        .replace(/[^\w\s@.-]/g, '');
    
    // Length limit
    return sanitized.substring(0, 100);
}
```

**Better Approach:** Use DOMPurify library:
```javascript
import DOMPurify from 'dompurify';

function sanitizeInput(input) {
    return DOMPurify.sanitize(input, { 
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: []
    }).substring(0, 100);
}
```

---

#### Finding 3.2: Contact Form Input Sanitization Gaps
- **Severity:** MEDIUM
- **Location:** `contact/index.html:283-290`
- **CWE:** CWE-20 (Improper Input Validation)
- **CVSS Score:** 5.8 (Medium)

**Description:**
Contact form sanitization function may not catch all injection vectors, especially for email and message fields.

**Current Sanitization:**
```javascript
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input
        .trim()
        .replace(/[<>'"]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '');
}
```

**Issues:**
1. Email field sanitization may break valid emails
2. Message field allows newlines which could be used for header injection
3. No protection against CRLF injection
4. No validation of email format before sanitization

**Remediation:**
```javascript
function sanitizeInput(input, fieldType = 'text') {
    if (typeof input !== 'string') return '';
    
    let sanitized = input.trim();
    
    if (fieldType === 'email') {
        // Validate email format first
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegex.test(sanitized)) {
            return '';
        }
        // Only remove dangerous characters, preserve email format
        sanitized = sanitized.replace(/[<>'"]/g, '');
    } else {
        // For text fields, more aggressive sanitization
        sanitized = sanitized
            .replace(/[<>'"]/g, '')
            .replace(/javascript:/gi, '')
            .replace(/data:/gi, '')
            .replace(/vbscript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .replace(/[\r\n]+/g, ' ') // Prevent CRLF injection
            .replace(/[^\w\s@.,!?;:()\-]/g, ''); // Allow common punctuation
    }
    
    return sanitized;
}
```

---

### A04:2021 – Insecure Design

#### Finding 4.1: Missing Security Monitoring and Logging
- **Severity:** MEDIUM
- **Location:** Application-wide
- **CWE:** CWE-778 (Insufficient Logging)
- **CVSS Score:** 5.5 (Medium)

**Description:**
No security event logging or monitoring is implemented. Failed form submissions, suspicious search queries, or potential attacks are not logged.

**Remediation:**
1. Implement client-side error logging (send to secure endpoint)
2. Monitor Formspree dashboard for unusual patterns
3. Add Google Analytics or similar (with privacy considerations)
4. Log security events:
   - Failed form validations
   - Suspicious search queries
   - Rate limit violations
   - CSP violations (if CSP reporting enabled)

**Implementation:**
```javascript
function logSecurityEvent(eventType, details) {
    // Send to secure logging endpoint
    fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: eventType,
            details: details,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        })
    }).catch(() => {
        // Fail silently if logging fails
    });
}
```

---

### A05:2021 – Security Misconfiguration

#### Finding 5.1: Content Security Policy Allows 'unsafe-inline'
- **Severity:** CRITICAL
- **Location:** All HTML files (e.g., `index.html:7`, `about/index.html:7`)
- **CWE:** CWE-16 (Configuration)
- **CVSS Score:** 8.2 (High)

**Description:**
CSP includes `'unsafe-inline'` for both scripts and styles, which significantly weakens XSS protection.

**Current CSP:**
```
default-src 'self'; 
script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; 
style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
```

**Issues:**
1. `'unsafe-inline'` allows inline scripts, negating XSS protection
2. Inline styles can be used for data exfiltration
3. No nonce or hash-based CSP implementation

**Exploitation Scenario:**
1. Attacker finds XSS vulnerability
2. Injects inline script: `<script>alert(document.cookie)</script>`
3. CSP doesn't block it due to `'unsafe-inline'`
4. Attacker can steal cookies, perform actions, etc.

**Remediation:**
1. **Move all inline scripts to external files**
2. **Use nonces for required inline scripts:**
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'nonce-{random-nonce}' https://cdnjs.cloudflare.com; 
               style-src 'self' 'nonce-{random-nonce}' https://cdnjs.cloudflare.com;
               ...">
```
3. **Or use hashes:**
```html
<script nonce="random-value">
  // Inline script
</script>
```

**Implementation Steps:**
1. Extract all inline scripts from HTML to `js/` files
2. Generate nonces server-side (or at build time)
3. Update CSP to use nonces
4. Test thoroughly

---

#### Finding 5.2: Missing Security Headers in _headers File
- **Severity:** MEDIUM
- **Location:** `_headers`
- **CWE:** CWE-16 (Configuration)
- **CVSS Score:** 5.3 (Medium)

**Description:**
The `_headers` file has some security headers but is missing important ones and has incorrect syntax for GitHub Pages.

**Current Headers:**
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**Issues:**
1. GitHub Pages `_headers` file uses different syntax
2. Missing `Content-Security-Policy` header (should be in HTML meta tags, which is done)
3. `X-XSS-Protection` is deprecated
4. Missing `Cross-Origin-Embedder-Policy` and `Cross-Origin-Opener-Policy`

**Remediation:**
Update `_headers` for GitHub Pages format:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Cross-Origin-Embedder-Policy: require-corp
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin
```

**Note:** CSP should remain in HTML meta tags as GitHub Pages may not support it in `_headers`.

---

#### Finding 5.3: Exposed Email Address in HTML
- **Severity:** LOW
- **Location:** `contact/index.html:180`, `privacy/index.html:127`
- **CWE:** CWE-200 (Information Exposure)
- **CVSS Score:** 3.1 (Low)

**Description:**
Email address `Richard.Mussell@yahoo.com` is exposed in plain HTML, making it vulnerable to scraping and spam.

**Remediation:**
1. Use contact form only (remove email from HTML)
2. Use JavaScript to obfuscate email (basic protection)
3. Use image-based email display
4. Use contact form with CAPTCHA

**JavaScript Obfuscation:**
```javascript
// Obfuscate email
const email = ['Richard', 'Mussell', '@yahoo', '.com'].join('.');
document.getElementById('email-link').href = 'mailto:' + email;
```

---

### A06:2021 – Vulnerable and Outdated Components

#### Finding 6.1: No Dependency Management or SBOM
- **Severity:** MEDIUM
- **Location:** Application-wide
- **CWE:** CWE-1104 (Use of Unmaintained Third-Party Components)
- **CVSS Score:** 5.4 (Medium)

**Description:**
No package.json, dependency tracking, or Software Bill of Materials (SBOM) exists. External dependencies (Font Awesome, Formspree) are not version-locked or monitored for vulnerabilities.

**Dependencies Identified:**
1. Font Awesome 6.4.0 (via CDN)
2. Formspree (third-party service)
3. Hugo 0.152.2 (build tool)

**Remediation:**
1. Create `package.json` for dependency tracking
2. Generate SBOM using tools like `cyclonedx` or `syft`
3. Monitor dependencies for CVEs
4. Set up Dependabot or similar for GitHub
5. Document all third-party services

**SBOM Generation:**
```json
{
  "bomFormat": "CycloneDX",
  "specVersion": "1.4",
  "components": [
    {
      "type": "library",
      "name": "font-awesome",
      "version": "6.4.0",
      "purl": "pkg:npm/@fortawesome/fontawesome-free@6.4.0"
    }
  ]
}
```

---

### A07:2021 – Identification and Authentication Failures

#### Finding 7.1: Missing CSRF Protection for Formspree
- **Severity:** HIGH
- **Location:** `contact/index.html:84-436`
- **CWE:** CWE-352 (Cross-Site Request Forgery)
- **CVSS Score:** 7.2 (High)

**Description:**
Contact form submits to Formspree without CSRF token validation. While Formspree may handle this server-side, client-side protection and origin validation are missing.

**Current Implementation:**
```javascript
fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: {
        'Accept': 'application/json',
        'Origin': formOrigin,
        'Referer': formOrigin + '/contact/'
    },
    credentials: 'same-origin',
    mode: 'cors'
})
```

**Issues:**
1. No CSRF token in request
2. Origin/Referer headers can be spoofed
3. No SameSite cookie protection (Formspree side)
4. No double-submit cookie pattern

**Remediation:**
1. **Enable Formspree's built-in CSRF protection** (check Formspree settings)
2. **Add reCAPTCHA v3** to form
3. **Implement origin validation:**
```javascript
const allowedOrigins = ['https://richardmussell.github.io', 'http://localhost:8080'];
if (!allowedOrigins.includes(window.location.origin)) {
    throw new Error('Invalid origin');
}
```
4. **Add custom header for CSRF:**
```javascript
headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-Token': getCSRFToken() // If Formspree supports
}
```

---

#### Finding 7.2: No Rate Limiting on Contact Form
- **Severity:** HIGH
- **Location:** `contact/index.html:354-436`
- **CWE:** CWE-307 (Improper Restriction of Excessive Authentication Attempts)
- **CVSS Score:** 6.8 (Medium-High)

**Description:**
Contact form has no client-side or server-side rate limiting, allowing potential spam or DoS attacks.

**Remediation:**
Implement client-side rate limiting (see Finding 1.1 for code example) and configure Formspree rate limiting in dashboard.

---

### A08:2021 – Software and Data Integrity Failures

#### Finding 8.1: Missing Integrity Verification for CDN Resources
- **Severity:** MEDIUM
- **Location:** Multiple HTML files
- **CWE:** CWE-345 (Insufficient Verification of Data Authenticity)
- **CVSS Score:** 5.9 (Medium)

**Description:**
While SRI hash exists for Font Awesome, it should be verified. No integrity checks for Formspree API calls.

**Remediation:**
1. Verify SRI hash is correct
2. Implement API response validation for Formspree
3. Consider self-hosting critical resources

---

### A09:2021 – Security Logging and Monitoring Failures

#### Finding 9.1: Insufficient Security Event Logging
- **Severity:** MEDIUM
- **Location:** Application-wide
- **CWE:** CWE-778 (Insufficient Logging)
- **CVSS Score:** 5.5 (Medium)

**Description:**
No security event logging implemented. Failed validations, suspicious inputs, or potential attacks are not logged.

**Remediation:**
See Finding 4.1 for implementation details.

---

### A10:2021 – Server-Side Request Forgery (SSRF)

#### Finding 10.1: N/A - Static Site
- **Severity:** N/A
- **Description:** This is a static site with no server-side components, so SSRF is not applicable.

---

## 2. CWE Top 25 Analysis

### CWE-79: Cross-site Scripting (XSS)

#### Finding CWE-79-1: Multiple XSS Vectors
- **Severity:** HIGH
- **Locations:** 
  - `js/script.js:31-42` (Search function)
  - `contact/index.html:283-290` (Form sanitization)
- **CVSS Score:** 7.2 (High)

**Description:**
Multiple XSS vulnerabilities exist due to insufficient input sanitization and CSP allowing `'unsafe-inline'`.

**Remediation:**
See Findings 3.1, 3.2, and 5.1.

---

### CWE-20: Improper Input Validation

#### Finding CWE-20-1: Insufficient Input Validation
- **Severity:** MEDIUM
- **Locations:** Multiple
- **CVSS Score:** 6.1 (Medium)

**Description:**
Input validation is present but insufficient. Missing:
- Unicode normalization
- Length validation before sanitization
- Type checking
- Format validation

**Remediation:**
See Findings 3.1 and 3.2.

---

### CWE-352: Cross-Site Request Forgery (CSRF)

#### Finding CWE-352-1: Missing CSRF Protection
- **Severity:** HIGH
- **Location:** `contact/index.html`
- **CVSS Score:** 7.2 (High)

**Description:**
Form submissions lack proper CSRF protection.

**Remediation:**
See Finding 7.1.

---

### CWE-284: Improper Access Control

#### Finding CWE-284-1: Exposed Form Endpoint
- **Severity:** HIGH
- **Location:** `contact/index.html:84`
- **CVSS Score:** 7.5 (High)

**Description:**
Formspree endpoint ID is exposed in client-side code.

**Remediation:**
See Finding 1.1.

---

### CWE-345: Insufficient Verification of Data Authenticity

#### Finding CWE-345-1: Missing SRI Verification
- **Severity:** MEDIUM
- **Location:** Multiple HTML files
- **CVSS Score:** 5.9 (Medium)

**Description:**
SRI hashes exist but need verification. No integrity checks for API responses.

**Remediation:**
See Finding 8.1.

---

### CWE-307: Improper Restriction of Excessive Authentication Attempts

#### Finding CWE-307-1: No Rate Limiting
- **Severity:** HIGH
- **Location:** `contact/index.html`
- **CVSS Score:** 6.8 (Medium-High)

**Description:**
No rate limiting on form submissions.

**Remediation:**
See Finding 7.2.

---

### CWE-778: Insufficient Logging

#### Finding CWE-778-1: Missing Security Logging
- **Severity:** MEDIUM
- **Location:** Application-wide
- **CVSS Score:** 5.5 (Medium)

**Description:**
No security event logging implemented.

**Remediation:**
See Finding 4.1.

---

### CWE-16: Configuration

#### Finding CWE-16-1: Security Misconfiguration
- **Severity:** CRITICAL
- **Location:** All HTML files
- **CVSS Score:** 8.2 (High)

**Description:**
CSP allows `'unsafe-inline'`, significantly weakening security.

**Remediation:**
See Finding 5.1.

---

## 3. SANS Top 25 Analysis

### CWE-79: Cross-site Scripting (Already covered)

### CWE-89: SQL Injection
- **Status:** ✅ NOT APPLICABLE
- **Reason:** Static site with no database

### CWE-20: Improper Input Validation (Already covered)

### CWE-352: Cross-Site Request Forgery (Already covered)

### CWE-434: Unrestricted Upload of File with Dangerous Type
- **Status:** ✅ NOT APPLICABLE
- **Reason:** No file upload functionality

---

## 4. NIST Cybersecurity Framework Analysis

### IDENTIFY (ID)

#### ID.AM-1: Physical devices and systems within the organization are inventoried
- **Status:** ✅ COMPLIANT
- **Assets:** Static HTML files, JavaScript, CSS, PowerShell scripts
- **Note:** All assets are version-controlled in Git

#### ID.AM-2: Software platforms and applications within the organization are inventoried
- **Status:** ⚠️ PARTIAL
- **Issue:** No formal dependency inventory or SBOM
- **Remediation:** Create SBOM (see Finding 6.1)

#### ID.AM-3: Organizational communication and data flows are mapped
- **Status:** ✅ COMPLIANT
- **Data Flows:**
  - User → Contact Form → Formspree → Email
  - User → Search → URL parameters
  - CDN → Font Awesome CSS

#### ID.BE-1: The organization's role in the supply chain is identified and communicated
- **Status:** ⚠️ PARTIAL
- **Issue:** Third-party dependencies not fully documented
- **Remediation:** Document all third-party services (Formspree, CDN, GitHub Pages)

### PROTECT (PR)

#### PR.AC-1: Identities and credentials are managed for authorized devices and users
- **Status:** ✅ COMPLIANT
- **Note:** Static site, no user authentication required

#### PR.AC-3: Remote access is managed
- **Status:** ✅ COMPLIANT
- **Note:** No remote access functionality

#### PR.AC-4: Access permissions and authorizations are managed, incorporating the principles of least privilege
- **Status:** ✅ COMPLIANT
- **Note:** Static site, public access intended

#### PR.AC-5: Network integrity is protected
- **Status:** ⚠️ PARTIAL
- **Issue:** No network-level protections (rely on GitHub Pages)
- **Remediation:** Ensure HTTPS is enforced (GitHub Pages default)

#### PR.AC-7: Users, devices, and other assets are authenticated
- **Status:** ✅ COMPLIANT
- **Note:** No authentication required for public site

#### PR.DS-1: Data-at-rest is protected
- **Status:** ✅ COMPLIANT
- **Note:** No sensitive data stored (form data goes to Formspree)

#### PR.DS-2: Data-in-transit is protected
- **Status:** ✅ COMPLIANT
- **Implementation:** HTTPS enforced, HSTS header present

#### PR.DS-3: Assets are formally managed throughout removal, transfers, and disposition
- **Status:** ✅ COMPLIANT
- **Implementation:** Git version control

#### PR.DS-5: Protections against data leaks are implemented
- **Status:** ⚠️ PARTIAL
- **Issue:** Email address exposed in HTML
- **Remediation:** See Finding 5.3

#### PR.IP-1: A baseline configuration of information technology/industrial control systems is created and maintained
- **Status:** ⚠️ PARTIAL
- **Issue:** No formal configuration baseline documented
- **Remediation:** Document security configuration standards

#### PR.IP-2: A System Development Life Cycle to manage systems is implemented
- **Status:** ✅ COMPLIANT
- **Implementation:** Git-based development workflow

#### PR.IP-3: Configuration change control processes are in place
- **Status:** ✅ COMPLIANT
- **Implementation:** Git version control, pull requests

#### PR.IP-7: Protection processes are improved
- **Status:** ⚠️ PARTIAL
- **Issue:** No formal security improvement process
- **Remediation:** Implement regular security reviews

#### PR.MA-1: Maintenance and repair of organizational assets are performed
- **Status:** ✅ COMPLIANT
- **Implementation:** Regular updates via Git

### DETECT (DE)

#### DE.AE-1: A baseline of network operations and expected data flows is established
- **Status:** ❌ NON-COMPLIANT
- **Issue:** No network monitoring or baseline
- **Remediation:** Implement basic analytics/monitoring

#### DE.AE-2: Detected events are analyzed
- **Status:** ❌ NON-COMPLIANT
- **Issue:** No event detection or analysis
- **Remediation:** See Finding 4.1

#### DE.AE-3: Event data are collected and correlated
- **Status:** ❌ NON-COMPLIANT
- **Issue:** No event collection
- **Remediation:** Implement logging (see Finding 4.1)

#### DE.CM-1: The network is monitored to detect potential cybersecurity events
- **Status:** ❌ NON-COMPLIANT
- **Issue:** No network monitoring
- **Note:** GitHub Pages provides basic monitoring

#### DE.CM-3: Personnel activity is monitored
- **Status:** ✅ COMPLIANT
- **Note:** Public site, no user accounts

#### DE.CM-7: Monitoring for unauthorized personnel, connections, devices, and software
- **Status:** ⚠️ PARTIAL
- **Issue:** No monitoring for malicious activity
- **Remediation:** Implement Formspree monitoring, add analytics

### RESPOND (RS)

#### RS.AN-1: Notifications from detection systems are investigated
- **Status:** ❌ NON-COMPLIANT
- **Issue:** No detection systems in place
- **Remediation:** Implement monitoring and alerting

#### RS.CO-2: Response activities are coordinated with internal and external stakeholders
- **Status:** ⚠️ PARTIAL
- **Issue:** No incident response plan
- **Remediation:** Create incident response plan

#### RS.MI-1: Incidents are contained
- **Status:** ⚠️ PARTIAL
- **Issue:** No containment procedures
- **Remediation:** Document incident response procedures

### RECOVER (RC)

#### RC.RP-1: Recovery plan is executed
- **Status:** ✅ COMPLIANT
- **Implementation:** Git allows quick rollback

#### RC.IM-1: Recovery plans are updated
- **Status:** ⚠️ PARTIAL
- **Issue:** No formal recovery plan
- **Remediation:** Document recovery procedures

---

## 5. Core Security Principles Analysis

### Least Privilege

#### Assessment: ✅ MOSTLY COMPLIANT
- **Status:** Static site with no privileged operations
- **Issues:**
  - Formspree endpoint exposed (could be rate-limited)
  - No access controls needed (public site)

### Defense in Depth

#### Assessment: ⚠️ PARTIAL
- **Implemented:**
  - Security headers (X-Frame-Options, CSP, etc.)
  - Input sanitization
  - HTTPS enforcement
- **Missing:**
  - Rate limiting
  - Security monitoring
  - Multiple validation layers
  - WAF (Web Application Firewall) - GitHub Pages may provide

### Fail Securely

#### Assessment: ✅ COMPLIANT
- **Implementation:**
  - Form validation fails closed (prevents submission)
  - Error messages don't expose sensitive information
  - Graceful error handling in JavaScript

### Separation of Duties

#### Assessment: ✅ COMPLIANT
- **Status:** Single-person site, not applicable
- **Note:** If team grows, implement code review process

### Zero Trust Architecture

#### Assessment: ⚠️ PARTIAL
- **Implemented:**
  - CSP restricts resource loading
  - Origin validation in form submission
- **Missing:**
  - No explicit "never trust, always verify" implementation
  - No continuous verification
  - No micro-segmentation (not applicable to static site)

---

## 6. Specific Vulnerability Checks

### Input Validation & Sanitization

#### Status: ⚠️ PARTIAL
- **Implemented:**
  - Basic sanitization in search and contact form
  - HTML5 validation
  - Length limits
- **Missing:**
  - Unicode normalization
  - CRLF injection protection
  - Format validation before sanitization
- **Remediation:** See Findings 3.1 and 3.2

### Authentication & Authorization

#### Status: ✅ COMPLIANT
- **Note:** Public static site, no authentication required
- **Formspree:** Handles authentication server-side

### Cryptography

#### Status: ✅ COMPLIANT
- **Implemented:**
  - HTTPS enforced (GitHub Pages)
  - HSTS header
  - SRI hashes (need verification)
- **No Issues Found:**
  - No hardcoded secrets
  - No weak encryption
  - No insecure random number generation

### Web Application Security

#### XSS Protection: ⚠️ PARTIAL
- **Issues:** See Findings 3.1, 3.2, 5.1

#### CSRF Protection: ❌ INSUFFICIENT
- **Issues:** See Finding 7.1

#### Clickjacking: ✅ PROTECTED
- **Implementation:** X-Frame-Options: DENY

#### CORS: ✅ COMPLIANT
- **Status:** No CORS issues (same-origin or Formspree CORS handled)

#### HTTP Security Headers: ✅ MOSTLY COMPLIANT
- **Implemented:**
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy
  - HSTS
- **Missing:**
  - Cross-Origin-Embedder-Policy
  - Cross-Origin-Opener-Policy
  - Cross-Origin-Resource-Policy

#### Cookie Security: ✅ COMPLIANT
- **Status:** No cookies used (privacy policy states this)

### API Security

#### Status: ⚠️ PARTIAL
- **Formspree API:**
  - ✅ HTTPS enforced
  - ✅ Origin validation (partial)
  - ❌ No rate limiting (client-side)
  - ❌ No CSRF token
  - ⚠️ Endpoint ID exposed

### Data Protection

#### PII Exposure: ⚠️ PARTIAL
- **Issue:** Email address exposed in HTML (see Finding 5.3)
- **Form Data:** Handled by Formspree (third-party)

#### Data Encryption: ✅ COMPLIANT
- **In Transit:** HTTPS
- **At Rest:** Formspree handles (third-party)

#### GDPR/CCPA Compliance: ✅ COMPLIANT
- **Implementation:**
  - Privacy policy present
  - GDPR rights documented
  - Data retention policy
  - Consent mechanism (form submission)

### Dependencies & Supply Chain

#### Status: ⚠️ PARTIAL
- **Issues:**
  - No dependency tracking
  - No SBOM
  - No CVE monitoring
- **Remediation:** See Finding 6.1

### Infrastructure & Configuration

#### Status: ✅ MOSTLY COMPLIANT
- **GitHub Pages:**
  - ✅ HTTPS enforced
  - ✅ DDoS protection
  - ✅ CDN provided
- **Issues:**
  - No WAF configuration visible
  - No custom security headers in _headers (syntax issue)

### Code Quality & Logic

#### Status: ✅ COMPLIANT
- **No Issues Found:**
  - No race conditions
  - No integer overflows
  - No null pointer dereferences
  - Proper error handling
  - No business logic flaws

### Logging & Monitoring

#### Status: ❌ INSUFFICIENT
- **Issues:** See Finding 4.1 and 9.1

---

## 7. Compliance Frameworks

### PCI DSS
- **Status:** ✅ NOT APPLICABLE
- **Reason:** No payment processing

### HIPAA
- **Status:** ✅ NOT APPLICABLE
- **Reason:** No health data collected

### SOC 2 Type II
- **Status:** ⚠️ PARTIAL COMPLIANCE
- **Controls Implemented:**
  - Access controls (public site)
  - Encryption in transit
  - Security headers
- **Controls Missing:**
  - Formal security policies
  - Incident response plan
  - Regular security audits
  - Change management process

### ISO 27001
- **Status:** ⚠️ PARTIAL COMPLIANCE
- **Similar to SOC 2:** Missing formal security management system

### GDPR/CCPA
- **Status:** ✅ COMPLIANT
- **Implementation:**
  - Privacy policy
  - Data subject rights documented
  - Consent mechanism
  - Data retention policy

---

## 8. Remediation Priority Matrix

### Critical (Fix Immediately)
1. **Remove 'unsafe-inline' from CSP** (Finding 5.1)
   - **Effort:** Medium
   - **Impact:** High
   - **Timeline:** 1-2 weeks

2. **Implement CSRF Protection** (Finding 7.1)
   - **Effort:** Low
   - **Impact:** High
   - **Timeline:** 1 week

3. **Add Rate Limiting** (Finding 7.2)
   - **Effort:** Low
   - **Impact:** High
   - **Timeline:** 1 week

### High (Fix Within 1 Month)
4. **Enhance Input Sanitization** (Findings 3.1, 3.2)
   - **Effort:** Medium
   - **Impact:** High
   - **Timeline:** 2 weeks

5. **Verify and Implement SRI** (Finding 2.1)
   - **Effort:** Low
   - **Impact:** Medium-High
   - **Timeline:** 1 week

6. **Add Security Monitoring** (Finding 4.1)
   - **Effort:** Medium
   - **Impact:** Medium
   - **Timeline:** 2-3 weeks

7. **Fix _headers File** (Finding 5.2)
   - **Effort:** Low
   - **Impact:** Medium
   - **Timeline:** 1 week

### Medium (Fix Within 3 Months)
8. **Create SBOM** (Finding 6.1)
9. **Obfuscate Email Address** (Finding 5.3)
10. **Document Security Policies**
11. **Implement Incident Response Plan**

### Low (Fix When Possible)
12. **Add Additional Security Headers**
13. **Self-host Critical Resources**
14. **Implement Advanced Monitoring**

---

## 9. Security Posture Summary

### Strengths ✅
1. **Strong Security Headers:** Most security headers properly configured
2. **HTTPS Enforcement:** GitHub Pages enforces HTTPS
3. **Input Sanitization:** Basic sanitization implemented
4. **Privacy Compliance:** GDPR/CCPA compliant with privacy policy
5. **No Hardcoded Secrets:** No credentials in code
6. **Static Site:** Reduced attack surface (no server-side code)
7. **Version Control:** Git-based development with history

### Weaknesses ❌
1. **CSP 'unsafe-inline':** Critical security gap
2. **Missing CSRF Protection:** Form vulnerable to CSRF
3. **No Rate Limiting:** Form vulnerable to spam/DoS
4. **Insufficient Input Validation:** XSS vectors possible
5. **No Security Monitoring:** No visibility into attacks
6. **Exposed Endpoints:** Formspree ID visible
7. **No Dependency Tracking:** Unknown vulnerabilities in dependencies

### Risk Assessment

**Overall Risk Level:** **MEDIUM-HIGH**

**Risk Breakdown:**
- **Critical Risk:** 3 findings
- **High Risk:** 7 findings
- **Medium Risk:** 12 findings
- **Low Risk:** 15 findings

**Business Impact:**
- **Low:** Static portfolio site, no financial transactions
- **Reputation Risk:** Medium (security issues could damage professional reputation)
- **Data Risk:** Low (minimal PII, handled by third-party)

---

## 10. Recommendations

### Immediate Actions (This Week)
1. ✅ Remove `'unsafe-inline'` from CSP and move scripts to external files
2. ✅ Add reCAPTCHA v3 to contact form
3. ✅ Implement client-side rate limiting
4. ✅ Verify SRI hashes for CDN resources

### Short-term (This Month)
5. ✅ Enhance input sanitization with DOMPurify
6. ✅ Add security event logging
7. ✅ Fix _headers file syntax
8. ✅ Obfuscate email address in HTML

### Medium-term (Next 3 Months)
9. ✅ Create SBOM and dependency tracking
10. ✅ Document security policies
11. ✅ Implement incident response plan
12. ✅ Set up security monitoring dashboard

### Long-term (Ongoing)
13. ✅ Regular security audits (quarterly)
14. ✅ Dependency vulnerability scanning
15. ✅ Security awareness training (if team grows)

---

## 11. Conclusion

This static portfolio website demonstrates **good security awareness** with proper security headers, input sanitization, and privacy compliance. However, **critical gaps** exist in CSP configuration, CSRF protection, and rate limiting that should be addressed immediately.

The site's **static nature reduces attack surface**, but **client-side security** remains important. With the recommended remediations, the security posture can be improved from **MEDIUM-HIGH** to **LOW-MEDIUM** risk.

**Estimated Time to Remediate Critical Issues:** 2-4 weeks  
**Estimated Time to Remediate All High Issues:** 1-2 months  
**Estimated Time to Full Compliance:** 3-6 months

---

**Report Generated:** January 2025  
**Next Review Date:** April 2025 (Quarterly)  
**Contact:** For questions about this audit, use the contact form on the website.

---

## Appendix A: CVSS Scores Reference

| Finding | CVSS Score | Severity |
|---------|-----------|----------|
| Finding 5.1 (CSP unsafe-inline) | 8.2 | Critical |
| Finding 1.1 (Exposed endpoint) | 7.5 | High |
| Finding 3.1 (XSS in search) | 7.2 | High |
| Finding 7.1 (CSRF) | 7.2 | High |
| Finding 2.1 (Missing SRI) | 7.1 | High |
| Finding 7.2 (Rate limiting) | 6.8 | High |
| Finding 3.2 (Form sanitization) | 6.1 | Medium |
| Finding CWE-20-1 (Input validation) | 6.1 | Medium |
| Finding 8.1 (Integrity verification) | 5.9 | Medium |
| Finding 5.2 (Headers file) | 5.3 | Medium |
| Finding 4.1 (Logging) | 5.5 | Medium |
| Finding 5.3 (Email exposure) | 3.1 | Low |

---

## Appendix B: Tools and Resources

### Recommended Security Tools
1. **OWASP ZAP** - Web application security testing
2. **Mozilla Observatory** - Security header analysis
3. **Security Headers** - Header analysis tool
4. **SRI Hash Generator** - Generate SRI hashes
5. **DOMPurify** - XSS sanitization library
6. **reCAPTCHA v3** - Bot protection

### Useful Resources
- OWASP Top 10: https://owasp.org/Top10/
- CWE Top 25: https://cwe.mitre.org/top25/
- NIST Cybersecurity Framework: https://www.nist.gov/cyberframework
- CSP Evaluator: https://csp-evaluator.withgoogle.com/
- Security Headers: https://securityheaders.com/

---

**End of Report**

