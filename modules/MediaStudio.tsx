import React, { useState, useEffect } from 'react';
import { generateIslamicVideo, enhanceVideoPrompt } from '../services/aiService';

const MediaStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'WATCH' | 'LISTEN' | 'CREATE'>('WATCH');

  // Create State
  const [prompt, setPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Persistence Effects
  useEffect(() => {
    const savedVideo = localStorage.getItem('last_generated_video');
    const savedPrompt = localStorage.getItem('last_video_prompt');
    if (savedVideo) setVideoUrl(savedVideo);
    if (savedPrompt) setPrompt(savedPrompt);
  }, []);

  useEffect(() => {
    if (videoUrl) localStorage.setItem('last_generated_video', videoUrl);
  }, [videoUrl]);

  useEffect(() => {
    localStorage.setItem('last_video_prompt', prompt);
  }, [prompt]);

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
        const improved = await enhanceVideoPrompt(prompt);
        setPrompt(improved);
    } catch (e) {
        // Fallback silently
    } finally {
        setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setError(null);
    setVideoUrl(null);
    localStorage.removeItem('last_generated_video'); // Clear old video

    // Check for API Key selection (Required for Veo)
    try {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        const success = await (window as any).aistudio.openSelectKey();
        if (!success) {
            setError("API Key is required for video generation.");
            return;
        }
      }
    } catch (e) {
        console.warn("AI Studio API Check failed, proceeding...", e);
    }

    setIsGenerating(true);
    try {
      const url = await generateIslamicVideo(prompt);
      if (url) {
        setVideoUrl(url);
      } else {
        setError("Video generation failed to return a valid URI.");
      }
    } catch (err: any) {
      setError("An error occurred while generating the video. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 pb-24 space-y-6 animate-fade-in min-h-full flex flex-col">
      
      {/* Header with Maze Context */}
      <div className="relative rounded-2xl bg-slate-900 p-6 border border-slate-800 overflow-hidden shadow-lg shrink-0">
         <div className="absolute inset-0 bg-maze opacity-20"></div>
         <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
         
         <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                <i className="fa-solid fa-photo-film"></i>
              </div>
              Multimedia Hub
            </h2>
            <p className="text-slate-400 text-xs mt-1">Watch, Listen, & Create.</p>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          {['WATCH', 'LISTEN', 'CREATE'].map(tab => (
              <button 
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all duration-300 relative overflow-hidden ${
                   activeTab === tab 
                   ? 'text-white shadow-lg' 
                   : 'text-slate-500 hover:text-slate-300'
               }`}
              >
                   {activeTab === tab && (
                       <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark rounded-xl"></div>
                   )}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                      <i className={`fa-solid ${tab === 'WATCH' ? 'fa-play' : tab === 'LISTEN' ? 'fa-headphones' : 'fa-wand-magic-sparkles'}`}></i>
                      {tab === 'WATCH' ? 'QP TV' : tab === 'LISTEN' ? 'Pulse FM' : 'Studio'}
                  </span>
              </button>
          ))}
      </div>

      {/* --- WATCH (QuranPulse TV) --- */}
      {activeTab === 'WATCH' && (
          <div className="flex-1 overflow-y-auto space-y-6 animate-slide-up">
              {/* Featured Series */}
              <div className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer bg-slate-800">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-600 bg-slate-800">
                      <i className="fa-solid fa-film text-4xl"></i>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6">
                      <div className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold rounded-md w-fit mb-2">NEW SERIES</div>
                      <h3 className="text-2xl font-bold text-white mb-1">Hijrah Digital</h3>
                      <p className="text-slate-300 text-xs line-clamp-2 mb-4">A documentary exploring the intersection of modern technology and ancient faith traditions.</p>
                      <button className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-full font-bold text-sm w-fit hover:bg-slate-200 transition-colors">
                          <i className="fa-solid fa-play"></i> Play Now
                      </button>
                  </div>
              </div>

              {/* Categories */}
              <div>
                  <h4 className="text-white font-bold text-sm mb-3">Trending Now</h4>
                  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                      {[1,2,3].map(i => (
                          <div key={i} className="min-w-[140px] aspect-[9/16] bg-slate-800 rounded-xl relative overflow-hidden group cursor-pointer border border-slate-700">
                               <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                                   <i className="fa-solid fa-play"></i>
                               </div>
                               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                                   <i className="fa-regular fa-circle-play text-3xl text-white"></i>
                               </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* --- LISTEN (Pulse FM) --- */}
      {activeTab === 'LISTEN' && (
          <div className="flex-1 overflow-y-auto space-y-6 animate-slide-up">
              {/* Now Playing Banner */}
              <div className="bg-gradient-to-r from-violet-900 to-fuchsia-900 rounded-2xl p-6 flex items-center gap-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/sound-waves.png')] opacity-30"></div>
                  <div className="w-20 h-20 rounded-xl bg-black/30 shadow-lg shrink-0 flex items-center justify-center">
                      <i className="fa-solid fa-music text-3xl text-white/50"></i>
                  </div>
                  <div className="flex-1 z-10">
                      <p className="text-[10px] font-bold text-fuchsia-300 uppercase tracking-widest mb-1">Live Station</p>
                      <h3 className="text-xl font-bold text-white">Morning Adhkar</h3>
                      <p className="text-xs text-slate-300">Ustaz Don Daniyal</p>
                  </div>
                  <button className="w-12 h-12 rounded-full bg-white text-fuchsia-900 flex items-center justify-center shadow-lg hover:scale-105 transition-transform z-10" title="Pause" aria-label="Pause">
                      <i className="fa-solid fa-pause"></i>
                  </button>
              </div>

              {/* Playlist */}
              <div>
                  <h4 className="text-white font-bold text-sm mb-3">Featured Podcasts</h4>
                  <div className="space-y-3">
                      {[
                          { title: "The Seerah", author: "Yasir Qadhi", time: "45m" },
                          { title: "Heart Therapy", author: "Mufti Menk", time: "30m" },
                          { title: "Tafsir Surah Kahf", author: "Nouman Ali Khan", time: "55m" }
                      ].map((pod, i) => (
                          <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer group border border-transparent hover:border-slate-700">
                              <div className="w-10 h-10 rounded-lg bg-slate-700 text-slate-400 flex items-center justify-center text-xs font-bold">
                                  {i + 1}
                              </div>
                              <div className="flex-1">
                                  <h5 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{pod.title}</h5>
                                  <p className="text-xs text-slate-500">{pod.author} • {pod.time}</p>
                              </div>
                              <button className="text-slate-500 hover:text-white" title="Play Podcast" aria-label="Play Podcast"><i className="fa-regular fa-circle-play text-xl"></i></button>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* --- CREATE (Veo Studio) --- */}
      {activeTab === 'CREATE' && (
        <div className="animate-slide-up space-y-4">
            <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-2xl p-1 relative group focus-within:border-primary/50 transition-colors">
                {/* Text Area */}
                <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your video... e.g. 'A mosque at sunset'"
                className="w-full bg-transparent text-slate-200 p-4 min-h-[140px] outline-none resize-none placeholder:text-slate-600 text-sm leading-relaxed"
                />
                
                {/* Magic Enhancer Button */}
                <button 
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancing || !prompt.trim()}
                  className="absolute bottom-16 right-4 z-20 text-xs bg-slate-800/80 backdrop-blur text-secondary border border-secondary/30 px-3 py-1.5 rounded-lg hover:bg-secondary/20 hover:text-white transition-all flex items-center gap-2"
                >
                    {isEnhancing ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-sparkles"></i>}
                    Enhance Prompt
                </button>

                {/* Footer Controls */}
                <div className="px-4 py-3 flex justify-between items-center border-t border-slate-800/50 bg-slate-950/30 rounded-b-xl">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Powered by Veo 3.1</span>
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg ${
                        isGenerating 
                        ? 'bg-slate-700 text-slate-300' 
                        : 'bg-gradient-to-r from-secondary to-primary hover:from-secondary-hover hover:to-primary-hover text-white shadow-primary/20 hover:shadow-primary/40'
                    }`}
                >
                    {isGenerating ? (
                    <>
                        <i className="fa-solid fa-circle-notch fa-spin"></i> Generating...
                    </>
                    ) : (
                    <>
                        <i className="fa-solid fa-video"></i> Create Video
                    </>
                    )}
                </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-xl text-sm flex items-center gap-3 animate-slide-up">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                {error}
                </div>
            )}

            {isGenerating && (
                <div className="text-center py-12 space-y-6 animate-fade-in">
                    <div className="relative w-32 h-32 mx-auto">
                        <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                            <i className="fa-solid fa-film text-3xl text-primary"></i>
                        </div>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-white font-bold text-lg">Dreaming up your scene...</p>
                        <p className="text-slate-400 text-sm">This usually takes about 30-60 seconds.</p>
                    </div>
                </div>
            )}

            {videoUrl && (
                <div className="space-y-4 animate-slide-up">
                <div className="flex items-center gap-2 text-primary font-bold border-b border-slate-800 pb-2">
                    <i className="fa-solid fa-check-circle"></i> Generation Complete
                </div>
                
                <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-[0_0_30px_rgba(0,191,165,0.2)] bg-black aspect-video relative group">
                    <video 
                        src={videoUrl} 
                        controls 
                        autoPlay 
                        loop 
                        className="w-full h-full object-contain"
                    />
                </div>
                
                <a 
                    href={videoUrl}
                    download="islamic_video.mp4"
                    className="flex items-center justify-center w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 py-4 rounded-xl text-white font-semibold transition-all group"
                >
                    <i className="fa-solid fa-download mr-2 group-hover:animate-bounce"></i> Download Video
                </a>
                </div>
            )}
      </div>
      )}
    </div>
  );
};

export default MediaStudio;
