import sys
import os

# Set paths
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    print("🚀 Testing ASR Engine Components...")
    
    from models.transcriber import QuranTranscriber
    from preprocessing.noise_robustness import AudioCleaner
    import librosa
    
    print("✅ Successfully imported modules.")
    
    # Try to initialize transcriber (This will fail if whisper is not installed)
    print("📦 Initializing Whisper Model (Small)...")
    transcriber = QuranTranscriber()
    print("✅ Model initialized successfully.")
    
    # Try to load audio
    audio_path = "test_audio.wav"
    if os.path.exists(audio_path):
        print(f"🎵 Loading audio: {audio_path}")
        y, sr = librosa.load(audio_path, sr=22050)
        print(f"✅ Audio loaded. Sample rate: {sr}, Duration: {len(y)/sr:.2f}s")
    else:
        print("⚠️ test_audio.wav not found, skipping audio load test.")
        
    print("\n✨ SANITY CHECK PASSED!")
    print("Your ASR Engine is healthy and ready to serve.")

except Exception as e:
    print(f"\n❌ SANITY CHECK FAILED!")
    print(f"Error: {str(e)}")
    sys.exit(1)
