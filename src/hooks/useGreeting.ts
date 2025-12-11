import { useState, useEffect } from 'react';

export type TimeOfDay = 'MORNING' | 'DAY' | 'NIGHT';

interface GreetingData {
  timeOfDay: TimeOfDay;
  greetingText: string;
}

export const useGreeting = (userName: string) => {
  const [greetingData, setGreetingData] = useState<GreetingData>({
    timeOfDay: 'DAY',
    greetingText: ""
  });

  useEffect(() => {
    const hour = new Date().getHours();
    let timeOfDay: TimeOfDay;
    let greetingText: string;

    if (hour >= 5 && hour < 7) {
      timeOfDay = 'MORNING';
      greetingText = "Assalamualaikum, Salam Subuh yang barakah.";
    } else if (hour >= 7 && hour < 11) {
      timeOfDay = 'MORNING';
      greetingText = `Salam Dhuha, ${userName.split(' ')[0]}.`;
    } else if (hour >= 11 && hour < 19) {
      timeOfDay = 'DAY';
      greetingText = "Teruskan usaha, semoga hari ini produktif.";
    } else {
      timeOfDay = 'NIGHT';
      greetingText = "Selamat berehat, jangan lupa Al-Mulk.";
    }
    setGreetingData({ timeOfDay, greetingText });
  }, [userName]);

  const getBackgroundClass = () => {
    switch(greetingData.timeOfDay) {
      case 'MORNING': return 'bg-gradient-to-br from-space-dark via-teal-950 to-space-light text-white';
      case 'DAY': return 'bg-gradient-to-br from-space-dark via-slate-900 to-space-light text-white';
      case 'NIGHT': return 'bg-gradient-to-br from-space-dark via-indigo-950 to-black text-white';
    }
  };

  const isDark = true; // Always dark mode for Deep Space theme

  return {
    ...greetingData,
    getBackgroundClass,
    isDark
  };
};