import { useState, useEffect, useCallback } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes, Qibla } from 'adhan';

// Types
export interface PrayerTimeData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  [key: string]: string;
}

export interface PrayerTimesState {
  times: PrayerTimeData | null;
  qibla: number;
  nextPrayer: {
    name: string;
    time: string;
    remaining: string;
  } | null;
  loading: boolean;
  error: string | null;
  source: 'API' | 'LOCAL' | null;
  hijriDate: string | null;
}

// Constants
const JAKIM_METHOD_ID = 3; // Aladhan API ID for JAKIM
const DEFAULT_COORDS = { lat: 3.1390, lng: 101.6869 }; // Kuala Lumpur

// Helper: Calculate Next Prayer (Pure Function)
const calculateNextPrayer = (times: PrayerTimeData) => {
  const now = new Date();
  const timeToDate = (timeStr: string) => {
    if (!timeStr) return new Date(); // Safety fallback
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const prayerOrder = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  let next = null;

  for (const prayer of prayerOrder) {
    const prayerDate = timeToDate(times[prayer as keyof PrayerTimeData]);
    if (prayerDate > now) {
      next = { name: prayer, time: times[prayer as keyof PrayerTimeData], date: prayerDate };
      break;
    }
  }

  // If no next prayer today, it's Fajr tomorrow
  if (!next) {
    next = { name: 'fajr', time: times.fajr, date: timeToDate(times.fajr) };
    next.date.setDate(next.date.getDate() + 1);
  }

  // Calculate remaining time
  const diffMs = next.date.getTime() - now.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return {
    name: next.name,
    time: next.time,
    remaining: `${diffHrs}h ${diffMins}m`
  };
};

export const usePrayerTimes = () => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [state, setState] = useState<PrayerTimesState>({
    times: null,
    qibla: 0,
    nextPrayer: null,
    loading: true,
    error: null,
    source: null,
    hijriDate: null
  });

  // 1. Get User Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          console.warn('Geolocation denied/failed, using default (KL):', err);
          setCoords(DEFAULT_COORDS);
        }
      );
    } else {
      setCoords(DEFAULT_COORDS);
    }
  }, []);

  // 3. Local Calculation Fallback (Adhan.js)
  const calculateLocalPrayerTimes = useCallback(() => {
    if (!coords) return;

    try {
      const coordinates = new Coordinates(coords.lat, coords.lng);
      const params = CalculationMethod.Singapore(); // Closest to JAKIM in standard library
      const date = new Date();
      const prayerTimes = new PrayerTimes(coordinates, date, params);

      // Formatter
      const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      };

      const times = {
        fajr: formatTime(prayerTimes.fajr),
        sunrise: formatTime(prayerTimes.sunrise),
        dhuhr: formatTime(prayerTimes.dhuhr),
        asr: formatTime(prayerTimes.asr),
        maghrib: formatTime(prayerTimes.maghrib),
        isha: formatTime(prayerTimes.isha)
      };

      setState({
        times,
        qibla: Qibla(coordinates),
        nextPrayer: calculateNextPrayer(times),
        loading: false,
        error: null,
        source: 'LOCAL',
        hijriDate: new Intl.DateTimeFormat('en-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())
      });

    } catch (localErr) {
      console.error('Local calculation failed:', localErr);
      setState(prev => ({ ...prev, loading: false, error: 'Failed to load prayer times' }));
    }
  }, [coords]);

  // 2. Fetch Prayer Times (API + Fallback)
  const fetchPrayerTimes = useCallback(async () => {
    if (!coords) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Try API First (Aladhan - JAKIM)
      const date = new Date();
      const timestamp = Math.floor(date.getTime() / 1000);
      const apiRes = await fetch(
        `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${coords.lat}&longitude=${coords.lng}&method=${JAKIM_METHOD_ID}`
      );

      if (!apiRes.ok) throw new Error('API request failed');

      const data = await apiRes.json();
      const timings = data.data.timings;
      const hijri = data.data.date.hijri;

      // Calculate Qibla
      const qiblaDir = Qibla(new Coordinates(coords.lat, coords.lng));

      setState({
        times: {
          fajr: timings.Fajr,
          sunrise: timings.Sunrise,
          dhuhr: timings.Dhuhr,
          asr: timings.Asr,
          maghrib: timings.Maghrib,
          isha: timings.Isha
        },
        qibla: qiblaDir,
        nextPrayer: calculateNextPrayer(timings),
        loading: false,
        error: null,
        source: 'API',
        hijriDate: `${hijri.day} ${hijri.month.en} ${hijri.year}`
      });

    } catch (err) {
      console.warn('Prayer Times API failed, switching to local calculation:', err);
      calculateLocalPrayerTimes();
    }
  }, [coords, calculateLocalPrayerTimes]);

  // Effect to fetch when coords change
  useEffect(() => {
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);

  // Refresh every minute for countdown
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.times) {
        setState(prev => ({
          ...prev,
          nextPrayer: calculateNextPrayer(prev.times!)
        }));
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [state.times]);

  return { ...state, refresh: fetchPrayerTimes, coords };
};