Write-Host "🚀 Sedang menghidupkan Enjin AI QuranPulse..." -ForegroundColor Cyan

# 1. Masuk ke folder
cd prototypes/asr_engine

# 2. Semak jika Python wujud
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Error "Python tidak dijumpai! Sila install Python dulu."
    exit
}

# 3. Install Dependencies (Jika perlu)
Write-Host "📦 Memasang 'spare part' (Librosa, FastAPI)..." -ForegroundColor Yellow
pip install -r requirements.txt

# 4. Jalankan Server
Write-Host "🧠 Menghidupkan Otak pada Port 8000..." -ForegroundColor Green
python main.py