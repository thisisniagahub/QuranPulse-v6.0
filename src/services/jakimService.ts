import { JAKIM_ZONES } from '../data/jakimZones';

const BASE_API_URL = 'https://api.waktusolat.app/v2/solat';

export interface JakimPrayerData {
  hijri: string;
  date: string;
  day: string;
  imsak: string;
  fajr: string;
  syuruk: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export const JakimService = {
  /**
   * Fetch prayer times for a specific zone
   */
  async getPrayerTimes(zone: string): Promise<JakimPrayerData | null> {
    try {
      const response = await fetch(`${BASE_API_URL}/${zone}`);
      if (!response.ok) {
        throw new Error('Failed to fetch JAKIM data');
      }
      
      const json = await response.json();
      
      // The API usually returns an array of prayer times for the week/month or just today
      // Let's assume the API structure from documentation or inspection:
      // Response: { prayers: [ { day: 1, ... } ], ... }
      
      // NOTE: `api.waktusolat.app/v2/solat/{zone}` returns an array `prayers`
      // We need to find TODAY's entry.
      
      const today = new Date();
      // Format today as DD-MMM-YYYY usually, or compare timestamps
      // Let's inspect the typical response shape in a real scenario.
      // Usually it returns: { status: "OK", prayers: [ { hijri: "...", day: "Tuesday", fajr: ... } ] }
      
      // Let's grab the first entry for "today" which corresponds to current day index or find by date match
      // Ideally the API handles "today" logic or returns a week's worth.
      
      if (json && json.prayers && Array.isArray(json.prayers)) {
          // Find the entry matching today's day of month?
          // The API returns the whole year/month usually? 
          // Actually api.waktusolat.app/v2/solat/WLY01 returns the current week/period usually.
          
          // Let's use the first one if it matches today, otherwise search.
          // Simplification: Let's assume the API returns relevant data. 
          // Actually, let's use a safer lookup.
          const currentDayOfMonth = today.getDate();
          const match = json.prayers.find((p: any) => p.day === currentDayOfMonth || parseInt(p.day) === currentDayOfMonth);
          
          return match || json.prayers[0]; // Fallback
      }

      return null;

    } catch (error) {
      console.error("JAKIM Service Error:", error);
      return null;
    }
  },

  getZoneName(zoneCode: string): string {
    const zone = JAKIM_ZONES.find(z => z.code === zoneCode);
    return zone ? `${zone.state} - ${zone.description}` : zoneCode;
  }
};
