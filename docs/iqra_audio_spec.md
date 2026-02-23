# 🔊 Iqra Digital — Audio Specification

> **Last Updated**: 21 Feb 2026
> **Status**: Active
> **Module**: Iqra Digital

---

Technical requirements for the "Ears" of the system.

## 1. Input Requirements
* **Sample Rate:** 16kHz (Standard for Whisper/Speech APIs).
* **Channels:** Mono (1 channel).
* **Format:** WAV or WebM (Opus).
* **Bitrate:** Minimum 32kbps.

## 2. Voice Activity Detection (VAD)
* **Silence Threshold:** -45dB.
* **Start Window:** Start recording after 200ms of energy > threshold.
* **Stop Window:** Stop recording after 1200ms of silence (Auto-submit).
* **Max Duration:** 5 seconds per segment (Iqra is short).

## 3. Noise Handling
* **Scenario:** Kids screaming, fan noise, TV in background.
* **Strategy:**
    1. **Frontend:** Low-pass filter to remove excessive high-freq noise? (Maybe too heavy).
    2. **Simple Check:** If RMS < 0.01 (too quiet), prompt "Sila cakap kuat sedikit."
    3. **Cancellation:** Rely on browser/OS standard noise suppression (`echoCancellation: true`, `noiseSuppression: true` constraints).

## 4. Latency Budget
* **Capture:** 0.5s (Chunking).
* **Network:** 0.3s (Edge Function).
* **Inference:** 0.5s (Groq/FastAPI).
* **Total RT:** ~1.3s (Acceptable for educational app).

