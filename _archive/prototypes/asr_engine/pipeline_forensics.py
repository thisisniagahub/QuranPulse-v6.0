import sys
import json
from scribe_whisper import QuranScribe
from scientist_acoustics import AcousticScientist
from judge_rules import TajweedJudge
# Analyst (MFA) requires external CLI, so we skip direct import for this synchronous prototype pipeline
# from analyst_mfa import PhonemeAnalyst

def run_forensic_pipeline(audio_file):
    print("=== STARTING QURAN PULSE FORENSIC ENGINE ===")
    
    # 1. The Scribe (ASR)
    scribe = QuranScribe() # Loads model (slow)
    transcript_result = scribe.transcribe(audio_file)
    transcribed_text = transcript_result.get('text', '') if isinstance(transcript_result, dict) else str(transcript_result)
    print(f"\n[Scribe] Heard: {transcribed_text[:50]}...")
    
    # 2. The Analyst (MFA)
    # Skipped in Python-only prototype (needs CLI)
    # But we would get phoneme timestamps here
    phoneme_data = {} 
    
    # 3. The Scientist (Acoustics)
    scientist = AcousticScientist()
    acoustics = scientist.analyze(audio_file)
    print(f"[Scientist] Acoustics: {json.dumps(acoustics)[:50]}...")
    
    # 4. The Judge (Rules)
    judge = TajweedJudge()
    forensics = {**acoustics, "phonemes": phoneme_data}
    verdict = judge.evaluate(ayah_index=1, transcription=transcribed_text, forensic_report=forensics)
    
    print("\n--- FINAL VERDICT ---")
    print(json.dumps(verdict, indent=2))
    print("============================================")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python pipeline_forensics.py <audio_file>")
        sys.exit(1)
        
    run_forensic_pipeline(sys.argv[1])
