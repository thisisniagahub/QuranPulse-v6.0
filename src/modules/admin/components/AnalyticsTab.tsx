import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const AnalyticsTab: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from('analytics_events')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);
      if (data) setEvents(data);
    };
    fetchEvents();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">Live Event Stream</h3>
      <div className="space-y-2">
        {events.map((e, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex justify-between items-center text-sm">
            <div>
              <span className="text-raudhah-teal font-mono mr-2">[{e.name}]</span>
              <span className="text-slate-400 text-xs">{JSON.stringify(e.properties)}</span>
            </div>
            <span className="text-slate-600 text-xs">{new Date(e.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
        {events.length === 0 && <div className="text-slate-500 italic">Menunggu data...</div>}
      </div>
    </div>
  );
};

export default AnalyticsTab;
