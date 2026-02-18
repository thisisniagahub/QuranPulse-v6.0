# ============================================
# BATTLE 1 P0 SPRINT - ALL-IN-ONE SCRIPT
# QuranPulse v7.0 | 18 Feb 2026
# ============================================

$ErrorActionPreference = "Continue"
$project = "I:\ANTIGRAVITY\QuranPulse-v6.0"
$logFile = "$project\battle1-log.txt"

Set-Location $project
"" | Out-File $logFile

function Log($msg) {
    $ts = Get-Date -Format "HH:mm:ss"
    $line = "[$ts] $msg"
    Write-Host $line -ForegroundColor Cyan
    $line | Out-File $logFile -Append
}

# ============================================
# STEP 1: TSC CHECK
# ============================================
Log "=== STEP 1: TypeScript Check ==="
$tscResult = & npx tsc --noEmit 2>&1
if ($LASTEXITCODE -eq 0) {
    Log "✅ TSC PASSES CLEAN"
} else {
    Log "❌ TSC ERRORS:"
    $tscResult | ForEach-Object { Log "  $_" }
    Log "ABORTING - Fix TSC errors first"
    exit 1
}

# ============================================
# STEP 2: VITE BUILD (with timeout)
# ============================================
Log "=== STEP 2: Vite Build ==="
Log "Starting vite build with 60s timeout..."

$buildJob = Start-Job -ScriptBlock {
    Set-Location $using:project
    & npx vite build 2>&1
}

$completed = $buildJob | Wait-Job -Timeout 60
if ($completed) {
    $buildOutput = Receive-Job $buildJob
    $exitCode = $buildJob.ChildJobs[0].JobStateInfo.Reason
    $buildOutput | ForEach-Object { Log "  $_" }
    
    if ($buildOutput -match "built in") {
        Log "✅ VITE BUILD SUCCESS"
    } else {
        Log "❌ VITE BUILD FAILED - Output above"
        Log ""
        Log "=== ATTEMPTING FIX: Remove PWA plugin ==="
        
        # Backup vite.config.ts
        Copy-Item "$project\vite.config.ts" "$project\vite.config.ts.bak"
        
        # Read and modify - comment out VitePWA
        $config = Get-Content "$project\vite.config.ts" -Raw
        $config = $config -replace "import \{ VitePWA \} from 'vite-plugin-pwa';", "// import { VitePWA } from 'vite-plugin-pwa';"
        $config = $config -replace "(?s)VitePWA\(\{.*?\}\)\s*\)", "// VitePWA disabled for build fix"
        $config | Set-Content "$project\vite.config.ts"
        
        Log "Retrying build without PWA plugin..."
        $retryOutput = & npx vite build 2>&1
        $retryOutput | ForEach-Object { Log "  $_" }
        
        if ($retryOutput -match "built in") {
            Log "✅ BUILD PASSES WITHOUT PWA - PWA plugin was the issue"
            Log "Restoring PWA config..."
            Copy-Item "$project\vite.config.ts.bak" "$project\vite.config.ts"
        } else {
            Log "❌ BUILD STILL FAILS WITHOUT PWA - Deeper issue"
            Copy-Item "$project\vite.config.ts.bak" "$project\vite.config.ts"
        }
    }
} else {
    Log "⏰ BUILD TIMED OUT (60s) - Killing..."
    $buildJob | Stop-Job
    $partialOutput = Receive-Job $buildJob
    $partialOutput | ForEach-Object { Log "  $_" }
    Log "Partial output above. Build may be hanging."
}

Remove-Job $buildJob -Force -ErrorAction SilentlyContinue

# ============================================
# STEP 3: CHECK PWA ASSETS
# ============================================
Log "=== STEP 3: PWA Asset Verification ==="
$assets = @("logo-full.png", "screenshots\screen1.png", "screenshots\screen2.png", "screenshots\screen3.png", "UstazAI-Icon.png")
foreach ($asset in $assets) {
    $path = "$project\public\$asset"
    if (Test-Path $path) {
        $size = (Get-Item $path).Length / 1KB
        Log "  ✅ $asset ({0:N0} KB)" -f $size
    } else {
        Log "  ❌ MISSING: $asset"
    }
}

# ============================================
# STEP 4: ENV VARS CHECK
# ============================================
Log "=== STEP 4: Environment Variables ==="
$envContent = Get-Content "$project\.env" -ErrorAction SilentlyContinue
$required = @("VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY", "VITE_GEMINI_API_KEY", "VITE_GROQ_API_KEY")
foreach ($key in $required) {
    if ($envContent -match $key) {
        Log "  ✅ $key configured"
    } else {
        Log "  ❌ MISSING: $key"
    }
}

# ============================================
# STEP 5: GIT STATUS
# ============================================
Log "=== STEP 5: Git Status ==="
$gitStatus = & git status --short 2>&1
Log "  Branch: $(git branch --show-current)"
Log "  Modified files: $($gitStatus.Count)"
$gitStatus | ForEach-Object { Log "  $_" }

# ============================================
# STEP 6: DEV SERVER SMOKE TEST
# ============================================
Log "=== STEP 6: Dev Server Smoke Test ==="
$devJob = Start-Job -ScriptBlock {
    Set-Location $using:project
    & npx vite --host 0.0.0.0 --port 5174 2>&1
}

Start-Sleep -Seconds 8

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5174" -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Log "  ✅ Dev server responds (HTTP 200)"
        Log "  Content length: $($response.Content.Length) bytes"
    }
} catch {
    Log "  ❌ Dev server failed: $($_.Exception.Message)"
}

$devJob | Stop-Job -ErrorAction SilentlyContinue
Remove-Job $devJob -Force -ErrorAction SilentlyContinue

# ============================================
# SUMMARY
# ============================================
Log ""
Log "============================================"
Log "BATTLE 1 SPRINT COMPLETE"
Log "============================================"
Log "Log saved to: $logFile"

Write-Host ""
Write-Host "📋 Full log: $logFile" -ForegroundColor Yellow
Get-Content $logFile
