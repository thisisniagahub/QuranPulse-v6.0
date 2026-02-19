# Quran Pulse ASR Engine Prototypes

This directory contains the Python prototypes for the "Hybrid Forensics" AI system.

## Setup

1. **Install Python 3.10+**
2. **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
    *(Note: Use a Virtual Environment)*

3. **Install FFmpeg**: Required for `librosa`/`transformers` audio loading.

## Components

### 1. The Scribe (`scribe_whisper.py`)
Uses `IJyad/whisper-large-v3-Tarteel` to transcribe audio.
- **Usage**: `python scribe_whisper.py path/to/audio.wav`
- **Note**: Will download a ~3GB model on first run. Requires GPU for reasonable speed.

### 2. The Scientist (`scientist_acoustics.py`)
Uses `Parselmouth` (Praat) to extract Pitch (F0) and Formants (F1, F2).
- **Usage**: `python scientist_acoustics.py path/to/audio.wav`
- Used for detecting "Heavy" letters (Isti'la) and Maqam analysis.

### 3. The Analyst (`analyst_mfa.py`)
Prepares data for `Montreal Forced Aligner` (MFA).
- **Usage**: `python analyst_mfa.py path/to/audio.wav "Arabic Text Here"`
- **Note**: You must have MFA installed separately (`conda install -c conda-forge montreal-forced-aligner`).

### 4. The Judge (`judge_rules.py`)
Logic engine to cross-reference extracted data with Tajweed rules.
- **Usage**: `python judge_rules.py` (Runs with mock data)

## Pipeline (`pipeline_forensics.py`)
Runs the full Scribe -> Scientist -> Judge flow.
- **Usage**: `python pipeline_forensics.py path/to/audio.wav`
