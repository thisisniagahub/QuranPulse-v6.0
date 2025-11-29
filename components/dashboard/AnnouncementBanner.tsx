import React from 'react';
import { Announcement } from '../../types';

interface AnnouncementBannerProps {
  announcements: Announcement[];
}

const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ announcements }) => {
  const activeAnnouncements = announcements.filter(a => a.active);

  if (activeAnnouncements.length === 0) {
    return null;
  }

  return (
    <>
      {activeAnnouncements.map((a, i) => (
        <div key={i} className="bg-primary/10 border-b border-primary/20 p-2 text-center animate-fade-in">
            <p className="text-xs font-bold uppercase text-primary">{a.title}</p>
            <p className="text-sm text-slate-300">{a.message}</p>
        </div>
      ))}
    </>
  );
};

export default AnnouncementBanner;