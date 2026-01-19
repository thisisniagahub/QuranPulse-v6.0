import whisper
import torch
from typing import Optional, Union, List


class QuranTranscriber:
    def __init__(self, model_size: str = "small", device: str = None):
        """Initialize the Quran transcriber with Whisper model.
        
        Args:
            model_size: Size of the whisper model (tiny, base, small, medium, large)
            device: Device to run on ('cuda' or 'cpu'). Auto-detects if None.
        """
        if device is None:
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
        else:
            self.device = device
            
        print(f"🚀 Al-Musami: Loading Whisper model '{model_size}' on {self.device}...")
        self.model = whisper.load_model(model_size, device=self.device)
    
    def transcribe(
        self, 
        audio_path: str, 
        beam_size: int = 5,
        patience: float = 1.0,
        temperature: Union[float, List[float]] = [0.0, 0.2, 0.4]
    ) -> str:
        """Transcribe audio file and return the transcribed text.
        
        Args:
            audio_path: Path to the audio file
            beam_size: Number of beams for beam search (higher = more accurate, slower)
            patience: Beam search patience factor
            temperature: Sampling temperature (list for fallback)
            
        Returns:
            Transcribed text as string
        """
        # Load audio file
        # The transcribe method handles loading internally, but we pass options for robustness
        result = self.model.transcribe(
            audio_path,
            beam_size=beam_size,
            patience=patience,
            temperature=temperature,
            language='ar', # Force Arabic
            suppress_tokens=None, # Allow all tokens (important for Quranic diacritics)
            fp16=(self.device == "cuda") # Use fp16 only if on GPU
        )
        
        return result['text'].strip()