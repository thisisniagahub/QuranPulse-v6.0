import React from 'react';
import { usePrayerTimes } from '../../../hooks/usePrayerTimes';
import { useQibla } from '../../../hooks/useQibla';

export const PrayerTimesAction: React.FC = () => {
    const { latitude, longitude } = useQibla();
    const { data: prayerData } = usePrayerTimes(latitude, longitude);

    return null; // This component doesn't render anything itself, it just registers the action
};
