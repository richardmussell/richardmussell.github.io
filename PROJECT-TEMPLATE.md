# Project Template Guide

This guide explains how to add new projects to the eportfolio in a modular and scalable way.

## Project Structure

Each project follows this structure:

```
projects/
  └── project-slug-name/
      └── index.html
```

## Step-by-Step: Adding a New Project

### 1. Create Project Directory

Create a new directory in `projects/` with a URL-friendly slug:
- Use lowercase
- Use hyphens instead of spaces
- Keep it descriptive but concise

Example: `projects/my-new-project/`

### 2. Create Project Page

Copy the template from `projects/automated-labs-windows-server-2022/index.html` and modify:

**Required Updates:**
- `<title>` tag
- `<meta name="description">` tag
- `<h1 class="project-single-title">` - Project title
- Date in `<div class="post-meta">`
- All content in `<div class="project-single-content">`
- Category link in `<div class="post-categories">`
- Tag links in `<div class="post-tags">`
- Navigation link back to `/project/`

### 3. Add to Project Listing

Add the project to `project/index.html` and `index.html`:

**Template for Project Listing:**
```html
<article class="blog-post-card" id="post-UNIQUE-ID">
    <div class="post-header">
        <h2 class="post-title">
            <a href="/projects/PROJECT-SLUG/">Project Title</a>
        </h2>
        <div class="post-meta">
            <span class="meta-item">
                <i class="far fa-calendar"></i> 
                Date
            </span>
            <span class="meta-item">
                <i class="far fa-clock"></i> 
                X min read
            </span>
        </div>
    </div>
    <div class="post-content">
        <div class="post-icon">
            <!-- Icon HTML -->
        </div>
        <div class="post-description">
            <p>Project description...</p>
            <div style="display: flex; gap: var(--spacing-3); flex-wrap: wrap; margin-top: var(--spacing-4);">
                <a href="/projects/PROJECT-SLUG/" class="read-more-btn">VIEW</a>
            </div>
        </div>
    </div>
</article>
```

### 4. Update Category Counts

Update category counts in all sidebar widgets:
- Find the category in sidebar
- Increment the count: `<span class="count">X</span>`

### 5. Add to Recent Posts

Add to Recent Posts sidebar widget in all pages (or use a script to update all).

## Project Page Content Structure

```html
<div class="project-single-content">
    <p class="project-single-description">Introduction paragraph</p>
    
    <h2 id="section-name">Section Title</h2>
    <p>Content...</p>
    
    <h3 id="subsection-name">Subsection Title</h3>
    <p>Content...</p>
    
    <ul>
        <li>List item</li>
    </ul>
    
    <pre><code>Code example</code></pre>
    
    <div class="post-categories">
        <strong>Categories:</strong>
        <a href="/categories/CATEGORY-SLUG/">Category Name</a>
    </div>
    
    <div class="post-tags">
        <strong>Tags:</strong>
        <a href="/tags/TAG-SLUG/">Tag Name</a>
    </div>
</div>
```

## Categories Reference

Available categories:
- Cloud - Azure (`/categories/cloud-azure/`)
- Cloud - AWS (`/categories/cloud-aws/`)
- Cloud - GCP (`/categories/cloud-gcp/`)
- Infrastructure as Code (IaC) (`/categories/infrastructure-as-code/`)
- Automation & Configuration (`/categories/automation-configuration/`)
- CI/CD Pipelines (`/categories/cicd-pipelines/`)
- Containers & Kubernetes (`/categories/containers-kubernetes/`)
- Monitoring & Logging (`/categories/monitoring-logging/`)
- Security & Identity (`/categories/security-identity/`)
- Systems Administration (`/categories/systems-administration/`)
- Networking (`/categories/networking/`)
- Scripting & Programming (`/categories/scripting-programming/`)
- Architecture & Design (`/categories/architecture-design/`)

## Tags Reference

Available tags:
- Azure (`/tags/azure/`)
- AWS (`/tags/aws/`)
- GCP (`/tags/gcp/`)
- Cloud Services (`/tags/cloud-services/`)
- DevOps / IaC Tools (`/tags/devops-iac-tools/`)
- Containers (`/tags/containers/`)
- Scripting / Programming (`/tags/scripting-programming/`)
- Security (`/tags/security/`)
- Monitoring & Observability (`/tags/monitoring-observability/`)
- Concepts / Practices (`/tags/concepts-practices/`)

## Automation Script

For future projects, you can create a PowerShell script to:
1. Create project directory
2. Copy template
3. Update all references
4. Update category counts

## Best Practices

1. **Consistent Naming**: Use kebab-case for directory names
2. **Descriptive URLs**: Make slugs descriptive but concise
3. **Proper Categories**: Assign to most relevant category
4. **Relevant Tags**: Use 3-5 relevant tags
5. **Code Formatting**: Use `<pre><code>` for code blocks
6. **Navigation**: Always include back link to `/project/`
7. **Meta Description**: Write compelling 150-160 character descriptions

## Example: Adding a New Project

1. Create: `projects/terraform-aws-vpc/`
2. Copy template from `automated-labs-windows-server-2022/index.html`
3. Update title, content, category, tags
4. Add to `project/index.html` and `index.html`
5. Update category counts in sidebars
6. Test locally with `.\serve-hugo.ps1`

