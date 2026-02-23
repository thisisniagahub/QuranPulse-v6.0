import React, { useEffect, useState } from 'react';
import { api } from '../../../services/apiClient';
import { Announcement } from '../../../types';
import { motion, AnimatePresence } from 'framer-motion';

const AnnouncementManager: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState<'normal' | 'high'>('normal');

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async () => {
        setLoading(true);
        const data = await api.getAnnouncements();
        setAnnouncements(data);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        await api.addAnnouncement({
            id: crypto.randomUUID(), // Temp ID if offline, real DB will auto-gen usually but good for optimistic UI
            title,
            content,
            priority,
            type: 'INFO',
            active: true,
            date: new Date().toISOString()
        });

        // Reset
        setTitle('');
        setContent('');
        setPriority('normal');
        setIsCreating(false);
        loadAnnouncements();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Archive this announcement?")) return;
        await api.deleteAnnouncement(id);
        loadAnnouncements();
    };

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Broadcast Center</h2>
                    <p className="text-slate-400 text-sm">Manage app-wide announcements and alerts.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="px-6 py-3 bg-teal-600 hover:bg-raudhah-teal text-white font-bold rounded-xl shadow-lg shadow-teal-600/20 transition-all flex items-center gap-2"
                >
                    <i className="fa-solid fa-plus"></i> New Broadcast
                </button>
            </div>

            {/* Create Modal (Inline) */}
            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-slate-900/80 border border-raudhah-teal/20 rounded-2xl p-6 overflow-hidden"
                    >
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs uppercase text-slate-500 font-bold mb-1 block">Title</label>
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-raudhah-teal outline-none"
                                        placeholder="e.g. Server Maintenance"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs uppercase text-slate-500 font-bold mb-1 block">Priority</label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value as any)}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-raudhah-teal outline-none"
                                    >
                                        <option value="normal">Normal (Info)</option>
                                        <option value="high">High (Alert)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs uppercase text-slate-500 font-bold mb-1 block">Content</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-raudhah-teal outline-none min-h-[100px]"
                                    placeholder="Details of the announcement..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreating(false)}
                                    className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-teal-600 hover:bg-raudhah-teal text-white font-bold rounded-lg"
                                >
                                    Publish Now
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {loading ? (
                    <div className="text-center py-20 text-slate-500">Loading feeds...</div>
                ) : announcements.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 border-2 border-dashed border-white/5 rounded-3xl">
                        No active announcements.
                    </div>
                ) : (
                    announcements.map((ann) => (
                        <motion.div
                            key={ann.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-6 rounded-2xl border flex justify-between items-start group transition-all ${ann.priority === 'high'
                                ? 'bg-red-500/10 border-red-500/30'
                                : 'bg-slate-800/40 border-white/5 hover:border-white/10'
                                }`}
                        >
                            <div className="flex gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg ${ann.priority === 'high'
                                    ? 'bg-red-500 text-white shadow-red-500/20'
                                    : 'bg-raudhah-teal/10 text-raudhah-teal border border-raudhah-teal/20'
                                    }`}>
                                    <i className={`fa-solid ${ann.priority === 'high' ? 'fa-triangle-exclamation' : 'fa-bullhorn'}`}></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-3">
                                        {ann.title}
                                        {ann.priority === 'high' && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded uppercase font-black tracking-wider">Urgent</span>}
                                    </h3>
                                    <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">{ann.content}</p>
                                    <p className="text-xs text-slate-600 mt-3 font-mono">
                                        Posted: {new Date(ann.date || Date.now()).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(ann.id)}
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:bg-red-500/20 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                                title="Archive"
                            >
                                <i className="fa-solid fa-box-archive"></i>
                            </button>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AnnouncementManager;
