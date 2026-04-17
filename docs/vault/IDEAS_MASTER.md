# 💡 QuranPulse v6.0 - IDEAS MASTER DOCUMENT

> **Total Ideas:** 89
> **Last Updated:** 2026-01-09
> **Legend:** ✅ Implemented | 🔄 In Progress | ⏳ Pending

---

## 🚀 SECTION A: INNOVATION IDEAS (Big Concepts)

### A1. 🕌 Digital Masjid Bridge
**Status:** ⏳ PENDING

**Problem:** Most apps only give "Zone Prayer Times". They don't know specific masjid events like ceramah or kenduri. This info exists but buried in old mosque websites (WordPress/Blogspot).

**Solution:**
- MCP Puppeteer agent scrapes local mosque websites weekly
- Extract "Poster" or "Jadual" from legacy PHP/HTML sites
- Sync to `official_mosques` table in Supabase with "Live Events"

**Tech Stack:**
- MCP Server: `puppeteer` (Web Fetcher)
- Target: Legacy PHP/HTML sites
- Database: Supabase `official_mosques` table

**Files:** None yet
**Value:** "QuranPulse satu-satunya app yang tahu bila masjid taman saya buat kenduri"

---

### A2. 📞 Suara Surau Hotline
**Status:** ⏳ PENDING

**Problem:** Nenek di kampung ada telefon Nokia lama. Dia tak pandai guna Apps. Macam mana dia nak tanya soalan agama?

**Solution:**
1. User dail nombor hotline (Local Number)
2. Audio → Text → MCP Agent → Gemini → Jawapan
3. Text-to-Speech response

**Tech Stack:**
- VoIP: Twilio or custom wrapper
- AI: Ustaz AI + TTS
- ASR: Whisper or similar

**Files:** None yet
**Value:** Total inclusivity untuk warga emas

---

### A3. 📦 Wakaf Node (Offline Box)
**Status:** ⏳ PENDING

**Problem:** Di surau pedalaman, internet perlahan. Nak stream video/audio mustahil.

**Solution:**
1. Raspberry Pi (RM200) as local server
2. Download all content monthly when internet available
3. Jemaah connect to "Wakaf_WiFi"
4. Video/audio load dalam 0.1s dari local

**Tech Stack:**
- Hardware: Raspberry Pi
- MCP: `filesystem` (Local Content Manager)
- Container: Docker

**Files:** None yet
**Value:** Pahala berpanjangan (Infaq Hardware)

---

### A4. 📜 Digital Sanad Chain
**Status:** ⏳ PENDING

**Problem:** Macam mana nak sahkan seseorang itu "Verified Tutor" atau "Hafiz" tanpa sijil kertas?

**Solution:**
1. Guru besar (Verified) tekan "Lulus" pada pelajar
2. Generate hash: `HASH(Guru_ID + Pelajar_ID + Tarikh + Level)`
3. Traceable "Rantaian Sanad" (Web of Trust)

**Tech Stack:**
- Database: Supabase (Recursive queries)
- Concept: Cryptographic signature

**Files:** None yet
**Value:** Tamper-proof certification

---

## 📖 SECTION B: QURAN MODULE

### B1. Quran Reader (Uthmani Script)
**Status:** ✅ IMPLEMENTED

**Description:** Full Quran reader with beautiful Uthmani script rendering. Sub-100ms loading time.

**Files:**
- `src/modules/quran/index.tsx`
- `src/modules/quran/components/QuranReader.tsx`
- `src/modules/quran/components/VerseDisplay.tsx`
- `src/services/quranService.ts`

---

### B2. Zen Mode (Distraction-free Reading)
**Status:** ✅ IMPLEMENTED

**Description:** Clean, focused reading mode without UI distractions.

**Files:**
- `src/modules/quran/components/ZenModeReader.tsx`

---

### B3. Quantum Search (Semantic)
**Status:** ✅ IMPLEMENTED

**Description:** AI-powered semantic search across Quran verses and translations.

**Files:**
- `src/modules/quran/components/QuantumSearch.tsx`
- `src/services/UstazOrchestrator.ts` (handleQuranIntent)

---

### B4. Word-by-Word Transliteration
**Status:** ✅ IMPLEMENTED

**Description:** Hover over any word to see transliteration and meaning.

**Files:**
- `src/services/quranService.ts` (getVersesFromAPI with word data)

---

### B5. Karaoke Mode Audio Sync
**Status:** ✅ IMPLEMENTED

**Description:** Word-by-word highlighting synchronized with audio playback.

**Files:**
- `src/services/quranService.ts` (getChapterAudioWithTimings)
- `src/contexts/AudioPlayerContext.tsx`

---

### B6. Verse Bookmarking
**Status:** ✅ IMPLEMENTED

**Description:** Save favorite verses for quick access.

**Files:**
- `src/services/bookmarkService.ts`

---

### B7. Reading Progress Tracking
**Status:** ✅ IMPLEMENTED

**Description:** Track where you left off in your reading.

**Files:**
- `src/services/readingProgressService.ts`

---

### B8. AR Qibla
**Status:** ⏳ PENDING

**Description:** Augmented Reality Qibla direction finder using camera.

**Files:** None yet (Would require AR library like AR.js)

---

## 🎓 SECTION C: IQRA MODULE

### C1. Levels 1-6 UI
**Status:** ✅ IMPLEMENTED

**Description:** Complete UI for 6 Iqra learning volumes.

**Files:**
- `src/modules/iqra/index.tsx`
- `src/modules/iqra/data/` (All volume data)

---

### C2. Interactive Digital Reader
**Status:** ✅ IMPLEMENTED

**Description:** Touch-based interactive reader for Iqra lessons.

**Files:**
- `src/modules/iqra/components/IqraDigitalReader.tsx`

---

### C3. Game Engine (Gamification)
**Status:** 🔄 IN PROGRESS

**Description:** XP, stars, and rewards for completing lessons.

**Files:**
- `src/modules/iqra/components/IqraGameEngine.tsx`
- `src/contexts/GamificationContext.tsx`

---

### C4. Voice Recording
**Status:** ✅ IMPLEMENTED

**Description:** Record user recitation using Web Speech API.

**Files:**
- `src/modules/iqra/components/IqraVoiceCoach.tsx`
- `src/hooks/useVoiceRecorder.ts`

---

### C5. ASR Tajweed Analysis
**Status:** 🔄 IN PROGRESS

**Description:** AI analysis of recitation for Tajweed errors.

**Files:**
- `src/services/iqraService.ts` (analyzeRecitation)
- `modules/asr_engine/` (Separate Python service)

---

### C6. Q-WER Scoring
**Status:** 🔄 IN PROGRESS

**Description:** Quran Word Error Rate scoring system.

**Files:**
- `src/services/iqraService.ts`

---

### C7. Kafa Dashboard
**Status:** ⏳ PENDING

**Description:** Teacher dashboard for KAFA (Islamic School) administrators.

**Files:** None yet

---

### C8. Leaderboard
**Status:** ⏳ PENDING

**Description:** Competitive leaderboard for Iqra learners.

**Files:** None yet

---

### C9. Voice Fingerprint
**Status:** 🔄 IN PROGRESS

**Description:** Voice profile for personalized feedback.

**Files:**
- `src/services/voiceFingerprint.ts`

---

### C10. Spaced Repetition Algorithm
**Status:** 🔄 IN PROGRESS

**Description:** Smart review scheduling based on learning science.

**Files:**
- `src/services/spacedRepetition.ts`

---

## 🤖 SECTION D: USTAZ AI MODULE

### D1. Chat Interface
**Status:** ✅ IMPLEMENTED

**Description:** Full chat UI with message history and persona avatar.

**Files:**
- `src/modules/smart-deen/SmartDeen.tsx`
- `src/modules/smart-deen/components/AIWidgetRenderer.tsx`

---

### D2. Persona Switching
**Status:** ✅ IMPLEMENTED

**Description:** Switch between different AI personas (Ustaz, Ustazah).

**Files:**
- `src/modules/smart-deen/SmartDeen.tsx`
- `src/data/ustazPersonas.ts`

---

### D3. Gemini Integration
**Status:** ✅ IMPLEMENTED

**Description:** Primary LLM using Google Gemini 2.5 Flash.

**Files:**
- `src/services/ai/GeminiClient.ts`
- `src/services/aiService.ts`

---

### D4. Groq Fallback
**Status:** ✅ IMPLEMENTED

**Description:** Fallback to Groq when Gemini fails.

**Files:**
- `src/services/ai/GroqClient.ts`
- `src/services/aiService.ts`

---

### D5. Circuit Breaker
**Status:** ✅ IMPLEMENTED

**Description:** Prevents API hammering when service is down.

**Files:**
- `src/services/aiService.ts` (CircuitBreaker class)

---

### D6. RAG Pipeline (Vector Search)
**Status:** 🔄 IN PROGRESS

**Description:** Retrieval-Augmented Generation for accurate answers.

**Files:**
- `src/services/staticContentService.ts`
- `supabase/migrations/` (hadith_embeddings table)

---

### D7. Fatwa Guard (Hallucination Check)
**Status:** 🔄 IN PROGRESS

**Description:** Safety layer to prevent AI from giving wrong Islamic rulings.

**Files:**
- `src/services/UstazOrchestrator.ts`

---

### D8. Text-to-Speech Response
**Status:** ⏳ PENDING

**Description:** AI speaks the response aloud.

**Files:**
- `src/services/ai/VoiceService.ts` (Partial)

---

### D9. Verse Context Chat
**Status:** ✅ IMPLEMENTED

**Description:** Ask questions about specific Quran verses.

**Files:**
- `src/services/aiService.ts` (chatWithVerseContext)

---

### D10. Image Analysis
**Status:** ⏳ PENDING

**Description:** Analyze images for halal ingredients, Arabic text, etc.

**Files:**
- `src/services/aiService.ts` (analyzeImage - stub)

---

## 🕌 SECTION E: IBADAH MODULE

