import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQibla } from '../../hooks/useQibla';
import { usePrayerTimes } from '../../hooks/usePrayerTimes';

const Ibadah: React.FC = () => {
  const [viewMode, setViewMode] = useState<'QIBLA' | 'PRAYER'>('QIBLA');
  
  // Qibla & Location Hook
  const qibla = useQibla();
  const {
    qiblaAngle,
    deviceHeading,
    headingDifference,
    isPointingQibla,
    latitude,
    longitude,
    isLoading,
    error,
    isDeviceOrientationSupported,
    isGeolocationSupported,
  } = qibla;

  // Prayer Times Hook
  const { data: prayerData, loading: prayerLoading } = usePrayerTimes(latitude, longitude);

  // State to handle permission request UI
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

  useEffect(() => {
    if (!isLoading && (error?.includes('permission') || (!isGeolocationSupported && !isDeviceOrientationSupported))) {
      setShowPermissionPrompt(true);
    } else {
      setShowPermissionPrompt(false);
    }
  }, [isLoading, error, isGeolocationSupported, isDeviceOrientationSupported]);

  // Requesting permission for iOS 13+ devices
  const requestDeviceOrientationPermission = () => {
    if ((typeof DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            setShowPermissionPrompt(false);
          } else {
            // Handle error state locally or trigger re-check
          }
        })
        .catch(console.error);
    }
  };

  // Calculate rotation for the compass (Qibla pointer)
  const compassRotation = deviceHeading !== null ? -deviceHeading : 0;
  
  // Calculate Qibla pointer rotation relative to the compass background
  let qiblaPointerRotation = 0;
  if (qiblaAngle !== null && deviceHeading !== null) {
    qiblaPointerRotation = (qiblaAngle - deviceHeading + 360) % 360;
  }

  // --- UI Elements ---
  const renderCompass = () => (
    <div className="relative w-72 h-72 sm:w-80 sm:h-80 bg-gradient-to-br from-slate-900 to-slate-950 rounded-full flex items-center justify-center border-4 border-cyan-800 shadow-[0_0_50px_rgba(6,182,212,0.3)] mt-8">
      {/* Compass background with North/South/East/West markers */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ rotate: compassRotation }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-8 bg-white" /> {/* North */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-8 bg-slate-500" /> {/* South */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-8 bg-slate-500" /> {/* West */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-1 w-8 bg-slate-500" /> {/* East */}
        
        {/* Cardinal points text */}
        <span className="absolute top-8 left-1/2 -translate-x-1/2 text-white font-bold text-sm">N</span>
        <span className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 text-sm">S</span>
        <span className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-500 text-sm">W</span>
        <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-500 text-sm">E</span>

        {/* Dynamic Qibla Pointer */}
        <motion.div
          className="absolute inset-0 rounded-full flex items-center justify-center"
          style={{ rotate: qiblaPointerRotation }}
        >
          <div className={`w-3 h-36 bg-emerald-500 rounded-t-full shadow-lg origin-bottom transition-all duration-300 ${isPointingQibla ? 'scale-y-110 shadow-emerald-400' : ''}`} />
        </motion.div>
        
        {/* Center Dot */}
        <div className="absolute w-6 h-6 bg-cyan-500 rounded-full shadow-inner shadow-white/50" />
      </motion.div>
      
      {/* Qibla Angle Display */}
      {qiblaAngle !== null && (
        <div className="absolute bottom-10 text-cyan-400 font-mono text-xl font-bold tracking-widest">
          {Math.round(qiblaAngle)}°
        </div>
      )}
    </div>
  );

  const formatTime = (date: Date) => {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const renderPrayerTimes = () => {
      if (!prayerData) return <div className="text-center text-slate-400 mt-10">Mengira waktu solat...</div>;

      const prayers = [
          { name: 'Subuh', time: prayerData.fajr, icon: 'fa-cloud-sun' },
          { name: 'Syuruk', time: prayerData.sunrise, icon: 'fa-sun', isSecondary: true },
          { name: 'Zohor', time: prayerData.dhuhr, icon: 'fa-sun' },
          { name: 'Asar', time: prayerData.asr, icon: 'fa-cloud-sun' },
          { name: 'Maghrib', time: prayerData.maghrib, icon: 'fa-moon' },
          { name: 'Isyak', time: prayerData.isha, icon: 'fa-star' },
      ];

      return (
          <div className="w-full max-w-md space-y-6 mt-4">
              {/* Hijri Date */}
              <div className="text-center mb-4">
                  <p className="text-amber-400 font-arabic text-lg">{prayerData.hijriDate}</p>
                  <p className="text-slate-500 text-xs">{prayerData.locationName}</p>
              </div>

              {/* Next Prayer Card */}
              <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 p-6 rounded-3xl text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
                  <p className="text-xs text-cyan-300 font-bold uppercase tracking-widest mb-1">Seterusnya</p>
                  <h2 className="text-4xl font-bold text-white mb-1">{prayerData.nextPrayer}</h2>
                  <p className="text-xl text-slate-300 mb-2">{formatTime(prayerData.nextPrayerTime)}</p>
                  <div className="inline-block px-3 py-1 bg-black/30 rounded-full text-xs text-emerald-400 font-mono border border-emerald-500/20">
                      - {prayerData.timeRemaining}
                  </div>
              </div>

              {/* List */}
              <div className="space-y-3">
                  {prayers.map((p, i) => {
                      const isNext = prayerData.nextPrayer === p.name;
                      return (
                        <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                            isNext ? 'bg-emerald-900/20 border-emerald-500/50 scale-105' : 'bg-slate-900/50 border-slate-800'
                        } ${p.isSecondary ? 'opacity-60 text-sm py-2' : ''}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isNext ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'}`}>
                                    <i className={`fa-solid ${p.icon}`}></i>
                                </div>
                                <span className={`font-bold ${isNext ? 'text-white' : 'text-slate-300'}`}>{p.name}</span>
                            </div>
                            <span className={`font-mono ${isNext ? 'text-emerald-400' : 'text-slate-400'}`}>{formatTime(p.time)}</span>
                        </div>
                      );
                  })}
              </div>
          </div>
      );
  };

  return (
    <div className="flex flex-col h-full bg-[#020617] items-center justify-start p-4 pt-8 text-white overflow-y-auto pb-32">
      {/* Header Toggle */}
      <div className="bg-slate-900/80 p-1 rounded-full flex gap-1 mb-4 border border-slate-800 relative z-10">
          <button 
            onClick={() => setViewMode('QIBLA')}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${viewMode === 'QIBLA' ? 'bg-cyan-500 text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
              <i className="fa-solid fa-compass mr-2"></i>Kiblat
          </button>
          <button 
            onClick={() => setViewMode('PRAYER')}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${viewMode === 'PRAYER' ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
              <i className="fa-solid fa-clock mr-2"></i>Waktu Solat
          </button>
      </div>

      <AnimatePresence mode='wait'>
        {viewMode === 'QIBLA' ? (
            <motion.div 
                key="qibla"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center w-full"
            >
                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
                    {isLoading && !error && (
                    <div className="flex flex-col items-center">
                        <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full mb-4"
                        />
                        <p className="text-slate-400">Mencari lokasi anda...</p>
                    </div>
                    )}

                    {showPermissionPrompt && (
                    <div className="text-center p-6 rounded-xl bg-slate-900/50 border border-red-500/30 shadow-lg max-w-sm">
                        <p className="text-red-400 text-lg mb-4">Akses Diblokir!</p>
                        <p className="text-slate-300 mb-6">
                        Untuk mengesan arah kiblat, sila benarkan akses lokasi dan sensor gerakan pada peranti anda.
                        </p>
                        {error && <p className="text-sm text-red-300 mb-4">{error}</p>}
                        {isDeviceOrientationSupported && (
                        <button
                            onClick={requestDeviceOrientationPermission}
                            className="px-6 py-3 bg-cyan-500 text-black font-bold rounded-lg shadow-md hover:bg-cyan-400 transition-colors"
                        >
                            Benarkan Sensor Gerakan
                        </button>
                        )}
                    </div>
                    )}

                    {!isLoading && !error && (qiblaAngle !== null && deviceHeading !== null) ? (
                    <>
                        {renderCompass()}
                        <div className="text-center mt-8">
                        <p className="text-slate-300 text-lg">
                            Arah Kiblat: <span className="text-cyan-400 font-bold">{qiblaAngle?.toFixed(1) || '--'}°</span>
                        </p>
                        <p className="text-slate-500 text-sm">
                            Heading Anda: <span className="font-mono">{deviceHeading?.toFixed(1) || '--'}°</span>
                        </p>
                        {isPointingQibla && (
                            <motion.p
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, repeat: Infinity, repeatType: "reverse" }}
                            className="text-emerald-400 text-xl font-bold mt-4 animate-pulse"
                            >
                            <i className="fa-solid fa-check-circle mr-2"></i> TEPAT KE ARAH KIBLAT!
                            </motion.p>
                        )}
                        </div>
                    </>
                    ) : (!isLoading && error && (
                        <div className="text-center p-6 rounded-xl bg-slate-900/50 border border-red-500/30 shadow-lg max-w-sm">
                            <p className="text-red-400 text-lg mb-4">Ralat!</p>
                            <p className="text-slate-300">{error}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        ) : (
            <motion.div 
                key="prayer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full flex flex-col items-center"
            >
                {renderPrayerTimes()}
            </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <div className="mt-8 text-center text-slate-600 text-[10px]">
        <p>Lokasi: {latitude?.toFixed(4) || '--'}, {longitude?.toFixed(4) || '--'}</p>
        <p>Waktu Solat: JAKIM Standard (Shafi'i)</p>
      </div>
    </div>
  );
};

export default Ibadah;