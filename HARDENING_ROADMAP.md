# 🛡️ Security Hardening Roadmap
**Implementation Guide with Specific Code Changes**

---

## Phase 1: Critical Fixes (24 Hours)

### 1.1 Strip Image EXIF Metadata

**Command:**
```bash
# Install ExifTool first
# Windows: choco install exiftool
# macOS: brew install exiftool
# Linux: sudo apt-get install libimage-exiftool-perl

# Strip all metadata
exiftool -all= -overwrite_original static/profile.jpg static/thumbnail.jpg

# Verify removal
exiftool static/*.jpg
```

**Expected Output:** No EXIF data should remain.

---

### 1.2 Complete GitHub Actions Pinning

**File:** `.github/workflows/hugo.yaml`

**Current State:** Partially pinned (checkout action pinned, others need commit SHAs)

**How to Get Commit SHAs:**

1. **For `actions/configure-pages@v5`:**
   ```bash
   # Visit: https://github.com/actions/configure-pages/releases/tag/v5
   # Or use API:
   curl https://api.github.com/repos/actions/configure-pages/commits?sha=v5 | jq '.[0].sha'
   ```
   Then update:
   ```yaml
   - name: Setup Pages
     id: pages
     uses: actions/configure-pages@<COMMIT_SHA_HERE>
   ```

2. **For `actions/upload-pages-artifact@v3`:**
   ```bash
   curl https://api.github.com/repos/actions/upload-pages-artifact/commits?sha=v3 | jq '.[0].sha'
   ```
   Then update:
   ```yaml
   - name: Upload artifact
     uses: actions/upload-pages-artifact@<COMMIT_SHA_HERE>
     with:
       path: ./public
   ```

3. **For `actions/deploy-pages@v4`:**
   ```bash
   curl https://api.github.com/repos/actions/deploy-pages/commits?sha=v4 | jq '.[0].sha'
   ```
   Then update:
   ```yaml
   - name: Deploy to GitHub Pages
     id: deployment
     uses: actions/deploy-pages@<COMMIT_SHA_HERE>
   ```

4. **For `peaceiris/actions-hugo@v2.7.0`:**
   ```bash
   curl https://api.github.com/repos/peaceiris/actions-hugo/commits?sha=v2.7.0 | jq '.[0].sha'
   ```
   Then update:
   ```yaml
   - name: Install Hugo
     uses: peaceiris/actions-hugo@<COMMIT_SHA_HERE>
     with:
       hugo-version: ${{ env.HUGO_VERSION }}
       extended: true
   ```

**Final Secure Workflow Example:**
```yaml
steps:
  - name: Checkout
    uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1

  - name: Setup Pages
    id: pages
    uses: actions/configure-pages@<SHA_FOR_V5>

  - name: Install Hugo
    uses: peaceiris/actions-hugo@<SHA_FOR_V2.7.0>
    with:
      hugo-version: ${{ env.HUGO_VERSION }}
      extended: true

  - name: Build with Hugo
    run: |
      hugo \
        --gc \
        --minify \
        --baseURL "${{ steps.pages.outputs.base_url }}/"

  - name: Upload artifact
    uses: actions/upload-pages-artifact@<SHA_FOR_V3>
    with:
      path: ./public

  # ... deploy step with pinned SHA
```

---

## Phase 2: High-Priority Fixes (1 Week)

### 2.1 Create Privacy Policy Page

**File:** `content/privacy.md` (create new)

**Content:**
```markdown
---
title: "Privacy Policy"
date: 2025-01-06
---

## Privacy Policy

Last updated: January 6, 2025

### Data Collection

This website collects the following data:
- Contact form submissions (name, email, message)
- Basic analytics (if applicable)

### Third-Party Services

This website uses the following third-party services:

1. **Formspree** - Contact form processing
   - Privacy Policy: https://formspree.io/legal/privacy-policy
   - Data: Form submissions are processed by Formspree

2. **Google Fonts** - Web font delivery
   - Privacy Policy: https://policies.google.com/privacy
   - Note: Google may collect IP addresses and user agent information
   - **Action:** We are migrating to self-hosted fonts to eliminate this tracking

3. **Cloudflare CDN** - Content delivery (via cdnjs.cloudflare.com)
   - Privacy Policy: https://www.cloudflare.com/privacypolicy/

### Your Rights (GDPR)

If you are located in the European Economic Area (EEA), you have the right to:
- Access your personal data
- Rectify inaccurate data
- Request deletion of your data
- Object to processing
- Data portability

To exercise these rights, contact: [your-email@example.com]

### Data Retention

Contact form submissions are retained for 90 days unless you request deletion.

### Cookies

This website does not use cookies for tracking. Local storage is used only for theme preferences (dark/light mode).

### Changes to This Policy

We may update this privacy policy from time to time. Changes will be posted on this page.

### Contact

For privacy-related inquiries, contact: [your-email@example.com]
```

