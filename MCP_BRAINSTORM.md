# 🧠 Pulse-MCP: Brainstorming & Architecture Blueprint

> **Objective:** Define the capability set for "Pulse-MCP", bridging Ustaz AI with real-world Islamic data.

## 1. The Core Concept
**Problem:** LLMs (like GLM-4) hallucinate specific facts (e.g., specific prayer times in Gombak today, or whether "Brand X" is Halal).
**Solution:** MCP (Model Context Protocol) allows Ustaz AI to say *"Wait, let me check the official database"* before answering.

---

## 2. Potential MCP Tools (The "Skills")

We are moving forward with **ALL** clusters as mandatory (P0) to ensure full ecosystem dominance.

### 🛡️ Cluster A: Compliance & Legal (JAKIM Integration) - **MANDATORY**
*High value, high trust. Hard to replicate.*

| Tool Name | User Question | MCP Action | Status |
|-----------|---------------|------------|--------|
| `verify_halal` | "Is [Product/Barcode] halal?" | 1. Search JAKIM Halal Portal<br>2. Return status + expiry date. | 🥇 **Gold** |
| `check_fatwa` | "What is the ruling on Forex?" | 1. Query E-Fatwa Portal<br>2. Return official text from Mufti. | 🥇 **Gold** |
| `mosque_locator` | "Where is the nearest masjid?" | 1. Geo-search JAKIM Mosque DB<br>2. Return map link. | 🥈 Silver |

### 🕌 Cluster B: Worship Precision (Ibadah) - **MANDATORY**
*Daily utility. Increases retention.*

| Tool Name | User Question | MCP Action | Status |
|-----------|---------------|------------|--------|
| `get_solat_time` | "Asar in Shah Alam today?" | 1. Call JAKIM E-Solat API<br>2. Return precise time for Zone. | 🥇 **Gold** |
| `calc_zakat` | "I have RM50k savings, how much zakat?" | 1. Fetch current Gold Price (Bank Negara)<br>2. Apply localized Zakat formula. | 🥈 Silver |
| `hijri_converter` | "When is 1st Ramadan?" | 1. Check official astronomy calculation.<br>2. Return exact date. | 🥉 Bronze |

### 📖 Cluster C: Deep Knowledge (Education) - **MANDATORY**
*Unique content moat.*

| Tool Name | User Question | MCP Action | Status |
|-----------|---------------|------------|--------|
| `search_tafsir` | "Explain 'Al-Asr' context." | 1. Vector search internal Tafsir DB (Ibn Kathir).<br>2. Return meaningful segments. | 🥇 **Gold** |
| `hadith_verify` | "Is the 'seek knowledge to China' hadith sahih?" | 1. Search Dorar/Sunnah.com API.<br>2. Return grading (Sahih/Daif/Maudu). | 🥈 Silver |

---

## 3. Technical Implementation Strategy

### Architecture Option A: "The Monolith" (Easier)
A single Next.js API Route that acts as the MCP Server.
- **Pros:** No new infrastructure.
- **Cons:** Slower, tied to app deployment.

### Architecture Option B: "The Micro-Brain" (Recommended)
A dedicated Node.js/TypeScript server (using official `@modelcontextprotocol/sdk`).
- **Pros:** Can run locally for dev, deploy on Fly.io/Render. Very fast.
- **Stack:** Hono (lightweight) + MCP SDK + Puppeteer (for scraping if APIs don't exist).

---

## 4. MCP Data Governance (Compliance)

> **CRITICAL:** All MCP tools MUST adhere to the **Part 3: AI & Data Intelligence Compliance** section of `COMPLIANCE_GUIDELINES.md`.

*   **Halal**: must use `halal.gov.my`
*   **Fatwa**: must use `e-smaf.islam.gov.my`
*   **Solat**: must use `e-solat.gov.my`
*   **Hadith**: must use Verified DBs (`dorar.net` / `sunnah.com`)

No scraping of unverified blogs or general Google results is permitted for these tools.
