import os
import sys

# Layer 2: The Analyst
# Tool: Montreal Forced Aligner (MFA)
# Purpose: Prepare data for MFA to align Text with Audio -> Phoneme Timestamps.

class PhonemeAnalyst:
    def __init__(self, output_dir="mfa_workspace"):
        self.output_dir = output_dir
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

    def prepare_corpus(self, audio_path, transcript_text):
        """
        MFA requires a specific folder structure:
        - speaker_id/
          - recording1.wav
          - recording1.lab (contains text)
        """
        filename = os.path.basename(audio_path)
        name, _ = os.path.splitext(filename)
        
        # In a real app, 'speaker_1' would be dynamic
        speaker_dir = os.path.join(self.output_dir, "speaker_1")
        if not os.path.exists(speaker_dir):
            os.makedirs(speaker_dir)
            
        # 1. Copy/Link Audio (Symlink is faster)
        dest_audio = os.path.join(speaker_dir, filename)
        if not os.path.exists(dest_audio):
            # For prototype, we might just assume user copies it or we use shutil
            # Using copy for safety
            import shutil
            shutil.copy2(audio_path, dest_audio)
            
        # 2. Create Transcription File (.lab or .txt)
        lab_path = os.path.join(speaker_dir, f"{name}.lab")
        with open(lab_path, 'w', encoding='utf-8') as f:
            f.write(transcript_text)
            
        print(f"Prepared MFA corpus in {speaker_dir}")
        return speaker_dir

    def run_alignment(self, dictionary_path="arabic_dictionary.dict", acoustic_model_path="arabic.zip"):
        """
        Wrapper to call 'mfa align' command line tool.
        Requires MFA to be installed in the system/conda env.
        """
        corpus_dir = os.path.join(self.output_dir, "speaker_1")
        output_textgrids = os.path.join(self.output_dir, "output_grids")
        
        cmd = f"mfa align {corpus_dir} {dictionary_path} {acoustic_model_path} {output_textgrids} --clean"
        
        print("\n--- MFA Command (Manual Run Required) ---")
        print(cmd)
        print("-----------------------------------------")
        
        # os.system(cmd) # Commented out for safety in prototype

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python analyst_mfa.py <audio_file> \"<transcript_text>\"")
        sys.exit(1)

    audio = sys.argv[1]
    text = sys.argv[2]
    
    analyst = PhonemeAnalyst()
    analyst.prepare_corpus(audio, text)
    analyst.run_alignment()
