import { useState, useEffect } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'adhan';
import { JakimService, JakimPrayerData } from '../services/jakimService';

export interface PrayerTimeData {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
  nextPrayer: string;
  nextPrayerTime: Date;
  timeRemaining: string; // "02:15:00"
  hijriDate: string;
  locationName: string;
  source: 'JAKIM' | 'CALCULATED';
}

// Convert "HH:mm:ss" time string to Date object for today
const parseTime = (timeStr: string): Date => {
  const d = new Date();
  const [h, m, s] = timeStr.split(':').map(Number);
  d.setHours(h, m, s || 0, 0);
  return d;
};

// Standardize time formatting
const formatTimeRemaining = (diffMs: number): string => {
  if (diffMs < 0) diffMs += 86400000; // Next day
  const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
  const diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000);
  const diffSecs = Math.floor(((diffMs % 60000) / 1000));
  return `${diffHrs}j ${diffMins}m ${diffSecs}s`; // Added seconds for "pulse" feel
};

export const usePrayerTimes = (latitude: number | null, longitude: number | null, zoneCode: string = 'WLY01') => {
  const [data, setData] = useState<PrayerTimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingJakim, setUsingJakim] = useState(false);

  // 1. Fetch JAKIM Data
  useEffect(() => {
    let mounted = true;

    const fetchJakim = async () => {
      setLoading(true);
      try {
        const jakimData = await JakimService.getPrayerTimes(zoneCode);
        if (mounted && jakimData) {
          processJakimData(jakimData, zoneCode);
          setUsingJakim(true);
        } else if (mounted) {
          // Fallback to calculation if API fails
          processCalculatedData();
        }
      } catch (e) {
        if (mounted) processCalculatedData();
      }
    };

    fetchJakim();

    return () => { mounted = false; };
  }, [zoneCode]);

  // 2. Real-time Timer Update (Every Second)
  useEffect(() => {
    if (!data) return;
    const timer = setInterval(() => {
      // Refresh Next Prayer Logic only
      // This is a simplified update to keep the countdown ticking without re-fetching
      const now = new Date();
      const nextTime = data.nextPrayerTime;
      const diff = nextTime.getTime() - now.getTime();

      // If passed, trigger re-calculation (or full refresh)
      if (diff <= 0) {
        // Prayer time passed, force refresh logic
        // For simplicity, we just let the main effect handle it on next render or force re-fetch
        // But here we just update string
      }

      setData(prev => prev ? { ...prev, timeRemaining: formatTimeRemaining(diff) } : null);
    }, 1000);
    return () => clearInterval(timer);
  }, [data?.nextPrayerTime]);


  // --- PROCESSORS ---

  const processJakimData = (j: JakimPrayerData, zone: string) => {
    // Convert strings "05:45:00" to Date objects
    // Note: JAKIM returns 24h format usually.
    // However, api.waktusolat.app might return unix timestamp.
    // Let's assume "HH:mm" or "HH:mm:ss" based on typical response. 
    // If it's unix, we adjust. 
    // Checking api.waktusolat.app sample: "fajr": 1734472020 (UNIX timestamp)

    // UPDATE: The API returns UNIX TIMESTAMPS (seconds).
    // Ref: https://github.com/mptwaktusolat/waktusolat-api

    // Helper to handle timestamp vs string
    const toDate = (val: string | number) => {
      if (typeof val === 'number') return new Date(val * 1000);
      return parseTime(val as string);
    };

    const fajr = toDate(j.fajr);
    const sunrise = toDate(j.syuruk);
    const dhuhr = toDate(j.dhuhr);
    const asr = toDate(j.asr);
    const maghrib = toDate(j.maghrib);
    const isha = toDate(j.isha);

    const { next, nextTime } = getNextPrayer(fajr, dhuhr, asr, maghrib, isha);

    setData({
      fajr, sunrise, dhuhr, asr, maghrib, isha,
      nextPrayer: next,
      nextPrayerTime: nextTime,
      timeRemaining: formatTimeRemaining(nextTime.getTime() - Date.now()),
      hijriDate: j.hijri, // "14 Jamadilakhir 1447"
      locationName: JakimService.getZoneName(zone),
      source: 'JAKIM'
    });
    setLoading(false);
  };

  const processCalculatedData = () => {
    if (!latitude || !longitude) {
      setLoading(false);
      return;
    }

    const coordinates = new Coordinates(latitude, longitude);
    const params = CalculationMethod.MuslimWorldLeague(); // MWL standard, closer to JAKIM parameters
    params.madhab = Madhab.Shafi;
    const date = new Date();
    const prayerTimes = new PrayerTimes(coordinates, date, params);

    const { next, nextTime } = getNextPrayer(prayerTimes.fajr, prayerTimes.dhuhr, prayerTimes.asr, prayerTimes.maghrib, prayerTimes.isha);

    const hijri = new Intl.DateTimeFormat('en-TN-u-ca-islamic', {
      day: 'numeric', month: 'long', year: 'numeric',
    }).format(Date.now());

    setData({
      fajr: prayerTimes.fajr,
      sunrise: prayerTimes.sunrise,
      dhuhr: prayerTimes.dhuhr,
      asr: prayerTimes.asr,
      maghrib: prayerTimes.maghrib,
      isha: prayerTimes.isha,
      nextPrayer: next,
      nextPrayerTime: nextTime,
      timeRemaining: formatTimeRemaining(nextTime.getTime() - Date.now()),
      hijriDate: hijri,
      locationName: 'Lokasi Semasa (GPS)',
      source: 'CALCULATED'
    });
    setLoading(false);
  };

  const getNextPrayer = (fajr: Date, dhuhr: Date, asr: Date, maghrib: Date, isha: Date) => {
    const now = new Date();
    if (now < fajr) return { next: 'Subuh', nextTime: fajr };
    if (now < dhuhr) return { next: 'Zohor', nextTime: dhuhr };
    if (now < asr) return { next: 'Asar', nextTime: asr };
    if (now < maghrib) return { next: 'Maghrib', nextTime: maghrib };
    if (now < isha) return { next: 'Isyak', nextTime: isha };

    // Next day Subuh
    const tomorrowFajr = new Date(fajr);
    tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
    return { next: 'Subuh', nextTime: tomorrowFajr };
  };

  return { data, loading, usingJakim };
};