**Then add to menu in `hugo.toml`:**
```toml
[[menu.main]]
  identifier = "privacy"
  name = "Privacy"
  url = "/privacy/"
  weight = 5
```

---

### 2.2 Migrate Google Fonts to Self-Hosted

**Step 1: Download Fonts**

Visit: https://gwfh.mranftl.com/fonts

Select fonts:
- Inter (Variable, weights 100-900)
- Public Sans (Variable, weights 100-900)
- Crimson Pro (400, 600)
- Lora (400, 600)
- JetBrains Mono (400, 500, 600, 700)

Download as "Modern Browsers" (WOFF2 format).

**Step 2: Create Font Directory**

```bash
mkdir -p static/fonts
# Copy downloaded font files to static/fonts/
```

**Step 3: Update CSS**

**File:** `themes/mussell-portfolio/assets/css/main.css`

**Replace lines 57-59:**
```css
/* OLD - Remove these lines */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Public+Sans:wght@100..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&family=Lora:wght@400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
```

**With:**
```css
/* Self-Hosted Fonts - Privacy-First */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-variable.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Public Sans';
  src: url('/fonts/public-sans-variable.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Crimson Pro';
  src: url('/fonts/crimson-pro-400.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Crimson Pro';
  src: url('/fonts/crimson-pro-600.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Lora';
  src: url('/fonts/lora-400.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Lora';
  src: url('/fonts/lora-600.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/jetbrains-mono-400.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/jetbrains-mono-500.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/jetbrains-mono-600.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/jetbrains-mono-700.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

**Also replace line 6035:**
```css
/* OLD */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

/* NEW - Remove this line entirely (fonts already loaded above) */
```

**Step 4: Update CSP Policy**

**File:** `themes/mussell-portfolio/layouts/_partials/head.html`

**Update CSP to remove Google Fonts:**
```html
<!-- BEFORE -->
<meta http-equiv="Content-Security-Policy" content="... style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; ...">

<!-- AFTER -->
<meta http-equiv="Content-Security-Policy" content="... style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; font-src 'self'; ...">
```

**Remove:**
- `https://fonts.googleapis.com` from `style-src`
- `https://fonts.gstatic.com` from `font-src`

---

### 2.3 Alternative: Quick Fix with Bunny Fonts

If self-hosting is not feasible immediately, use Bunny Fonts:

**File:** `themes/mussell-portfolio/assets/css/main.css`

**Replace Google Fonts imports with:**
```css
/* Privacy-First Font CDN (GDPR Compliant) */
@import url('https://fonts.bunny.net/css?family=inter:100;200;300;400;500;600;700;800;900|public-sans:100;200;300;400;500;600;700;800;900|crimson-pro:400;600|lora:400;600|jetbrains-mono:400;500;600;700&display=swap');
```

**Update CSP:**
```html
<meta http-equiv="Content-Security-Policy" content="... style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.bunny.net; font-src 'self' https://fonts.bunny.net; ...">
```

---

## Phase 3: CSP Refinement (1 Month)

### 3.1 Remove Unsafe-Inline Scripts

**Current Issue:** Inline script in `head.html` (lines 13-37)

**Solution:** Move to external file

**Step 1: Create External Script**

**File:** `themes/mussell-portfolio/assets/js/theme-init.js` (create new)

