# Pull Request Workflow Guide

## Quick Create PR Button

### Option 1: Using Command Palette (Recommended)
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type: `Tasks: Run Task`
3. Select: **"Create Pull Request"**
4. The script will open your GitHub PR creation page in your browser

### Option 2: Using Terminal
```powershell
.\create-pr.ps1
```

### Option 3: Add Custom Keyboard Shortcut
1. Press `Ctrl+K Ctrl+S` (or `Cmd+K Cmd+S` on Mac) to open Keyboard Shortcuts
2. Click the "Open Keyboard Shortcuts (JSON)" icon in the top right
3. Add this to your keybindings.json:
   ```json
   {
       "key": "ctrl+shift+p r",
       "command": "workbench.action.tasks.runTask",
       "args": "Create Pull Request"
   }
   ```
4. Save the file and use `Ctrl+Shift+P R` to create a PR

## What the Script Does

The `create-pr.ps1` script:
- ✅ Detects your current git branch
- ✅ Gets your GitHub repository URL
- ✅ Opens the PR creation page in your default browser
- ✅ Pre-fills the compare branch (your current branch)

## Workflow Steps

1. **Make your changes** and commit them:
   ```powershell
   git add .
   git commit -m "Your commit message"
   ```

2. **Push your branch** to GitHub:
   ```powershell
   git push origin your-branch-name
   ```

3. **Create the PR** using one of the methods above

4. **Fill in the PR details** in the browser:
   - Title
   - Description
   - Reviewers (if needed)
   - Labels (if needed)

5. **Click "Create pull request"**

## Tips

- Make sure you've pushed your branch before creating the PR
- The script works with both HTTPS and SSH remote URLs
- If you're not on a branch, the script will show an error

