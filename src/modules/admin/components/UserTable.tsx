import React, { useEffect, useState } from 'react';
import { adminService } from '../../../services/adminService'; // Fixed import path
import { UserProfile } from '../../../types'; // Fixed import path
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, MoreVertical, Crown, ShieldAlert, UserCheck } from 'lucide-react';
import { format } from 'date-fns';

const UserTable: React.FC = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 10;

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1); // Reset to page 1 on new search
            loadUsers();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Pagination
    useEffect(() => {
        loadUsers();
    }, [page]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const { users: data, total } = await adminService.getUsers<UserProfile>(page, LIMIT, searchQuery);
            setUsers(data);
            setTotalPages(Math.ceil((total || 0) / LIMIT));
        } catch (error) {
            console.error("Failed to load users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBan = async (id: string) => {
        if (!confirm("Are you sure you want to ban this user?")) return;
        await adminService.banUser(id, "Admin manual ban");
        loadUsers();
    };

    const handlePromote = async (id: string) => {
        if (!confirm("Promote user to admin?")) return;
        await adminService.updateUser(id, { role: 'admin' });
        loadUsers();
    };

    const handleUpgradeTier = async (id: string, tier: 'PRO' | 'FAMILY') => {
        await adminService.updateUserTier(id, tier);
        loadUsers();
    };

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-emerald-400" />
                        Ummah CRM
                    </h3>
                    <p className="text-xs text-slate-500">Manage users, subscriptions, and roles.</p>
                </div>

                <div className="relative group w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-raudhah-teal transition-colors" />
                    <input
                        type="text"
                        placeholder="Search email or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-raudhah-teal w-full md:w-72 transition-all"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-slate-400 font-medium uppercase tracking-wider text-[10px] font-mono">
                        <tr>
                            <th className="px-6 py-4">User Identity</th>
                            <th className="px-6 py-4">Subscription</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Joined Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4"><div className="h-10 bg-white/5 rounded-lg w-48"></div></td>
                                    <td className="px-6 py-4"><div className="h-6 bg-white/5 rounded w-20"></div></td>
                                    <td className="px-6 py-4"><div className="h-6 bg-white/5 rounded w-16"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-white/5 rounded w-24"></div></td>
                                    <td className="px-6 py-4"><div className="h-8 bg-white/5 rounded w-20 ml-auto"></div></td>
                                </tr>
                            ))
                        ) : users.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-16 text-slate-500">No users found matching "{searchQuery}".</td></tr>
                        ) : (
                            users.map((user) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-white/5 transition-colors group"
                                >
                                    <td className="px-6 py-4 flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 overflow-hidden">
                                                <img loading="lazy" src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            {user.is_verified_tutor && (
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-teal-500 rounded-full border border-black flex items-center justify-center text-[8px] text-white">✓</div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">{user.full_name || 'Anonymous'}</p>
                                            <p className="text-xs text-slate-500 font-mono">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${user.tier === 'FAMILY' || user.tier === 'FAMILY_OWNER' || user.tier === 'FAMILY_MEMBER' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                                            user.tier === 'PRO' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                                                'bg-slate-700/30 border-slate-600 text-slate-400'
                                            }`}>
                                            {user.tier || 'FREE'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center gap-1.5 text-xs font-medium ${user.role === 'admin' ? 'text-amber-400' : 'text-slate-300'}`}>
                                            {user.role === 'admin' && <Crown className="w-3 h-3" />}
                                            {(user.role || 'user').toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-xs font-mono">
                                        {user.created_at ? format(new Date(user.created_at), 'dd MMM yyyy') : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => user.id && handleUpgradeTier(user.id, 'PRO')}
                                                title="Gift PRO"
                                                className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                                            >
                                                <Crown className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => user.id && handlePromote(user.id)}
                                                title="Make Admin"
                                                className="p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white transition-all"
                                            >
                                                <ShieldAlert className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => user.id && handleBan(user.id)}
                                                title="Ban User"
                                                className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 border-t border-white/5 flex justify-between items-center bg-black/20">
                <span className="text-xs text-slate-500">Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Previous page"
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Next page"
                        aria-label="Next page"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserTable;
