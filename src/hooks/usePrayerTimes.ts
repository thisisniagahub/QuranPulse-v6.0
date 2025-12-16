import { useState, useEffect } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'adhan';

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
}

export const usePrayerTimes = (latitude: number | null, longitude: number | null) => {
  const [data, setData] = useState<PrayerTimeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!latitude || !longitude) return;

    const calculate = () => {
      const coordinates = new Coordinates(latitude, longitude);
      
      // Use Singapore/Malaysia method (Muslim World League is closest standard, or creating custom parameters for JAKIM)
      // JAKIM Standard: Fajr 20deg, Isha 18deg. 
      // 'Singapore' method in Adhan JS is close to Malaysia.
      const params = CalculationMethod.Singapore(); 
      params.madhab = Madhab.Shafi;

      const date = new Date();
      const prayerTimes = new PrayerTimes(coordinates, date, params);

      // Determine Next Prayer
      const now = new Date();
      let next = 'Fajr';
      let nextTime = prayerTimes.fajr;
      let timeDiff = 0;

      if (now < prayerTimes.fajr) {
        next = 'Subuh';
        nextTime = prayerTimes.fajr;
      } else if (now < prayerTimes.dhuhr) {
        next = 'Zohor';
        nextTime = prayerTimes.dhuhr;
      } else if (now < prayerTimes.asr) {
        next = 'Asar';
        nextTime = prayerTimes.asr;
      } else if (now < prayerTimes.maghrib) {
        next = 'Maghrib';
        nextTime = prayerTimes.maghrib;
      } else if (now < prayerTimes.isha) {
        next = 'Isyak';
        nextTime = prayerTimes.isha;
      } else {
        // Next day Fajr
        next = 'Subuh';
        const tomorrow = new Date(date);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowPrayers = new PrayerTimes(coordinates, tomorrow, params);
        nextTime = tomorrowPrayers.fajr;
      }

      // Calculate time remaining
      const diffMs = nextTime.getTime() - now.getTime();
      const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
      const diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000);
      const timeRemaining = `${diffHrs}j ${diffMins}m`;

      // Hijri Date (Simple formatter)
      const hijri = new Intl.DateTimeFormat('en-TN-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
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
        timeRemaining,
        hijriDate: hijri,
        locationName: 'Lokasi Semasa' // Reverse geocoding optional
      });
      setLoading(false);
    };

    calculate();
    const timer = setInterval(calculate, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [latitude, longitude]);

  return { data, loading };
};
