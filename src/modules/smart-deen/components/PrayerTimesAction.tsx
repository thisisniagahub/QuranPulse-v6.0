import React from 'react';
import { useCopilotAction } from "@copilotkit/react-core";
import { usePrayerTimes } from '../../../hooks/usePrayerTimes';
import { useQibla } from '../../../hooks/useQibla';

export const PrayerTimesAction: React.FC = () => {
    const { latitude, longitude } = useQibla();
    const { data: prayerData } = usePrayerTimes(latitude, longitude);

    useCopilotAction({
        name: "showPrayerTimes",
        description: "Show the current prayer times for the user's location.",
        parameters: [],
        render: () => {
            if (!prayerData) return <div className="text-amber-400">Sedang mendapatkan waktu solat...</div>;

            return (
                <div className="bg-slate-900 border border-cyan-500/30 rounded-xl p-4 my-2 max-w-sm">
                    <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                        <span className="text-xs text-cyan-400 font-bold uppercase">Waktu Solat Hari Ini</span>
                        <span className="text-[10px] text-slate-500">{prayerData.hijriDate}</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-300">Subuh</span>
                            <span className="font-mono text-emerald-400">{prayerData.fajr.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-300">Zohor</span>
                            <span className="font-mono text-emerald-400">{prayerData.dhuhr.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-300">Asar</span>
                            <span className="font-mono text-emerald-400">{prayerData.asr.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-300">Maghrib</span>
                            <span className="font-mono text-emerald-400">{prayerData.maghrib.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-300">Isyak</span>
                            <span className="font-mono text-emerald-400">{prayerData.isha.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                    </div>
                </div>
            );
        }
    });

    return null; // This component doesn't render anything itself, it just registers the action
};
