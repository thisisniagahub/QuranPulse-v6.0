# 📂 Current Project Structure Map (Before Reorganization)

Generated at: 2025-12-06
Status: **Mixed/Flat Structure** (Needs Cleanup)

This diagram shows the *actual* current location of files, highlighting the inconsistencies we plan to fix.

```text
src/
├── components/                  # [SHARED & MIXED]
│   ├── admin/                   # ⚠️ SHOULD BE IN modules/admin
│   │   └── AdminDashboard.tsx   # (Active Implementation)
│   ├── dashboard/               # ⚠️ SHOULD BE IN modules/dashboard
│   │   ├── CommunityPulse.tsx
│   │   ├── DailyDeeds.tsx
│   │   ├── LearningWidget.tsx
│   │   ├── PrayerCard.tsx
│   │   └── QuickActions.tsx
│   ├── landing/                 # ⚠️ SHOULD BE IN modules/landing
│   │   ├── AdvancedTools.tsx
│   │   ├── BackgroundElements.tsx
│   │   ├── BusinessSection.tsx
│   │   ├── StoreBadges.tsx
│   │   ├── TiltCard.tsx
│   │   └── WhatsAppButton.tsx
│   ├── quran/                   # ⚠️ SHOULD BE IN modules/quran
│   │   └── (Components)
│   ├── AnimatedLogo.tsx
│   ├── ErrorBoundary.tsx
│   ├── Layout.tsx
│   ├── MiniPlayer.tsx
│   ├── NavLottieIcon.tsx
│   ├── PulseLoader.tsx
│   └── QiblaCompass.tsx         # ⚠️ SHOULD BE IN modules/smart-deen
│
├── modules/                     # [FEATURES]
│   ├── dashboard/               # (Sub-components)
│   ├── iqra/                    # (Sub-components)
│   ├── quran/                   # (Sub-components)
│   ├── smart-deen/              # (Sub-components)
│   ├── social/                  # (Sub-components)
│   ├── ADMIN-DASHBOARD.md
│   ├── Admin.tsx                # ❌ LEGACY/UNUSED (To Delete)
│   ├── Auth.tsx
│   ├── Community.tsx
│   ├── Dashboard.tsx            # (Main Entry)
│   ├── Ibadah.module.css
│   ├── Ibadah.tsx
│   ├── Iqra.module.css
│   ├── LandingPage.module.css
│   ├── LandingPage.tsx          # ⚠️ FLAT FILE (To Move)
│   ├── MediaStudio.tsx
│   ├── PrayerTimes.tsx          # ⚠️ FLAT FILE (To Move)
│   ├── Profile.tsx
│   ├── SmartDeen.tsx
│   └── Souq.tsx
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
