# Quick Review Script - Check site before pushing
# Usage: .\quick-review.ps1

Write-Host "=== Pre-Push Site Review ===" -ForegroundColor Cyan
Write-Host ""

# Check for common issues
Write-Host "Checking for common issues..." -ForegroundColor Yellow
Write-Host ""

$issues = @()

# Check for notification-dot (should be removed)
$htmlFilesForCheck = Get-ChildItem -Path . -Filter "*.html" -Recurse -ErrorAction SilentlyContinue
$notificationDot = $htmlFilesForCheck | Select-String -Pattern "notification-dot" -ErrorAction SilentlyContinue
if ($notificationDot) {
    $issues += "Found notification-dot references (should be removed)"
    Write-Host "  [WARNING] Found notification-dot references" -ForegroundColor Red
} else {
    Write-Host "  [OK] No notification-dot found" -ForegroundColor Green
}

# Check for duplicate class attributes
$duplicateClass = $htmlFilesForCheck | Select-String -Pattern 'class=".*" class="' -ErrorAction SilentlyContinue
if ($duplicateClass) {
    $issues += "Found duplicate class attributes"
    Write-Host "  [WARNING] Found duplicate class attributes" -ForegroundColor Red
} else {
    Write-Host "  [OK] No duplicate class attributes" -ForegroundColor Green
}

# Check category directories
Write-Host ""
Write-Host "Checking category structure..." -ForegroundColor Yellow
$expectedCategories = @(
    "automation-configuration-management",
    "cicd-pipelines",
    "cloud-aws",
    "cloud-azure",
    "containers-kubernetes",
    "infrastructure-as-code",
    "monitoring-logging",
    "networking",
    "security-identity",
    "systems-administration"
)

$categoryDirs = Get-ChildItem -Path .\categories -Directory -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name
$missingCategories = $expectedCategories | Where-Object { $categoryDirs -notcontains $_ }

if ($missingCategories) {
    $missingList = $missingCategories -join ", "
    $issues += "Missing category directories: $missingList"
    Write-Host "  [WARNING] Missing categories: $missingList" -ForegroundColor Red
} else {
    Write-Host "  [OK] All 10 categories exist" -ForegroundColor Green
}

# Check for CSS files
Write-Host ""
Write-Host "Checking CSS files..." -ForegroundColor Yellow
$cssFiles = @("styles.css", "contact-form.css", "projects.css")
foreach ($css in $cssFiles) {
    if (Test-Path ".\css\$css") {
        Write-Host "  [OK] $css exists" -ForegroundColor Green
    } else {
        $issues += "Missing CSS file: $css"
        Write-Host "  [WARNING] Missing: $css" -ForegroundColor Red
    }
}

# Check HTML files count
Write-Host ""
Write-Host "Checking HTML files..." -ForegroundColor Yellow
$htmlFiles = Get-ChildItem -Path . -Filter "*.html" -Recurse | Where-Object { $_.FullName -notmatch "node_modules|\.git" }
Write-Host "  [OK] Found $($htmlFiles.Count) HTML files" -ForegroundColor Green

# Summary
Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
if ($issues.Count -eq 0) {
    Write-Host "[SUCCESS] No issues found! Site looks good to push." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Start server: .\serve-hugo.ps1" -ForegroundColor White
    Write-Host "  2. Review in browser: http://localhost:1313/" -ForegroundColor White
    Write-Host "  3. Complete the checklist in LOCAL-REVIEW-GUIDE.md" -ForegroundColor White
} else {
    Write-Host "[WARNING] Found $($issues.Count) potential issue(s):" -ForegroundColor Red
    foreach ($issue in $issues) {
        Write-Host "  - $issue" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "Please fix these issues before pushing." -ForegroundColor Red
}

Write-Host ""
