# 🐳 Docker MCP — Container Strategy

> **Last Updated**: 21 Feb 2026
> **Status**: Draft
> **Module**: Infrastructure / MCP

---

> **Status:** Recommended Upgrade
> **Goal:** Stability, Security, and "Zero-Dependency" Environment.

This document outlines how to run your MCP Servers (AI Tools) using **Docker**. This eliminates issues with `npx`, `node` versions, or Windows/Linux compatibility.

## 1. Prerequisites
*   **Docker Desktop:** Must be installed and running. [Download Here](https://www.docker.com/products/docker-desktop/).
*   **Gemini CLI:** You already have this.

---

## 2. The Configuration (`.gemini/settings.json`)

Copy the following configuration into your `.gemini/settings.json`. This sets up 3 powerful servers inside Docker containers.

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "--init",
        "node:18-alpine",
        "npx",
        "-y",
        "@modelcontextprotocol/server-sequential-thinking"
      ],
      "disabled": false,
      "alwaysAllow": []
    },
    "puppeteer-web-scraper": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "--init",
        "ghcr.io/puppeteer/puppeteer:latest",
        "npx",
        "-y",
        "@modelcontextprotocol/server-puppeteer"
      ]
    },
    "supabase-postgres": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.[REF_ID].supabase.co:5432/postgres",
        "npx",
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://postgres:[YOUR_PASSWORD]@db.[REF_ID].supabase.co:5432/postgres"
      ]
    }
  }
}
```

**⚠️ PENTING:** Gantikan `[YOUR_PASSWORD]` dan `[REF_ID]` dengan maklumat Supabase sebenar anda.

---

## 3. Server Breakdown & Functions

### 🧠 A. Sequential Thinking (The Strategist)
*   **Docker Image:** `node:18-alpine` (Running npx)
*   **Fungsi:** Membolehkan AI "berfikir" langkah demi langkah sebelum menjawab.
*   **Kegunaan QuranPulse:**
    *   *Complex Debugging:* "Gunakan Sequential Thinking untuk menyiasat kenapa pembayaran ToyyibPay gagal pada hari Jumaat."
    *   *Architecture Planning:* "Rancang struktur database untuk modul 'Waris Faraid' secara berperingkat."

### 🌐 B. Puppeteer (The Scout)
*   **Docker Image:** `ghcr.io/puppeteer/puppeteer`
*   **Fungsi:** Browser tanpa kepala (Headless Chrome) untuk melayari web.
*   **Kegunaan QuranPulse:**
    *   *Jakim Scraper:* "Buka laman web E-Solat, cari jadual solat untuk zon Gombak, dan pulangkan dalam format JSON."
    *   *Halal Checker:* "Pergi ke portal Halal Malaysia, semak status sijil untuk produk 'Brand X'."

### 🗄️ C. PostgreSQL (The Data Keeper)
*   **Docker Image:** `npx` (inside Node container)
*   **Fungsi:** Akses terus ke database tanpa perlu API HTTP (lebih laju & berkuasa).
*   **Kegunaan QuranPulse:**
    *   *Mass Update:* "Cari semua user yang 'inactive' lebih 3 bulan dan set status mereka kepada 'dormant'."
    *   *Schema Inspection:* "Senaraikan semua index dalam table `prayer_logs` dan cadangkan optimization."

---

## 4. How to Test

Selepas kemaskini `settings.json` dan restart Gemini CLI, cuba prompt ini:

**Test Sequential Thinking:**
> "Using Sequential Thinking, analyze the pros and cons of moving our 'Moments' feed from Supabase to a dedicated NoSQL database like MongoDB."

**Test Puppeteer:**
> "Use Puppeteer to visit 'https://www.e-solat.gov.my' and take a screenshot of the homepage."

---

## 5. Why This is "Out-of-the-Box"?
Kebanyakan developer install tools ini di laptop mereka.
*   **Masalah:** "It works on my machine".
*   **Solusi Docker:** Ia berfungsi di MANA-MANA mesin (Windows, Mac, Linux) dengan cara yang SAMA. Anda sedang membina infrastruktur taraf **Enterprise**.

