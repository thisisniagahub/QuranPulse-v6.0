/**
 * RealtimeChatDemo Component
 * QuranPulse v6.0 - Example usage of useRealtimeChat hook
 * 
 * This is a demonstration component showing how to integrate
 * realtime chat functionality into the app.
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Wifi, WifiOff, RefreshCw, MessageCircle } from 'lucide-react';
import { useRealtimeChat, WhatsAppMessage } from '../../hooks/useRealtimeChat';

interface RealtimeChatDemoProps {
    /** Phone number for WhatsApp chat */
    phoneNumber?: string;
    /** User ID for user-based chat */
    userId?: string;
}

const RealtimeChatDemo: React.FC<RealtimeChatDemoProps> = ({
    phoneNumber = '+60123456789',
    userId
}) => {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Use the realtime chat hook
    const {
        messages,
        status,
        error,
        sendMessage,
        refreshMessages,
        reconnect,
    } = useRealtimeChat({
        topicType: userId ? 'user' : 'phone',
        identifier: userId || phoneNumber,
        debug: true, // Enable console logging for development
        onNewMessage: (msg) => {
            // Play notification sound for incoming messages
            if (msg.message_type === 'incoming') {
                playNotificationSound();
            }
        },
    });

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle send message
    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const success = await sendMessage(inputValue.trim());
        if (success) {
            setInputValue('');
        }
    };

    // Handle Enter key
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Dummy notification sound
    const playNotificationSound = () => {
        // In production, use actual audio
        // TODO: Implement actual notification audio playback
    };

    // Connection status indicator
    const StatusIndicator = () => {
        const statusConfig = {
            connected: { color: 'text-green-400', icon: Wifi, label: 'Connected' },
            connecting: { color: 'text-yellow-400', icon: RefreshCw, label: 'Connecting...' },
            disconnected: { color: 'text-gray-400', icon: WifiOff, label: 'Disconnected' },
            error: { color: 'text-red-400', icon: WifiOff, label: 'Error' },
        };

        const config = statusConfig[status];
        const Icon = config.icon;

        return (
            <div className={`flex items-center gap-2 text-xs ${config.color}`}>
                <Icon size={14} className={status === 'connecting' ? 'animate-spin' : ''} />
                <span>{config.label}</span>
            </div>
        );
    };

    // Format timestamp
    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('ms-MY', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="flex flex-col h-[600px] max-w-md mx-auto bg-slate-900 rounded-2xl border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-800/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        <MessageCircle size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">
                            {userId ? 'Direct Message' : phoneNumber}
                        </h3>
                        <StatusIndicator />
                    </div>
                </div>

                <button
                    onClick={reconnect}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Reconnect"
                >
                    <RefreshCw size={18} className="text-slate-400" />
                </button>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="px-4 py-2 bg-red-500/20 border-b border-red-500/30 text-red-400 text-xs">
                    ⚠️ {error}
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    <AnimatePresence>
                        {messages.map((msg: WhatsAppMessage) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.message_type === 'outgoing' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${msg.message_type === 'outgoing'
                                        ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-br-md'
                                        : 'bg-slate-800 text-slate-100 rounded-bl-md'
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                    <div className={`flex items-center gap-2 mt-1 text-[10px] ${msg.message_type === 'outgoing' ? 'text-white/60' : 'text-slate-500'
                                        }`}>
                                        <span>{formatTime(msg.created_at)}</span>
                                        {msg.message_type === 'outgoing' && (
                                            <span>
                                                {msg.status === 'read' ? '✓✓' :
                                                    msg.status === 'delivered' ? '✓✓' :
                                                        msg.status === 'sent' ? '✓' : '○'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-slate-800/30">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        disabled={status !== 'connected'}
                        className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
                    />
                    <button
                        onClick={handleSend}
                        disabled={status !== 'connected' || !inputValue.trim()}
                        className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RealtimeChatDemo;
