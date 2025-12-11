
import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { getPersonalizedGreeting, generateDoaCard } from '../../services/aiService';

interface ProfileProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onSignOut: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, onSignOut }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [donationStep, setDonationStep] = useState<'INFO' | 'AMOUNT' | 'SUCCESS'>('INFO');
  const [activeTab, setActiveTab] = useState<'PERSONAL' | 'FAMILY'>('PERSONAL');
  const [generatedDoa, setGeneratedDoa] = useState("");

  const handleSave = () => {
    onUpdateUser({ ...user, name });
    setIsEditing(false);
  };

  const handleDonate = async () => {
    // Simulate API call
    setTimeout(async () => {
        setDonationStep('SUCCESS');
        const doa = await generateDoaCard(user.name);
        setGeneratedDoa(doa);
        // Award Barakah Points for donation
        onUpdateUser({ ...user, barakah_points: (user.barakah_points || 0) + 500 });
    }, 1000);
  };

  const resetDonation = () => {
      setShowSupportModal(false);
      setDonationStep('INFO');
      setGeneratedDoa("");
  };

  return (
    <div className="p-4 space-y-6 pb-24 animate-fade-in relative">
        
        {/* Background Layer */}
        <div className="app-bg-layer bg-downbg app-bg-subtle"></div>
        <div className="gradient-overlay-light"></div>
        
        {/* Header */}
        <div className="flex justify-between items-end">
            <div>
                <h2 className="text-2xl font-bold text-white">My Profile</h2>
                <p className="text-slate-400 text-sm">Manage your account and family</p>
            </div>
            {!isEditing ? (
                 <button onClick={() => setIsEditing(true)} className="text-primary text-sm font-semibold hover:text-primary-hover">Edit</button>
            ) : (
                 <div className="flex gap-4">
                     <button onClick={() => { setIsEditing(false); setName(user.name); }} className="text-slate-400 text-sm hover:text-white">Cancel</button>
                     <button onClick={handleSave} className="text-primary text-sm font-bold hover:text-primary-hover">Save</button>
                 </div>
            )}
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button onClick={() => setActiveTab('PERSONAL')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'PERSONAL' ? 'bg-slate-800 text-white shadow' : 'text-slate-500'}`}>Personal</button>
            <button onClick={() => setActiveTab('FAMILY')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'FAMILY' ? 'bg-slate-800 text-white shadow' : 'text-slate-500'}`}>Family Plan</button>
        </div>

        {activeTab === 'PERSONAL' && (
            <div className="space-y-6 animate-slide-up">
                {/* Avatar & Info */}
                <div className="flex flex-col items-center py-8 bg-slate-900 relative overflow-hidden rounded-3xl border border-slate-800 shadow-lg">
                    <div className="absolute inset-0 bg-maze opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>

                    <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,191,165,0.2)] ring-2 ring-primary/50">
                        <i className="fa-solid fa-user text-4xl text-slate-400"></i>
                    </div>
                    
                    <div className="relative z-10 text-center w-full flex flex-col items-center">
                        {isEditing ? (
                            <>
                                <label htmlFor="profile-name" className="sr-only">Your Name</label>
                                <input 
                                    id="profile-name"
                                    name="name"
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-center text-white font-bold outline-none focus:border-primary w-2/3"
                                    placeholder="Your Name"
                                    autoComplete="name"
                                />
                            </>
                        ) : (
                            <h3 className="text-xl font-bold text-white">{user.name}</h3>
                        )}
                        <p className="text-slate-500 text-sm mt-1 font-medium">{user.email}</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                            <i className="fa-solid fa-gem text-gold-500"></i> Barakah Points
                        </div>
                        <div className="text-2xl font-bold text-white">{user.barakah_points || 0}</div>
                    </div>
                    <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                            <i className="fa-solid fa-fire text-orange-500"></i> Streak
                        </div>
                        <div className="text-2xl font-bold text-white">{user.streak} <span className="text-base text-slate-500 font-normal">Days</span></div>
                    </div>
                </div>

                 {/* Sadaqah Jariyah Section */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-gold-500/30 shadow-lg group cursor-pointer" onClick={() => setShowSupportModal(true)}>
                    <div className="absolute inset-0 bg-maze opacity-10"></div>
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl group-hover:bg-gold-500/20 transition-colors"></div>
                    
                    <div className="relative z-10 p-5 flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 bg-gold-500/20 text-gold-400 text-[10px] font-bold uppercase tracking-wider rounded border border-gold-500/20">Sadaqah Jariyah</span>
                            </div>
                            <h3 className="text-lg font-bold text-white">Support Development</h3>
                            <p className="text-xs text-slate-400 max-w-[200px]">
                                Earn Barakah Points while supporting the mission.
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 border border-gold-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)] group-hover:scale-110 transition-transform">
                            <i className="fa-solid fa-hand-holding-heart text-xl"></i>
                        </div>
                    </div>
                </div>

                {/* Settings & Sign Out */}
                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Preferences</h4>
                    <div className="bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-800 backdrop-blur-sm">
                        <div className="p-4 flex justify-between items-center border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <i className="fa-regular fa-bell"></i>
                                </div>
                                <span className="text-slate-200 text-sm font-medium">Notifications</span>
                            </div>
                            <div className="w-10 h-5 bg-primary/20 rounded-full relative">
                                <div className="w-3 h-3 bg-primary rounded-full absolute right-1 top-1 shadow-sm"></div>
                            </div>
                        </div>
                        <div 
                            onClick={onSignOut}
                            className="p-4 flex justify-between items-center hover:bg-red-900/20 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
                                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                </div>
                                <span className="text-red-400 text-sm font-medium">Sign Out</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'FAMILY' && (
            <div className="space-y-6 animate-slide-up">
                 <div className="bg-gradient-to-r from-slate-900 to-primary-dark p-6 rounded-3xl text-center border border-white/5 relative overflow-hidden">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                     <i className="fa-solid fa-users text-4xl text-white/50 mb-3 relative z-10"></i>
                     <h3 className="text-xl font-bold text-white mb-2 relative z-10">Family Plan</h3>
                     <p className="text-xs text-slate-300 mb-4 relative z-10">Manage up to 5 child accounts. Monitor their Quran progress and limit screen time.</p>
                     <button className="px-6 py-2 bg-white text-primary-dark font-bold rounded-full text-sm hover:bg-slate-200 transition-colors relative z-10 shadow-lg">
                         Upgrade (RM 19.90/mo)
                     </button>
                 </div>

                 <div>
                     <div className="flex justify-between items-center mb-4">
                         <h4 className="text-white font-bold text-sm">Child Progress (Dashboard)</h4>
                         <button className="text-primary text-xs font-bold flex items-center gap-1">
                             <i className="fa-solid fa-plus"></i> Add Child
                         </button>
                     </div>
                     
                     <div className="space-y-3">
                         {/* Mock Child 1 */}
                         <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
                             <div className="flex items-center gap-4 mb-3">
                                 <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold border border-primary/30 shadow-inner">
                                     A
                                 </div>
                                 <div className="flex-1">
                                     <h5 className="text-white font-bold text-sm">Adam (Son)</h5>
                                     <p className="text-xs text-slate-500">Iqra Level 2</p>
                                 </div>
                                 <div className="text-right">
                                     <span className="text-xs font-bold text-green-400">3 Pages</span>
                                     <span className="text-[10px] text-slate-500 block">Today</span>
                                 </div>
                             </div>
                             {/* Progress Visuals */}
                             <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                                 <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                                     <span>Pronunciation Accuracy</span>
                                     <span className="text-white font-bold">78%</span>
                                 </div>
                                 <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden mb-2">
                                     <div className="w-[78%] h-full bg-primary rounded-full"></div>
                                 </div>
                                 <div className="flex gap-2">
                                     <span className="text-[9px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20">Focus: Letter 'Ra'</span>
                                     <span className="text-[9px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20">Strong: 'Ba'</span>
                                 </div>
                             </div>
                         </div>
                         
                         {/* Mock Child 2 */}
                         <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-10 h-10 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold border border-secondary/30 shadow-inner">
                                    S
                                </div>
                                <div className="flex-1">
                                    <h5 className="text-white font-bold text-sm">Sarah (Daughter)</h5>
                                    <p className="text-xs text-slate-500">Iqra Level 1</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-slate-500">No Activity</span>
                                </div>
                            </div>
                             <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                                 <p className="text-[10px] text-slate-500 italic">Last active: 3 days ago. Send a reminder?</p>
                             </div>
                        </div>
                     </div>
                 </div>
            </div>
        )}
        
        {/* Support Modal */}
        {showSupportModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowSupportModal(false)}>
                <div className="bg-slate-900 w-full max-w-md rounded-3xl border border-slate-800 shadow-2xl overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
                    <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-gold-400">
                             <i className="fa-solid fa-hand-holding-heart text-3xl"></i>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Support QuranPulse</h3>
                        {donationStep === 'INFO' && (
                            <>
                                <p className="text-slate-400 text-sm mb-6">Your Infaq helps us develop AI features and keep the app ad-free for everyone.</p>
                                <button onClick={() => setDonationStep('AMOUNT')} className="w-full py-3 bg-gold-500 text-black font-bold rounded-xl mb-3 hover:bg-gold-400">Donate Now</button>
                                <button onClick={() => setShowSupportModal(false)} className="text-slate-500 text-sm">Maybe Later</button>
                            </>
                        )}
                        {donationStep === 'AMOUNT' && (
                            <>
                                <p className="text-slate-400 text-sm mb-6">Select Amount</p>
                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    {[10, 50, 100].map(amt => (
                                        <button key={amt} onClick={handleDonate} className="py-3 rounded-xl border border-slate-700 hover:bg-slate-800 hover:border-gold-500 text-white font-bold transition-all">RM {amt}</button>
                                    ))}
                                </div>
                                <button onClick={() => setDonationStep('INFO')} className="text-slate-500 text-sm">Back</button>
                            </>
                        )}
                        {donationStep === 'SUCCESS' && (
                            <div className="animate-fade-in">
                                <p className="text-green-400 font-bold mb-4">Alhamdulillah! Payment Successful.</p>
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6 relative overflow-hidden">
                                     <div className="absolute top-0 left-0 w-1 h-full bg-gold-500"></div>
                                     <p className="text-[10px] text-gold-500 uppercase font-bold tracking-widest mb-2 text-left">Your Doa Receipt</p>
                                     <p className="text-white text-sm italic font-serif leading-relaxed">"{generatedDoa || 'Loading Doa...'}"</p>
                                </div>
                                <button onClick={resetDonation} className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700">Close</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default Profile;
