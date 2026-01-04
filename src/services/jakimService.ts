import { JAKIM_ZONES } from '../data/jakimZones';
import { MCPService, MCPWorshipData } from './mcpService';

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
  source?: string;
}

export const JakimService = {
  /**
   * Fetch prayer times for a specific zone via MCP
   */
  async getPrayerTimes(zone: string): Promise<JakimPrayerData | null> {
    try {
      console.log(`🕌 JakimService: Redirecting request for ${zone} to MCP...`);
      const data = await MCPService.getWorshipData(zone);
      
      if (!data) return null;

      // Map MCP format to JakimPrayerData format
      return {
        hijri: "", // MCP current logic doesn't return hijri for all sources yet
        date: data.date,
        day: new Date(data.date).toLocaleDateString('ms-MY', { weekday: 'long' }),
        imsak: data.times.imsak,
        fajr: data.times.subuh,
        syuruk: data.times.syuruk,
        dhuhr: data.times.zohor,
        asr: data.times.asar,
        maghrib: data.times.maghrib,
        isha: data.times.isyak,
        source: data.source
      };

    } catch (error) {
      console.error("JAKIM Service Error (MCP Bridge):", error);
      return null;
    }
  },

  getZoneName(zoneCode: string): string {
    const zone = JAKIM_ZONES.find(z => z.code === zoneCode);
    return zone ? `${zone.state} - ${zone.description}` : zoneCode;
  }
};
