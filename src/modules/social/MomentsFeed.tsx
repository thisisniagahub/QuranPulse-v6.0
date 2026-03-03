/**
 * 🌿 Moments Feed
 * Community reflection feed in Raudhah theme
 * 
 * Features:
 * - Raudhah Ivory/Teal interface
 * - Real-time Supabase integration
 * - Image sharing support
 * - Like and Comment engagement
 * - High-readability typography
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Heart, MessageSquare, Share2, Image as ImageIcon,
  Send, Sparkles, User, Loader2, Plus, Flag
} from 'lucide-react';
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
  isLiked?: boolean;
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

const MomentsFeed: React.FC = () => {
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

  if (isLoading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center space-y-4">
        <div className="inline-flex animate-spin">
          <Loader2 className="text-raudhah-teal/30" size={40} />
        </div>
        <p className="text-[10px] font-black text-raudhah-teal/30 uppercase tracking-[0.4em]">Menyusun Refleksi Ummah...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto px-4 pb-32">
      {/* Header Section */}
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-raudhah-ink uppercase tracking-tight">Refleksi Ummah</h2>
          <p className="text-[10px] text-raudhah-teal/40 font-black uppercase tracking-widest">Ruang Tadabbur & Perkongsian</p>
        </div>
        <button className="text-[10px] text-raudhah-ink font-black uppercase tracking-widest px-4 py-2 glass-v7 border border-raudhah-teal/10 rounded-xl hover:bg-raudhah-teal hover:text-white transition-all">
          Lihat Semua
        </button>
      </div>

      {/* Create Post Input */}
      <div className="p-6 rounded-[2.5rem] border-2 border-raudhah-teal/10 bg-white shadow-sm glass-v7 transition-all focus-within:border-raudhah-teal/30">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-2xl bg-raudhah-teal/5 border border-raudhah-teal/10 flex items-center justify-center text-raudhah-teal shadow-inner">
            <User size={20} />
          </div>
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Kongsi tadabbur atau refleksi hari ini..."
            rows={2}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-raudhah-ink placeholder-raudhah-teal/20 text-base font-medium resize-none py-2"
          />
        </div>
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-raudhah-teal/5">
          <div className="flex gap-2">
            <button className="p-3 bg-raudhah-teal/5 rounded-xl text-raudhah-teal hover:bg-raudhah-teal hover:text-white transition-all active:scale-90" title="Muat naik gambar">
              <ImageIcon size={18} />
            </button>
          </div>
          <button
            onClick={handlePost}
            disabled={createMomentMutation.isPending || !newContent.trim()}
            className="bg-raudhah-teal text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-20 flex items-center gap-3 border-b-4 border-raudhah-ink active:border-b-0 active:translate-y-1"
          >
            {createMomentMutation.isPending ? (
              <div className="inline-flex animate-spin">
                <Loader2 size={16} />
              </div>
            ) : <Send size={16} />}
            {createMomentMutation.isPending ? 'Mengirim...' : 'Kirim Masej'}
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        <AnimatePresence>
          {moments?.map((moment, idx) => (
            <motion.div
              key={moment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-[2.5rem] border-2 border-raudhah-teal/5 bg-white shadow-sm hover:border-raudhah-teal/10 transition-all group"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-raudhah-teal/5 border border-raudhah-teal/10 overflow-hidden shadow-inner flex items-center justify-center bg-white">
                    {moment.profiles?.avatar_url ? (
                      <img loading="lazy" src={moment.profiles.avatar_url} alt={moment.profiles.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-raudhah-teal font-black text-lg uppercase">{moment.profiles?.name?.charAt(0) || '?'}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-raudhah-ink uppercase tracking-tight">{moment.profiles?.name || 'Hamba Allah'}</h4>
                    <p className="text-[10px] text-raudhah-teal/30 font-bold uppercase tracking-widest">
                      {new Date(moment.created_at).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long' })}
                    </p>
                  </div>
                </div>
                <button className="p-2 text-raudhah-teal/20 hover:text-raudhah-ink transition-colors">
                  <Flag size={14} />
                </button>
              </div>

              <p className="text-base text-raudhah-ink/80 mb-6 leading-relaxed font-medium">
                {moment.content}
              </p>

              {moment.image_url && (
                <div className="mb-6 rounded-[2rem] overflow-hidden border border-raudhah-teal/5 shadow-sm group-hover:shadow-md transition-shadow">
                  <img loading="lazy" src={moment.image_url} alt="Moment" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              )}

              <div className="flex items-center gap-8 text-raudhah-teal/40 text-xs pt-4 border-t border-raudhah-teal/5">
                <button
                  className="flex items-center gap-2.5 transition-all hover:text-raudhah-red group/btn active:scale-90"
                >
                  <div className="w-9 h-9 rounded-xl bg-raudhah-teal/5 flex items-center justify-center group-hover/btn:bg-raudhah-red/10 group-hover/btn:text-raudhah-red transition-all">
                    <Heart size={16} className={moment.isLiked ? 'fill-raudhah-red text-raudhah-red' : ''} />
                  </div>
                  <span className="font-black text-sm">{moment.likes_count}</span>
                </button>

                <button className="flex items-center gap-2.5 hover:text-raudhah-teal transition-all group/btn active:scale-90">
                  <div className="w-9 h-9 rounded-xl bg-raudhah-teal/5 flex items-center justify-center group-hover/btn:bg-raudhah-teal/10 group-hover/btn:text-raudhah-teal transition-all">
                    <MessageSquare size={16} />
                  </div>
                  <span className="font-black text-sm uppercase tracking-widest text-[9px]">Komen</span>
                </button>

                <button className="ml-auto w-9 h-9 rounded-xl bg-raudhah-teal/5 flex items-center justify-center hover:bg-raudhah-teal hover:text-white transition-all active:scale-90" aria-label="Kongsi">
                  <Share2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MomentsFeed;
