# How to Review the Site Locally

## Option 1: PowerShell Web Server (Recommended)

1. Open PowerShell in the project directory
2. Run:
   ```powershell
   .\serve-local.ps1
   ```
3. Open your browser to: `http://localhost:8080`

Press `Ctrl+C` to stop the server.

## Option 2: Using Python (if installed)

If you have Python installed:

```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

Then open: `http://localhost:8080`

## Option 3: Using Node.js (if installed)

If you have Node.js installed:

```bash
# Install http-server globally (one time)
npm install -g http-server

# Run the server
http-server -p 8080
```

Then open: `http://localhost:8080`

## Option 4: Using VS Code Live Server Extension

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Option 5: Direct File Opening (Limited)

You can open `index.html` directly in your browser, but:
- Some features may not work (relative paths, AJAX, etc.)
- Category and tag pages may not load correctly
- Use a web server for best results

## What to Check

After starting the server, review:

1. **Homepage** (`http://localhost:8080/`)
   - Check sidebar categories show new structure
   - Verify category counts are correct

2. **Category Pages**:
   - `/categories/cloud-aws/` - Should show AWS API Gateway post
   - `/categories/cloud-azure/` - Should show Azure Function App post
   - `/categories/infrastructure-as-code/` - Should show 2 Terraform posts
   - `/categories/automation-configuration-management/` - Should show Ansible post
   - `/categories/security-identity/` - Should show Boost AWS Security post

3. **Individual Post Pages**:
   - Check category links at bottom of each post
   - Verify they link to correct new categories

4. **Categories Index** (`/categories/`):
   - Should list all categories with new names

5. **Sidebar Widgets**:
   - All pages should show updated category list in sidebar

## Troubleshooting

- **Port already in use**: Change the port number in the script (e.g., 8081, 3000)
- **Files not loading**: Make sure you're in the project root directory
- **CSS/JS not working**: Ensure you're using a web server (not opening files directly)

