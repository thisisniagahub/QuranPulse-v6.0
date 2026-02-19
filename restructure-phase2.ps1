# QuranPulse v6.0 - Phase 2: src/ Structure Improvement Script
# Run from project root: h:\ANTIGRAVITY\QuranPulse-v6.0

$ErrorActionPreference = "Continue"
Write-Host "🚀 Starting src/ Structure Improvement..." -ForegroundColor Cyan

# ============================================
# 1. Create Directories
# ============================================
Write-Host "`n📁 Step 1: Creating directories..." -ForegroundColor Yellow

$dirs = @(
    "src/types",
    "src/utils/__tests__",
    "server"
)
foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
        Write-Host "  ✓ Created: $dir" -ForegroundColor Green
    }
}

# ============================================
# 2. Move Type Files to src/types/
# ============================================
Write-Host "`n📝 Step 2: Consolidating type files..." -ForegroundColor Yellow

# Move types.ts to types/index.ts
if (Test-Path "src/types.ts") {
    Move-Item -Path "src/types.ts" -Destination "src/types/app.ts" -Force
    Write-Host "  ✓ Moved: types.ts → types/app.ts" -ForegroundColor Green
}

# Move declaration files
$dtsFiles = @{
    "src/types.d.ts"   = "src/types/types.d.ts"
    "src/global.d.ts"  = "src/types/global.d.ts"
    "src/jest.d.ts"    = "src/types/jest.d.ts"
    "src/modules.d.ts" = "src/types/modules.d.ts"
    "src/test.d.ts"    = "src/types/test.d.ts"
}

foreach ($src in $dtsFiles.Keys) {
    $dest = $dtsFiles[$src]
    if (Test-Path $src) {
        Move-Item -Path $src -Destination $dest -Force
        Write-Host "  ✓ Moved: $src → $dest" -ForegroundColor Green
    }
}

# ============================================
# 3. Move Context Files from services/ to contexts/
# ============================================
Write-Host "`n🔄 Step 3: Moving context files..." -ForegroundColor Yellow

$contextFiles = @(
    "src/services/DataContext.tsx",
    "src/services/QueryProvider.tsx"
)

foreach ($f in $contextFiles) {
    if (Test-Path $f) {
        $fileName = Split-Path $f -Leaf
        Move-Item -Path $f -Destination "src/contexts/$fileName" -Force
        Write-Host "  ✓ Moved: $f → src/contexts/$fileName" -ForegroundColor Green
    }
}

# ============================================
# 4. Move Test Files
# ============================================
Write-Host "`n🧪 Step 4: Moving test files..." -ForegroundColor Yellow

$testFile = "src/utils/transliterationConverter.test.ts"
if (Test-Path $testFile) {
    Move-Item -Path $testFile -Destination "src/utils/__tests__/transliterationConverter.test.ts" -Force
    Write-Host "  ✓ Moved: test file to __tests__/" -ForegroundColor Green
}

# ============================================
# 5. Move Data Files from iqra module
# ============================================
Write-Host "`n📊 Step 5: Moving data files..." -ForegroundColor Yellow

$iqraData = "src/modules/iqra/extracted_BUKU_IQRA1_structured.json"
if (Test-Path $iqraData) {
    Move-Item -Path $iqraData -Destination "content-data/iqra/" -Force
    Write-Host "  ✓ Moved: iqra data file to content-data/" -ForegroundColor Green
}

# ============================================
# 6. Move Bot Server
# ============================================
Write-Host "`n🤖 Step 6: Moving bot server..." -ForegroundColor Yellow

if (Test-Path "src/bot-server.ts") {
    Move-Item -Path "src/bot-server.ts" -Destination "server/bot-server.ts" -Force
    Write-Host "  ✓ Moved: bot-server.ts → server/" -ForegroundColor Green
    
    # Update package.json
    $pkg = Get-Content "package.json" -Raw
    $pkg = $pkg -replace '"bot": "tsx src/bot-server.ts"', '"bot": "tsx server/bot-server.ts"'
    Set-Content "package.json" $pkg
    Write-Host "  ✓ Updated: package.json bot script" -ForegroundColor Green
}

# ============================================
# 7. Merge Constants
# ============================================
Write-Host "`n📦 Step 7: Handling constants..." -ForegroundColor Yellow

if (Test-Path "src/constants.ts") {
    # Check if constants/index.ts exists
    if (Test-Path "src/constants/index.ts") {
        # Append content
        $content = Get-Content "src/constants.ts" -Raw
        Add-Content "src/constants/index.ts" "`n// Merged from constants.ts`n$content"
        Remove-Item "src/constants.ts" -Force
        Write-Host "  ✓ Merged: constants.ts into constants/index.ts" -ForegroundColor Green
    }
    else {
        Move-Item -Path "src/constants.ts" -Destination "src/constants/index.ts" -Force
        Write-Host "  ✓ Moved: constants.ts → constants/index.ts" -ForegroundColor Green
    }
}

# ============================================
# DONE
# ============================================
Write-Host "`n✅ Structure Improvement Complete!" -ForegroundColor Cyan
Write-Host "⚠️  Run 'npx tsc --noEmit' to check for import errors" -ForegroundColor Yellow
Write-Host "⚠️  Fix any broken imports in affected files" -ForegroundColor Yellow
