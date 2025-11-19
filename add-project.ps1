# Modular Project Addition Script
# Usage: .\add-project.ps1 -ProjectSlug "my-project" -Title "My Project Title" -Date "Jan 15, 2025" -Category "systems-administration" -Tags @("scripting-programming", "devops-iac-tools")

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectSlug,
    
    [Parameter(Mandatory=$true)]
    [string]$Title,
    
    [Parameter(Mandatory=$true)]
    [string]$Date,
    
    [Parameter(Mandatory=$true)]
    [string]$Category,
    
    [Parameter(Mandatory=$true)]
    [string[]]$Tags,
    
    [string]$Description = "",
    [string]$ReadTime = "5 min read"
)

Write-Host "Adding new project: $Title" -ForegroundColor Cyan
Write-Host "Slug: $ProjectSlug" -ForegroundColor Yellow
Write-Host ""

# Create project directory
$projectDir = "projects\$ProjectSlug"
if (Test-Path $projectDir) {
    Write-Host "Error: Project directory already exists!" -ForegroundColor Red
    exit 1
}

New-Item -ItemType Directory -Path $projectDir -Force | Out-Null
Write-Host "Created directory: $projectDir" -ForegroundColor Green

# Copy template
$templateFile = "projects\automated-labs-windows-server-2022\index.html"
if (-not (Test-Path $templateFile)) {
    Write-Host "Error: Template file not found!" -ForegroundColor Red
    exit 1
}

$projectFile = "$projectDir\index.html"
Copy-Item $templateFile $projectFile

# Update project file
$content = [System.IO.File]::ReadAllText($projectFile, [System.Text.Encoding]::UTF8)

# Replace title
$content = $content -replace 'Automated Labs: Provisioning a Windows Server 2022 VM with PowerShell ISE', $Title

# Replace date
$content = $content -replace 'Jul 21, 2025', $Date

# Replace category
$categoryMap = @{
    "cloud-azure" = "Cloud - Azure"
    "cloud-aws" = "Cloud - AWS"
    "cloud-gcp" = "Cloud - GCP"
    "infrastructure-as-code" = "Infrastructure as Code (IaC)"
    "automation-configuration" = "Automation & Configuration"
    "cicd-pipelines" = "CI/CD Pipelines"
    "containers-kubernetes" = "Containers & Kubernetes"
    "monitoring-logging" = "Monitoring & Logging"
    "security-identity" = "Security & Identity"
    "systems-administration" = "Systems Administration"
    "networking" = "Networking"
    "scripting-programming" = "Scripting & Programming"
    "architecture-design" = "Architecture & Design"
}

$categoryName = $categoryMap[$Category]
if ($categoryName) {
    $content = $content -replace 'Systems Administration', $categoryName
    $content = $content -replace '/categories/systems-administration/', "/categories/$Category/"
}

# Replace tags
$tagMap = @{
    "azure" = "Azure"
    "aws" = "AWS"
    "gcp" = "GCP"
    "cloud-services" = "Cloud Services"
    "devops-iac-tools" = "DevOps / IaC Tools"
    "containers" = "Containers"
    "scripting-programming" = "Scripting / Programming"
    "security" = "Security"
    "monitoring-observability" = "Monitoring & Observability"
    "concepts-practices" = "Concepts / Practices"
}

$tagHTML = ""
foreach ($tag in $Tags) {
    $tagName = $tagMap[$tag]
    if ($tagName) {
        if ($tagHTML -ne "") {
            $tagHTML += "`n                            , `n                            "
        }
        $tagHTML += "<a href=`"/tags/$tag/`">$tagName</a>"
    }
}

$content = $content -replace '(?s)<a href="/tags/scripting-programming/">Scripting / Programming</a>.*?<a href="/tags/concepts-practices/">Concepts / Practices</a>', $tagHTML

# Replace project URL
$content = $content -replace 'automated-labs-windows-server-2022', $ProjectSlug

# Replace description if provided
if ($Description -ne "") {
    $content = $content -replace 'In this project, I leveraged the power of AutomatedLab—a powerful PowerShell module designed to automate the deployment of virtual lab environments—to provision a fully functional Windows Server 2022 virtual machine\. Using PowerShell ISE as my scripting environment, I was able to streamline the setup process, saving valuable time while ensuring consistent, repeatable results\.', $Description
}

[System.IO.File]::WriteAllText($projectFile, $content, [System.Text.UTF8Encoding]::new($false))
Write-Host "Created project page: $projectFile" -ForegroundColor Green

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Edit $projectFile to add your project content" -ForegroundColor White
Write-Host "2. Add project to blog/index.html and index.html" -ForegroundColor White
Write-Host "3. Update category counts in sidebars" -ForegroundColor White
Write-Host "4. Test locally with .\serve-hugo.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Project URL: /projects/$ProjectSlug/" -ForegroundColor Cyan

