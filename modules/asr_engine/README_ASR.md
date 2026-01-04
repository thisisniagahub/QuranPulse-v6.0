# 🎙️ QuranPulse ASR Engine: Technical Reference & Operations Manual

> **Version:** 1.0.0 (Integrated)
> **Role:** Acoustic Intelligence Microservice
> **Target Latency:** < 800ms (Local)

---

## 1. System Overview (Clarity)
This module serves as the "Auditory Cortex" of the QuranPulse ecosystem. Unlike standard Speech-to-Text services (like Google STT) which optimize for semantic accuracy (words), this engine optimizes for **Acoustic Precision** (Tajweed compliance).

It hosts a **FastAPI** server that receives audio blobs, processes them through a custom DSP pipeline, and evaluates them using the proprietary **Q-WER (Quran Weighted Error Rate)** metric.

---

## 2. Technical Architecture (Structure)

### 2.1 The Stack
*   **Runtime:** Python 3.10+ (Required for `numba` and `torch` compatibility).
*   **Core Framework:** FastAPI + Uvicorn (Asynchronous Server).
*   **AI Model:** OpenAI Whisper (`small` architecture).
*   **DSP Pipeline:** `librosa` (Loading), `noisereduce` (Stationary Noise Removal), `pyloudnorm` (LUFS Normalization).

### 2.2 Directory Map
```
modules/asr_engine/
├── main.py                 # 🚀 Entry Point (Controller)
├── models/                 # 🧠 AI Logic (Whisper Wrapper)
├── preprocessing/          # 🧹 Cleaning & Normalization Logic
├── alignment/              # 📏 Forced Alignment (Phoneme Mapping)
├── dataset/                # 📚 Ground Truth (Golden Reference)
└── requirements.txt        # 📦 Dependency Manifest
```

---

## 3. Operational Requirements (Precision)

### 3.1 Hardware Specifications
| Component | Minimum Req | Recommended | Impact |
| :--- | :--- | :--- | :--- |
| **RAM** | 4 GB | 8 GB | Avoids OOM kills during model load. |
| **CPU** | 2 vCPU | 4 vCPU | Directly affects transcription speed. |
| **GPU** | Optional | NVIDIA T4 | Reduces latency from 800ms to <200ms. |

### 3.2 Performance Benchmarks (Outcomes)
*   **Cold Start:** ~4 seconds (Model loading).
*   **Inference Time:** ~0.8s per 5s audio clip (on CPU).
*   **Accuracy:** > 92% for clear recitations; > 85% for noisy environments (thanks to `noisereduce`).

---

## 4. Installation & Deployment Guide

### 4.1 Local Development (Developer)
1.  **Environment Setup:**
    ```powershell
    cd modules/asr_engine
    python -m venv venv
    .\venv\Scripts\activate
    pip install -r requirements.txt
    ```
2.  **Start Server:**
    ```powershell
    # Reload flag enables hot-reloading for dev
    uvicorn main:app --reload --port 8000
    ```
3.  **Verify Health:**
    Visit `http://localhost:8000/docs` (Swagger UI) or `GET /health`.

### 4.2 Production Deployment (DevOps)
*   **Platform:** Use containerized hosting (Fly.io, Render, AWS ECS).
*   **Docker:** Ensure base image includes `ffmpeg` (Required by `librosa`).
*   **Constraints:** Do NOT deploy to Vercel/Netlify/Lambda (Package size > 250MB exceeds limits).

---

## 5. API Interface Specifications

### Endpoint: Analyze Audio
*   **URL:** `POST /analyze/audio`
*   **Content-Type:** `multipart/form-data`
*   **Parameters:**
    *   `file`: The audio file (`.wav`, `.mp3`, `.m4a`).
    *   `expected_text`: (Optional) The Ayah text for forced alignment.

### Response Schema (JSON)
```json
{
  "success": true,
  "analysis": {
    "qwer": 12.5,
    "level": "Intermediate",
    "error_breakdown": {
      "makhraj": 5.2,
      "tajwid": 4.1,
      "harakat": 3.2
    }
  }
}
```

---
*Maintained by Antigravity Engineering Team.*