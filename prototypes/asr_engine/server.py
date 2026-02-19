from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import json
import uuid

# Import our Engines
from scribe_whisper import QuranScribe
from scientist_acoustics import AcousticScientist
from judge_rules import TajweedJudge

app = FastAPI(title="QuranPulse ASR Forensic Engine")

# CORS - Allow Frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In prod, specify ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Engines (Loaded on Startup)
print("Initializing Engines...")
scribe = QuranScribe() # This will take time to load model
scientist = AcousticScientist()
judge = TajweedJudge()
print("Engines Ready.")

TEMP_DIR = "temp_uploads"
if not os.path.exists(TEMP_DIR):
    os.makedirs(TEMP_DIR)

@app.get("/")
def health_check():
    return {"status": "active", "model": "IJyad/whisper-large-v3-Tarteel"}

@app.post("/analyze")
async def analyze_recitation(file: UploadFile = File(...), ayah_index: int = 1):
    # 1. Save uploaded file
    file_id = str(uuid.uuid4())
    file_ext = file.filename.split('.')[-1]
    temp_path = os.path.join(TEMP_DIR, f"{file_id}.{file_ext}")
    
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        print(f"Processing file: {temp_path}")

        # 2. Run Layer 1: Scribe (ASR)
        scribe_result = scribe.transcribe(temp_path)
        transcription_text = scribe_result.get('text', '') if isinstance(scribe_result, dict) else str(scribe_result)
        timestamps = scribe_result.get('chunks', []) if isinstance(scribe_result, dict) else []

        # 3. Run Layer 2: Scientist (Acoustics)
        acoustics = scientist.analyze(temp_path)
        
        # 4. Run Layer 3: Analyst (MFA)
        # Skipped in prototype server - using Mock/Placeholder for phoneme timings if needed
        phonemes = [] 

        # 5. Run Layer 4: Judge (Rules)
        forensic_report = {
            **acoustics,
            "phonemes": phonemes,
            "timestamps": timestamps
        }
        
        verdict = judge.evaluate(ayah_index, transcription_text, forensic_report)

        return {
            "transcription": transcription_text,
            "forensics": acoustics,
            "verdict": verdict,
            "meta": {
                "audio_id": file_id,
                "ayah_requested": ayah_index
            }
        }

    except Exception as e:
        print(f"Error processing request: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        # Cleanup
        if os.path.exists(temp_path):
            os.remove(temp_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
