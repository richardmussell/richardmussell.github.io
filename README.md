# Richard Mussell - Professional Portfolio

> Enterprise-grade static portfolio built with Hugo, optimized for performance, security, and search visibility.

[![Build Status](https://github.com/richardmussell/richardmussell.github.io/workflows/Build%20and%20Deploy%20Hugo%20Site%20to%20GitHub%20Pages/badge.svg)](https://github.com/richardmussell/richardmussell.github.io/actions)
[![Hugo Version](https://img.shields.io/badge/Hugo-0.152.2-blue)](https://gohugo.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-100%2F100-brightgreen)](https://developers.google.com/web/tools/lighthouse)

**Live Demo:** [https://richardmussell.github.io](https://richardmussell.github.io)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Development](#development)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Performance](#performance)
- [Security](#security)
- [SEO](#seo)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- ⚡ **Performance**: Optimized for Lighthouse 100/100 score
- 🔒 **Security**: Hardened CSP, SRI, email obfuscation
- 🔍 **SEO**: Comprehensive structured data (JSON-LD), OpenGraph, sitemap
- 📱 **Responsive**: Mobile-first design with progressive enhancement
- 🎨 **Modern**: Custom SCSS architecture with design tokens
- 🚀 **CI/CD**: Automated deployment via GitHub Actions
- ♿ **Accessible**: WCAG 2.1 AA compliant
- 🌐 **Multi-format**: AVIF/WebP image optimization

---

## Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Static Site Generator** | Hugo 0.152.2 (Extended) | Content management & build |
| **Styling** | SCSS + Hugo Pipes | CSS preprocessing & optimization |
| **JavaScript** | Vanilla ES6+ | Client-side interactivity |
| **Hosting** | GitHub Pages | Static site hosting |
| **CI/CD** | GitHub Actions | Automated builds & deployment |
| **Image Processing** | Hugo Pipes | AVIF/WebP conversion, responsive images |

### Key Dependencies

- No CSS frameworks (custom SCSS architecture)
- No JavaScript frameworks (vanilla JS for performance)
- Font Awesome 6.4.0 (CDN, async loaded)
- Formspree (contact form submissions)

---

## Quick Start

### Prerequisites

- **Hugo Extended** 0.152.2 or later ([Installation Guide](https://gohugo.io/installation/))
- **Git** (for cloning)
- **Node.js** 14+ (optional, for npm scripts)

### Installation

```bash
# Clone the repository
git clone https://github.com/richardmussell/richardmussell.github.io.git
cd richardmussell.github.io

# Verify Hugo installation
hugo version  # Should show Hugo Static Site Generator v0.152.2+ extended
```

### Development

```bash
# Start development server (with hot reload)
hugo server --environment development

# Or use npm script
npm run serve

# Site will be available at http://localhost:1313
```

### Production Build

```bash
# Build for production (minified, optimized)
hugo --minify --gc --environment production

# Or use npm script
npm run build

# Output will be in the `public/` directory
```

---

## Architecture

### Design Philosophy

This portfolio follows a "100x Engineering" approach:

1. **Performance First**: Every optimization decision prioritizes speed and Core Web Vitals
2. **Security by Default**: Hardened security headers, CSP, SRI, and input validation
3. **SEO Excellence**: Comprehensive structured data for rich results and knowledge graph
4. **Zero Dependencies**: Minimal external dependencies for maximum reliability
5. **Maintainability**: Clean architecture, well-documented, modular components

### Key Architectural Decisions

#### 1. Hugo Static Site Generator
- **Why**: Fast builds, excellent performance, zero runtime overhead
- **Benefit**: Perfect Lighthouse scores, instant page loads

#### 2. Custom SCSS Architecture
- **Why**: Full control, no framework bloat, optimal bundle size
- **Benefit**: Smaller CSS files, faster FCP (First Contentful Paint)

#### 3. Vanilla JavaScript
- **Why**: No framework overhead, maximum performance
- **Benefit**: Minimal JavaScript, faster TTI (Time to Interactive)

#### 4. Hugo Pipes for Assets
- **Why**: Built-in optimization, fingerprinting, SRI
- **Benefit**: Automatic cache busting, asset integrity

#### 5. GitHub Pages + Actions
- **Why**: Free hosting, automated deployments, HTTPS by default
- **Benefit**: Zero-cost hosting with enterprise-grade CI/CD

---

## Development

### Local Development Server

```bash
# Development mode (includes drafts, future posts)
hugo server --environment development --buildDrafts

# Production mode (excludes drafts)
hugo server --environment production
```

### Available npm Scripts

```bash
npm run serve      # Start development server
npm run build      # Build for production
npm run build:dev  # Build in development mode
```

### Adding New Content

#### Create a New Project

```bash
hugo new projects/my-project-name/index.md
```

Edit the front matter in `content/projects/my-project-name/index.md`:

```yaml
---
title: "My Project"
description: "Project description"
featuredImage: "/images/project.jpg"
technologies: ["Python", "Django"]
date: 2024-01-01
categories: ["Web Development"]
tags: ["python", "django"]
---
```

#### Create a New Blog Post

```bash
hugo new posts/my-blog-post/index.md
```

### Project Structure

```
.
├── assets/              # Source files (SCSS, JS, images)
│   ├── scss/           # SCSS partials
│   ├── js/             # JavaScript modules
│   └── images/         # Image assets
├── config/             # Hugo configuration
│   ├── _default/       # Default config
│   ├── development/    # Dev overrides
│   └── production/     # Production overrides
├── content/            # Content files (Markdown)
│   ├── projects/       # Project pages
│   ├── about/          # About page
│   └── contact/        # Contact page
├── layouts/            # HTML templates
│   ├── _default/       # Base templates
│   ├── partials/       # Reusable components
│   └── shortcodes/     # Shortcodes
├── static/             # Static assets (copied as-is)
├── public/             # Generated site (gitignored)
└── .github/            # GitHub Actions workflows
```

---

## Deployment

### Automated Deployment

The site is automatically deployed to GitHub Pages on every push to `main`:

1. **GitHub Actions** triggers on push to `main`
2. **Build job** compiles Hugo site with production settings
3. **Deploy job** uploads to GitHub Pages
4. **Site goes live** within 1-2 minutes

### Manual Deployment

```bash
# Build the site
hugo --minify --gc --environment production

# Deploy to GitHub Pages (if using gh-pages branch)
git subtree push --prefix public origin gh-pages

# Or push to main (if using GitHub Actions)
git add .
git commit -m "Deploy: Update site"
git push origin main
```

### GitHub Pages Configuration

1. Go to **Repository Settings** → **Pages**
2. **Source**: GitHub Actions
3. **Branch**: `main` (automatically set by workflow)

---

## Performance

### Lighthouse Scores

| Metric | Score | Target |
|--------|-------|--------|
| **Performance** | 100/100 | ✅ |
| **Accessibility** | 100/100 | ✅ |
| **Best Practices** | 100/100 | ✅ |
| **SEO** | 100/100 | ✅ |

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 2.0s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.05
- **FCP (First Contentful Paint)**: < 1.5s
- **TTI (Time to Interactive)**: < 3.8s

### Performance Optimizations

- ✅ AVIF/WebP image formats with responsive srcsets
- ✅ CSS/JS minification and fingerprinting
- ✅ Resource hints (preload, preconnect, DNS-prefetch)
- ✅ Lazy loading for below-fold images
- ✅ System fonts (zero load time)
- ✅ Async JavaScript loading
- ✅ Critical CSS optimization

---

## Security

### Security Features

- ✅ **Content Security Policy (CSP)**: Strict "Trust No One" architecture
- ✅ **Subresource Integrity (SRI)**: All assets fingerprinted
- ✅ **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- ✅ **Email Obfuscation**: Base64 encoding to prevent scraping
- ✅ **Hugo Generator Tag**: Disabled (security by obscurity)

### Security Headers

```
Content-Security-Policy: default-src 'self'; ...
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

---

## SEO

### Structured Data (JSON-LD)

- ✅ **Person Schema**: Homepage (enables Knowledge Graph)
- ✅ **WebSite Schema**: Homepage (enables search box)
- ✅ **SoftwareSourceCode Schema**: Project pages
- ✅ **BlogPosting Schema**: Blog posts
- ✅ **BreadcrumbList Schema**: All inner pages

### SEO Features

- ✅ Comprehensive OpenGraph tags
- ✅ Twitter Card metadata
- ✅ Dynamic robots meta tags
- ✅ Canonical URLs
- ✅ XML sitemap with priorities
- ✅ robots.txt optimization

### Validation Tools

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test locally**: `hugo server --environment development`
5. **Commit with clear messages**: `git commit -m "Add: Feature description"`
6. **Push to your fork**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and structure
- Test all changes locally before submitting
- Update documentation if needed
- Ensure Lighthouse scores remain 100/100

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Additional Documentation

- [Security Hardening Summary](SECURITY-HARDENING-SUMMARY.md)
- [Performance Optimization Guide](PERFORMANCE-OPTIMIZATION-SUMMARY.md)
- [SEO Implementation Guide](PHASE-9-SEO-COMPLETE.md)
- [Hugo Foundations Summary](HUGO-FOUNDATIONS-SUMMARY.md)

---

## Contact

**Richard Mussell**  
Junior Systems & Network Engineer

- **Portfolio**: [https://richardmussell.github.io](https://richardmussell.github.io)
- **LinkedIn**: [linkedin.com/in/richard-mussell](https://www.linkedin.com/in/richard-mussell/)
- **GitHub**: [github.com/richardmussell](https://github.com/richardmussell)

---

**Built with ❤️ using Hugo and deployed on GitHub Pages**

