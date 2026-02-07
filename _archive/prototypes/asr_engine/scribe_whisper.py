import torch
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline
import librosa
import sys
import os

# Layer 1: The Scribe
# Model: IJyad/whisper-large-v3-Tarteel

class QuranScribe:
    def __init__(self, model_id="IJyad/whisper-large-v3-Tarteel"):
        print(f"Loading '{model_id}'...")
        
        self.device = "cuda:0" if torch.cuda.is_available() else "cpu"
        self.torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32

        try:
            self.model = AutoModelForSpeechSeq2Seq.from_pretrained(
                model_id, 
                torch_dtype=self.torch_dtype, 
                low_cpu_mem_usage=True, 
                use_safetensors=True
            )
            self.model.to(self.device)

            self.processor = AutoProcessor.from_pretrained(model_id)

            self.pipe = pipeline(
                "automatic-speech-recognition",
                model=self.model,
                tokenizer=self.processor.tokenizer,
                feature_extractor=self.processor.feature_extractor,
                max_new_tokens=128,
                chunk_length_s=30,
                batch_size=16,
                return_timestamps=True,
                torch_dtype=self.torch_dtype,
                device=self.device,
            )
            print(f"Model loaded on {self.device}")
        except Exception as e:
            print(f"Error loading model: {e}")
            sys.exit(1)

    def transcribe(self, audio_path):
        if not os.path.exists(audio_path):
            return {"error": "File not found"}
        
        print(f"Transcribing {audio_path}...")
        
        # Helper to load audio if not handled by pipeline directly
        # audio, rate = librosa.load(audio_path, sr=16000)
        
        try:
            result = self.pipe(audio_path, generate_kwargs={"language": "arabic"})
            return result
        except Exception as e:
            return {"error": str(e)}

if __name__ == "__main__":
    # Test execution
    if len(sys.argv) < 2:
        print("Usage: python scribe_whisper.py <path_to_audio_file>")
        # Create a dummy test if no args
        print("No audio file provided. Create a 'test.wav' to test.")
        sys.exit(1)
        
    audio_file = sys.argv[1]
    scribe = QuranScribe()
    transcription = scribe.transcribe(audio_file)
    
    print("\n--- Transcription Result ---")
    print(transcription)
    print("----------------------------\n")
