import librosa
import numpy as np
import asyncio

# --- HELPER FUNCTIONS ---

def detect_silence_count(y, top_db=20):
    """Mengira berapa kali berhenti (tanda mengeja)."""
    intervals = librosa.effects.split(y, top_db=top_db)
    return max(0, len(intervals) - 1)

def check_short_vowel_strictness(duration, is_long_vowel):
    """
    Iqra 1 & 2: Pantang larang terbesar ialah memanjangkan yang pendek.
    """
    if not is_long_vowel and duration > 0.45:
        return -30, "Salah: Jangan panjangkan huruf pendek."
    if is_long_vowel and duration < 0.5:
        return -20, "Salah: Huruf Mad mesti panjang (2 harakat)."
    return 0, None

def check_qolqolah(y, sr):
    """
    Iqra 4: Mengesan lantunan tenaga di hujung sebutan.
    (Logic Ringkas: Energy spike selepas main consonant drop)
    """
    # Dapatkan envelope (bentuk tenaga)
    hop_length = 512
    frame_length = 1024
    energy = np.array([
        sum(abs(y[i:i+frame_length]**2))
        for i in range(0, len(y), hop_length)
    ])
    
    # Cari puncak tenaga (peaks)
    peaks = librosa.util.peak_pick(energy, pre_max=3, post_max=3, pre_avg=3, post_avg=5, delta=0.5, wait=10)
    
    # Qolqolah biasanya ada 'double peak' di hujung (Henti -> Lantun)
    # Ini heuristik asas.
    if len(peaks) >= 2:
        return 0, "Qolqolah dikesan."
    return -15, "Kurang lantunan Qolqolah."

def check_silent_letter_trap(duration):
    """
    Iqra 5: Alif Ziyadah. Kalau baca panjang, gagal.
    """
    if duration > 0.5:
        return -40, "Salah: Alif ini tidak boleh dibaca panjang (Ziyadah)."
    return 0, None

# --- MAIN LOGIC ---

async def analyze_audio(file_path: str, expected_text: str):
    """
    Enjin Analisis 'Jiwa Iqra' v2.0
    Sekarang dengan Logik Spesifik Jilid (Context-Aware).
    """
    
    # 1. Muat Audio
    y, sr = librosa.load(file_path, sr=None)
    duration = librosa.get_duration(y=y, sr=sr)
    
    # 2. Analisis Asas (Jahar & Fluency)
    rms = librosa.feature.rms(y=y)
    avg_volume = np.mean(rms)
    pause_count = detect_silence_count(y)
    
    # Skor Mula
    score = 100
    feedback_notes = []
    
    # Semakan Jahar (Wajib semua level)
    if avg_volume < 0.005:
        return {
            "status": "fail",
            "score": 10,
            "feedback": "Suara terlalu perlahan. Sila baca dengan kuat (Jahar)."
        }

    # Penalti Mengeja (Wajib semua level)
    if pause_count > 1:
        score -= (pause_count * 10)
        feedback_notes.append("Jangan mengeja (baca terus).")

    # --- 3. CONTEXT AWARE RULES (The "Teacher's Brain") ---
    
    # Kita perlu tahu Jilid berapa sekarang. 
    # Oleh kerana API semasa cuma terima 'expected_text', kita akan 
    # 'teka' jilid berdasarkan ciri teks atau terima param baru nanti.
    # Untuk sekarang, kita guna heuristik mudah pada teks.
    
    is_mad_asli = any(c in expected_text for c in ['ā', 'ū', 'ī'])
    is_qolqolah_char = any(c in expected_text for c in ['بْ', 'جْ', 'دْ', 'طْ', 'قْ'])
    is_silent_alif = 'ُوْا' in expected_text # Pola umum Iqra 5
    
    # Rule Iqra 1-2 (Asas Pendek)
    if not is_mad_asli and not is_qolqolah_char:
        pen, msg = check_short_vowel_strictness(duration, False)
        if pen < 0:
            score += pen
            feedback_notes.append(msg)
            
    # Rule Iqra 3 (Mad Asli)
    if is_mad_asli:
        pen, msg = check_short_vowel_strictness(duration, True)
        if pen < 0:
            score += pen
            feedback_notes.append(msg)

    # Rule Iqra 4/6 (Qolqolah)
    if is_qolqolah_char:
        pen, msg = check_qolqolah(y, sr)
        if pen < 0:
            score += pen
            feedback_notes.append(msg)
            
    # Rule Iqra 5 (Alif Ziyadah Trap)
    if is_silent_alif:
        pen, msg = check_silent_letter_trap(duration)
        if pen < 0:
            score += pen
            feedback_notes.append(msg)

    # --- FINAL VERDICT ---
    
    score = max(0, min(100, score))
    is_passing = score >= 70
    
    final_feedback = " | ".join(feedback_notes) if feedback_notes else "Bacaan MasyaAllah!"
    
    return {
        "status": "success" if is_passing else "fail",
        "score": score,
        "confidence": score / 100.0,
        "feedback": final_feedback,
        "metrics": {
            "duration": round(duration, 2),
            "pauses": pause_count,
            "volume": round(avg_volume, 4)
        }
    }
