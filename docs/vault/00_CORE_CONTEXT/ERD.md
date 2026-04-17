# 🗂️ QURANPULSE v6.0 ENTITY RELATIONSHIP DIAGRAM (ERD)

> **Purpose:** Visual representation of the database structure and relationships.
> **Source:** Based on `DATABASE_SCHEMA.md` and `PRD.md`.
> **Format:** Mermaid Class Diagram.

---

## 🗺️ HIGH-LEVEL ARCHITECTURE

The database is built on **Supabase (PostgreSQL)** and follows a modular "Star Schema" approach where the `profiles` table is the central hub connecting all user activities.

```mermaid
erDiagram
    %% ---------------------------------------------------------
    %% 1. CORE USER & IDENTITY PREMIS
    %% ---------------------------------------------------------
    profiles ||--o{ families : "creates/owns"
    families ||--|{ profiles : "contains members"
    profiles ||--o{ auth_users : "link to auth"

    profiles {
        uuid id PK
        string username
        string full_name
        string avatar_url
        enum tier "FREE, PRO, FAMILY"
        uuid family_id FK
        boolean is_verified_tutor
        timestamp created_at
    }

    families {
        uuid id PK
        string name
        uuid owner_id FK
        int max_members
        timestamp created_at
    }

    %% ---------------------------------------------------------
    %% 2. LEARNING ENGINE (IQRA & QURAN)
    %% ---------------------------------------------------------
    profiles ||--o{ iqra_progress : "tracks"
    
    iqra_progress {
        uuid id PK
        uuid user_id FK
        int level "1-6"
        int page_number "1-30"
        float accuracy_score "0.0-1.0"
        string audio_url
        boolean verified_by_human
        timestamp updated_at
    }

    %% ---------------------------------------------------------
    %% 3. IBADAH & TRACKING
    %% ---------------------------------------------------------
    profiles ||--o{ prayer_logs : "logs"

    prayer_logs {
        uuid id PK
        uuid user_id FK
        date date
        enum prayer "subuh, zohor, asar, maghrib, isyak"
        enum status "early, on_time, late, missed"
        float location_lat
        float location_long
    }

    %% ---------------------------------------------------------
    %% 4. OFFICIAL DATA (REFERENCE TABLES)
    %% Independent Reference Data (No direct FK to users usually)
    %% ---------------------------------------------------------
    
    official_mosques {
        uuid id PK
        string name
        enum type "national, state, district"
        string jakim_code
        geography coordinates
    }

    halal_directory {
        uuid id PK
        string company_name
        string product_name
        string cert_number
        date expiry_date
        enum status "valid, suspended"
    }

    zakat_centers {
        uuid id PK
        string agency_name
        string branch_name
        jsonb services
    }

    %% ---------------------------------------------------------
    %% 5. AI KNOWLEDGE BASE (EMBEDDINGS)
    %% ---------------------------------------------------------

    fatwa_knowledge_base {
        uuid id PK
        string title
        text content
        vector embedding "1536 dim"
        string source_url
    }

    hadith_collection {
        uuid id PK
        string collection
        int number
        text text_ar
        text text_ms
        string grade
    }
```

---

## 🔗 RELATIONSHIP KEYS

### **User & Family Dynamics**
*   **One-to-Many**: A User (`profiles.id`) can be an owner of one Family, but implies membership.
*   **Recursive**: The `family_id` column in `profiles` creates the membership link.

### **Progress Tracking**
*   **Composite Uniqueness:** For `prayer_logs`, we enforce uniqueness on `(user_id, date, prayer)` to prevents duplicate logs for the same prayer slot.
*   **Granularity:** `iqra_progress` tracks every page attempt.

### **Official Data**
*   These tables (`official_mosques`, `halal_directory`) act as **Immutable Reference Data**.
*   They are queried by location (GIS) or search string, not typically joined directly to `profiles` unless a user "favorites" an item (which would require a join table like `user_favorites`).

---

## 🛡️ DATA SECURITY MODEL
*   **RLS (Row Level Security)** is mandatory.
*   **Public Data:** Green tables (Official Data) are publicly readable.
*   **Private Data:** Blue tables (User Data) are strictly siloed by `auth.uid()`.
