import React, { useState } from 'react';



import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface Moment {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  likes_count: number;
  created_at: string;
  profiles?: {
    name: string;
    avatar_url?: string;
  };
  isLiked?: boolean; // Virtual field for UI
}

const fetchMoments = async () => {
  const { data, error } = await supabase
    .from('moments')
    .select(`
      *,
      profiles:user_id (name, avatar_url)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Moment[];
};

const MomentsFeed: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const queryClient = useQueryClient();
  const [newContent, setNewContent] = useState('');

  const { data: moments, isLoading } = useQuery({
    queryKey: ['moments'],
    queryFn: fetchMoments
  });

  const createMomentMutation = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase.from('moments').insert([{ content }]);
      if (error) throw error;
    },
    onSuccess: () => {
      setNewContent('');
      queryClient.invalidateQueries({ queryKey: ['moments'] });
    }
  });

  const handlePost = () => {
    if (!newContent.trim()) return;
    createMomentMutation.mutate(newContent);
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading moments...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Community Moments</h2>
        <button className="text-sm text-cyan-400 font-bold hover:underline">View All</button>
      </div>

      {/* Create Post Input */}
      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
                ME
            </div>
            <input 
                type="text" 
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Share a reflection..." 
                className={`flex-1 bg-transparent border-none outline-none ${isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`}
            />
        </div>
        <div className="flex justify-end mt-3 gap-2">
            <button className="text-slate-500 hover:text-cyan-400 transition-colors" aria-label="Upload Image">
                <i className="fa-solid fa-image"></i>
            </button>
            <button 
              onClick={handlePost}
              disabled={createMomentMutation.isPending}
              className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-1.5 rounded-full text-sm font-bold transition-all disabled:opacity-50"
            >
                {createMomentMutation.isPending ? 'Posting...' : 'Post'}
            </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {moments?.map(moment => (
            <div key={moment.id} className={`p-5 rounded-3xl border transition-all ${isDark ? 'bg-slate-900/40 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm">
                        {moment.profiles?.avatar_url ? <img src={moment.profiles.avatar_url} alt={moment.profiles.name} className="w-full h-full rounded-full" /> : (moment.profiles?.name?.charAt(0) || '?')}
                    </div>
                    <div>
                        <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{moment.profiles?.name || 'Anonymous'}</h4>
                        <p className="text-xs text-slate-500">{new Date(moment.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

                <p className={`text-sm mb-4 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {moment.content}
                </p>

                {moment.image_url && (
                    <div className="mb-4 rounded-2xl overflow-hidden">
                        <img src={moment.image_url} alt="Moment" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                )}

                <div className="flex items-center gap-6 text-slate-500 text-sm">
                    <button 
                        className={`flex items-center gap-2 transition-colors hover:text-red-500`}
                    >
                        <i className={`fa-regular fa-heart`}></i>
                        <span>{moment.likes_count}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                        <i className="fa-regular fa-comment"></i>
                        <span>Comment</span>
                    </button>
                    <button className="ml-auto hover:text-white transition-colors" aria-label="Share">
                        <i className="fa-solid fa-share-nodes"></i>
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default MomentsFeed;
