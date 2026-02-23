import React, { useState } from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';

interface HalaqahRoom {
  id: string;
  title: string;
  ustaz: string;
  schedule: string;
  location: string;
  participants: number;
}

const ROOMS: HalaqahRoom[] = [
  {
    id: 'halaqah-tafsir',
    title: 'Halaqah Tafsir Ringkas',
    ustaz: 'Ustaz Ahmad',
    schedule: 'Rabu, 9:00 PM',
    location: 'Online',
    participants: 42,
  },
  {
    id: 'halaqah-tajwid',
    title: 'Halaqah Tajwid Asas',
    ustaz: 'Ustazah Maryam',
    schedule: 'Jumaat, 8:30 PM',
    location: 'Masjid Al-Hidayah',
    participants: 28,
  },
  {
    id: 'halaqah-hadith',
    title: 'Halaqah Hadith 40',
    ustaz: 'Ustaz Hafiz',
    schedule: 'Ahad, 10:00 AM',
    location: 'Online',
    participants: 35,
  },
];

const Halaqah: React.FC = () => {
  const [joinedRoomIds, setJoinedRoomIds] = useState<string[]>([]);

  const toggleJoin = (roomId: string) => {
    setJoinedRoomIds((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]
    );
  };

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <div className="mb-6 rounded-2xl border border-raudhah-teal/20 bg-slate-900/80 p-5 text-white">
        <h1 className="text-2xl font-bold">Halaqah</h1>
        <p className="mt-2 text-sm text-slate-300">
          Sertai sesi ilmu berkumpulan bersama komuniti QuranPulse.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {ROOMS.map((room) => {
          const joined = joinedRoomIds.includes(room.id);
          return (
            <div key={room.id} className="rounded-2xl border border-slate-700 bg-slate-900 p-5 text-white">
              <p className="text-lg font-bold">{room.title}</p>
              <p className="mt-1 text-sm text-raudhah-teal">{room.ustaz}</p>

              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-raudhah-teal" />
                  <span>{room.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-raudhah-teal" />
                  <span>{room.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-raudhah-teal" />
                  <span>{room.participants} peserta</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleJoin(room.id)}
                aria-label={joined ? `Tinggalkan halaqah ${room.title}` : `Sertai halaqah ${room.title}`}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${joined
                    ? 'bg-slate-800 text-slate-300 border border-slate-700'
                    : 'bg-raudhah-teal text-black shadow-lg shadow-teal-500/20 hover:bg-raudhah-teal'
                  }`}
              >
                {joined ? 'Sudah Sertai' : 'Sertai Halaqah'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Halaqah;
