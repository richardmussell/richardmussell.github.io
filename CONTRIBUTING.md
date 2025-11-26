# Contributing Guidelines

Thank you for considering contributing to this portfolio project! This document provides guidelines and best practices for contributing.

## Code of Conduct

- Be respectful and constructive
- Focus on what is best for the project
- Show empathy towards other contributors

## Development Workflow

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/richardmussell.github.io.git
cd richardmussell.github.io

# Add upstream remote
git remote add upstream https://github.com/richardmussell/richardmussell.github.io.git
```

### 2. Create a Branch

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or a fix branch
git checkout -b fix/your-fix-name
```

### 3. Make Changes

- Write clean, maintainable code
- Follow existing code style and patterns
- Test your changes locally
- Update documentation if needed

### 4. Test Locally

```bash
# Start development server
hugo server --environment development

# Build for production
hugo --minify --gc --environment production

# Verify build output
# Check that all pages render correctly
# Test responsive design on multiple screen sizes
```

### 5. Commit Changes

Use clear, descriptive commit messages:

```bash
git commit -m "Add: Feature description"
git commit -m "Fix: Bug description"
git commit -m "Update: Documentation changes"
git commit -m "Refactor: Code improvements"
```

### 6. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create a Pull Request on GitHub
# Fill out the PR template with details about your changes
```

## Coding Standards

### Hugo Templates

- Use Hugo's template syntax consistently
- Prefer partials for reusable components
- Use `{{- -}}` for whitespace control
- Comment complex template logic

```go
{{- /* Good: Clear, commented */ -}}
{{- if .Params.featuredImage -}}
  {{- $image := resources.Get .Params.featuredImage -}}
  {{- if $image -}}
    <img src="{{ $image.RelPermalink }}" alt="{{ .Title }}">
  {{- end -}}
{{- end -}}
```

### SCSS/CSS

- Use design tokens from `_design-tokens.scss`
- Follow BEM naming conventions
- Organize styles by component
- Use mobile-first responsive design

```scss
// Good: Uses design tokens, BEM naming
.card-summary {
  padding: var(--spacing-4);
  background-color: var(--color-bg-primary);
  
  &__title {
    font-size: var(--font-size-xl);
    color: var(--color-text-primary);
  }
  
  &--featured {
    border: 2px solid var(--color-primary);
  }
}
```

### JavaScript

- Use modern ES6+ syntax
- Write modular, reusable code
- Handle errors gracefully
- Add comments for complex logic

```javascript
// Good: Modular, documented
class MobileMenu {
  constructor() {
    this.header = document.querySelector('.header');
    this.navMenu = document.querySelector('.nav-menu');
    this.events();
  }

  events() {
    // Handle menu toggle
    this.hamburger.addEventListener('click', () => this.toggleMenu());
  }
}
```

### Markdown Content

- Use proper heading hierarchy
- Add alt text to images
- Use front matter consistently
- Format code blocks with language tags

```yaml
---
title: "Project Title"
description: "Brief description"
featuredImage: "/images/project.jpg"
technologies: ["Python", "Django"]
date: 2024-01-01
categories: ["Web Development"]
tags: ["python", "django"]
---
```

## Pull Request Process

### Before Submitting

- [ ] Code follows existing style and patterns
- [ ] All changes tested locally
- [ ] Build succeeds without errors
- [ ] Documentation updated if needed
- [ ] Lighthouse scores maintained (100/100 target)
- [ ] No console errors or warnings

### PR Checklist

When creating a Pull Request, please include:

1. **Clear title and description**
   - What changes were made?
   - Why were they made?
   - How were they tested?

2. **Screenshots** (if UI changes)
   - Desktop view
   - Mobile view (if applicable)

3. **Testing notes**
   - What was tested?
   - Any edge cases considered?

4. **Performance impact**
   - Does this affect Lighthouse scores?
   - Any bundle size changes?

### Review Process

1. Maintainer reviews PR
2. Changes requested (if needed)
3. Updates made by contributor
4. Approval and merge

## Quality Standards

### Performance

- Maintain Lighthouse 100/100 score
- Optimize images (AVIF/WebP)
- Minimize bundle sizes
- Use lazy loading appropriately

### Accessibility

- WCAG 2.1 AA compliance
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support

### Security

- No inline scripts (use Hugo Pipes)
- SRI for external resources
- Input validation
- No sensitive data in code

### SEO

- Proper meta tags
- Structured data (JSON-LD)
- Alt text for images
- Semantic HTML structure

## Project Structure

When adding new features, follow the existing structure:

```
content/           # Content files
  projects/        # Project pages
  posts/           # Blog posts
  about/           # About page
  
assets/            # Source files
  scss/            # Stylesheets
  js/              # JavaScript
  images/          # Images
  
layouts/           # Templates
  _default/        # Base templates
  partials/        # Reusable components
  shortcodes/      # Shortcodes
```

## Questions?

If you have questions or need clarification:

1. Check existing documentation
2. Review similar code in the codebase
3. Open an issue with your question
4. Ask in the PR discussion

## Thank You!

Your contributions help make this project better. Every contribution, no matter how small, is appreciated!

---

**Happy coding! 🚀**

