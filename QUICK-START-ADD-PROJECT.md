# Quick Start: Adding a New Project

## Fast Track (3 Steps)

### 1. Create Project Page
```powershell
# Copy template
Copy-Item "projects\automated-labs-windows-server-2022\index.html" "projects\YOUR-PROJECT-SLUG\index.html"

# Edit the file to update:
# - Title, date, content
# - Category and tags
# - Project URL
```

### 2. Add to Project Listing
Add this to `project/index.html` and `index.html` (after line 44):

```html
<article class="blog-post-card" id="post-UNIQUE-ID">
    <div class="post-header">
        <h2 class="post-title">
            <a href="/projects/YOUR-PROJECT-SLUG/">Your Project Title</a>
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
            <!-- Your icon HTML -->
        </div>
        <div class="post-description">
            <p>Project description...</p>
            <a href="/projects/YOUR-PROJECT-SLUG/" class="read-more-btn">READ MORE</a>
        </div>
    </div>
</article>
```

### 3. Update Category Counts
In all sidebar widgets, find your category and increment the count:
- Change `<span class="count">X</span>` to `<span class="count">X+1</span>`

## Using the Automation Script

```powershell
.\add-project.ps1 `
    -ProjectSlug "my-new-project" `
    -Title "My New Project Title" `
    -Date "Jan 15, 2025" `
    -Category "systems-administration" `
    -Tags @("scripting-programming", "devops-iac-tools", "security")
```

Then edit the generated file to add your content.

## Project Structure Pattern

```
projects/
  └── project-slug/
      └── index.html  (Full project page)
```

**Key Points:**
- Title links directly to project page: `/projects/PROJECT-SLUG/`
- "READ MORE" button also links to project page
- Consistent structure across all projects
- Category and tags follow the established taxonomy
- Clean, enterprise-level design flows

## See Also
- `PROJECT-TEMPLATE.md` - Detailed guide
- `projects/automated-labs-windows-server-2022/index.html` - Reference template

