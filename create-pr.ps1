# Create Pull Request Script
# Opens GitHub PR creation page for current branch
# Usage: .\create-pr.ps1

Write-Host "=== Creating Pull Request ===" -ForegroundColor Cyan
Write-Host ""

# Get current branch
try {
    $currentBranch = git rev-parse --abbrev-ref HEAD 2>$null
    if (-not $currentBranch) {
        Write-Host "[ERROR] Not in a git repository or no branch detected" -ForegroundColor Red
        exit 1
    }
    Write-Host "Current branch: $currentBranch" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed to get current branch" -ForegroundColor Red
    exit 1
}

# Get remote URL
try {
    $remoteUrl = git config --get remote.origin.url 2>$null
    if (-not $remoteUrl) {
        Write-Host "[ERROR] No remote 'origin' found" -ForegroundColor Red
        exit 1
    }
    
    # Convert SSH to HTTPS if needed
    if ($remoteUrl -match 'git@github\.com:(.+)\.git') {
        $repoPath = $matches[1]
        $prUrl = "https://github.com/$repoPath/compare/$currentBranch?expand=1"
    } elseif ($remoteUrl -match 'https://github\.com/(.+)\.git') {
        $repoPath = $matches[1]
        $prUrl = "https://github.com/$repoPath/compare/$currentBranch?expand=1"
    } elseif ($remoteUrl -match 'https://github\.com/(.+)') {
        $repoPath = $remoteUrl -replace 'https://github\.com/', '' -replace '\.git$', ''
        $prUrl = "https://github.com/$repoPath/compare/$currentBranch?expand=1"
    } else {
        Write-Host "[ERROR] Could not parse remote URL: $remoteUrl" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Repository: $repoPath" -ForegroundColor Green
    Write-Host ""
    Write-Host "Opening PR creation page..." -ForegroundColor Yellow
    Write-Host "URL: $prUrl" -ForegroundColor Cyan
    Write-Host ""
    
    # Open in default browser
    Start-Process $prUrl
    
    Write-Host "[SUCCESS] PR creation page opened in browser!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Fill in PR title and description" -ForegroundColor White
    Write-Host "  2. Review the changes" -ForegroundColor White
    Write-Host "  3. Click 'Create pull request'" -ForegroundColor White
    
} catch {
    Write-Host "[ERROR] Failed to create PR URL: $_" -ForegroundColor Red
    exit 1
}


