# QuranPulse v6.0 - Project Restructure Script
# Run from project root: h:\ANTIGRAVITY\QuranPulse-v6.0

$ErrorActionPreference = "Continue"
Write-Host "🚀 Starting QuranPulse v6.0 Restructure..." -ForegroundColor Cyan

# ============================================
# PHASE 1: Create New Directories
# ============================================
Write-Host "`n📁 Phase 1: Creating directories..." -ForegroundColor Yellow

$dirs = @(
    "assets/images/misc",
    "assets/logos", 
    "content-data/iqra",
    "_archive/prototypes",
    "_archive/old-modules"
)

foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    Write-Host "  ✓ Created: $dir" -ForegroundColor Green
}

# ============================================
# PHASE 2: Move Image Files to assets/
# ============================================
Write-Host "`n🖼️ Phase 2: Moving image files..." -ForegroundColor Yellow

# Move misc JPGs
$jpgFiles = Get-ChildItem -Path "." -Filter "*.jpg" -File -ErrorAction SilentlyContinue
foreach ($f in $jpgFiles) {
    Move-Item -Path $f.FullName -Destination "assets/images/misc/" -Force
    Write-Host "  ✓ Moved: $($f.Name)" -ForegroundColor Green
}

# Move misc PNGs (except important logos)
$pngToMove = @(
    "Copy_of_Copy_of_Pulse (1).png",
    "Copy_of_Copy_of_Pulse.png",
    "download (1).png",
    "download.png",
    "client_debug.png",
    "my-durves-image.png"
)
foreach ($f in $pngToMove) {
    if (Test-Path $f) {
        Move-Item -Path $f -Destination "assets/images/misc/" -Force
        Write-Host "  ✓ Moved: $f" -ForegroundColor Green
    }
}

# Move logos to assets/logos
$logos = @(
    "Font-Logo-QP.svg",
    "Kufi-QP-Logo.png",
    "LOGO-PULSE-KUFI.png",
    "PULSE-LOGO-KUFI.png",
    "Copy_of_Copy_of_Pulse (1).svg",
    "Copy_of_Copy_of_Pulse.svg",
    "HOME-ICON.png",
    "UstazAI-Icon.png",
    "WIREFRAME-CONCEPT-1.png"
)
foreach ($f in $logos) {
    if (Test-Path $f) {
        Move-Item -Path $f -Destination "assets/logos/" -Force
        Write-Host "  ✓ Moved logo: $f" -ForegroundColor Green
    }
}

# Move SVG vector
if (Test-Path "my-durves-vector.svg") {
    Move-Item -Path "my-durves-vector.svg" -Destination "assets/images/misc/" -Force
    Write-Host "  ✓ Moved: my-durves-vector.svg" -ForegroundColor Green
}

# ============================================
# PHASE 3: Move Data Files to content-data/
# ============================================
Write-Host "`n📊 Phase 3: Moving data files..." -ForegroundColor Yellow

$dataFiles = Get-ChildItem -Path "." -Filter "extracted_iqra-*.json" -File -ErrorAction SilentlyContinue
foreach ($f in $dataFiles) {
    Move-Item -Path $f.FullName -Destination "content-data/iqra/" -Force
    Write-Host "  ✓ Moved: $($f.Name)" -ForegroundColor Green
}

if (Test-Path "iqra-2-new.json") {
    Move-Item -Path "iqra-2-new.json" -Destination "content-data/iqra/" -Force
    Write-Host "  ✓ Moved: iqra-2-new.json" -ForegroundColor Green
}

if (Test-Path "video_metadata.json") {
    Move-Item -Path "video_metadata.json" -Destination "content-data/" -Force
    Write-Host "  ✓ Moved: video_metadata.json" -ForegroundColor Green
}

# ============================================
# PHASE 4: Delete Temp/Debug Files
# ============================================
Write-Host "`n🗑️ Phase 4: Cleaning temp files..." -ForegroundColor Yellow

$tempFiles = @(
    "build_error.log",
    "build_log.txt",
    "client_snapshot.txt",
    "startup_debug.txt",
    "git_status.txt",
    "myhadith_debug_dump.txt",
    "help.txt",
    "metadata.json",
    "myhadith_bukhari_parsed.json",
    "myhadith_bukhari_test.json"
)

foreach ($f in $tempFiles) {
    if (Test-Path $f) {
        Remove-Item -Path $f -Force
        Write-Host "  ✓ Deleted: $f" -ForegroundColor Red
    }
}

# ============================================
# PHASE 5: Archive Folders
# ============================================
Write-Host "`n📦 Phase 5: Archiving folders..." -ForegroundColor Yellow

# Archive prototypes
if ((Test-Path "prototypes") -and (Get-ChildItem "prototypes" -ErrorAction SilentlyContinue)) {
    Move-Item -Path "prototypes/*" -Destination "_archive/prototypes/" -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ Archived: prototypes/" -ForegroundColor Green
}

# Archive root modules (keep only if it's ASR engine)
if ((Test-Path "modules") -and (Get-ChildItem "modules" -ErrorAction SilentlyContinue)) {
    Move-Item -Path "modules/*" -Destination "_archive/old-modules/" -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ Archived: modules/" -ForegroundColor Green
}

# ============================================
# PHASE 6: Consolidate Documentation
# ============================================
Write-Host "`n📚 Phase 6: Consolidating docs..." -ForegroundColor Yellow

# Rename DOCS_VAULT to docs (backup old docs first)
if (Test-Path "docs") {
    if (Test-Path "docs_old") { Remove-Item -Recurse -Force "docs_old" }
    Rename-Item -Path "docs" -NewName "docs_old" -Force
    Write-Host "  ✓ Backed up: docs -> docs_old" -ForegroundColor Green
}

if (Test-Path "DOCS_VAULT") {
    Rename-Item -Path "DOCS_VAULT" -NewName "docs" -Force
    Write-Host "  ✓ Renamed: DOCS_VAULT -> docs" -ForegroundColor Green
}

# ============================================
# PHASE 7: Move Python Scripts from Root
# ============================================
Write-Host "`n🐍 Phase 7: Moving Python scripts..." -ForegroundColor Yellow

$pyScripts = Get-ChildItem -Path "." -Filter "*.py" -File -ErrorAction SilentlyContinue
foreach ($f in $pyScripts) {
    Move-Item -Path $f.FullName -Destination "scripts/" -Force
    Write-Host "  ✓ Moved: $($f.Name)" -ForegroundColor Green
}

# ============================================
# DONE
# ============================================
Write-Host "`n✅ Restructure Complete!" -ForegroundColor Cyan
Write-Host "Run 'npm run dev' to verify everything works." -ForegroundColor White
