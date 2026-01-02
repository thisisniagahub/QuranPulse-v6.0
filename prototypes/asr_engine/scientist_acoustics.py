import parselmouth
from parselmouth.praat import call
import numpy as np
import sys
import os

# Layer 3: The Scientist
# Tools: Parselmouth (Praat)
# Purpose: Extract Pitch (F0) and Formants (F1, F2) for Makhraj analysis.

class AcousticScientist:
    def __init__(self):
        pass

    def analyze(self, audio_path):
        if not os.path.exists(audio_path):
            return {"error": "File not found"}

        print(f"Analyzing acoustics for {audio_path}...")
        
        sound = parselmouth.Sound(audio_path)
        
        # 1. Pitch Analysis (F0)
        pitch = sound.to_pitch()
        pitch_values = pitch.selected_array['frequency']
        # Filter 0 values (unvoiced)
        pitch_values = pitch_values[pitch_values != 0]
        
        avg_pitch = np.mean(pitch_values) if len(pitch_values) > 0 else 0
        
        # 2. Formant Analysis (F1, F2, F3) for Vowel Quality / Heavy Letters
        formant = sound.to_formant_burg(max_number_of_formants=5)
        
        # Sample formants at mid-point
        mid_time = sound.get_total_duration() / 2
        f1 = formant.get_value_at_time(1, mid_time)
        f2 = formant.get_value_at_time(2, mid_time)
        
        # 3. Intensity (Loudness) for Hams vs Jahr
        intensity = sound.to_intensity()
        max_intensity = call(intensity, "Get maximum", 0, 0, "Parabolic")

        result = {
            "duration": sound.get_total_duration(),
            "pitch": {
                "average_hz": float(avg_pitch),
                "track": pitch_values.tolist()  # For graphing
            },
            "formants_midpoint": {
                "f1_hz": f1, # Tongue Height
                "f2_hz": f2  # Tongue Backness (Important for Isti'la/Heavy letters)
            },
            "max_intensity_db": max_intensity
        }
        
        return result

    def get_maqam_curve(self, pitch_track):
        # Placeholder for Maqam matching logic
        # Would compare normalized pitch curve against a database of Maqam templates
        return "Unknown Maqam"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scientist_acoustics.py <audio_file>")
        sys.exit(1)

    file_path = sys.argv[1]
    scientist = AcousticScientist()
    data = scientist.analyze(file_path)
    
    print("\n--- Acoustic Analysis ---")
    print(f"Duration: {data['duration']:.2f}s")
    print(f"Avg Pitch: {data['pitch']['average_hz']:.2f} Hz")
    print(f"Formant F1: {data['formants_midpoint']['f1_hz']:.2f} Hz")
    print(f"Formant F2: {data['formants_midpoint']['f2_hz']:.2f} Hz ({'Heavy/Back' if data['formants_midpoint']['f2_hz'] and data['formants_midpoint']['f2_hz'] < 1500 else 'Light/Front'})")
    print("-------------------------")
