import React, { useState } from 'react';
import { TAJWEED_TUTORIALS, TajweedTutorial } from './data';
import { generateIslamicVideo } from '../../services/aiService';

interface IqraTutorialsProps {
    onBack: () => void;
}

const IqraTutorials: React.FC<IqraTutorialsProps> = ({ onBack }) => {
    const [selectedTutorial, setSelectedTutorial] = useState<TajweedTutorial | null>(null);
    const [tutorialVideoUrl, setTutorialVideoUrl] = useState<string | null>(null);
    const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

    const handleGenerateLesson = async () => {
        if (!selectedTutorial) return;
        setIsGeneratingVideo(true);
        try {
            const videoUrl = await generateIslamicVideo(selectedTutorial.prompt);
            setTutorialVideoUrl(videoUrl);
        } catch (e) {
            console.error("Video Gen Error:", e);
            alert("Failed to generate video. Try again.");
        } finally {
            setIsGeneratingVideo(false);
        }
    };

    return (
        <div className="space-y-4 animate-slide-up h-full overflow-y-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={onBack}
                    className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
                    aria-label="Back to Read"
                    title="Back to Read"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h2 className="text-xl font-bold text-white">Tajweed Masterclass</h2>
            </div>

            {!selectedTutorial ? (
                <div className="grid grid-cols-1 gap-4">
                    {TAJWEED_TUTORIALS.map((tut: any) => (
                        <div
                            key={tut.id}
                            onClick={() => setSelectedTutorial(tut)}
                            className={`relative h-32 rounded-3xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-500 group border-2 ${tut.borderColor.replace('border-', 'border-')}`}
                        >
                            {/* Cinematic Poster Background */}
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={tut.poster}
                                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                    alt={tut.title}
                                />
                                <div className={`absolute inset-0 bg-gradient-to-r ${tut.bgColor.replace('bg-', 'from-').replace('/10', '/80')} to-slate-900/90 z-10`}></div>
                            </div>

                            <div className="relative z-20 p-6 flex items-center gap-4 h-full">
                                <div className={`w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl ${tut.color} shadow-xl border border-white/20`}>
                                    <i className={`fa-solid ${tut.icon}`}></i>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white text-lg font-black tracking-tight">{tut.title}</h3>
                                    <p className="text-xs text-white/70 line-clamp-1">{tut.description}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:bg-primary transition-all">
                                    <i className="fa-solid fa-play text-xs"></i>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-6 animate-fade-in">
                    <button
                        onClick={() => { setSelectedTutorial(null); setTutorialVideoUrl(null); }}
                        className="text-xs text-slate-500 hover:text-white mb-2 flex items-center gap-1"
                    >
                        <i className="fa-solid fa-arrow-left"></i> Back to Topics
                    </button>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1 overflow-hidden">
                        <div className="relative aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
                            {isGeneratingVideo ? (
                                <div className="text-center">
                                    <i className="fa-solid fa-circle-notch fa-spin text-3xl text-teal-500 mb-2"></i>
                                    <p className="text-xs text-slate-400">Generating AI Lesson...</p>
                                </div>
                            ) : tutorialVideoUrl ? (
                                <video src={tutorialVideoUrl} controls autoPlay className="w-full h-full object-contain" />
                            ) : (
                                <div className="text-center p-6">
                                    <div className={`w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 ${selectedTutorial.color}`}>
                                        <i className={`fa-solid ${selectedTutorial.icon} text-3xl`}></i>
                                    </div>
                                    <h3 className="text-white font-bold mb-2">Watch Lesson: {selectedTutorial.title}</h3>
                                    <p className="text-xs text-slate-500 mb-6 max-w-xs mx-auto">Generate a 5-second AI video explaining this rule visually.</p>
                                    <button
                                        onClick={handleGenerateLesson}
                                        className="px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-700 text-white font-bold rounded-full shadow-lg hover:shadow-teal-500/20 transition-transform hover:-translate-y-1"
                                    >
                                        <i className="fa-solid fa-wand-magic-sparkles mr-2"></i> Generate Video
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                        <h4 className="text-white font-bold mb-2">About this Rule</h4>
                        <p className="text-sm text-slate-300 leading-relaxed">{selectedTutorial.description}</p>
                        <div className="mt-4 p-4 bg-slate-900 rounded-xl border border-slate-800">
                            <p className="text-xs text-slate-500 uppercase font-bold mb-2">Practice Prompt</p>
                            <p className="text-sm text-teal-400 font-arabic text-right" dir="rtl">... (Arabic Example) ...</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IqraTutorials;
