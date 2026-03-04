import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useOpenClawStatus } from '../hooks/useOpenClawStatus';

/**
 * Minimal gateway status indicator.
 * Shows a small dot in the corner — green if connected, red if not.
 */
const OpenClawStatus: React.FC = () => {
  const { status } = useOpenClawStatus(30000); // Check every 30s

  if (status === 'checking') return null;

  return (
    <div
      className="fixed bottom-20 right-4 z-40"
      title={status === 'connected' ? 'AI Gateway: Aktif' : 'AI Gateway: Tidak Tersambung'}
    >
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm border transition-all ${
        status === 'connected'
          ? 'bg-emerald-50/90 text-emerald-700 border-emerald-200'
          : 'bg-red-50/90 text-red-600 border-red-200'
      }`}>
        {status === 'connected' ? (
          <>
            <Wifi className="w-3 h-3" />
            <span>AI Aktif</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3" />
            <span>Offline</span>
          </>
        )}
      </div>
    </div>
  );
};

export default OpenClawStatus;