### E1. Prayer Times (JAKIM)
**Status:** ✅ IMPLEMENTED

**Description:** Official Malaysian prayer times from JAKIM.

**Files:**
- `src/modules/ibadah/Ibadah.tsx`
- `src/services/prayerService.ts`
- `src/services/UstazOrchestrator.ts` (getWorshipData)

---

### E2. Qibla Compass
**Status:** ✅ IMPLEMENTED

**Description:** Compass pointing to Mecca using device orientation.

**Files:**
- `src/modules/ibadah/Ibadah.tsx`
- `src/hooks/useQibla.ts`

---

### E3. Digital Tasbih
**Status:** ✅ IMPLEMENTED

**Description:** Digital counter for dhikr.

**Files:**
- `src/modules/ibadah/components/DigitalTasbih.tsx`

---

### E4. Masjid Hub
**Status:** 🔄 IN PROGRESS

**Description:** Find nearby mosques with events.

**Files:**
- `src/modules/ibadah/Ibadah.tsx` (Basic UI)

---

### E5. Prayer Streak Tracking
**Status:** ⏳ PENDING

**Description:** Track consecutive days of prayer completion.

**Files:** None yet

---

### E6. Smart Notifications
**Status:** ⏳ PENDING

**Description:** Prayer time reminders with intelligent scheduling.

**Files:** None yet

---

### E7. Location Auto-Detection
**Status:** ✅ IMPLEMENTED

**Description:** Automatic zone detection based on GPS.

**Files:**
- `src/services/geolocationService.ts`

---

## 💰 SECTION F: BARAKAH/INFAQ MODULE

### F1. Wakaf Digital Donation
**Status:** ✅ IMPLEMENTED

**Description:** Donate for digital wakaf initiatives.

**Files:**
- `src/modules/barakah/InfaqPage.tsx`

---

### F2. Sedekah Jumaat
**Status:** ✅ IMPLEMENTED

**Description:** Weekly Friday charity option.

**Files:**
- `src/modules/barakah/InfaqPage.tsx`

---

### F3. XP/Level System
**Status:** 🔄 IN PROGRESS

**Description:** Experience points and levels for engagement.

**Files:**
- `src/contexts/GamificationContext.tsx`

---

### F4. Badges/Achievements
**Status:** ⏳ PENDING

**Description:** Unlock badges for milestones.

**Files:** None yet

---

### F5. Family Leaderboard
**Status:** ⏳ PENDING

**Description:** Compete with family members.

**Files:** None yet

---

### F6. Affiliate/Referral Program
**Status:** ⏳ PENDING

**Description:** Earn rewards for referring users.

**Files:** None yet

---

## 🛒 SECTION G: SOUQ MODULE (Marketplace)

### G1-G4. Marketplace Features
**Status:** ⏳ PENDING (All)

**Features:**
- Product Listing
- Halal Verification
- Merchant Dashboard
- Payment Integration (ToyyibPay partial)

**Files:**
- `src/modules/souq/Souq.tsx` (Skeleton only)
- `src/services/paymentService.ts`

---

## 🕋 SECTION H: UMRAH MODULE

### H1-H4. Umrah Features
**Status:** ⏳ PENDING (All)

**Features:**
- Umrah Dashboard
- Itinerary Planning
- Doa Guide
- Mecca Map

**Files:**
- `src/modules/umrah/UmrahDashboard.tsx` (Skeleton only)

---

## 👥 SECTION I: SOCIAL MODULE

### I1-I4. Social Features
**Status:** ⏳ PENDING (All)

**Features:**
- Moments Feed
- Tadabbur Sharing
- Study Circles (Halaqah)
- Community Posts

**Files:**
- `src/modules/social/MomentsFeed.tsx` (Skeleton only)

---

## 🎬 SECTION J: MEDIA MODULE

### J1. Media Studio
**Status:** ✅ IMPLEMENTED

**Description:** Video and audio content library.

**Files:**
- `src/modules/media/MediaStudio.tsx`

---

### J2. Curated Videos
**Status:** ⏳ PENDING

**Description:** Admin-curated video content.

---

### J3. Poster Generator
**Status:** 🔄 IN PROGRESS

**Description:** Create Islamic posters and graphics.

**Files:**
- `src/modules/admin/components/PosterGenerator.tsx`

---

### J4. Article Library
**Status:** ⏳ PENDING

**Description:** Islamic articles and learning materials.

---

## 🛡️ SECTION K: ADMIN DASHBOARD

### K1. User CRM
**Status:** 🔄 IN PROGRESS

**Description:** View, ban, upgrade users.

**Files:**
- `admin-dashboard/src/app/users/`
- `src/services/adminService.ts`

---

### K2. Content CMS
**Status:** ⏳ PENDING

**Description:** Manage banners, notifications, content.

---

### K3. AI Monitor
**Status:** ⏳ PENDING

**Description:** View chat logs, flag hallucinations.

---

### K4. Finance Dashboard
**Status:** ⏳ PENDING

**Description:** MRR tracking, Infaq ledger.

---

### K5. MCP Agent Control Panel
**Status:** ⏳ PENDING

**Description:** Trigger agents, view status.

---

### K6. Knowledge Base Manager
**Status:** 🔄 IN PROGRESS

**Files:**
- `src/modules/admin/components/KnowledgeBaseManager.tsx`

---

### K7. Poster Generator Tool
**Status:** 🔄 IN PROGRESS

**Files:**
- `src/modules/admin/components/PosterGenerator.tsx`

---

## 🤖 SECTION L: MCP AGENTS

### L1. mcp-worship
**Status:** ✅ IMPLEMENTED
**Function:** Prayer times from JAKIM
**Files:** `supabase/functions/mcp-worship/`

### L2. mcp-quran
**Status:** ✅ IMPLEMENTED
**Function:** Verse search
**Files:** `supabase/functions/mcp-quran/`

### L3. mcp-compliance
**Status:** 🔄 IN PROGRESS
**Function:** Fatwa/Halal checks
**Files:** `supabase/functions/mcp-compliance/`

### L4. mcp-education
**Status:** 🔄 IN PROGRESS
**Function:** Hadith/Tafsir
**Files:** `supabase/functions/mcp-education/`

### L5. mcp-zakat
**Status:** 🔄 IN PROGRESS
**Function:** Zakat calculator
**Files:** `supabase/functions/mcp-zakat/`

### L6. mcp-admin
**Status:** ⏳ PENDING
**Function:** System analytics

### L7. mcp-asr
**Status:** ⏳ PENDING
**Function:** Voice analysis

### L8. mcp-iqra
**Status:** ⏳ PENDING
**Function:** Learning data

---

## 📱 SECTION M: BOT INTEGRATIONS

### M1. Telegram Bot
**Status:** 🔄 IN PROGRESS
**Files:** `src/services/telegramService.ts`

### M2. WhatsApp Bot
**Status:** 🔄 IN PROGRESS
**Files:** `src/services/whatsappService.ts`

### M3. WhatsApp CRM
**Status:** ⏳ PENDING
**Files:** `src/services/whatsappCRM.ts` (Skeleton)

---

## 🔮 SECTION N: FUTURE PHASE IDEAS

| # | Feature | Phase | Status |
|:-:|---------|:-----:|:------:|
| N1 | Kids Mode | 4 | ⏳ |
| N2 | Smartwatch App | 4 | ⏳ |
| N3 | B2B Corporate Plans | 4 | ⏳ |
| N4 | Indonesian Market | 4 | ⏳ |
| N5 | Live Ustaz Sessions | 3 | ⏳ |
| N6 | Quran Memorization Tools | 3 | ⏳ |
| N7 | Islamic Calendar | 3 | ⏳ |
| N8 | MyDigital ID Login | Future | ⏳ |
| N9 | Desktop App | Future | ⏳ |
| N10 | Video Streaming Platform | Future | ⏳ |

---

## 🤝 SECTION O: STRATEGIC JV PARTNERSHIPS (NEW!)

### O1. 🐄 EZ Qurban Integration (Raya Haji)
**Status:** ⏳ PENDING
**Type:** API Integration + Payment Partnership
**Priority:** HIGH (Seasonal - Zulhijjah)

#### Partner Profile: EZ Qurban Sdn Bhd

