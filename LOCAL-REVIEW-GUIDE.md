# Local Review Guide - Before Pushing

## Quick Start

1. **Start the local server:**
   ```powershell
   .\serve-hugo.ps1
   ```

2. **Open your browser:**
   Navigate to: **http://localhost:1313/**

3. **Press `Ctrl+C`** in PowerShell to stop the server when done

---

## Pre-Push Checklist

### ✅ Homepage (`/`)
- [ ] Page loads correctly
- [ ] All blog posts display
- [ ] Sidebar shows all 10 categories with correct counts
- [ ] Tags sidebar displays correctly
- [ ] Navigation menu works (Home, Blog, About, Contact)
- [ ] Social icons (LinkedIn, GitHub, RSS) are visible and clickable
- [ ] Footer shows correct copyright: "© 2018-2025 Richard Mussell III. All Rights Reserved."
- [ ] No broken images or missing assets

### ✅ Blog Posts
Check each post:
- [ ] `/posts/aws-api-gateway-beginner-to-expert/`
- [ ] `/posts/azure-function-app/`
- [ ] `/posts/ansible-handlers-explained/`
- [ ] `/posts/securing-sensitive-data-terraform/`
- [ ] `/posts/boost-aws-security-terraform/`
- [ ] `/posts/load-input-data-terraform/`

For each post verify:
- [ ] Post content displays correctly
- [ ] Category link at bottom works and shows correct category
- [ ] Tags are displayed (if any)
- [ ] Sidebar categories match homepage
- [ ] "Read More" or navigation links work

### ✅ Category Pages
Check all 10 categories:
- [ ] `/categories/cloud-aws/` - Should show AWS API Gateway post
- [ ] `/categories/cloud-azure/` - Should show Azure Function App post
- [ ] `/categories/infrastructure-as-code/` - Should show 2 Terraform posts
- [ ] `/categories/automation-configuration-management/` - Should show Ansible post
- [ ] `/categories/security-identity/` - Should show Boost AWS Security post
- [ ] `/categories/cicd-pipelines/` - Empty (0 posts) - OK
- [ ] `/categories/containers-kubernetes/` - Empty (0 posts) - OK
- [ ] `/categories/monitoring-logging/` - Empty (0 posts) - OK
- [ ] `/categories/networking/` - Empty (0 posts) - OK
- [ ] `/categories/systems-administration/` - Empty (0 posts) - OK

### ✅ Categories Index
- [ ] `/categories/` - Lists all 10 categories with proper names

### ✅ About Page
- [ ] `/about/` - Content displays correctly
- [ ] All sections visible (Professional Background, Core Skills, Mission, etc.)
- [ ] Contact page link works
- [ ] No formatting issues

### ✅ Contact Page
- [ ] `/contact/` - Form displays correctly
- [ ] Contact information cards show properly
- [ ] All links work

### ✅ Design & Styling
- [ ] Enterprise-level design looks professional
- [ ] Colors are consistent (blue/gray theme)
- [ ] Typography is readable
- [ ] Spacing looks good
- [ ] Cards have proper shadows and hover effects
- [ ] Buttons work and have hover states
- [ ] Responsive design works (try resizing browser)

### ✅ Navigation
- [ ] All navigation links work
- [ ] Breadcrumbs (if any) are correct
- [ ] Back buttons work
- [ ] Category links in sidebar work
- [ ] Tag links work

### ✅ No Errors
- [ ] No 404 errors
- [ ] No broken links
- [ ] No console errors (check browser DevTools F12)
- [ ] All images load
- [ ] CSS loads correctly
- [ ] JavaScript (if any) works

### ✅ Mobile/Responsive
- [ ] Test on mobile viewport (F12 → Toggle device toolbar)
- [ ] Navigation menu works on mobile
- [ ] Sidebar stacks correctly on mobile
- [ ] Text is readable on small screens
- [ ] Buttons are clickable on mobile

---

## Quick Test Commands

### Check for broken links (if you have a link checker):
```powershell
# You can use online tools like:
# - https://validator.w3.org/checklink
# - Browser extensions like "Check My Links"
```

### Check file structure:
```powershell
# Verify all category directories exist
Get-ChildItem -Path .\categories -Directory | Select-Object Name
```

### Check for common issues:
```powershell
# Find any remaining notification-dot references
Select-String -Path *.html -Pattern "notification-dot" -Recurse

# Find any inline styles that should be in CSS
Select-String -Path *.html -Pattern 'style="' -Recurse
```

---

## Browser Testing

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)

---

## Performance Check

- [ ] Pages load quickly
- [ ] No slow-loading resources
- [ ] Images are optimized (if any)

---

## Accessibility Check

- [ ] Can navigate with keyboard (Tab key)
- [ ] Focus states are visible
- [ ] Alt text on images (if any)
- [ ] Color contrast is good
- [ ] Text is readable

---

## Final Steps Before Push

1. ✅ Complete all checklist items above
2. ✅ Test in multiple browsers
3. ✅ Check mobile responsiveness
4. ✅ Verify no console errors
5. ✅ Review all content for typos
6. ✅ Ensure all links work
7. ✅ Check footer copyright is correct on all pages

---

## Common Issues to Watch For

- **Broken category links** - Check category URLs match directory names
- **Missing sidebar widgets** - All pages should have category sidebar
- **Incorrect post counts** - Category counts should match actual posts
- **Wrong category names** - Should match the 10 new categories
- **Footer inconsistencies** - All pages should have same footer
- **Missing social icons** - LinkedIn, GitHub, RSS should be on all pages

---

## Quick Review Script

Run this to get a quick overview:
```powershell
.\quick-review.ps1
```

