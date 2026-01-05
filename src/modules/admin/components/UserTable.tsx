import React, { useEffect, useState } from 'react';
import { api } from '../../../services/apiClient';
import { UserProfile } from '../../../types';
import { motion } from 'framer-motion';

const UserTable: React.FC = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchQuery] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await api.getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to load users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBan = async (id: string) => {
        if(!confirm("Are you sure you want to ban this user?")) return;
        await api.adminUpdateUser({ id, role: 'banned' }); // Assuming role update handles ban logic
        loadUsers();
    };

    const handlePromote = async (id: string) => {
        await api.adminUpdateUser({ id, role: 'admin' });
        loadUsers();
    };

    const filteredUsers = users.filter(u => 
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-slate-900/50 rounded-2xl border border-white/5 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">User Management</h3>
                <div className="relative">
                    <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={searchTerm}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 w-64"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-slate-400 font-medium uppercase tracking-wider text-[10px]">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan={5} className="text-center py-10 text-slate-500">Loading users...</td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-10 text-slate-500">No users found.</td></tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <motion.tr 
                                    key={user.id} 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-white/5 transition-colors"
                                >
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden">
                                            <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="" className="w-full h-full object-cover"/>
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                            user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700/50 text-slate-400'
                                        }`}>
                                            {user.role || 'User'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-2 text-emerald-400 text-xs">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-xs">
                                        {new Date().toLocaleDateString()} {/* Mock date if not in DB */}
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button onClick={() => handlePromote(user.id)} title="Promote to Admin" className="w-7 h-7 rounded bg-slate-800 hover:bg-purple-500/20 hover:text-purple-400 text-slate-400 transition-colors flex items-center justify-center">
                                            <i className="fa-solid fa-crown text-xs"></i>
                                        </button>
                                        <button onClick={() => handleBan(user.id)} title="Ban User" className="w-7 h-7 rounded bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors flex items-center justify-center">
                                            <i className="fa-solid fa-ban text-xs"></i>
                                        </button>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;
