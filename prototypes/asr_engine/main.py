from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from tempfile import NamedTemporaryFile
from service import analyze_audio

app = FastAPI(title="QuranPulse ASR Engine", version="1.0.0")

# Benarkan Frontend (Localhost) bercakap dengan Backend ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "active", "brain": "online"}

@app.post("/analyze")
async def analyze_recitation(
    file: UploadFile = File(...), 
    expected_text: str = ""
):
    try:
        # 1. Simpan audio sementara
        temp_filename = f"temp_{file.filename}"
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        print(f"🎤 Menerima audio: {temp_filename} | Target: {expected_text}")

        # 2. Hantar ke 'Otak' (Service) untuk analisis
        result = await analyze_audio(temp_filename, expected_text)

        # 3. Bersihkan fail temp
        os.remove(temp_filename)

        return result

    except Exception as e:
        print(f"🔥 Error: {str(e)}")
        return {"status": "error", "message": str(e), "score": 0}

if __name__ == "__main__":
    import uvicorn
    # Jalankan server di port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
