# 📂 Current Project Structure Map (Before Reorganization)

Generated at: 2025-12-06
Status: **Refactored & Modularized** (Client App V6.0)

This diagram shows the *actual* current location of files, highlighting the inconsistencies we plan to fix.

```text
src/
├── components/                  # [SHARED]
│   ├── Layout.tsx               # (Main App Shell)
│   ├── ErrorBoundary.tsx
│   └── (Global UI Elements)
│
├── modules/                     # [FEATURES]
│   ├── dashboard/               # (Refactored & Modularized)
│   │   ├── components/          # [NEW]
│   │   │   ├── BentoCard.tsx
│   │   │   ├── HeroHeader.tsx
│   │   │   ├── PrayerTimesStrip.tsx
│   │   │   └── ContinueReadingCard.tsx
│   │   └── index.tsx            # (Main Entry)
│   │
│   ├── quran/                   # (Premium Redesign)
│   │   ├── components/          # [NEW]
│   │   │   ├── QuantumSearchBar.tsx
│   │   │   ├── HoloSurahCard.tsx
│   │   │   ├── NeuroJuzGrid.tsx
│   │   │   └── ImmersiveControls.tsx
│   │   ├── QuranList.tsx
│   │   └── QuranReader.tsx
│   │
│   ├── profile/                 # (Gamified & 3D)
│   │   ├── components/          # [NEW]
│   │   │   ├── ProfileHead.tsx  # (HolographicID)
│   │   │   └── CyberBadges.tsx
│   │   └── Profile.tsx
│   │
│   ├── iqra/                    # (Digital Education)
│   │   ├── IqraVoiceCoach.tsx   # [NEW] (Real-time AI Coach)
│   │   ├── IqraDigitalReader.tsx
│   │   └── index.tsx
│   │
│   ├── smart-deen/              # (Sub-components)
│   ├── ibadah/                  # (Sub-components)
│   └── souq/                    # (Sub-components)

│   ├── Iqra.module.css
│   ├── LandingPage.module.css
│   ├── LandingPage.tsx          # ⚠️ FLAT FILE (To Move)
│   ├── MediaStudio.tsx
│   ├── PrayerTimes.tsx          # ⚠️ FLAT FILE (To Move)
│   ├── Profile.tsx
│   ├── SmartDeen.tsx
│   └── Souq.tsx
│
├── hooks/                       # [NEW]
│   └── useAudioRecorder.ts      # (Web Speech API Wrapper)
│
├── services/                    # [LOGIC]
│   ├── adminService.ts
│   ├── aiService.ts
│   ├── apiClient.ts
│   ├── googleSheetService.ts
│   ├── prayerService.ts
│   ├── quranService.ts
│   ├── ttsService.ts
│   ├── verificationService.ts
│   └── whatsappService.ts
│
└── App.tsx                      # (Router)
```

### 🔍 Key Issues Identified:
1.  **Split Admin Code:** `Admin.tsx` (Legacy) is in `modules/`, but `AdminDashboard.tsx` (Active) is in `components/admin/`.
2.  **Orphaned Components:** `LandingPage.tsx` is a flat file, but its components are in `components/landing/`.
3.  **Misplaced Widgets:** `QiblaCompass.tsx` and `PrayerTimes.tsx` are separated from `SmartDeen`.
4.  **Inconsistent Nesting:** Some modules have folders, others are just flat files.

### ✅ Targeted Structure (After Reorg):
All code related to a feature will be grouped into `src/modules/<feature_name>/`.
