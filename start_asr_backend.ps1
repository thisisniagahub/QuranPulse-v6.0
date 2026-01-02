# Start QuranPulse ASR System
Write-Host "Starting QuranPulse ASR Forensic Engine..." -ForegroundColor Cyan

# Check if Python is available
if (-not (Get-Command "python" -ErrorAction SilentlyContinue)) {
    Write-Error "Python not found! Please install Python 3.10+."
    exit 1
}

# Navigate to Prototypes
Set-Location "prototypes\asr_engine"

# Install Dependencies (Optional check)
# pip install -r requirements.txt

# Start Server
Write-Host "Launching FastAPI Server on http://localhost:8000..." -ForegroundColor Green
python server.py
