# QuranPulse v6.0 — Comprehensive Product Requirements Document
> **Version:** 6.0.0 | **Status:** Production Blueprint  
> **Last Updated:** December 6, 2025  
> **Author:** QuranPulse Development Team
---
## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Strategic Foundation & Vision](#2-strategic-foundation--vision)
3. [Market Analysis & Target Audience](#3-market-analysis--target-audience)
4. [Product Specifications & Features](#4-product-specifications--features)
5. [Technical Architecture](#5-technical-architecture)
6. [Data Architecture & Schema](#6-data-architecture--schema)
7. [AI & Machine Learning Strategy](#7-ai--machine-learning-strategy)
8. [Security & Compliance](#8-security--compliance)
9. [Design System & User Experience](#9-design-system--user-experience)
10. [Monetization & Business Model](#10-monetization--business-model)
11. [Success Metrics & KPIs](#11-success-metrics--kpis)
12. [Development Roadmap](#12-development-roadmap)
13. [Risk Assessment & Mitigation](#13-risk-assessment--mitigation)
14. [Implementation Status](#14-implementation-status)
15. [Appendix](#15-appendix)
---
## 1. Executive Summary
### 1.1 Product Overview
**QuranPulse** is a revolutionary Islamic Super App designed to unify 10+ essential Islamic applications into a single, AI-powered, comprehensive platform. Tailored specifically for the Malaysian Muslim market, QuranPulse combines traditional Islamic education with cutting-edge artificial intelligence to deliver an unprecedented digital worship experience.
### 1.2 Key Value Propositions

| Pillar | Description |

|--------|-------------|
| 🤖 **AI-Powered Learning** | Revolutionary AI Ustaz providing real-time Tajwid feedback and personalized guidance |
| 📚 **Complete Iqra 1-6** | The ONLY app with the full Iqra curriculum for learning to read the Quran |
| 🛠️ **Comprehensive Toolkit** | 15+ Islamic tools unified in one platform |
| 🇲🇾 **Malaysia-First** | JAKIM-compliant, Shafi'i-aligned, Bahasa Malaysia primary |
| 💰 **Zero-Cost Architecture** | Built on free-tier cloud services for sustainable scaling |

### 1.3 Unique Value Proposition (UVP)
> **"Satu-satunya app dengan AI Ustaz yang mengajar Iqra 1-6 lengkap, memberikan feedback tajwid real-time, dan menjadi companion untuk seluruh amalan Islam anda - dibuat khas untuk Muslim Malaysia."**
### 1.4 Current Implementation Status

| Metric | Status |

|--------|--------|
| **Overall Readiness** | 🟡 70% |
| **UI/UX Completion** | ✅ 90% |
| **Backend Integration** | ⚠️ 50% |
| **AI Wiring** | ✅ 100% |
| **Monetization** | 🔴 10% |

---
## 2. Strategic Foundation & Vision
### 2.1 Problem Statement
Muslims in Malaysia face significant challenges in managing their daily digital religious practices:

| Problem | Impact | Our Solution |

|---------|--------|--------------|
| **App Fragmentation** | Users juggle 5-10 apps for different Islamic needs | Single unified platform |
| **Inconsistent Data** | No synchronized learning journey across apps | Unified progress tracking |
| **Financial Burden** | Multiple subscriptions cost RM50-100+/month | Single affordable subscription |
| **Learning Gaps** | No complete Iqra curriculum digitally available | Full Iqra 1-6 with AI |
| **Limited Guidance** | No 24/7 access to Islamic knowledge | AI Ustaz available anytime |

### 2.2 Vision & Mission
**Vision Statement:**
> "To become the world's most beloved and beneficial Islamic super-app that helps every Muslim strengthen their connection with Allah SWT, understand the Quran deeply, practice Islam correctly, and inspire others to do the same."
**Mission Statement:**
> "Empowering Malaysian Muslims with AI-powered Islamic education and comprehensive digital worship tools - making learning and practicing Islam accessible, engaging, and authentic."
### 2.3 The "Zero Cost" Imperative
A core strategic principle ensuring 100% free operation at scale:

| Component | Traditional Approach | QuranPulse Approach |

|-----------|---------------------|---------------------|
| **AI Chatbot** | Paid LLM API (GPT-4) ~RM500+/mo | Google Gemini 2.5 Flash Free Tier |
| **Database & Auth** | AWS RDS ~RM200+/mo | Supabase Free Tier |
| **Hosting** | Vercel Pro ~RM80/mo | Static Free Tier |
| **AI Voice** | Cloud Speech API ~RM300/mo | Client-side + Edge Functions |

### 2.4 Core Identity Matrix

| What QuranPulse **IS** | What it is **NOT** |

|------------------------|-------------------|
| ✅ Islamic Super App (10+ apps unified) | ❌ Simple "Apps Mengaji" |
| ✅ AI-Powered Learning Platform | ❌ Generic Quran Reader |
| ✅ Complete Iqra 1-6 Curriculum (our moat) | ❌ Kids-only Learning App |
| ✅ Malaysian-First, JAKIM-compliant | ❌ Generic Global App |
| ✅ Family-Centric Platform | ❌ Single-purpose Tool |
| ✅ Lifestyle Companion (morning to evening) | |
| ✅ Multi-Media Platform (audio, video, interactive) | |

---
## 3. Market Analysis & Target Audience
### 3.1 Market Size & Opportunity
```text
┌─────────────────────────────────────────────────────────────┐
│  TAM (Total Addressable Market)                             │
│  20M+ Muslims in Malaysia                                   │
│  Islamic + Educational App Sector: RM500 Million            │
├─────────────────────────────────────────────────────────────┤
│  SAM (Serviceable Addressable Market)                       │
│  5M Users actively seeking digital solutions                │
│  Willingness to pay: RM10-20/month                          │
│  Value: RM150 Million                                       │
├─────────────────────────────────────────────────────────────┤
│  SOM (Serviceable Obtainable Market) - Year 1               │
│  Target: 5% penetration = 250,000 users                     │
│  Projected ARR: RM 800,000                                  │
└─────────────────────────────────────────────────────────────┘
```
### 3.2 Competitive Analysis

| Competitor | Strengths | Weaknesses | Our Advantage |

|------------|-----------|------------|---------------|
| **Qara'a** | Tajwid focus, good UI | No Iqra, expensive (RM20/mo) | Full Iqra 1-6, 50% cheaper |
| **ThinkQuran** | Good tafsir | No AI feedback, study-only | Real-time AI, lifestyle focus |
| **Muslim Pro** | Global brand | Not Malaysian-specific, generic | Malaysia-first, JAKIM-aligned |
| **Free Apps** | Free, simple | No learning path, no AI | AI-powered, gamified |

### 3.3 User Personas

#### 👩‍👧‍👦 Ibu Aisha - The Family Manager

| Attribute | Details |

|-----------|---------|
| **Demographics** | Age 32-45, Urban Malaysia, Working Mother |
| **Income** | RM4,000-10,000/household |
| **Pain Points** | Finding qualified Quran teachers, managing children's attention |
| **Goals** | Ensure children learn Quran correctly, monitor progress affordably |
| **Solution Fit** | Family Plan (6 users, RM19.90/mo), Parent Dashboard, AI Ustaz per child |

#### 👨‍💼 Akhil - The Young Professional

| Attribute | Details |

|-----------|---------|
| **Demographics** | Age 25-35, Urban Malaysia, Corporate Employee |
| **Income** | RM3,000-8,000 |
| **Pain Points** | Managing prayer times with busy schedule, maintaining consistency |
| **Goals** | Relearn Quran, improve Tajwid, track spiritual progress |
| **Solution Fit** | Self-paced Iqra, AI Tajwid Tutor, 24/7 Tanya Ustaz AI |

#### 🧕 Siti - The New Muslimah

| Attribute | Details |

|-----------|---------|
| **Demographics** | Age 18-30, Student/Early Career, New Convert |
| **Income** | RM1,500-4,000 |
| **Pain Points** | Overwhelmed by new faith, conflicting information online |
| **Goals** | Learn from absolute basics, build confidence privately |
| **Solution Fit** | Iqra 1-6 from zero, patient AI guidance, privacy-focused learning |

#### 👴 Pak Hassan - The Retiree Learner

| Attribute | Details |

|-----------|---------|
| **Demographics** | Age 55-70, Retired, Low Tech-Savviness |
| **Income** | RM2,000-5,000 |
| **Pain Points** | Never learned Quran properly, eyesight challenges |
| **Goals** | Finally read Quran, simple interface, audio guidance |
| **Solution Fit** | Large fonts, audio with highlighting, voice-based AI, step-by-step lessons |

---
## 4. Product Specifications & Features
### 4.1 Feature Hierarchy
Features are organized into three strategic tiers:
- **Tier 1 (Flagship)**: Competitive moat, primary marketing focus
- **Tier 2 (Core)**: Market parity, foundational expectations
- **Tier 3 (Advanced)**: Depth, retention, upselling
### 4.2 TIER 1: Flagship Features (Competitive Moat)
#### 4.2.1 AI Ustaz - Mengaji IQRA & Al-Quran
**Description:** Revolutionary AI-powered platform teaching Quranic recitation from scratch using the Iqra 1-6 methodology with real-time pronunciation feedback.
**Core Components:**

| Component | Function | Status |

|-----------|----------|--------|
| `IqraHub` | Main dashboard with progress overview | ✅ Built |
| `IqraLessonViewer` | Display lessons with audio & transliteration | ✅ Built |
| `IqraPageViewer` | Traditional book-style navigation | ✅ Built |
| `IqraRecorder` | Record user's reading for AI analysis | ⚠️ UI Only |
| `AIFeedbackPanel` | Instant feedback on pronunciation & tajwid | ⚠️ Mock |
| `IqraProgressDashboard` | Charts, stats, streaks, badges | ✅ Built |
| `IqraAssessment` | End-of-level certification tests | ⏳ Planned |
| `IqraExercises` | Interactive quizzes | ⏳ Planned |
| `MakhrijMap` | Visual letter articulation diagram | ⏳ Planned |
| `StarRating` | 1-5 star accuracy scoring | ⚠️ Mock |
| `TeacherDashboard` | Parent/teacher monitoring | ✅ Built |
| `LiveVoiceTeacher` | Real-time voice AI conversation | ⏳ Planned |
**Acceptance Criteria:**
- [ ] User can navigate through all 6 Iqra levels
- [ ] Audio recording with SNR > 20dB
- [ ] AI feedback accuracy > 85%
- [ ] Analysis response time < 5 seconds
- [ ] Cross-device progress sync
- [ ] Parent monitoring dashboard functional
#### 4.2.2 AI Tutor Tajwid
**Description:** Intelligent AI that provides real-time feedback on Tajwid rules during Quran recitation.
**Features:**
- Live recording or audio upload support
- Color-coded Tajwid identification
- Corrective suggestions with explanations
- Comparison with professional Qari recitation
- Supports all major Tajwid rules (Idgham, Ikhfa, Iqlab, Izhar, Qalqalah, etc.)
**Status:** ⚠️ 50% (UI complete, AI wiring pending)
#### 4.2.3 Tanya Ustaz AI
**Description:** 24/7 Islamic Q&A assistant with JAKIM-compliant responses.
**Features:**
- Natural language chat interface
- Responses with evidence (dalil) from Quran/Hadith
- Links to official JAKIM/E-Fatwa sources
- Conversation history
- Multi-language support (BM, EN, AR)
**Status:** ✅ Ready (Powered by Gemini 2.5 Flash)
### 4.3 TIER 2: Core Features

| Feature | Description | Status | Completion |

|---------|-------------|--------|------------|
| **QuranReader** | Full Uthmani text, translations, audio, Tajwid colors | ✅ | 75% |
| **Waktu Solat** | JAKIM-accurate prayer times, notifications, tracker | ⚠️ Mock | 60% |
| **Kompas Kiblat** | Accurate Qibla finder, offline-capable | ⚠️ Static | 60% |
| **Koleksi Doa & Zikir** | Categorized library with audio | ✅ | 80% |
| **Kalendar Islam** | Hijri calendar with events | 🔴 Missing | 0% |

### 4.4 TIER 3: Advanced Features

| Feature | Description | Status | Completion |

|---------|-------------|--------|------------|
| **Perancang Pembelajaran** | AI-powered spaced repetition planner | ⚠️ UI Only | 40% |
| **Penerang Ayat** | Detailed Tafsir and context for any verse | ⚠️ Basic | 40% |
| **Perpustakaan Hadith** | Kutub al-Sittah searchable | 🔴 Missing | 0% |
| **Profil & Kemajuan** | User stats, achievements dashboard | ✅ | 70% |
| **Gamification** | XP, badges, leaderboards | ⚠️ | 60% |

### 4.5 Feature Access by Tier

| Feature | PERCUMA | PRO (RM9.90/mo) | KELUARGA (RM19.90/mo) |

|---------|---------|-----------------|----------------------|
| QuranReader | ✅ Full | ✅ Full | ✅ Full |
| Waktu Solat | ✅ Full | ✅ Full | ✅ Full |
| Kompas Kiblat | ✅ Full | ✅ Full | ✅ Full |
| Doa & Zikir | ✅ Full | ✅ Full | ✅ Full |
| AI Ustaz - Iqra | ⚠️ Iqra 1 only | ✅ Iqra 1-6 | ✅ Iqra 1-6 |
| AI Tutor Tajwid | ⚠️ 10/month | ✅ Unlimited | ✅ Unlimited |
| Tanya Ustaz AI | ⚠️ 50/month | ✅ Unlimited | ✅ Unlimited |
| Perancang Pembelajaran | ⚠️ Limited | ✅ Full | ✅ Full |
| Perpustakaan Hadith | ❌ | ✅ | ✅ |
| Mod Luar Talian | ❌ | ✅ | ✅ |
| Analitik Lanjutan | ❌ | ✅ | ✅ |
| Sijil Digital | ❌ | ✅ | ✅ |
| Papan Pemuka Guru | ❌ | ❌ | ✅ |
| Family Members | 1 | 1 | 6 |
| Ads | ❌ None | ❌ None | ❌ None |

---
## 5. Technical Architecture
### 5.1 Technology Stack
#### Frontend

| Layer | Technology | Version | Rationale |

|-------|------------|---------|-----------|
| **Framework** | React | 19.2.0 | Latest features, concurrent rendering |
| **Build Tool** | Vite | 7.2.4 | Fast HMR, optimized builds |
| **Language** | TypeScript | 5.9.3 | Type safety, better DX |
| **Styling** | Tailwind CSS | 4.1.17 | Utility-first, consistent design |
| **State** | Zustand | 5.0.8 | Minimal, performant, TypeScript-native |
| **Routing** | React Router | 7.9.6 | Declarative, nested routing |
| **Animations** | Framer Motion | 12.23.24 | Production-ready animations |
| **Icons** | Lucide React | 0.554.0 | Consistent icon set |
| **Data Fetching** | TanStack Query | 5.90.10 | Caching, background sync |
| **Virtualization** | react-window | 2.2.3 | Performant long lists |

#### Backend

| Layer | Technology | Rationale |

|-------|------------|-----------|
| **Platform** | Supabase | All-in-one BaaS with generous free tier |
| **Database** | PostgreSQL | Robust, full-featured RDBMS |
| **Authentication** | Supabase Auth | Email, Phone, OAuth support |
| **Storage** | Supabase Storage | File storage with CDN |
| **Realtime** | Supabase Realtime | WebSocket subscriptions |
| **Edge Functions** | Hono + Deno | Serverless compute at edge |

#### AI & External APIs

| Service | Technology | Purpose |

|---------|------------|---------|
| **LLM** | Zhipu AI (GLM-4 Series) | Chat, text generation |
| **Vision** | GLM-4.5V | OCR, image understanding |
| **Image Gen** | CogView-4 | Content creation |
| **Video Gen** | CogVideoX-3 | Promotional content |
| **Speech** | Web Speech API + Transformers.js | Voice recognition |
| **Prayer Times** | JAKIM API / Aladhan | Accurate calculations |

### 5.2 System Architecture
```text
┌──────────────────────────────────────────────────────────────────────┐
│                              CLIENT                                   │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  React 19 + Vite + TypeScript                                   │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │ │
│  │  │ Modules  │ │  Shared  │ │  Stores  │ │   AI     │           │ │
│  │  │  (15)    │ │Components│ │ (Zustand)│ │ Worker   │           │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────┬────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
┌───────────────────────────────┐  ┌───────────────────────────────┐
│       SUPABASE BACKEND        │  │       EXTERNAL APIS           │
│  ┌─────────────────────────┐  │  │  ┌─────────────────────────┐  │
│  │     PostgreSQL DB       │  │  │  │     Zhipu AI API        │  │
│  │  (RLS-protected)        │  │  │  │  (GLM-4, CogView, etc)  │  │
│  └─────────────────────────┘  │  │  └─────────────────────────┘  │
│  ┌─────────────────────────┐  │  │  ┌─────────────────────────┐  │
│  │    Supabase Auth        │  │  │  │     JAKIM API           │  │
│  │  (Email, Phone, OAuth)  │  │  │  │  (Prayer Times)         │  │
│  └─────────────────────────┘  │  │  └─────────────────────────┘  │
│  ┌─────────────────────────┐  │  │  ┌─────────────────────────┐  │
│  │   Edge Functions        │  │  │  │     Quran.com API       │  │
│  │  (Hono + Deno)          │  │  │  │  (Text, Audio)          │  │
│  └─────────────────────────┘  │  │  └─────────────────────────┘  │
│  ┌─────────────────────────┐  │  │  ┌─────────────────────────┐  │
│  │   Supabase Storage      │  │  │  │     Payment Gateway     │  │
│  │  (Media, Downloads)     │  │  │  │  (ToyyibPay/Stripe)     │  │
│  └─────────────────────────┘  │  │  └─────────────────────────┘  │
└───────────────────────────────┘  └───────────────────────────────┘
```
### 5.3 Module Architecture
```text
src/
├── modules/                    # Feature-based modules (15 total)
│   ├── admin/                 # Admin Dashboard & CMS
│   ├── ai-hub/                # SmartDeen AI features
│   ├── auth/                  # Authentication flows
│   ├── barakah/               # Infaq & Transparency
│   ├── community/             # Social Feed
│   ├── dashboard/             # Main User Dashboard
│   ├── family/                # Family Plan features
│   ├── gamification/          # Badges & Leaderboards
│   ├── ibadah/                # Prayer, Qibla, Zakat, Tasbih
│   ├── iqra/                  # Education Hub (Iqra 1-6)
│   ├── multimedia/            # TV & FM content
│   ├── profile/               # User settings
│   ├── quran/                 # Quran Reader
│   └── souq/                  # Marketplace
├── shared/                     # Shared infrastructure
│   ├── components/            # Reusable UI components
│   │   ├── layout/            # MainLayout, BottomNav, SplashScreen
│   │   ├── ui/                # Buttons, Cards, Modals
│   │   └── visuals/           # WaveformVisualizer, etc
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API & external services
│   │   ├── ai/                # HybridEngine, Zhipu, Worker
│   │   └── supabase/          # DB client, auth
│   └── utils/                 # Helper functions
├── stores/                     # Zustand state stores
│   ├── audioStore.ts          # Universal audio player state
│   ├── infaqStore.ts          # Donation flow state
│   ├── uiStore.ts             # UI preferences
│   ├── iqraStore.ts           # Iqra learning state (NEW)
│   └── userStore.ts           # User profile state (NEW)
└── config/                     # App configuration
```
---
## 6. Data Architecture & Schema
### 6.1 Core Database Tables
#### `profiles` (Users)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  name TEXT,
  avatar_url TEXT,
  tier TEXT DEFAULT 'FREE' CHECK (tier IN ('FREE', 'PRO', 'FAMILY')),
  subscription_expires TIMESTAMPTZ,
  family_id UUID REFERENCES families(id),
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_sign_in TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);
```
#### `iqra_student_progress`
```sql
CREATE TABLE iqra_student_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  iqra_level INT NOT NULL CHECK (iqra_level BETWEEN 1 AND 6),
  current_page INT DEFAULT 1,
  pages_completed INT DEFAULT 0,
  total_pages INT DEFAULT 30,
  average_accuracy DECIMAL(5,2) DEFAULT 0,
  time_spent_minutes INT DEFAULT 0,
  last_studied_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, iqra_level)
);
```
#### `prayer_tracker`
```sql
CREATE TABLE prayer_tracker (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  prayer TEXT NOT NULL CHECK (prayer IN ('subuh','zohor','asar','maghrib','isyak')),
  completed BOOLEAN DEFAULT FALSE,
  prayed_at TIMESTAMPTZ,
  prayed_on_time BOOLEAN,
  UNIQUE(user_id, date, prayer)
);
```
#### `quran_progress`
```sql
CREATE TABLE quran_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  surah_number INT NOT NULL,
  ayah_number INT NOT NULL,
  action TEXT CHECK (action IN ('read', 'memorized', 'bookmarked')),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, surah_number, ayah_number, action)
);
```
#### `ai_conversations`
```sql
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  session_id UUID NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  sources JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```
#### `families`
```sql
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES profiles(id) NOT NULL,
  max_members INT DEFAULT 6,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```
#### `gamification_stats`
```sql
CREATE TABLE gamification_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  xp INT DEFAULT 0,
  level INT DEFAULT 1,
  streak_days INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb
);
```
### 6.2 Row Level Security (RLS) Policies
All user-data tables MUST have RLS enabled:
```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE iqra_student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_tracker ENABLE ROW LEVEL SECURITY;
-- Users can only read/write their own data
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
-- Family members can view family data"
  ON iqra_student_progress FOR SELECT
  USING (
    user_id = auth.uid() OR
    user_id IN (
      SELECT id FROM profiles
      WHERE family_id = (SELECT family_id FROM profiles WHERE id = auth.uid())
    )
  );
```
---
## 7. AI & Machine Learning Strategy
### 7.1 Hybrid AI Engine Architecture
QuranPulse uses a **3-Layer Hybrid AI Architecture** for optimal performance, privacy, and cost efficiency:
```text
┌─────────────────────────────────────────────────────────────────┐
│                    HYBRID AI ENGINE                             │
├─────────────────────────────────────────────────────────────────┤
│  Layer 1: LOCAL (Browser-based)                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ • Local Knowledge Base (Regex Matcher)                      ││
│  │ • Web Speech API (TTS)                                      ││
│  │ • Offline capable, zero latency                             ││
│  │ • Privacy: Audio never leaves device                        ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│  Layer 2: EDGE (Supabase Edge Functions)                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ • Authentication & User Data                                ││
│  │ • Request validation & rate limiting                        ││
│  │ • Response caching                                          ││
│  │ • Key rotation for multiple free tier accounts              ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│  Layer 3: CLOUD (Google AI)                                     │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ • Gemini 2.5 Flash: Chat, Q&A (TanyaUstaz)                  ││
│  │ • Gemini 1.5 Pro: Fallback Logic                            ││
│  │ • ElevenLabs: Neural TTS (Ustaz Voice)                      ││
│  │ • CogVideoX-3: Video generation (Admin)                     ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```
### 7.2 AI Orchestration by Feature

| Feature | User Action | AI Model | Processing | Status |

|---------|-------------|----------|------------|--------|
| **Tanya Ustaz** | Chat question | GLM-4-Flash | Edge → Cloud | ⚠️ Wire needed |
| **Iqra Voice** | Record audio | Whisper (Local) | Browser Worker | ⚠️ Mock |
| **Iqra Scan** | Upload photo | GLM-4.5V | Edge → Cloud | 🔴 Not built |
| **Tajwid Check** | Record recitation | Whisper + Custom | Local + Edge | ⚠️ Mock |
| **Learning Planner** | Request plan | GLM-4-Flash | Edge → Cloud | ⚠️ UI only |
| **Ayah Explainer** | Select verse | GLM-4-Flash | Edge → Cloud | ⚠️ Basic |
| **Admin Image Gen** | Generate poster | CogView-4 | Edge → Cloud | ✅ Ready |

### 7.3 AI Safety & Islamic Compliance
**Mandatory Safeguards:**
1. **Source Attribution**: All fatwa responses MUST cite official sources
2. **Disclaimer**: Clear disclaimer that AI is not a replacement for qualified scholars
3. **Content Filtering**: Block non-Islamic or inappropriate queries
4. **Shafi'i Alignment**: Default to Shafi'i madhab for Malaysian users
5. **Human Review**: Flagged responses require scholar verification
**System Prompt Template:**
```text
You are Ustaz AI, an Islamic knowledge assistant for QuranPulse.
RULES:
1. Only answer questions related to Islam
2. Cite Quran verses with Surah:Ayah format
3. Reference authentic Hadith with collection and number
4. For Malaysian-specific questions, reference JAKIM rulings
5. Always clarify if there are multiple scholarly opinions
6. Never give medical, legal, or financial advice
7. Encourage users to consult qualified scholars for complex matters
8. Default to Shafi'i madhab unless user specifies otherwise
RESPONSE FORMAT:
- Clear, respectful Bahasa Malaysia or English
- Include relevant Quran/Hadith references
- Provide source links when available
```
---
## 8. Security & Compliance
### 8.1 Security Architecture
#### Authentication Flow
```text
User ─────► Supabase Auth ─────► JWT Token ─────► Protected Routes
              │
              ├── Email/Password
              ├── Phone OTP (WhatsApp)
              ├── Google OAuth
              └── Apple OAuth (iOS)
```
#### API Security

| Layer | Protection |

|-------|------------|
| **Client → Edge** | HTTPS only, Supabase API key |
| **Edge → Zhipu** | Server-side, key rotation |
| **Database** | RLS policies, prepared statements |
| **Storage** | Presigned URLs, access policies |

#### Key Rotation (Zero-Cost Strategy)
```typescript
// KeyRotator.ts
class KeyRotator {
  private keys: string[];
  private currentIndex: number = 0;
  
  rotate(): string {
    const key = this.keys[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.keys.length;
    return key;
  }
  
  handleRateLimitError(): string {
    // Automatically switch to next key when rate limited
    return this.rotate();
  }
}
```
### 8.2 JAKIM Compliance
**Requirements for Islamic App Compliance:**

| Requirement | Implementation | Status |

|-------------|----------------|--------|
| **Prayer Time Accuracy** | JAKIM calculation method | ⚠️ Pending |
| **Quran Text Integrity** | SHA-256 verified Uthmani text | ✅ |
| **Content Verification** | Scholar review process | 📋 Planned |
| **Halal Product Verification** | JAKIM certification check | 📋 Planned |
| **Data Privacy (PDPA)** | User consent, data deletion | ✅ |

### 8.3 Data Privacy (PDPA Malaysia)
**User Data Rights:**
- Right to access personal data
- Right to correct inaccurate data
- Right to withdraw consent
- Right to data deletion
**Implementation:**
- Export user data endpoint
- Delete account with cascade
- Privacy policy with clear consent
- Cookie/tracking consent banner
---
## 9. Design System & User Experience
### 9.1 Visual Identity
**Theme: "Modern Digital Kufi"**
A deliberate fusion of ancient Islamic art with modern technology aesthetics.
#### Color Palette

| Color | Hex | Usage |

|-------|-----|-------|
| **Neon Cyan** | `#00E5FF` | Primary accent, technology, "pulse" |
| **Gold** | `#FFD700` | Divine light, premium, highlights |
| **Deep Black** | `#050505` | Background ("Layl" theme) |
| **Dark Gray** | `#1A1A1A` | Card backgrounds |
| **White** | `#FFFFFF` | Text, icons |
| **Emerald** | `#10B981` | Success states |
| **Amber** | `#F59E0B` | Warning states |
| **Rose** | `#F43F5E` | Error states |

#### Typography

| Type | Font | Usage |

|------|------|-------|
| **Headers** | Reem Kufi | Arabic-inspired, display text |
| **Body** | Inter | Clean, readable, modern |
| **Arabic** | Amiri Quran | Authentic Quranic text |
| **Monospace** | JetBrains Mono | Code, timing |

#### Design Principles
1. **Glassmorphism**: Frosted glass effects for depth
2. **Glow Effects**: Subtle neon glows for interactivity
3. **Micro-animations**: Smooth transitions for premium feel
4. **High Contrast**: Accessibility on dark backgrounds
5. **Islamic Motifs**: Geometric patterns, no figurative imagery
### 9.2 Navigation Architecture
```text
App Structure
├── (Auth)
│   ├── /login
│   └── /register
├── (App Shell - Bottom Tabs)
│   ├── /home              # Dashboard
│   ├── /quran             # Quran Hub
│   ├── /iqra              # Iqra Hub
│   ├── /community         # Social Feed
│   └── /profile           # Settings
└── (Full Screen Stacks)
    ├── /tanya-ustaz       # AI Chat
    ├── /ibadah            # Prayer Tools
    ├── /media/:id         # Media Player
    ├── /souq              # Marketplace
    └── /admin             # Admin Panel (role-gated)
```
### 9.3 Responsive Breakpoints

| Breakpoint | Width | Target |

|------------|-------|--------|
| `sm` | 640px | Mobile (portrait) |
| `md` | 768px | Mobile (landscape), Small tablets |
| `lg` | 1024px | Tablets |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large desktops |

### 9.4 Component Library
**Using custom components with Shadcn/ui patterns:**

| Component | Description | Status |

|-----------|-------------|--------|
| `Button` | Primary, secondary, ghost variants | ✅ |
| `Card` | Glassmorphic cards | ✅ |
| `Modal` | Animated overlays | ✅ |
| `Toast` | Notifications (Sonner) | ✅ |
| `BottomNav` | Mobile navigation | ✅ |
| `BottomSheet` | Swipeable panels | ✅ |
| `Skeleton` | Loading states | 📋 Needed |
| `Tabs` | Content organization | ✅ |

---
## 10. Monetization & Business Model
### 10.1 Subscription Tiers
#### "Asas" (PERCUMA / Free)

| Attribute | Details |

|-----------|---------|
| **Price** | RM 0 (Free forever) |
| **Target** | New users, trial, low-income segment |
| **Limits** | Iqra 1 only, 50 AI requests/month, 100 Duas |
| **Value Prop** | Access to core Islamic tools at no cost |

#### "Premium" (PRO)

| Attribute | Details |

|-----------|---------|
| **Price** | RM 9.90/month or RM 99/year (17% savings) |
| **Target** | Serious learners, adults, professionals |
| **Features** | Unlimited AI, full Iqra 1-6, certificates, offline mode |
| **Value Prop** | Complete AI-powered Quran education for RM 0.33/day |

#### "Keluarga" (FAMILY)

| Attribute | Details |

|-----------|---------|
| **Price** | RM 19.90/month or RM 199/year (17% savings) |
| **Target** | Parents with children, large families |
| **Features** | PRO for 6 members, parent dashboard, family analytics |
| **Value Prop** | 67% savings vs individual plans (RM 3.32/user/month) |

### 10.2 Pricing Psychology
```text
Individual PRO:  RM 9.90 × 6 = RM 59.40/month for a family
Family Plan:     RM 19.90/month for 6 users
Savings:         RM 39.50/month = 67% discount
Yearly Anchor:   12 × RM 9.90 = RM 118.80
Yearly Price:    RM 99 (17% savings displayed prominently)
```
### 10.3 Conversion Funnel
```text
Awareness ───► Acquisition ───► Activation ───► Engagement ───► Monetization ───► Retention ───► Revenue Expansion
   │               │                │               │                │               │                │
   │         Download/Signup    First Action    Daily Use      Upgrade Prompt   Renewal         Family Upgrade
   │                              (24 hrs)      (7 days)           │           (Annual)         │
   │                                                               │                            │
   ▼                                                               ▼                            ▼
Marketing                                                   Soft Prompts:                 Smart Prompts:
- Social Media                                              - "AI quota 20% left"          - "Add family member"
- App Store                                                 - "PRO" badges                 - "Gift subscription"
- Influencer                                                - Feature tooltips             - "Refer a friend"
                                                            Hard Prompts:
                                                            - Limit reached modal
                                                            - "Upgrade to continue"
                                                            - Limited time offers
```
### 10.4 Revenue Projections
**Year 1 Targets:**

| Metric | Target |

|--------|--------|
| Total Signups | 10,000 (Month 1), 100,000 (Year 1) |
| Monthly Active Users | 50,000 |
| Conversion Rate | 10% |
| Paying Users | 10,000 |
| Average Revenue Per User | RM 80/year |
| Projected ARR | **RM 800,000** |

---
## 11. Success Metrics & KPIs
### 11.1 Product Metrics

| Category | Metric | Target | Measurement |

|----------|--------|--------|-------------|
| **Acquisition** | New signups | 10,000 (M1) | Supabase auth events |
| **Activation** | First action in 24h | 60% | Event tracking |
| **Engagement** | DAU | 10,000 (6mo) | Active session count |
| **Engagement** | DAU/MAU ratio | >30% | Stickiness indicator |
| **Retention** | D7 retention | >40% | Cohort analysis |
| **Retention** | D30 retention | >20% | Cohort analysis |

### 11.2 Business Metrics

| Metric | Target | Notes |

|--------|--------|-------|
| FREE → PRO Conversion | 10% (Y1) | Primary revenue driver |
| ARR | RM 800,000 (Y1) | Sustainable business |
| CLV (Customer Lifetime Value) | >RM 100 | Healthy unit economics |
| CAC (Customer Acquisition Cost) | <RM 20 | Organic + paid mix |
| Churn Rate | <5% monthly | High retention priority |

### 11.3 Learning Metrics

| Metric | Target | Purpose |

|--------|--------|---------|
| Iqra 1 Completion | 80% | Core value demonstration |
| Full Iqra Completion (PRO) | 50% | End-to-end learning |
| AI Tajwid Accuracy | >85% | Quality assurance |
| Avg. Session Duration | >10 mins | Engagement depth |
| Lessons per Week | >5 | Learning consistency |

### 11.4 Customer Satisfaction

| Metric | Target | Measurement |

|--------|--------|-------------|
| NPS (Net Promoter Score) | >50 | In-app survey |
| App Store Rating | 4.5+ stars | Store listing |
| Support Response Time | <24 hours | Helpdesk metrics |
| Feature Request Implementation | 30% | Community engagement |

---
## 12. Development Roadmap
### 12.1 Phase 1: MVP (0-3 Months)

**Goal:** Launch core features to early adopters for validation

| Track | Features | Status |
|-------|----------|--------|
| **Auth** | Email, phone signup, profile | ✅ 85% |
| **Quran** | Reader, audio, basic navigation | ✅ 75% |
| **Iqra** | Levels 1-6 UI, mock feedback | ⚠️ 50% |
| **AI** | TanyaUstaz chat interface | ⚠️ 50% |
| **Ibadah** | Prayer times, Qibla, Tasbih | ⚠️ 60% |
| **Infra** | Supabase, Edge Functions | ✅ 80% |

**Exit Criteria:**
- All P0 features functional
- <5 critical bugs
- Islamic content verified
- 100 beta users testing
### 12.2 Phase 2: Beta Launch (3-6 Months)

**Goal:** Public beta for feedback and conversion model validation

| Track | Features | Priority |
|-------|----------|----------|
| **AI Wiring** | Connect TanyaUstaz to HybridEngine | P0 |
| **Real Data** | JAKIM prayer times, device Qibla | P0 |
| **Tier 2** | Learning Planner, Ayah Explainer | P1 |
| **Monetization** | Subscription tiers, paywall | P1 |
| **Analytics** | Event tracking, conversion funnels | P1 |
| **Offline** | PWA with cached content | P2 |

**Exit Criteria:**
- 1,000 active users
- 5% conversion rate
- NPS > 40
### 12.3 Phase 3: Public Launch (6-9 Months)

**Goal:** Official launch with marketing campaign

| Track | Features | Priority |
|-------|----------|----------|
| **Tier 3** | Hadith Library, advanced Tafsir | P1 |
| **Social** | Study circles (Halaqah) | P1 |
| **Premium** | Live sessions with Ustaz | P2 |
| **Memorization** | Quran memorization tools | P2 |
| **Calendar** | Islamic calendar with events | P1 |

**Exit Criteria:**
- 10,000 active users
- 10% conversion rate
- MRR RM 50,000
### 12.4 Phase 4: Growth & Scale (9-12 Months)

**Goal:** Scale to 100,000 users and optimize monetization

| Track | Features | Priority |
|-------|----------|----------|
| **Kids Mode** | Child-safe interface | P1 |
| **Wearables** | Smartwatch companion | P2 |
| **B2B** | Corporate/institutional plans | P1 |
| **Localization** | Indonesian market expansion | P2 |
| **Performance** | CDN, edge caching | P1 |

**Exit Criteria:**
- 100,000 active users
- 15% conversion rate
- MRR RM 200,000
---
## 13. Risk Assessment & Mitigation
### 13.1 Technical Risks

| Risk | Impact | Probability | Mitigation |

|------|--------|-------------|------------|
| **AI API Downtime** | High | Medium | Cached responses, backup provider, graceful degradation |
| **Security Breach** | Critical | Low | Regular audits, penetration testing, RLS policies |
| **Performance Issues** | High | Medium | React Query caching, virtualization, CDN |
| **Database Scaling** | Medium | Low | Supabase Pro tier, read replicas |

### 13.2 Business Risks

| Risk | Impact | Probability | Mitigation |

|------|--------|-------------|------------|
| **Low Conversion** | High | Medium | A/B test pricing, enhance value demos, free trials |
| **Competitor Launch** | Medium | High | Continuous innovation, brand loyalty, community |
| **Payment Gateway Issues** | High | Low | Multiple providers (ToyyibPay, Stripe) |
| **Free Tier Exhaustion** | High | Medium | Key rotation, usage optimization, tier upgrades |

### 13.3 Content & Compliance Risks

| Risk | Impact | Probability | Mitigation |

|------|--------|-------------|------------|
| **AI Incorrect Fatwa** | Critical | Low | Scholar review, source citations, disclaimers |
| **Tajwid Feedback Errors** | High | Medium | User feedback loop, manual validation, training data |
| **JAKIM Non-compliance** | High | Low | Official consultation, documented processes |
| **Copyright Issues** | Medium | Low | Licensed content, proper attribution |

---
## 14. Implementation Status
### 14.1 Current State Summary

| Category | Completion | Notes |

|----------|------------|-------|
| **Overall** | 🟡 70% | Strong foundation, needs integration |
| **UI/UX** | ✅ 90% | Premium, polished |
| **Architecture** | ✅ 90% | Modern, scalable |
| **Backend Integration** | ⚠️ 50% | Too many mocks |
| **AI Wiring** | ⚠️ 40% | HybridEngine unused |
| **Monetization** | 🔴 10% | Not implemented |
| **Analytics** | 🔴 5% | No tracking |

### 14.2 Module Readiness

| Module | Status | Completion | Critical Actions |

|--------|--------|------------|------------------|
| Dashboard | ✅ High | 90% | Connect to real data |
| Auth | 🟡 Functional | 85% | Add password recovery |
| Quran | ✅ High | 75% | Add offline cache |
| Iqra | 🟠 Partial | 50% | Wire to AI |
| Ibadah | 🟠 Partial | 60% | **JAKIM API critical** |
| AI Hub | 🟠 Partial | 50% | Wire to HybridEngine |
| Souq | 🔴 Low | 40% | Payment integration |
| Barakah | ✅ High | 80% | Real payment gateway |
| Family | 🟡 Functional | 70% | RLS hardening |
| Gamification | 🟡 Functional | 60% | Build event engine |
| Multimedia | 🔴 Placeholder | 30% | Full implementation |
| Admin | 🟡 Functional | 60% | Role-based protection |
### 14.3 Critical Path to Launch
```text
Priority 1: Data Integration (Weeks 1-4)
├── Replace mock prayer times with JAKIM API
├── Connect Qibla to device magnetometer
└── Implement offline Quran caching
Priority 2: AI Wiring (Weeks 2-6)
├── Connect TanyaUstaz to HybridEngine
├── Wire IqraRecorder to speech recognition
└── Implement Tajwid feedback with citations
Priority 3: Monetization (Weeks 4-8)
├── Build subscription management
├── Integrate ToyyibPay/Stripe
└── Implement feature gating
Priority 4: Analytics (Weeks 6-10)
├── Implement event tracking
├── Build conversion funnels
└── Create admin analytics dashboard
Priority 5: Polish & Launch (Weeks 8-12)
├── PWA with offline support
├── Security audit
├── Beta user testing
└── Marketing preparation
```
---
## 15. Appendix
### 15.1 Glossary
#### Islamic Terms
| Term | Definition |
|------|------------|
| **Iqra** | Foundational method for learning to read Al-Quran (6 levels) |
| **Tajwid** | Rules governing pronunciation during Quran recitation |
| **Tafsir** | Exegesis or commentary on Quran verses |
| **Khatam** | Completing a full reading of the entire Quran |
| **Solat** | Prayer (Malaysian term) |
| **Qiblat** | Direction of Kaaba in Mecca (Malaysian term) |
| **JAKIM** | Malaysian government Islamic authority |
| **Shafi'i** | School of Islamic jurisprudence predominant in Malaysia |
#### Technical Terms
| Term | Definition |
|------|------------|
| **PWA** | Progressive Web App (installable, offline-capable) |
| **RLS** | Row Level Security (database access control) |
| **DAU/MAU** | Daily/Monthly Active Users |
| **ARR/MRR** | Annual/Monthly Recurring Revenue |
| **CLV** | Customer Lifetime Value |
| **CAC** | Customer Acquisition Cost |
| **NPS** | Net Promoter Score |
### 15.2 External References
| Resource | URL | Purpose |
|----------|-----|---------|
| JAKIM | https://www.islam.gov.my | Official Malaysian Islamic authority |
| MyHadith | https://myhadith.islam.gov.my | Official Hadith reference |
| E-Fatwa | https://efatwa.muftiwp.gov.my | Official fatwa database |
| Quran.com | https://quran.com | Quran text and audio API |
| Aladhan | https://aladhan.com | Prayer times API |
| Supabase | https://supabase.com/docs | Backend documentation |
| Zhipu AI | https://open.bigmodel.cn | AI API documentation |
### 15.3 Contact & Stakeholders
| Role | Responsibility |
|------|----------------|
| **Product Owner** | Vision, priorities, stakeholder management |
| **Tech Lead** | Architecture, technical decisions |
| **Islamic Advisor** | Content verification, JAKIM compliance |
| **UX Designer** | Design system, user research |
| **Frontend Developer** | React, UI implementation |
| **Backend Developer** | Supabase, Edge Functions, AI integration |
---
## Document History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Nov 2024 | Team | Initial v6.0 PRD |
| 2.0 | Dec 2025 | Antigravity | Comprehensive consolidation, implementation status |
---
*This document is the authoritative source of truth for QuranPulse v6.0 development. All teams should reference this PRD for feature specifications, technical requirements, and business objectives.*