**Content:**
```javascript
// Theme initialization - moved from inline script
(function() {
  'use strict';
  
  const DARK_MODE_KEY = 'theme';
  const DARK_THEME = 'dark';
  const LIGHT_THEME = 'light';

  function getThemePreference() {
    try {
      const savedTheme = localStorage.getItem(DARK_MODE_KEY);
      if (savedTheme === DARK_THEME || savedTheme === LIGHT_THEME) {
        return savedTheme;
      }
    } catch (e) {
      console.warn('localStorage not available:', e);
    }
    return DARK_THEME;
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === DARK_THEME) {
      root.classList.add('dark-mode');
      root.setAttribute('data-theme', DARK_THEME);
    } else {
      root.classList.remove('dark-mode');
      root.setAttribute('data-theme', LIGHT_THEME);
    }
    try {
      localStorage.setItem(DARK_MODE_KEY, theme);
    } catch (e) {
      console.warn('Could not save theme preference:', e);
    }
  }

  // Initialize theme on load
  const theme = getThemePreference();
  applyTheme(theme);
})();
```

**Step 2: Update head.html**

**File:** `themes/mussell-portfolio/layouts/_partials/head.html`

**Remove inline script (lines 13-37) and replace with:**
```html
{{- with resources.Get "js/theme-init.js" }}
  {{- $opts := dict
    "minify" (not hugo.IsDevelopment)
    "targetPath" "js/theme-init.js"
  }}
  {{- with . | js.Build $opts }}
    {{- if hugo.IsDevelopment }}
      <script src="{{ .RelPermalink }}"></script>
    {{- else }}
      {{- with . | fingerprint }}
        <script src="{{ .RelPermalink }}" integrity="{{ .Data.Integrity }}" crossorigin="anonymous"></script>
      {{- end }}
    {{- end }}
  {{- end }}
{{- end }}
```

**Step 3: Update CSP**

**Remove `'unsafe-inline'` from `script-src`:**
```html
<meta http-equiv="Content-Security-Policy" content="... script-src 'self' 'unsafe-eval' https://cdnjs.cloudflare.com; ...">
```

**Note:** `'unsafe-eval'` may still be needed if any dependencies use `eval()`. Test and remove if possible.

---

### 3.2 Add CSP Violation Reporting

**File:** `themes/mussell-portfolio/layouts/_partials/head.html`

**Add to CSP meta tag:**
```html
<meta http-equiv="Content-Security-Policy" content="... report-uri /api/csp-report; report-to csp-endpoint;">
```

**Or use report-to directive (requires Reporting API support):**
```html
<meta http-equiv="Content-Security-Policy" content="... report-to csp-endpoint;">

<!-- Add reporting endpoint -->
<script>
  if ('ReportingObserver' in window) {
    const observer = new ReportingObserver((reports) => {
      reports.forEach((report) => {
        if (report.type === 'csp-violation') {
          // Log to your analytics or send to endpoint
          console.warn('CSP Violation:', report.body);
        }
      });
    }, { types: ['csp-violation'] });
    observer.observe();
  }
</script>
```

---

## Verification Checklist

After implementing each phase, verify:

- [ ] **Phase 1:**
  - [ ] Images have no EXIF data (`exiftool static/*.jpg` returns empty)
  - [ ] All GitHub Actions use commit SHAs (not version tags)
  - [ ] Workflow runs successfully

- [ ] **Phase 2:**
  - [ ] Privacy policy page exists and is accessible
  - [ ] Google Fonts removed from network tab (no requests to fonts.googleapis.com)
  - [ ] Fonts load correctly from self-hosted or Bunny Fonts
  - [ ] CSP updated to reflect new font sources

- [ ] **Phase 3:**
  - [ ] No inline scripts in HTML (check source)
  - [ ] CSP allows only necessary sources
  - [ ] No CSP violations in browser console
  - [ ] Site functionality unchanged

---

## Testing Commands

```bash
# Check image metadata
exiftool static/*.jpg static/*.png

# Verify no Google Fonts requests
# Open browser DevTools → Network tab → Filter: "fonts.googleapis"
# Should show zero requests

# Test CSP
# Open browser DevTools → Console
# Should show no CSP violations

# Verify GitHub Actions
# Check workflow file for commit SHAs (40-character hashes)
grep -E "@[a-f0-9]{40}" .github/workflows/hugo.yaml
```

---

**Last Updated:** 2025-01-06  
**Next Review:** After Phase 2 completion

