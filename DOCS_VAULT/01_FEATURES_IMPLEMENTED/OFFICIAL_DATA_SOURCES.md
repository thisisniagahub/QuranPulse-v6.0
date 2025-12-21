# 🇲🇾 OFFICIAL ISLAMIC DATA SOURCES (MALAYSIA)

> **Purpose:** Authoritative reference for **QuranPulse MCP Servers**.
> **Status:** Verified as of December 6, 2025.
> **Compliance:** All AI agents MUST cite these sources to avoid hallucination.

---

## 1. 🕌 CORE JAKIM SERVICES (National Level)

| Service | Official Portal URL | API / Developer Note |
| :--- | :--- | :--- |
| **Halal Verification** | [www.halal.gov.my](http://www.halal.gov.my/v4/) | No public API. Use [SmartHalal App](https://play.google.com/store/apps/details?id=my.gov.islam.smarthalal) logic or scrape directory at `myehalal.halal.gov.my`. |
| **Prayer Times (E-Solat)** | [www.e-solat.gov.my](https://www.e-solat.gov.my) | Official Endpoint: `https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat`<br>Alternative (Stable Wrapper): [waktu-solat-api](https://waktu-solat-api.herokuapp.com) |
| **Mosque Database** | [masjid.islam.gov.my](http://masjid.islam.gov.my) | **Portal Masjid Malaysia**. Contains geo-locations of registered mosques. |
| **Hadith Verification** | [semakhadis.com](https://semakhadis.com) | Also see **MyHadith** at [islam.gov.my/en/myhadith](http://www.islam.gov.my/en/myhadith). Use for "Sahih/Palsu" checking. |

---

## 2. ⚖️ FATWA & RULINGS (Mufti Departments)

| Agency | Scope | Official URL |
| :--- | :--- | :--- |
| **E-SMAF (National)** | National Fatwa Repository | [e-smaf.islam.gov.my](http://e-smaf.islam.gov.my/e-smaf/) (Best for general rulings). |
| **Mufti WP** | Federal Territories | [muftiwp.gov.my](https://www.muftiwp.gov.my/perkhidmatan/e-fatwa) (Highly active, detailed articles). |
| **Mufti Selangor** | Selangor State | [muftiselangor.gov.my](https://www.muftiselangor.gov.my) |

---

## 3. 💰 ZAKAT INSTITUTIONS (Calculator & Payment)

*Note: Calculations differ slightly by state. Use the user's location to select the correct specific official calculator.*

| State | Agency | Official Calculator / Portal |
| :--- | :--- | :--- |
| **Federal Territories** | **PPZ-MAIWP** | [zakat.com.my](https://www.zakat.com.my) |
| **Selangor** | **LZS (Lembaga Zakat Selangor)** | [zakatselangor.com.my](https://www.zakatselangor.com.my) (Has excellent [Online Calculator](https://fpx.zakatselangor.com.my/)) |
| **Kedah** | **LZNK** | [zakatkedah.com.my](https://www.zakatkedah.com.my) |
| **Penang** | **Zakat Pulau Pinang** | [zakatpenang.com](https://www.zakatpenang.com) |
| **Johor** | **MAIJ** | [maij.gov.my](http://www.maij.gov.my) |

---

## 4. 🏛️ STATE RELIGIOUS COUNCILS (MAIN / JAIN)

| State | Acronym | Official URL |
| :--- | :--- | :--- |
| **Wilayah Persekutuan** | MAIWP | [maiwp.gov.my](https://www.maiwp.gov.my) |
| **Selangor** | MAIS / JAIS | [mais.gov.my](http://www.mais.gov.my) |
| **Johor** | MAIJ | [maij.gov.my](http://www.maij.gov.my) |
| **Melaka** | MAIM | [maim.gov.my](http://www.maim.gov.my) |
| **Negeri Sembilan** | MAINS | [mains.gov.my](http://www.mains.gov.my) |
| **Pahang** | MUIP | [muip.gov.my](http://www.muip.gov.my) |

---

## 5. 🛠️ TECHNICAL IMPLEMENTATION STRATEGY

### For MCP Server `jakim-connector`:
1.  **Halal**: Use `Puppeteer` to automate search on `myehalal.halal.gov.my` form (since no API).
2.  **Solat**: Direct fetch from `e-solat.gov.my` JSON endpoint (cache for 24h).
3.  **Fatwa**: Scrape `muftiwp.gov.my` specifically for "Irsyad Al-Fatwa" articles (high quality text for RAG).
4.  **Zakat**: Redirect users to the specific State Calculator URL (safest legally).

---

## 6. ⚖️ SYARIAH JUDICIARY & LEGAL

| Agency | Function | Official URL |
| :--- | :--- | :--- |
| **JKSM** | Jabatan Kehakiman Syariah Malaysia | [jksm.gov.my](http://www.jksm.gov.my) |
| **E-Syariah** | Syariah Court Case Management | [esyariah.kehakiman.gov.my](https://esyariah.kehakiman.gov.my) (Check court dates/status) |

---

## 7. 🕋 HAJJ S WAKAF (Pilgrimage & Endowment)

| Agency | Function | Official URL |
| :--- | :--- | :--- |
| **Tabung Haji** | Hajj Fund Board | [tabunghaji.gov.my](https://www.tabunghaji.gov.my) |
| **THiJARI** | Digital Hajj Services | [www.thijari.com.my](https://www.thijari.com.my) (Login portal) |
| **YWM** | Yayasan Waqaf Malaysia | [ywm.gov.my](https://www.ywm.gov.my) |
| **MyWakaf** | Banking Waqaf Collaboration | [mywakaf.com.my](https://www.mywakaf.com.my) |

---

## 8. 📡 OFFICIAL ISLAMIC MEDIA & DAKWAH

| Agency | Type | Official URL |
| :--- | :--- | :--- |
| **IKIM** | Institute of Islamic Understanding | [ikim.gov.my](https://ikim.gov.my) / [ikimfm.my](https://ikimfm.my) |
| **TV AlHijrah** | Islamic Broadcaster | [tvalhijrah.com](https://tvalhijrah.com) |
| **YADIM** | Dakwah Foundation | [yadim.com.my](https://yadim.com.my) |

---

## 9. 🏛️ COMPLETE STATE RELIGIOUS COUNCILS LIST

| Region | State | Acronym | Official URL |
| :--- | :--- | :--- | :--- |
| **Central** | Wilayah Persekutuan | MAIWP | [maiwp.gov.my](https://www.maiwp.gov.my) |
| | Selangor | MAIS | [mais.gov.my](http://www.mais.gov.my) |
| **North** | Kedah | MAIK | [maik.gov.my](http://www.maik.gov.my) |
| | Pulau Pinang | MAINPP | [mainpp.gov.my](http://mainpp.gov.my) |
| | Perak | MAIPk | [maiamp.gov.my](https://www.maiamp.gov.my) |
| | Perlis | MAIPs | [maips.gov.my](http://www.maips.gov.my) |
| **South** | Johor | MAIJ | [maij.gov.my](http://www.maij.gov.my) |
| | Melaka | MAIM | [maim.gov.my](http://www.maim.gov.my) |
| | Negeri Sembilan | MAINS | [mains.gov.my](http://www.mains.gov.my) |
| **East Coast** | Pahang | MUIP | [muip.gov.my](http://www.muip.gov.my) |
| | Terengganu | MAIDAM | [maidam.gov.my](http://maidam.gov.my) |
| | Kelantan | MAIK | [e-maik.my](http://www.e-maik.my) |
| **Borneo** | Sabah | MUIS | [muis.gov.my](https://muis.gov.my) / [jheains.sabah.gov.my](https://jheains.sabah.gov.my)|
| | Sarawak | MIS | [mis.sarawak.gov.my](https://mis.sarawak.gov.my) |

**[End of Official Data Sources]**

