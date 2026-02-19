
import { APP_NAME } from "../constants";

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

export interface HijriDate {
  day: string;
  month: {
    en: string;
    ar: string;
  };
  year: string;
  weekday: {
    en: string;
    ar: string;
  };
}

import { UstazahOrchestrator } from "./UstazahOrchestrator";
import { getCachedOrFetchZone, coordinatesToMalaysiaZone } from "./geolocationService";

const ALADHAN_API = "https://api.aladhan.com/v1";

export const getPrayerTimes = async (lat: number, lng: number, zone?: string): Promise<{ timings: PrayerTimes; date: HijriDate; source: string }> => {
  try {
    // 1. Determine zone: provided > geolocation > coordinate mapping > default
    let targetZone = zone;

    if (!targetZone) {
      // Try geolocation-based zone detection
      try {
        targetZone = await getCachedOrFetchZone();
        console.log(`📍 Auto-detected zone: ${targetZone}`);
      } catch {
        // Fallback to coordinate-based mapping
        const mapped = coordinatesToMalaysiaZone(lat, lng);
        targetZone = mapped.code !== 'INTL' ? mapped.code : 'WLP01';
        console.log(`📍 Coordinate-mapped zone: ${targetZone}`);
      }
    }

    console.log(`🕌 PrayerService: Fetching for zone ${targetZone} via MCP...`);
    const mcpData = await UstazahOrchestrator.getWorshipData(targetZone);

    if (mcpData) {
      // Map MCP format to UI format
      return {
        source: mcpData.source,
        timings: {
          Fajr: mcpData.times.subuh,
          Sunrise: mcpData.times.syuruk,
          Dhuhr: mcpData.times.zohor,
          Asr: mcpData.times.asar,
          Maghrib: mcpData.times.maghrib,
          Isha: mcpData.times.isyak,
          Imsak: mcpData.times.imsak
        },
        date: {
          day: mcpData.date.split('-')[2],
          month: { en: "Selected Month", ar: "" },
          year: mcpData.date.split('-')[0],
          weekday: { en: "", ar: "" }
        }
      };
    }

    // 2. FALLBACK to AlAdhan for International / Failure
    console.warn("⚠️ MCP Failed or outside Malaysia. Falling back to AlAdhan...");
    const date = new Date();
    const response = await fetch(
      `${ALADHAN_API}/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=${lat}&longitude=${lng}&method=3`
    );
    const data = await response.json();
    return {
      source: 'aladhan',
      timings: data.data.timings,
      date: data.data.date.hijri
    };
  } catch (error) {
    console.error("Prayer API Error", error);
    // Fallback mock data
    return {
      source: 'mock',
      timings: {
        Fajr: "05:30",
        Sunrise: "06:45",
        Dhuhr: "13:00",
        Asr: "16:15",
        Maghrib: "19:20",
        Isha: "20:30"
      },
      date: {
        day: "15",
        month: { en: "Ramadan", ar: "رمضان" },
        year: "1446",
        weekday: { en: "Jumuah", ar: "الجمعة" }
      }
    };
  }
};

export const getNextPrayer = (timings: PrayerTimes): { name: string; time: string; remaining: string } => {
  const now = new Date();
  const currentTime = `${now.getHours()}:${now.getMinutes()}`;

  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  for (const prayer of prayers) {
    if (timings[prayer] > currentTime) {
      // Simple logic for display purposes. 
      // In a real app, full Date object comparison is needed for accurate countdown.
      return { name: prayer, time: timings[prayer], remaining: "Coming Soon" };
    }
  }

  return { name: 'Fajr', time: timings['Fajr'], remaining: "Tomorrow" };
};

export const getQiblaDirection = (lat: number, lng: number): number => {
  // Simplified Qibla direction for Kuala Lumpur (approx)
  // In a real app, use spherical trigonometry:
  // λ = lng, φ = lat, λ_Mecca = 39.8262, φ_Mecca = 21.4225
  return 292;
};
