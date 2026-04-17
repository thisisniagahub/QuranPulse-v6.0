# 📡 MCP Edge Functions API Reference

**Base URL:** `https://bomjkgyrkvuivqodzqzf.supabase.co/functions/v1`  
**Auth:** Requires `Authorization: Bearer <SUPABASE_ANON_KEY>` or Service Role Key.

---

## 1. MCP Worship (`mcp-worship`)
Provides accurate prayer times using a Cache-First strategy (Cache -> JAKIM -> Calculation).

**Endpoint:** `POST /mcp-worship`

### Request Body
```json
{
  "zone": "WLP01",       // Optional (Default: WLP01). JAKIM Zone Code.
  "lat": 3.1390,         // Optional. Latitude for fallback calculation.
  "lng": 101.6869,       // Optional. Longitude for fallback calculation.
  "date": "2026-01-04"   // Optional. Date (YYYY-MM-DD). Defaults to today.
}
```

### Response (Success)
```json
{
  "source": "jakim", // or "cache", "calculation"
  "zone": "WLP01",
  "date": "2026-01-04",
  "times": {
    "imsak": "05:45",
    "subuh": "05:55",
    "syuruk": "07:15",
    "zohor": "13:20",
    "asar": "16:40",
    "maghrib": "19:25",
    "isyak": "20:40"
  }
}
```

---

## 2. MCP Compliance (`mcp-compliance`)
Checks official rulings (Fatwa) and Halal status. currently uses Mock Data until scraping is implemented.

**Endpoint:** `POST /mcp-compliance`

### Request Body
```json
{
  "type": "fatwa",       // "fatwa" or "halal"
  "query": "hukum forex",
  "lang": "ms"           // "ms" or "en"
}
```

### Response (Success)
```json
{
  "source": "jakim_fatwa",
  "status": "found",
  "data": {
    "title": "Hukum Forex",
    "ruling": "Haram kerana melibatkan...",
    "reference_url": "http://e-smaf...",
    "date": "2012-02-15"
  }
}
```

---

## 3. MCP Education (`mcp-education`)
Retrieves religious knowledge (Hadith & Tafsir) from the internal Supabase Vector Database.

**Endpoint:** `POST /mcp-education`

### Request Body
```json
{
  "intent": "hadith",    // "hadith" or "tafsir"
  "query": "menuntut ilmu"
}
```

### Response (Success)
```json
{
  "source": "internal_db",
  "results": [
    {
      "collection_name": "Sahih Al-Bukhari",
      "hadith_number": 12,
      "title": "Kelebihan Ilmu",
      "content_translation": "Barangsiapa yang menempuh jalan untuk menuntut ilmu...",
      "grade": "Sahih"
    }
  ]
}
```