| Field | Details |
|-------|---------|
| **Website** | [ezqurban.org](https://ezqurban.org) |
| **Founded** | April 2007 (18 years) |
| **Participants Served** | 485,186+ |
| **Animals Slaughtered** | 171,909 |
| **Countries** | 40 |
| **Partners** | Maybank Islamic, Bank Islam, Touch 'n Go |
| **Verification** | AWARIS (Independent Trustee) |
| **Target 2025** | 200,000 participants |

#### 2025 Pricing

| Package | Local (Malaysia) | Global (37 Countries) |
|---------|-----------------|----------------------|
| Cattle (1/7 share) | RM 699 | RM 270 |
| Cattle (Whole) | RM 4,893 | RM 1,890 |
| Goat (Whole) | RM 899 | RM 499 |

#### Proposed Features
1. **Qurban Module** in Barakah section
   - In-app registration & akad digital
   - Package selection (Local/Global/Palestine/Syria)
   - Price comparison tool
   - Registration deadline tracking

2. **Aqiqah Module** (Year-round)
   - New baby celebrations
   - Name announcement integration
   - Family sharing

3. **Fidyah/Kaffarah** payments
   - Ramadan missed fasting
   - Automatic calculation

4. **Tracking Dashboard**
   - Real-time qurban status
   - Implementation photos/videos
   - Digital certificate

#### Technical Requirements
- EZ Qurban registration API
- Shared payment gateway (Touch 'n Go, Maybank)
- Media CDN for photos/videos
- Push notifications (deadline reminders)

#### Revenue Model Options

| Option | Model | Est. Revenue |
|--------|-------|--------------|
| A | Commission (5-10% per transaction) | RM 50K-100K/season |
| B | Fixed partnership fee | RM 30K-50K/year |
| C | Hybrid (base + performance) | Variable |

#### Marketing Synergy
- QuranPulse promoted on EZ Qurban website/socials
- EZ Qurban featured in QuranPulse app
- Joint Ramadan/Raya Haji campaign
- Cross-promotion to 485K+ EZ Qurban users

#### Timeline

| Phase | Action | Target |
|-------|--------|--------|
| 1 | Initial contact & MoU | Q1 2026 |
| 2 | API integration | Q2 2026 |
| 3 | Beta testing | Ramadan 2026 |
| 4 | Full launch | Zulhijjah 1447H (June 2026) |

**Files:** None yet
**Value:** Seasonal revenue + User growth via cross-promotion

---

### O2. 📺 TV Alhijrah Partnership (Content & Events)
**Status:** ⏳ PENDING
**Type:** Content Licensing + Event Sponsorship
**Priority:** HIGH (Brand Credibility)

#### Partner Profile: TV Alhijrah

| Field | Details |
|-------|---------|
| **Type** | State-owned Islamic TV Channel |
| **Owner** | Malaysian Government |
| **Audience** | Millions of Malaysian households |
| **Mission** | "Strategic alliances with win-win concept" |
| **Digital** | AlHijrah Plus (AH+) streaming |

#### Key Programs (2025-2026)

| Program | Date | Opportunity |
|---------|------|-------------|
| **Malaysia #QuranHour** | Aug 30, 2025 | Digital Partner |
| **Konvensyen Hijrah Bergema** | Dec 30-31, 2025 | Booth |
| **Konsert Malam Hijrah** | Dec 31, 2025 | Sponsorship |
| **Projek Bangkit** | 2025-2026 | Asnaf tech training |
| **Karnival Hijrah 2026** | TBD | Major presence |
| **Anugerah Carta 114** | Annual | Integration |

#### Proposed Partnership Phases

**Phase 1: Content Partnership (Q2 2026)**
- License Alhijrah content for Media Studio
- Exclusive clips from "Tenang Sekejap" program
- Nasyid/Zikir audio content
- Islamic educational videos

**Phase 2: Event Partnership (Karnival Hijrah 2026)**
- QuranPulse tech booth at event
- Live demo station for Iqra module
- App download incentive campaign
- On-stage branding

**Phase 3: Malaysia #QuranHour (Aug 2026)**
- QuranPulse as Official Digital Partner
- In-app #QuranHour tracker
- Gamification: Special badges for participation
- Live streaming integration
- Nation-wide engagement campaign

**Phase 4: Projek Bangkit Collaboration**
- Tech training for asnaf entrepreneurs
- QuranPulse business tools (Souq module)
- Digital literacy program
- Empowerment through technology

#### Technical Requirements
- Video streaming CDN
- Content Management integration
- Live broadcast capability (WebRTC)
- Analytics & viewership tracking

#### Revenue/Value Model

| Type | Model | Value |
|------|-------|-------|
| Content | Fixed annual license OR revenue share | RM 20K-50K |
| Events | Booth sponsorship + branding | RM 10K-30K/event |
| Strategic | Government relations pathway | Invaluable |

#### Strategic Value
- ✅ **Legitimacy:** State-owned media endorsement
- ✅ **Reach:** Access to millions of households
- ✅ **Content:** Professional Islamic media
- ✅ **Network:** Islamic influencers and preachers
- ✅ **Government:** Pathway to JAKIM/KDN endorsement

#### Timeline

| Phase | Action | Target |
|-------|--------|--------|
| 1 | Initial meetings | Q1 2026 |
| 2 | MoU signing | Q1 2026 |
| 3 | Content licensing begins | Q2 2026 |
| 4 | #QuranHour partnership | Aug 2026 |
| 5 | Karnival Hijrah 2026 | Q4 2026 |

**Files:** None yet
**Value:** Brand credibility + Content library + Government relations

---

### O3. 👗 Siti Khadijah Partnership (E-Commerce + Ramadan)
**Status:** ⏳ PENDING
**Type:** E-Commerce Integration + Seasonal Campaign
**Priority:** MEDIUM (Ramadan Focus)

#### Partner Profile: Siti Khadijah

| Field | Details |
|-------|---------|
| **Type** | Premium Telekung & Prayer Wear Brand |
| **Headquarters** | Malaysia 🇲🇾 |
| **E-Commerce Revenue** | 35% of total revenue |
| **Website** | [sitikhadijah.com](https://sitikhadijah.com) |
| **Payment Partners** | Moby Islamic (BNPL), Setel Pay |
| **Delivery** | Setel Express (Next-day) |
| **Bank Partner** | alrajhi bank (2025-2026 promo) |

#### Key Events 2025

| Event | Date | Opportunity |
|-------|------|-------------|
| 2.2 Online Sale | Feb 2025 | Cross-promo |
| 6.6 Online Sale | Jun 2025 | Cross-promo |
| Islamic Tourism Month | Aug-Sep 2025 | Featured Partner |
| Ramadan Campaign | Mar-Apr 2026 | Major collab |

#### Proposed Integration
1. **Souq Module Integration**
   - Siti Khadijah products in QuranPulse marketplace
   - Exclusive "QuranPulse x Siti Khadijah" telekung

2. **Ramadan Campaign**
   - Joint promotion during Ramadan
   - "Prepare for Terawih" bundle
   - Discount codes for QuranPulse users

3. **Sewing Experience**
   - Promote SK Sewing Experience program
   - Content for Media Studio

#### Revenue Model
- Affiliate commission (5-15% per sale)
- Cross-promotional marketing value
- Exclusive product revenue share

**Value:** Premium brand association + E-commerce revenue + Ramadan traffic

---

### O4. 🕋 Tabung Haji Partnership (Umrah Module)
**Status:** ⏳ PENDING
**Type:** API Integration + Content Partnership
**Priority:** HIGH (Millions of depositors)

#### Partner Profile: Tabung Haji

| Field | Details |
|-------|---------|
| **Full Name** | Lembaga Tabung Haji (LTH) |
| **Type** | Government Hajj Fund Agency |
| **Digital Platform** | THiJARI App |
| **Target Users** | 4+ Million digital users |
| **Transformation** | HIJRAH24 Strategic Plan |

#### THiJARI App Features

| Feature | Available |
|---------|:---------:|
| Account Management | ✅ |
| Hajj Registration Status | ✅ |
| Dam & Qurban Payment | ✅ |
| Flight Schedules | ✅ |
| Hajj Course Locations | ✅ |
| Kelab TaHa Membership | ✅ |
| Digital Passport Submission | 🆕 2025 |
| Digital Medical Records | 🆕 2025 |

#### Proposed Integration
1. **Umrah Module Enhancement**
   - Link to THiJARI for savings status
   - Doa guides for Umrah/Hajj
   - Mecca/Madinah navigation maps

2. **Hajj Preparation Content**
   - License TH educational content
   - Hajj course materials in-app
   - Manasik training videos

3. **Kelab TaHa Integration**
   - Special offers for TH depositors
   - Premium features for Kelab TaHa members

4. **Dam & Qurban Link**
   - Deep link to TH Qurban payment
   - Complement EZ Qurban integration

#### Technical Requirements
- OAuth integration with THiJARI
- API for savings/status check
- Content licensing agreement

#### Revenue Model
- Referral commission (Hajj registration)
- Premium content licensing
- B2B partnership fee

**Value:** Access to millions of TH depositors + Government credibility

---

### O5. 💰 PPZ-MAIWP Partnership (Zakat Payment)
**Status:** ⏳ PENDING
**Type:** Payment Gateway Integration
**Priority:** HIGH (Federal Territory Focus)

#### Partner Profile: PPZ-MAIWP

| Field | Details |
|-------|---------|
| **Full Name** | Pusat Pungutan Zakat Majlis Agama Islam WP |
| **Coverage** | Wilayah Persekutuan (KL, Putrajaya, Labuan) |
| **Digital Platform** | MyZakat 3.0 App |
| **Website** | [zakat.com.my](https://zakat.com.my) |
| **Innovation** | First crypto zakat in Malaysia (Dec 2024) |
| **Payment Tech** | NFC "Tap on Phone" (2023) |

#### Payment Channels

| Channel | Status |
|---------|:------:|
| MyZakat 3.0 App | ✅ |
| Online Portal | ✅ |
| Internet Banking | ✅ |
| E-Wallets | ✅ |
| Crypto (Sharlife.my) | 🆕 |
| NFC Tap-to-Pay | 🆕 |
| MYEG Portal (Waqf) | 🆕 March 2025 |

#### Proposed Integration
1. **Zakat Calculator in-app**
   - All zakat types (Pendapatan, Perniagaan, Emas, Saham, etc.)
   - Automatic calculation
   - Direct payment to PPZ

2. **Payment Gateway**
   - Deep link to MyZakat 3.0
   - Or: Embedded payment widget

3. **Tax Rebate Tracking**
   - Store zakat payment history
   - Generate tax rebate documents
   - Annual summary

4. **Asnaf Support**
   - Info about asnaf programs
   - Volunteer opportunities
   - Sadaqah module

#### Technical Requirements
- PPZ payment API integration
- MyZakat 3.0 deep linking
- Secure payment handling

#### Revenue Model
- No direct commission (social good)
- Government relations value
- User engagement & retention

**Value:** Core Islamic obligation support + Federal Territory users

---

### O6. 💵 LZS (Lembaga Zakat Selangor) Partnership
**Status:** ⏳ PENDING
**Type:** Payment Gateway Integration
**Priority:** HIGH (Largest State by Population)

#### Partner Profile: LZS

| Field | Details |
|-------|---------|
| **Coverage** | Selangor (Most populous state) |
| **App** | ZakatSelangor |
| **Website** | [zakatselangor.com.my](https://zakatselangor.com.my) |

#### Proposed Integration
- Same as PPZ-MAIWP (Zakat calculator, payment, tracking)
- Target Selangor residents specifically
- Complement PPZ for wider coverage

**Value:** Cover largest state + Comprehensive zakat coverage

---

### O7. 🏦 Islamic Banking Partnership
**Status:** ⏳ PENDING
**Type:** Payment & Financing Integration
**Priority:** HIGH (Payment Infrastructure)

#### Potential Partners

| Bank | Type | Opportunity |
|------|------|-------------|
| **Maybank Islamic** | Largest Islamic Bank | FPX, Payment Gateway |
| **Bank Islam** | Full Islamic Bank | Financing, BNPL |
| **CIMB Islamic** | Islamic Window | Payment Integration |
| **Bank Rakyat** | Cooperative Bank | Community Focus |
| **alrajhi bank** | Saudi-backed | Premium segment |

#### Proposed Integration
1. **Payment Gateway**
   - FPX integration for all payments
   - Credit/Debit card processing
   - E-wallet support

2. **Islamic Financing**
   - Hajj savings plan promotion
   - "Simpan untuk Umrah" campaign
   - BNPL for premium features

3. **Corporate Sponsorship**
   - Bank sponsors QuranPulse features
   - Co-branded campaigns
   - CSR partnership

#### Revenue Model
- Transaction fees (payment processing)
- Sponsorship revenue
- Referral commission (financing)

**Value:** Payment infrastructure + Corporate sponsorship potential

---

### O8. 🥗 Halal Hub Partnership (SmartHalal Integration)
**Status:** ⏳ PENDING
**Type:** Data API Integration
**Priority:** MEDIUM (Lifestyle Feature)

#### Partner Options

| Partner | Type | Data |
|---------|------|------|
| **JAKIM SmartHalal** | Government | Official Halal database |
| **HalalXpert** | Private | Extended product data |
| **MyHalal** | Community | User-submitted data |

#### Proposed Integration
1. **Halal Scanner**
   - Barcode/QR scanner
   - Instant halal status check
   - Product ingredients list

2. **Restaurant Finder**
   - Nearby halal restaurants
   - Ratings & reviews
   - Directions integration

3. **Image Analysis**
   - AI ingredient detection
   - Arabic text translation
   - Suspicious ingredient alerts

#### Technical Requirements
- JAKIM SmartHalal API (if available)
- Barcode scanning library
- Image analysis AI (Gemini Vision)

**Value:** Daily utility feature + User engagement

---

### O9. 🎵 Nasyid Artists Partnership (Content Creation)
**Status:** ⏳ PENDING
**Type:** Content Licensing + Original Production
**Priority:** MEDIUM (Content Library)

#### Potential Partners

| Artist/Group | Type | Opportunity |
|--------------|------|-------------|
| **Raihan** | Legendary Nasyid | Legacy content |
| **Maher Zain** | International | Premium content |
| **Hafiz Hamidun** | Local Star | Exclusive content |
| **Rabbani** | Classic Group | Nostalgia content |
| **Brothers** | Young Group | Youth appeal |
| **Inteam** | Modern Nasyid | Fresh content |

#### Proposed Integration
1. **Media Studio Content**
   - Licensed nasyid tracks
   - Exclusive releases
   - Behind-the-scenes content

2. **Ramadan Special**
   - Ramadan nasyid playlist
   - Live concert streaming
   - Artist collaborations

3. **Original Production**
   - QuranPulse theme song
   - Doa audio with music
   - Educational songs for Iqra

#### Revenue Model
- Licensing fees (upfront or rev share)
- Premium content exclusivity
- Concert ticket partnerships

**Value:** High-quality content library + User engagement + Brand association

---

### O10. 📱 JAKIM Touch Partnership (Official Super-App)
**Status:** ⏳ PENDING
**Type:** Official Integration
**Priority:** CRITICAL (Government Endorsement)

#### Partner Profile

| Field | Details |
|-------|---------|
| **Type** | Government Islamic Super-App |
| **Developer** | JAKIM |
| **Data** | Official prayer times, Halal, Fatwa |

#### Proposed Integration
1. **Data Source**
   - Official prayer times API
   - Halal database access
   - Fatwa/E-Fatwa content

2. **Official Endorsement**
   - JAKIM logo in app
   - "Verified by JAKIM" badge
   - Government credibility

3. **Content Partnership**
   - License JAKIM content
   - Official Islamic rulings
   - Holiday announcements

#### Strategic Value
- **Legitimacy:** Official government backing
- **Trust:** Users trust JAKIM data
- **Differentiation:** Unique vs competitors

**Value:** HIGHEST PRIORITY - Government endorsement is game-changer

---

## 💰 SECTION P: FUNDING & GRANT OPPORTUNITIES (From Strategic Report)

> **Source:** `DOCS_VAULT/ZAKAT_SELANGOR.md`
> **Total Opportunities:** 11

---

### P1. 🕌 LZS Fisabilillah Grant (Dakwah & Education)
**Status:** ⏳ PENDING
**Type:** Non-equity Grant
**Priority:** HIGH
**Estimated Value:** Variable (Project-based, potentially RM50K-500K+)

#### Description
LZS allocates hundreds of millions annually to Fisabilillah. Digital Dakwah platforms like QuranPulse qualify under "upholding and defending the religion of Allah."

#### Key Requirements
- Position as Social Enterprise / Dakwah Organization
- Propose specific program (e.g., "Selangor Quran Literacy Campaign")
- Partner with NGO/Mosque/University for credibility
- Submit "Theory of Change" with impact metrics

#### Application
- Submit to LZS Agihan/Dakwah Department
- Include: Maslahah documentation, budget, impact metrics

---

### P2. 📡 Radiuz Affiliate Program (LZS)
**Status:** ⏳ PENDING
**Type:** Revenue Partnership
**Priority:** HIGH (Low-hanging fruit)
**Estimated Value:** Commission-based (% of Zakat collected)

#### Description
Integrate Zakat payment into QuranPulse app. Users pay Zakat Selangor through the app, QuranPulse earns commission (Wakalah).

#### Benefits
- Shariah-compliant revenue stream
- Official LZS partner status
- Credibility for future grants

#### Application
- Apply at: [radiuz.zakatselangor.com.my](https://radiuz.zakatselangor.com.my)
- Requires: Technical integration, marketing agreement

---

### P3. 💼 LZS Bantuan Modal Perniagaan (Individual)
**Status:** ⏳ PENDING (If founder qualifies)
**Type:** Individual Grant
**Priority:** MEDIUM (Eligibility-dependent)
**Estimated Value:** RM2,000 - RM50,000

#### Eligibility
- Must be Asnaf: Fakir, Miskin, or Mualaf
- Selangor resident (3+ years)
- Below Had Kifayah threshold

#### Types of Aid
- Capital injection (non-repayable grant)
- Equipment purchase (workstations, servers)

---

### P4. 🚀 Selangor Accelerator Programme (SAP) - LZS Track
**Status:** ⏳ PENDING
**Type:** Accelerator + Prize Money
**Priority:** HIGH
**Estimated Value:** RM50K - RM100K+ prizes + mentorship

#### Description
Sidec-LZS partnership accelerator for Islamic Digital Economy startups. 3-4 month intensive program culminating in Demo Day.

#### Benefits
- SAP alumnus "seal of approval"
- Direct access to LZS decision-makers
- Pilot project opportunities (KAFA schools)
- Access to Selangor Innovation Fund

#### Timeline
- Applications: Q2 annually (April/May)
- Monitor: [sidec.com.my](https://sidec.com.my)

---

### P5. 📊 Sidec SME Digitalisation Matching Grant
**Status:** ⏳ PENDING
**Type:** Matching Grant
**Priority:** MEDIUM
**Estimated Value:** RM5,000 (50% matching)

#### Eligible Expenses
- Cloud accounting (Xero)
- HR systems
- Digital marketing
- Server costs

#### Requirements
- Selangor-registered Sdn Bhd/Enterprise
- 51% Malaysian-owned
- 1+ year operation
- Turnover RM300K-RM1M (micro tiers exist)

---

### P6. 🎓 TERAS/TUAS Program (Asnaf Entrepreneurship)
**Status:** ⏳ PENDING
**Type:** Incubation + Grant
**Priority:** HIGH (If founder is Asnaf)
**Provider:** Teraju Ekonomi Asnaf (MAIS subsidiary)

#### Program: TUAS (Transformasi Usahawan Asnaf Selangor)
- Training & capacity building
- Assigned monitoring officers
- Marketing through LZS network

#### Contact
- Website: [myteras.com](https://myteras.com)
- Location: Klang headquarters

#### Special Opportunity
Tech startup = "Blue Ocean" candidate for TERAS (they usually do F&B/retail)

---

### P7. 🏢 Corporate Wakalah (B2B Strategy)
**Status:** ⏳ PENDING
**Type:** Corporate Sponsorship
**Priority:** HIGH
**Estimated Value:** Varies (1000+ premium subscriptions)

#### Mechanism
Corporations paying large Zakat (Bank Islam, Affin Bank, Maybank) can "get back" 37.5-50% to distribute themselves.

#### Strategy
Approach corporate CSR departments:
> "Sponsor 1,000 Premium QuranPulse subscriptions for Asnaf students using your Wakalah money."

#### Targets
- Bank Islam CSR
- Affin Islamic
- Maybank Islamic
- Worldwide Holdings

---

### P8. 🖥️ MDEC Digital Catalyst Grant (MDCG)
**Status:** ⏳ PENDING
**Type:** Federal Tech Grant
**Priority:** HIGH
**Estimated Value:** 50-70% of project costs

#### Focus Areas
- Islamic Fintech
- Islamic Digital Content
- AI/Deep Tech

#### Special Track: MDAG-AI
If QuranPulse adds AI Tajweed Checker → qualifies for larger AI funding pools

#### Apply
- Website: [mdec.my](https://mdec.my)

---

### P9. 🎬 Dana Kandungan Digital (DKD)
**Status:** ⏳ PENDING
**Type:** Federal Content Grant
**Priority:** HIGH
**Estimated Value:** RM50K - RM300K
**Provider:** Ministry of Communications

#### Scope
- Mobile apps
- Animation
- Digital content promoting Malaysian values

#### Use
- Content development costs
- Hire Qaris for audio recording
- Marketing expenses

#### Timeline
- Opens: Early in the year

---

### P10. 🌟 Yayasan Hasanah Special Grant (HSG)
**Status:** ⏳ PENDING
**Type:** Social Impact Grant
**Priority:** MEDIUM-HIGH
**Estimated Value:** RM100K - RM500K
**Provider:** Khazanah Nasional foundation

#### Focus Areas
- Education
- Community Development
- Scalable, replicable projects

#### Proposal Idea
> "Digitizing Quranic Education for Rural Youth in Selangor"

#### Apply
- Website: [yayasanhasanah.org](https://yayasanhasanah.org)

---

### P11. 🏦 iTEKAD Program (Bank Negara + Islamic Banks)
**Status:** ⏳ PENDING
**Type:** Microentrepreneur Financing
**Priority:** MEDIUM
**Partners:** Bank Muamalat, Bank Islam, Agrobank

#### Description
BNM program empowering low-income microentrepreneurs with:
- Capital + training
- Zakat-backed financing
- Business mentorship

#### Website
- [bnm.gov.my/itekad](https://www.bnm.gov.my/itekad)

---

### P12. 🏛️ Yayasan Hijrah Selangor
**Status:** ⏳ PENDING
**Type:** State Financing
**Priority:** MEDIUM
**Estimated Value:** Up to RM5,000 (Skim Go Digital)

#### Programs
- Skim Go Digital
- I-Bisnes & Niaga Darul Ehsan (NADI)
- U-PLATS

#### Website
---

### P13. 🏦 Bank Muamalat Wakalah Zakat (Fisabilillah)
**Status:** ⏳ PENDING
**Type:** Grant (Non-repayable)
**Priority:** HIGH
**Estimated Value:** RM10K - RM100K
**Source:** `DOCS_VAULT/03_RESEARCH_ARCHIVE/BANK_MUALAMAT.md`

#### Description
Bank Muamalat redistributes portion of corporate Zakat (37.5-50%) through Social Finance Department. QuranPulse qualifies under Fisabilillah (upholding religion).

#### Proposal Strategy
- Title: "Digital Dakwah Initiative: Democratizing Quran Access"
- Request: Free premium access for 5,000 B40 students
- Contact: feedback@muamalat.com.my (Subject: "Social Finance Proposal")

---

### P14. 💳 Bank Muamalat HTG Facility (High Tech & Green)
**Status:** ⏳ PENDING
**Type:** Debt (Low Rate)
**Priority:** HIGH
**Estimated Value:** Up to RM10 Million @ 3.5% p.a.

#### Eligibility
- Digital/4IR Technology sector
- AI/Big Data/Software Development
- Must be "commercially ready" (revenue-generating)
- MDEC Malaysia Digital Status recommended

#### Prerequisites
1. Obtain MDEC MD Status first
2. SJPP 80% government guarantee
3. 3-year projections + tech architecture

#### Contact
- SME Banking: +603 2059 1211

---

### P15. 🚀 Muamalat Venture Sdn Bhd (Equity)
**Status:** ⏳ PENDING
**Type:** Equity Investment (Musharakah)
**Priority:** MEDIUM-HIGH
**Estimated Value:** RM1M - RM20 Million

#### Investment Mandate
- Target: Series A/B stage companies
- Sectors: Technology, Green Tech
- Preference: 51% Bumiputera equity

#### Value Proposition
- Islamic bank understands Quranic app value
- "Social impact" premium valuation
- Mezzanine financing option (debt+equity hybrid)

#### Contact
- Investment Banking: +603 2615 8212

---

### P16. 📊 Investment Account Platform (IAP)
**Status:** ⏳ PENDING
**Type:** Islamic Crowdfunding
**Priority:** MEDIUM
**Estimated Value:** RM500K - RM20 Million

#### Mechanism
1. Bank Muamalat sponsors project (due diligence)
2. Listed on IAP platform
3. Retail/institutional investors fund via Mudarabah/Musharakah

#### Advantages
- Bank backing = credibility
- Tax exemption for investors (3 years)
- Large ticket sizes

#### Website
- [iaplatform.com](https://iaplatform.com)

---

### P17. 📱 Muamalat DIN API Integration (Strategic)
**Status:** ⏳ PENDING
**Type:** Revenue Partnership
**Priority:** CRITICAL (Game-changer)
**Estimated Value:** Recurring SaaS Revenue

#### Opportunity
Bank Muamalat's Super App (Muamalat DIN) needs "sticky" Islamic lifestyle content. QuranPulse fills this "content gap."

#### Proposed Integration
- Daily Verse widget in banking app
- Khatam Tracking dashboard
- Premium version for all depositors

#### Revenue Model
- SaaS licensing fee, or
- Bank sponsors premium for depositors

#### Technical Requirements
- RESTful API documentation
- Open Banking standards compliance
- Backbase/Mambu compatible architecture

---

## 🌙 SECTION Q: RAMADAN 2026 MOONSHOT FEATURES

> **Brainstormed via:** MCP Sequential Thinking
> **Total Ideas:** 50+ Revolutionary Features
> **Timeline:** Ramadan 2026 (March 2026)

---

### Q1. 🤖 AI RAMADAN COMPANION (Ustaz AI Ramadan Mode)
**Status:** ⏳ PENDING
**Type:** AI/ML Feature
**Priority:** CRITICAL
**Impact:** Solves "Spiritual Emptiness" Problem

#### Features
1. **Morning Niyyah Setting** - AI calls at Suhoor to set daily intention
2. **Mid-Ramadan Intervention** - Detects motivation drop, sends personalized content
3. **Lailatul Qadr Optimizer** - Analyzes YOUR best prayer times
4. **Emotion-Aware Content** - Detects mood, suggests appropriate ayat/dua
5. **Personalized Tafsir Journey** - Adapts explanation depth to knowledge level

#### Technical Stack
- Gemini 2.5 Flash for context-aware responses
- Sentiment analysis on user interactions
- Push notification scheduling engine

---

### Q2. 🎙️ VOICE-FIRST QURAN EXPERIENCE
**Status:** ⏳ PENDING
**Type:** Voice AI Feature
**Priority:** HIGH
**Impact:** Hands-Free During Suhoor Cooking/Driving

#### Features
1. **Voice Khatam** - "Hey QuranPulse, continue my reading"
2. **Voice Dua Assistant** - "What dua for breaking fast?"
3. **Voice-Activated Tafsir** - Interrupt to ask "What does this mean?"
4. **Car Mode Dashboard** - Simplified UI for driving
5. **Smart Speaker Integration** - Alexa/Google Home skill
6. **30-Episode Audio Series** - Podcast-style Ramadan content

#### Technical Stack
- Web Speech API / Whisper ASR
- Text-to-Speech with Arabic support
- Google Actions / Alexa Skills Kit

---

### Q3. 🥽 AR/VR IMMERSIVE EXPERIENCES
**Status:** ⏳ PENDING
**Type:** Extended Reality
**Priority:** HIGH (Differentiator)
**Impact:** Profound Spiritual Experiences

#### Features
1. **VR Makkah Terawih** - Pray at Masjidil Haram immersively
2. **AR Quran Wall Projection** - Point phone at wall, see verses
3. **AR Iftar Table Blessing** - Animated dua over food
4. **Virtual I'tikaf** - VR mosque for those who can't attend physically
5. **Historical Ramadan Journey** - VR experience of Prophet's time
6. **360° Qibla Finder** - Beautiful AR visualization

#### Technical Stack
- WebXR / A-Frame
- ARCore / ARKit
- 360° video content

---

### Q4. �‍👩‍👧‍👦 FAMILY RAMADAN HUB (B2H)
**Status:** ⏳ PENDING
**Type:** Family/Social Feature
**Priority:** HIGH
**Impact:** Solves "Family Disconnect" Problem

#### Features
1. **Family Dashboard** - All members' progress on one screen
2. **Family Khatam Relay** - Dad Juz 1, Mom Juz 2, Child Juz 3...
3. **Kids Ramadan Quest** - Gamified missions for children
4. **Elderly Parent Mode** - LARGE text, simplified interface
5. **Family Iftar Planner** - Shared grocery list, menu, tasks
6. **Digital Moreh** - Record & share family mini-sermons

#### Technical Stack
- Family group management system
- Real-time sync (Firebase/Supabase)
- Accessibility features (font scaling)

---

### Q5. 🏥 HEALTH-INTEGRATED RAMADAN
**Status:** ⏳ PENDING
**Type:** Wearable/Health Integration
**Priority:** HIGH
**Impact:** Safe Fasting for Medical Conditions

#### Features
1. **Blood Sugar Tracker** - Sync with glucose monitors (diabetics)
2. **Hydration Optimizer** - Plan water intake during non-fasting hours
3. **Sleep Quality Monitor** - Track Terawih impact on sleep
4. **Pregnancy Safe Mode** - Specialized guidance
5. **Heart Rate Monitoring** - Wearable integration
6. **Energy Level Logger** - Identify patterns, optimize ibadah
7. **Medical Exemption Tracker** - Auto-calculate Fidyah

#### Technical Stack
- HealthKit / Google Fit integration
- Continuous Glucose Monitor APIs
- Smart notification scheduling

---

### Q6. ⛓️ BLOCKCHAIN/WEB3 RAMADAN
**Status:** ⏳ PENDING
**Type:** Web3 Feature
**Priority:** MEDIUM
**Impact:** Trust & Transparency in Charity

#### Features
1. **Zakat on Blockchain** - Track where YOUR zakat goes
2. **Soul-bound Tokens (SBTs)** - Non-transferable achievement badges
3. **DAO for Mosque Projects** - Community votes on funding
4. **NFT Quran Art** - Daily AI-generated collectibles
5. **Crypto Sadaqah Pool** - Collective charity with voting
6. **Verified Khatam Certificate** - Blockchain-verified for schools

#### Technical Stack
- Polygon/Base L2 for low gas fees
- Soul-bound token standard (ERC-5192)
- IPFS for certificate storage

---

### Q7. 📺 LIVE STREAMING & CREATOR ECONOMY
**Status:** ⏳ PENDING
**Type:** Live/Social Feature
**Priority:** HIGH
**Impact:** Global Ummah Connection

#### Features
1. **Live Terawih Streaming** - Mosques livestream, discover best reciters
2. **Ustaz Live Q&A** - Scholars answer questions, tipping enabled
3. **Tadarus Room** - Live group Quran reading, anyone can join
4. **Ramadan Cooking Live** - Celebrity chefs cook iftar
5. **Global Iftar Bell** - Notification when ANY user breaks fast
6. **Celebrity Qari Cameos** - Surprise live recitations
7. **Ramadan Podcast Network** - Islamic influencer content

#### Technical Stack
- WebRTC for live streaming
- HLS for playback
- Stripe Connect for tipping

---

### Q8. 💚 SOCIAL IMPACT AMPLIFIER
**Status:** ⏳ PENDING
**Type:** Social Impact Feature
**Priority:** HIGH
**Impact:** Meaningful Charity Connection

#### Features
1. **Adopt-an-Asnaf** - Matched with specific family, see progress
2. **Sadaqah Multiplier** - Corporate sponsors match donations
3. **Food Bank Integration** - Log excess iftar, connect to food banks
4. **Prison Ramadan Program** - Tablets for inmates via zakat
5. **Hospital Patient Mode** - Features for hospitalized during Ramadan
6. **Refugee Ramadan Kit** - UNHCR partnership for refugees
7. **Skill Sadaqah** - Donate skills, not just money

#### Technical Stack
- Impact tracking dashboard
- Integration with charity APIs
- Volunteer matching system

---

### Q9. 🎮 RAMADAN GAMIFICATION
**Status:** ⏳ PENDING
**Type:** Gamification
**Priority:** MEDIUM-HIGH

#### Features
1. **30-Day Streak Challenge** - Maintain full Ramadan streak
2. **Ramadan Badges** - Khatam Champion, Charity Hero, Terawih Master
3. **Daily XP Multiplier** - 2x points during Ramadan
4. **Lailatul Qadr Hunt** - Special activities for last 10 nights
5. **Leaderboard** - Compete with friends/family
6. **Ramadan Gift Cards** - Unlock premium for others

---

### Q10. 📅 ESSENTIAL RAMADAN TOOLS
**Status:** ⏳ PENDING
**Type:** Core Features
**Priority:** MUST-HAVE

#### Features
1. **30-Day Khatam Tracker** - Daily Juz assignment
2. **Iftar/Suhoor Countdown Timer** - Dramatic countdown to Maghrib
3. **Zakat Calculator** - All types with payment integration
4. **Terawih Tracker** - Log rakaat daily
5. **Fasting Tracker** - Log status + Qadha counter
6. **Ramadan Calendar Widget** - Key dates (Nuzul Quran, Lailatul Qadr)
7. **Daily Ramadan Dua** - Curated dua per day
8. **30-Day Tafsir Series** - One juz explanation per day

---

## � SECTION R: E-COMMERCE ECOSYSTEM

> **Core Concept:** Physical products + Digital subscription synergy
> **Inspiration:** Frame ayat Al-Quran as subscriber reward (low cost, lifetime display, viral marketing)

---

### R1. 🖼️ QURANPULSE FRAME COLLECTION
**Status:** ⏳ PENDING
**Type:** Physical Product
**Priority:** HIGH

#### Products
1. **Ayat Kursi Frame** - RM69 (Best seller)
2. **Surah Al-Fatihah** - RM59
3. **99 Names of Allah Set** - RM199 (Collector!)
4. **Tahmid/Tasbih/Takbir Set** - RM89
5. **Personal Verse Frame** - RM79 (User picks ayat)
6. **Birth Verse Frame** - RM89 (Verse on birth date)
7. **Marriage Verse Frame** - RM129
8. **Memorial Frame** - RM99
9. **Monthly Verse Club** - RM49/mo (Subscription box!)
10. **Giant Mosque-Style** - RM299 (Premium)

**Materials:** Canvas, Acrylic Glass, Wood Carved, LED-Backlit, Gold-Foil

---

### R2. 📿 TASBIH PRODUCT LINE
**Status:** ⏳ PENDING
**Type:** Physical Product
**Priority:** HIGH

#### Products
1. **Tasbih Kayu Premium** - RM49 (33/99 beads)
2. **Tasbih Batu Permata** - RM129 (Aqeeq/Turquoise)
3. **Tasbih Zaitun** - RM89 (Olive wood Palestine)
4. **Tasbih Digital Smart** - RM159 (**Syncs with app!**)
5. **Family Bundle (3 set)** - RM119
6. **Custom Engraved** - RM99 (Name/dua)
7. **Kids Colorful** - RM29
8. **Premium Travel Pouch** - RM39

**Digital Tasbih Feature:** Bluetooth sync, count zikir, track daily, unlock badges!

---

### R3. 🕌 LIFESTYLE & WEARABLES
**Status:** ⏳ PENDING
**Type:** Physical Product
**Priority:** MEDIUM

#### Products
- Qibla Compass Watch
- Prayer Mat Premium (foldable, compass)
- Quran Stand (wood crafted)
- Azan Clock
- Car Quran Player (USB)
- Hijab Line (collab Siti Khadijah!)
- Kids Koko/Jubah
- Islamic Art Prints
- Quran Sleeve
- QuranPulse Earbuds

---

### R4. 🎁 SUBSCRIPTION REWARD SYSTEM
**Status:** ⏳ PENDING
**Type:** Business Model
**Priority:** CRITICAL

#### Tiered Rewards

| Tier | Price | Physical Gift |
|------|:-----:|---------------|
| FREE | RM0 | Earn points for discount |
| PRO Monthly | RM19.90 | Bookmark + Sticker |
| PRO Yearly | RM149.90 | **FREE Frame (RM59)!** |
| LIFETIME | RM499 | Premium Frame + Tasbih + Exclusive |

**Marketing Genius:** QR code on frame → visitors scan → download app → VIRAL!

---

### R5. 💳 PURCHASE → FREE PRO MECHANISM
**Status:** ⏳ PENDING
**Type:** Business Model
**Priority:** HIGH

#### Spend Tiers

| Spend | FREE PRO |
|:-----:|:--------:|
| RM50+ | 1 month |
| RM100+ | 2 months |
| RM200+ | 6 months |
| RM500+ | 1 YEAR |

#### Multipliers
- First purchase = +1 week bonus
- Birthday month = 2x months
- Ramadan = **3x months!**
- Referral = both get 1 month

---

### R6. 🕌 ZAKAT & INFAQ INTEGRATION
**Status:** ⏳ PENDING
**Type:** Shariah-Compliant Revenue
**Priority:** CRITICAL

#### Options
1. **Buy 5 PRO for Asnaf** - RM99.50 (Donate to verified Asnaf)
2. **Round-Up Infaq** - RM47.30 → RM50, RM2.70 donated
3. **Beli 1 Beri 1** - Buy frame, donate 1 to orphanage
4. **Zakat Fitrah** - In-app before Raya
5. **Wakaf Product** - Profits to mosque building
6. **Sponsor KAFA Student** - RM50 = 1 year PRO
7. **Infaq Subscription** - RM10/mo auto-donate
8. **Corporate Zakat Sponsor** - 1000 accounts for Asnaf

---

### R7. 🎮 PULSE LOYALTY PROGRAM
**Status:** ⏳ PENDING
**Type:** Gamification
**Priority:** MEDIUM-HIGH

#### Features
1. **Pulse Points** - 1 point = RM0.01
2. **Collector Badges** - Own 5 frames = "Frame Collector"
3. **Limited Edition Drops** - Ramadan 2026 Exclusive (1000 only)
4. **Early Access** - PRO = 24h head start
5. **Photo Review** - 100 points
6. **TikTok Unboxing** - 500 points
7. **Gold Member** (RM500 lifetime spent) - FREE shipping forever

---

### R8. 🤝 PARTNERSHIP NETWORK
**Status:** ⏳ PENDING
**Type:** B2B Strategy
**Priority:** HIGH

#### Partners

| Partner | Type |
|---------|------|
| Local Muslim Artisans | Frame manufacturer |
| Turkey/Indonesia | Tasbih supplier |
| Siti Khadijah | Co-branded prayer set |
| JAKIM | "JAKIM Verified" label |
| Mosque Bookshops | Retail partner |
| Bazaar Ramadan | Physical booth |
| Islamic Influencers | Affiliate 15% |
| Dropshippers | Resell program |

---

### R9. 📣 MARKETING STRATEGIES
**Status:** ⏳ PENDING
**Type:** Marketing
**Priority:** HIGH

#### Campaigns
1. **"Display Your Faith"** - Photo contest
2. **Corporate Gifting** - Raya gifts (bulk)
3. **Wedding Registry** - Wish list for newlyweds
4. **Mystery Box** - Surprise bundle
5. **"Pulse Box"** - Monthly subscription box
6. **QR on Frame** - Scan to download
7. **Personalized Name** - "Hadiah untuk [NAMA]"
8. **Instagrammable Packaging**

---

### R10. 🌐 E-COMMERCE PLATFORM
**Status:** ⏳ PENDING
**Type:** Technical Infrastructure
**Priority:** HIGH

#### Platform: Hybrid (App Browse + Web Checkout)
- **Website:** shop.quranpulse.com
- **Tech:** Shopify/WooCommerce or custom

#### Payment Gateways
- FPX (Bank transfer)
- Credit/Debit Card
- e-Wallets (TnG, Boost, GrabPay)
- BNPL (Atome, ShopBack)

#### Logistics
- J&T, Poslaju, Ninja Van
- FREE shipping for PRO subscribers
- Same-day delivery Klang Valley
- International shipping for diaspora

---

## 🌱 SECTION S: SOCIAL ENTERPRISE ECOSYSTEM

> **Source:** `DOCS_VAULT/BRAINSTORM_OUTSOURCE.md`
> **Core Concept:** Perpetual Flywheel - Buy Frame → Asnaf Job → Zakat → More Asnaf → Repeat

---

### S1. 🖼️ AR-ENHANCED FRAMES
**Status:** ⏳ PENDING
**Type:** Product Innovation
**Priority:** HIGH

#### Features
1. **Living Frame** - Scan → 3D animated calligraphy
2. **Reciter Selection** - Choose different Qari
3. **Daily Verse Mode** - Different verse based on progress
4. **Tafsir Pop-up** - Hover over Arabic → translation
5. **Family Sharing** - Multiple users, personalized
6. **NFC Tag Embedded** - Tap phone → instant audio

**Grant:** Dana Kandungan Digital (DKD)

---

### S2. 👷 ASNAFPRENEUR ACADEMY
**Status:** ⏳ PENDING
**Type:** Social Impact
**Priority:** CRITICAL

#### Features
1. **Asnaf Academy** - Full training + certification
2. **Production Hubs** - 5 hubs across Malaysia
3. **QC App** - Workers upload photos for quality control
4. **Asnafpreneur Marketplace** - "Made by [NAMA]" with story
5. **Skills Ladder** - Level 1 (Assembly) → Level 3 (Programming)
6. **Graduation Bonus** - 100 orders = own business
7. **Asnaf Rating** - High-rated = priority orders

**Pitch:** "Kami mencipta pekerjaan untuk Asnaf!"
**Grant:** iTEKAD Bank Muamalat, TERAS

---

### S3. � PULSE RIDERS (Asnaf Logistics)
**Status:** ⏳ PENDING
**Type:** Logistics
**Priority:** HIGH

#### Features
1. **Pulse Riders** - Train Asnaf youth as riders
2. **Mosque Pickup Hub** - Collect from nearest mosque
3. **Jemaah Delivery** - Pick up during Friday prayer
4. **Rider Cooperative** - Shared profits
5. **Green Delivery** - Motorcycle/bicycle only
6. **Delivery in App** - Track reading AND package
7. **Tip Sadaqah** - Optional tip = infaq
8. **Rider Du'a** - Short dua on delivery

**Grant:** Hijrah Selangor (Zero to Hero)

---

### S4. 🏢 CORPORATE WAKALAH DASHBOARD
**Status:** ⏳ PENDING
**Type:** B2B
**Priority:** HIGH

#### Features
1. **Corporate Leaderboard** - Public ranking by Asnaf sponsored
2. **Company Dashboard** - See employee usage stats
3. **Custom Branded Frame** - Company logo + Quran verse
4. **Employee Matching** - Company matches purchases
5. **Quarterly Impact Report** - "100 Asnaf completed Juz Amma"
6. **CSR Tax Link** - Maximize tax benefits
7. **Press Release Template** - Ready-made PR
8. **Zakat Certificate** - Official LZS acknowledgment

**Package:** "Beli 100 Frame → Wakafkan 500 PRO"

---

### S5. 💰 MICRO-ZAKAT INTEGRATION
**Status:** ⏳ PENDING
**Type:** Fintech
**Priority:** HIGH

#### Features
1. **Zakat Meter** - Visual progress bar
2. **Daily Zakat** - RM0.50/day auto (RM15/mo)
3. **Zakat Goals** - "RM100K for Asnaf Education"
4. **Blockchain Receipt** - Transparent tracking
5. **Asnaf Thank You Video** - Recipient records video
6. **Zakat Calculator Pro** - KWSP, ASB, Crypto
7. **Zakat Reminder** - Before Ramadan/year-end
8. **Community Sadaqah Pool** - Group funding
9. **Matching Campaigns** - Corporate doubles donations

**Integration:** Radiuz LZS

---

### S6. 📱 SMART IoT PRODUCTS
**Status:** ⏳ PENDING
**Type:** Hardware/IoT
**Priority:** MEDIUM-HIGH

#### Products
1. **Smart Tasbih Pro** - Bluetooth, vibrate at 33/99, LED
2. **LED Quran Frame** - Dims/brightens, glows at Azan
3. **NFC Prayer Mat** - Tap to start prayer tracker
4. **Smart Quran Stand** - Built-in speaker, tap to play
5. **WiFi Azan Clock** - Auto-updates, syncs with app
6. **Digital Tasbeeh Ring** - Wearable, click to count
7. **AR Qibla Compass** - Physical + AR overlay
8. **NFC Quran Bookmark** - Tap to save reading position

---

### S7. 💼 GRANT STRATEGY MATRIX
**Status:** ⏳ PENDING
**Type:** Funding
**Priority:** CRITICAL

#### Sources

| Grant | Purpose |
|-------|---------|
| SE.Akreditasi (MAGIC) | Social Enterprise certification |
| MDEC DE Rantau | Digital Nomad friendly app |
| TERAJU Bumi | High-growth Bumiputera startup |
| Cradle CIP | Seed funding for tech |
| MaGIC GAP | Global Accelerator |
| Yayasan Hasanah | Education tech |
| UIA Research Grant | Digital Islamic Education |
| Triple Bottom Line | People, Planet, Profit for ESG |

---

### S8. ♻️ THE PERPETUAL FLYWHEEL
**Status:** ⏳ PENDING
**Type:** Business Model
**Priority:** CRITICAL (Core Strategy)

#### The Loop
```text
Customer Buys Frame
       ↓
Frame Made by Asnaf (JOB)
       ↓
Customer Gets FREE PRO
       ↓
Customer Round-Up Zakat
       ↓
Zakat Funds Asnaf Training
       ↓
More Asnaf = More Production
       ↓
App Sponsors Asnaf Children
       ↓
Children Learn Quran
       ↓
Children Grow → PAYING CUSTOMERS
       ↓
───── CYCLE REPEATS ─────
```

**Positioning:** "Kami bukan sekadar mengajar Quran. Kami mencipta pekerjaan untuk Asnaf."

---

### S9. 🏭 TERAS VENDOR ASNAF MODEL
**Status:** ⏳ PENDING
**Type:** Supply Chain Strategy
**Priority:** CRITICAL

#### Concept
- **Quran Pulse:** Design + Order Management
- **TERAS (MAIS):** Train Asnaf to produce

#### Implementation
1. Quran Pulse buat rekaan frame/tasbih
2. TERAS latih tukang kayu/ibu tunggal
3. Asnaf dapat order dari app
4. Quran Pulse jamin pembelian stok

**Result:** Quran Pulse = "Anchor Company" for Asnaf economy

---

### S10. 💰 iTEKAD GUARANTEED PURCHASE
**Status:** ⏳ PENDING
**Type:** Financial Innovation
**Priority:** CRITICAL

#### Mechanism
1. Bank Muamalat beri "Seed Capital" kepada Asnaf
2. Asnaf beli mesin laser engraving
3. Quran Pulse **JAMIN beli stok** mereka
4. Asnaf bayar balik iTEKAD dari hasil jualan

**Pitch to Bank:** "Kami platform teknologi yang masarkan produk Asnaf kepada ribuan pengguna app."

---

### S11. 📱 RADIUZ LZS INTEGRATION
**Status:** ⏳ PENDING
**Type:** Zakat Fintech
**Priority:** HIGH

#### Features
1. Round-Up button at checkout (RM29.90 → RM30)
2. Baki 10 sen dikumpul automatically
3. Daftar sebagai **ejen Radiuz LZS**
4. Dapat **ujrah (commission)** yang halal

**Result:** Every transaction = micro-zakat + revenue

---

### S12. 🎁 HYBRID SUBSCRIPTION MODEL
**Status:** ⏳ PENDING
**Type:** Business Model
**Priority:** HIGH

#### Tiers

| Tier | Price | Reward |
|------|:-----:|--------|
| Bulanan | RM19.90 | Digital Art PDF (cetak sendiri) |
| Tahunan | RM149.90 | Physical Frame (Limited Edition) |

**Cashflow Strategy:** Upfront annual payment absorbs frame cost

---

### S13. 🎯 WINNING PITCH POSITIONING
**Status:** ⏳ PENDING
**Type:** Investor Strategy
**Priority:** CRITICAL

#### The Killer Pitch

> **"Kami bukan meminta derma. Kami adalah penggerak ekonomi yang menyelesaikan masalah jualan produk Asnaf kepada ribuan pengguna app kami."**

#### Impact Data Loop
1. Track "X Asnaf dibantu"
2. Use data for Yayasan Hasanah/Cradle grant
3. Grant → Scale up tech → Help more Asnaf
4. More impact data → More grants

---

### S14. 🌱 ASNAFPRENEUR COMPLETE MODEL
**Status:** ⏳ PENDING
**Type:** Social Enterprise Strategy
**Priority:** CRITICAL

#### Community Garden Analogy
```text
🏪 Supermarket (China import) = TRADITIONAL TRADER
              VS
🌱 Community Garden = SOCIAL HERO

Seeds + Tools    = Grants (iTEKAD/TERAS)
Villagers        = Asnaf (single mothers, youth)
Crops            = Frames, Tasbih
Stall Manager    = Quran Pulse (Marketing)
```

#### 4-Component Model

| Component | Role |
|-----------|------|
| **1. Roles** | Asnaf = Producer, QP = Marketer |
| **2. Funding** | TERAS/iTEKAD for machinery |
| **3. Corporate** | Wakalah 37.5% for gift sets |
| **4. Logistics** | Hijrah riders for delivery |

#### Key Pitch Lines
> **To LZS:** "Kami mencipta pekerjaan, bukan meminta bantuan"
> **To Corporate:** "Gunakan Wakalah untuk beli gift set dari Asnafpreneur"

#### Game Changer Impact
- Asnaf as Producers (frames, tasbih)
- Asnaf as Riders (Hijrah logistics)
- Asnaf as Beneficiaries (free PRO)
- **Triple Integration = Maximum Grant Eligibility**

---

## 🏛️ SECTION T: SELANGOR FUNDING ECOSYSTEM

> **Source:** `DOCS_VAULT/HIJRAH_SELANGOR.md`
> **Concept:** Multi-layer capital stack from state + federal sources

---

### T1. 🚀 ZERO TO HERO (Lead Company Strategy)
**Status:** ⏳ PENDING
**Type:** Strategic Revenue
**Priority:** CRITICAL
**Source:** Hijrah Selangor

#### Concept
Don't just receive funding - become a **Syarikat Peneraju**!
QuranPulse creates "Digital Madrasah Toolkit" → Hijrah pays for customers.

#### Mechanism
1. Develop B2B module for Quran tutors
2. Register as Lead Company with Hijrah
3. Unemployed youth/Asnaf applies for scheme
4. Hijrah pays QuranPulse for toolkit
5. User gets "business-in-a-box"

**Impact:** State funding becomes REVENUE, not grant!

---

### T2. 💼 CORPORATE WAKALAH STRATEGY
**Status:** ⏳ PENDING
**Type:** B2B Revenue
**Priority:** CRITICAL

#### The "Hack"
Approach corporate zakat payers: Bank Islam, Maybank Islamic, GLCs.

**Pitch:** "Your company pays RM1M zakat. Use your 37.5% Wakalah to sponsor Quran Pulse for B40 families."

#### Result
- Corporation: Tangible CSR + religious obligation
- Asnaf: Free app access
- QuranPulse: B2B revenue from Zakat funds!

---

### T3. 📱 LZS INTEGRATION PARTNERSHIP
**Status:** ⏳ PENDING
**Type:** Strategic Partnership
**Priority:** HIGH

#### Features
1. "Pay Zakat" button in app
2. Zakat Calculator API integration
3. Official LZS channel partner status
4. Featured in LZS digital campaigns

**Benefit:** Immense trust + lower user acquisition cost

---

### T4. 🎓 SAP POSITIONING STRATEGY
**Status:** ⏳ PENDING
**Type:** Accelerator
**Priority:** HIGH

#### How to Position QuranPulse for SAP

| Vertical | Positioning |
|----------|-------------|
| AI-Driven EdTech | NLP for Tajweed correction |
| Fintech/Social Finance | Zakat/Sadaqah features |
| Smart Lifestyle | Smart City living for Muslims |

#### Perks
- Cash prize (RM50K pool)
- AWS credits (USD 5,000)
- Global immersion (Silicon Valley)

---

### T5. 🏪 DSP REGISTRATION (Digital Service Provider)
**Status:** ⏳ PENDING
**Type:** B2B Revenue
**Priority:** HIGH

#### Strategy
Register QuranPulse as **Sidec-approved DSP**.
- Other SMEs (Islamic schools) apply for grant
- Grant pays QuranPulse for services
- **50% of B2B revenue subsidized by government!**

---

### T6. 💰 MULTI-LAYER CAPITAL STACK
**Status:** ⏳ PENDING
**Type:** Funding Strategy
**Priority:** CRITICAL

#### The Stack

| Layer | Source | Amount | Use |
|-------|--------|:------:|-----|
| 1 | Zero to Hero | RM10K | Hardware |
| 2 | Go Digital | RM5K | APIs/Server |
| 3 | i-Bisnes | RM50K | OpEx bridge |
| 4 | CIP SPARK | RM150K | MVP/R&D |
| 5 | SAP | RM50K+AWS | Validation |
| 6 | MDEC DCG | RM500K | Content/Export |
| 7 | Corporate Wakalah | Custom | Sustainable B2B |

**Total Potential:** RM700K+ non-dilutive

---

### T7. 📅 4-PHASE FUNDING ROADMAP
**Status:** ⏳ PENDING
**Type:** Strategic Planning
**Priority:** CRITICAL

| Phase | Timeline | Actions |
|-------|----------|---------|
| **Foundation** | M1-3 | Zero to Hero, Go Digital |
| **Validation** | M3-6 | Cradle CIP SPARK, SAP 2026 |
| **Sustainability** | M6-12 | Corporate Wakalah, LZS Fisabilillah |
| **Scaling** | Year 2+ | MDEC DCG (RM500K) for export |

---

### T8. 🚗 HIJRAH LOGISTICS NETWORK
**Status:** ⏳ PENDING
**Type:** Logistics/Social Impact
**Priority:** HIGH
**Source:** Hijrah Selangor "Zero to Hero"

#### Role: "The WHEELS" of the Ecosystem
```text
MDEC/DKD     → "The BRAIN"   (Digital/AR)
TERAS/iTEKAD → "The TOOLS"   (Production)
Sidec        → "The SYSTEM"  (E-Commerce)
Wakalah      → "The FUEL"    (CSR Funding)
HIJRAH       → "The WHEELS"  (Logistics)
```

#### Assets

| Program | Asset | Recipient | Purpose |
|---------|-------|-----------|---------|
| Zero to Hero | Motorbike | Asnaf Youth | Last-mile delivery |
| Zero to Hero | Van | Asnaf | Bulk/Mosque delivery |

#### 4-Stream Funding Matrix

| Stream | Provider | Asset |
|--------|----------|-------|
| Logistics | Hijrah Selangor | Vehicles |
| Production | TERAS/iTEKAD | Machinery |
| Digital | Sidec/MDEC | E-Commerce + AR |
| Corporate | Wakalah/LZS | CSR + Zakat |

#### Social Hero Positioning
> **Standard Trader:** Buy → Sell → Profit
> **Social Hero:** Asnaf makes → Asnaf delivers → Asnaf benefits

**Impact:** Triple Asnaf Integration = More grant eligibility

---

## 🎨 SECTION U: BUSINESS MODEL CANVAS

> **Framework:** 9-Block Business Model Canvas
> **Positioning:** Faith-Tech Social Enterprise

---

### U1. 🤝 KEY PARTNERS
**Status:** ⏳ PENDING

| Partner | Role |
|---------|------|
| **TERAS (MAIS)** | Manufacturing partner - Asnaf workforce |
| **LZS** | Radiuz affiliate + Fisabilillah funding |
| **Bank Muamalat** | iTEKAD equipment capital for Asnaf |
| **Sidec** | Digitalization grants + Accelerator |
| **Corporate B2B** | Wakalah Zakat sponsors |

---

### U2. 🔧 KEY ACTIVITIES
**Status:** ⏳ PENDING

1. **App R&D** - AR features + E-Commerce integration
2. **Social Supply Chain** - Monitor Asnaf product quality
3. **Dakwah Content** - "Healing dengan Al-Quran" videos
4. **Impact Data Management** - Track Asnaf helped + Quran hours

---

### U3. 💎 VALUE PROPOSITIONS
**Status:** ⏳ PENDING

| Segment | Value |
|---------|-------|
| **User** | Phygital Experience + Guilt-Free Shopping |
| **Corporate** | Transparent Wakalah + Dashboard Pahala |
| **Asnaf** | Pendapatan Bermaruah (producer, not just recipient) |

---

### U4. � CUSTOMER RELATIONSHIPS
**Status:** ⏳ PENDING

1. **Tiered Rewards**
   - Basic: Digital Art
   - Pro: Physical Frame delivered

2. **Komuniti "Pulse"**
   - Personal "Heartbeat check-in"
   - Monthly Infaq impact report

---

### U5. 👥 CUSTOMER SEGMENTS
**Status:** ⏳ PENDING

| Type | Segment |
|------|---------|
| **B2C** | Modern Muslim (estetik lifestyle) |
| **B2C** | Digital Huffaz (hafalan tools) |
| **B2B** | GLC/Islamic Banks (Wakalah channel) |
| **Beneficiary** | B40/Tahfiz students |

---

### U6. 📦 KEY RESOURCES
**Status:** ⏳ PENDING

1. **Tech Platform** - Source code + AR IP
2. **User Data** - Reading habits for AI
3. **Brand** - "App Gaya Hidup Muslim No.1 Selangor"
4. **Asnaf Network** - Trained workforce via TERAS

---

### U7. 📣 CHANNELS
**Status:** ⏳ PENDING

1. **In-App Store** - Built-in E-Commerce
2. **TikTok/IG** - AR demo viral content
3. **Kaunter Zakat LZS** - Cross-promotion

---

### U8. 💸 COST STRUCTURE
**Status:** ⏳ PENDING

| Cost | Mitigation |
|------|------------|
| Tech Development | Geran Sidec/Cradle |
| COGS (Asnaf wages) | iTEKAD Bank Muamalat |
| Marketing & Logistics | Revenue from sales |

---

### U9. 💰 REVENUE STREAMS (4 Streams)
**Status:** ⏳ PENDING

| Stream | Model |
|--------|-------|
| **SaaS** | Freemium subscription (Monthly/Yearly) |
| **E-Commerce** | Frame, Tasbih, merchandise margin |
| **Ujrah** | Radiuz LZS affiliate commission |
| **B2B** | Corporate Wakalah/CSR sponsorship |

---

### U10. 📅 BMC IMPLEMENTATION ROADMAP
**Status:** ⏳ PENDING

| Phase | Timeline | Focus |
|-------|----------|-------|
| **Validasi** | M1-2 | TERAS samples + Sidec grant |
| **MVP Launch** | M3-4 | Pro+Frame package sales |
| **Social Integration** | M5-6 | Radiuz + B2B Wakalah pitch |

---

## 📊 SUMMARY

| Status | Count | Percentage |
|--------|:-----:|:----------:|
| ✅ Implemented | 35 | 14% |
| 🔄 In Progress | 22 | 9% |
| ⏳ Pending | 189 | 77% |
| **TOTAL** | **246** | 100% |

**Latest Additions:**
- T8: Hijrah Logistics Network (4-Stream Matrix)
- U1-U10: Business Model Canvas

---

**[End of IDEAS MASTER DOCUMENT]**
