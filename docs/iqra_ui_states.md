# Iqra UI State Definitions

The visual language for the "Mission Control" HUD during an Iqra session.

## 1. Visual States

### ⚪ Idle (Waiting)
* **Mic Icon:** Pulsing slowly (White/Cyan).
* **Text:** Normal black/white.
* **Status Text:** "Sedia..."

### 🔴 Listening (Recording)
* **Mic Icon:** Expanded active state (Red).
* **Background:** Subtle particle effect or waveform reacting to volume.
* **Status Text:** "Mendengar..."

### 🟡 Processing (Thinking)
* **Mic Icon:** Spinning loader.
* **Text:** Slight shimmer effect.
* **Status Text:** "Menyemak..."

### 🟢 Result: Correct
* **Mic Icon:** Checkmark.
* **Text:** Glows Neon Green.
* **Effect:** Confetti or "Combo" counter increment.
* **Sound:** *Ding*

### 🟠 Result: Retry
* **Mic Icon:** Refresh/Loop icon.
* **Text:** Shakes left-right (Orange).
* **Effect:** "Try Again" tooltip appears.
* **Sound:** *Boop*

## 2. Navigation States
* **Locked Page:** Padlock icon overlaid. Greyscale thumbnail.
* **Unlocked Page:** Full color.
* **Mastered Page:** Gold badge/Star overlaid.
