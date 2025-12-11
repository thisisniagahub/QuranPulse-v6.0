# 🗄️ QURANPULSE v6.0 DATABASE SCHEMAS (Supabase)

> **Purpose:** Definitive source of truth for all Database Tables, Relations, and RLS Policies.
> **Context:** Integrates "User Progress" (PRD) with "Official Data Ecosystem" (Benchmarks).

---

## 1. 👥 CORE USER & IDENTITY
*Foundation for Auth, Profiles, and Family plans.*

### `public.profiles`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | PK, refs `auth.users` (1:1). |
| `username` | `text` | Unique handle (e.g. @ahmad). |
| `full_name` | `text` | Display name. |
| `avatar_url` | `text` | Profile picture. |
| `tier` | `enum` | `FREE`, `PRO`, `FAMILY`. |
| `family_id` | `uuid` | FK to `families.id`. |
| `is_verified_tutor`| `boolean`| Manually verified Quran teacher. |
| `created_at` | `timestamptz`| Auto-generated. |

### `public.families`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | PK. |
| `owner_id` | `uuid` | The "Head of Household". |
| `name` | `text` | "Keluarga Haji Ahmad". |
| `max_members` | `int` | Default 6. |

---

## 2. 📖 IQRA & LEARNING ENGINE
*Tracks granularity of student progress.*

### `public.iqra_progress`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | PK. |
| `user_id` | `uuid` | FK `profiles.id`. |
| `level` | `int` | 1-6. |
| `page_number` | `int` | Current page (1-30). |
| `accuracy_score` | `float` | AI-assessed (0.0 - 1.0). |
| `audio_url` | `text` | Link to user's recording (Storage). |
| `verified_by_human`| `boolean`| If validated by parent/teacher. |

---

## 3. 🕋 IBADAH & TRACKING
*Daily spiritual habits.*

### `public.prayer_logs`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | PK. |
| `user_id` | `uuid` | FK. |
| `date` | `date` | YYYY-MM-DD. |
| `prayer` | `enum` | `subuh`, `zohor`, `asar`, `maghrib`, `isyak`. |
| `status` | `enum` | `early`, `on_time`, `late`, `missed`. |
| `location_lat` | `float` | Optional (check-in at mosque). |
| `location_long` | `float` | Optional. |

---

## 4. 🇲🇾 OFFICIAL DATA INTEGRATIONS (The "Pulse" Layer)
*New tables to store scraped/API data from Government Benchmarks.*

### `public.official_mosques` (Source: JAKIM)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | PK. |
| `name` | `text` | E.g., "Masjid Negara". |
| `type` | `enum` | `national`, `state`, `district`, `kariah`. |
| `address` | `text` | Full address. |
| `state` | `text` | "Selangor", "KL", etc. |
| `coordinates` | `geography` | PostGIS point (Lat/Long). |
| `jakim_code` | `text` | Official reference code. |

### `public.halal_directory` (Source: SmartHalal)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | PK. |
| `company_name` | `text` | Manufacturer/Premise. |
| `product_name` | `text` | Item name. |
| `cert_number` | `text` | JAKIM Halal Cert ID. |
| `expiry_date` | `date` | Certification expiry. |
| `status` | `enum` | `valid`, `expired`, `suspended`. |

### `public.zakat_centers` (Source: State Agencies)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | PK. |
| `agency_name` | `text` | "LZS", "PPZ-MAIWP". |
| `branch_name` | `text` | "Cawangan Shah Alam". |
| `services` | `jsonb` | `["payment", "application", "consultation"]`. |
| `operating_hours`| `jsonb` | Opening times. |

---

## 5. 🤖 AI & KNOWLEDGE BASE
*Storing content for `Ustaz AI` Context.*

### `public.fatwa_knowledge_base` (Source: E-Fatwa/Mufti)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | PK. |
| `title` | `text` | Question/Topic. |
| `content` | `text` | The ruling/answer. |
| `source_url` | `text` | Official link (Compliance). |
| `category` | `text` | "Aqidah", "Fiqh", "Social". |
| `embedding` | `vector` | OpenAI/Supabase embedding (1536). |

### `public.hadith_collection` (Source: JAKIM/SmartHadith)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | PK. |
| `collection` | `text` | "Bukhari", "Muslim". |
| `number` | `int` | Hadith number. |
| `text_ar` | `text` | Arabic text. |
| `text_ms` | `text` | Malay translation (Official). |
| `grade` | `text` | `Sahih`, `Hasan`, `Daif`. |

---

## 6. 🛡️ SECURITY POLICIES (RLS)

### Rules
1.  **Public Data:** `official_mosques`, `halal_directory`, `fatwa_knowledge_base` are **READ ONLY** for all users (anon/auth).
2.  **User Data:** `profiles`, `iqra_progress`, `prayer_logs` are **CRUD** only for `auth.uid() = user_id`.
3.  **Family Data:** `families` allow read access if `auth.uid()` is in `profiles.family_id`.

## 7. NEXT STEPS
1.  Run Migration Scripts (SQL).
2.  Build "ingestion scripts" to populate Section 4 & 5 from `OFFICIAL_DATA_SOURCES.md`.
