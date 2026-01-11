# QuranPulse Auto-Deploy Script (PowerShell)
# This script commits all changes and deploys to Vercel production

param(
    [string]$CommitMessage = "Auto-deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
)

Write-Host ""
Write-Host "🚀 QuranPulse Auto-Deploy" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Stage all changes
Write-Host "📦 Staging all changes..." -ForegroundColor Yellow
git add -A

# Commit
Write-Host "📝 Committing: $CommitMessage" -ForegroundColor Yellow
git commit -m $CommitMessage
if ($LASTEXITCODE -ne 0) {
    Write-Host "   Nothing to commit (or already committed)" -ForegroundColor Gray
}

# Push to GitHub
Write-Host "⬆️  Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

# Deploy to Vercel
Write-Host "🔨 Building & Deploying to Vercel..." -ForegroundColor Yellow
npx vercel --prod --yes

Write-Host ""
Write-Host "✅ DONE! Check https://quranpulse.my" -ForegroundColor Green
Write-Host ""

# Open in browser
Start-Process "https://quranpulse.my"
