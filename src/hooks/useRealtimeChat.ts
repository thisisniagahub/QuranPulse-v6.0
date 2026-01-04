/**
 * useRealtimeChat Hook
 * QuranPulse v6.0 - Real-time WhatsApp/Chat Integration
 * 
 * This hook provides real-time chat functionality using Supabase Realtime.
 * Supports both phone-based (WhatsApp) and user-based topics.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// ============================================================================
// TYPES
// ============================================================================

export interface WhatsAppMessage {
    id: string;
    created_at: string;
    phone_number: string;
    user_id?: string;
    message_type: 'incoming' | 'outgoing';
    content: string;
    media_url?: string;
    status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
    metadata?: Record<string, unknown>;
}

export interface RealtimeChatOptions {
    /** Topic type: 'phone' for WhatsApp, 'user' for user-based chat */
    topicType: 'phone' | 'user';
    /** The identifier (phone number or user UUID) */
    identifier: string;
    /** Enable debug logging */
    debug?: boolean;
    /** Callback when new message arrives */
    onNewMessage?: (message: WhatsAppMessage) => void;
    /** Callback when message is updated */
    onMessageUpdate?: (message: WhatsAppMessage) => void;
    /** Callback when message is deleted */
    onMessageDelete?: (messageId: string) => void;
    /** Callback on connection status change */
    onConnectionChange?: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
}

export interface UseRealtimeChatReturn {
    /** Current messages in the chat */
    messages: WhatsAppMessage[];
    /** Connection status */
    status: 'connecting' | 'connected' | 'disconnected' | 'error';
    /** Error message if any */
    error: string | null;
    /** Send a new message */
    sendMessage: (content: string, mediaUrl?: string) => Promise<boolean>;
    /** Manually refresh messages from database */
    refreshMessages: () => Promise<void>;
    /** Disconnect from realtime channel */
    disconnect: () => void;
    /** Reconnect to realtime channel */
    reconnect: () => void;
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export function useRealtimeChat(options: RealtimeChatOptions): UseRealtimeChatReturn {
    const {
        topicType,
        identifier,
        debug = false,
        onNewMessage,
        onMessageUpdate,
        onMessageDelete,
        onConnectionChange,
    } = options;

    // State
    const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
    const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
    const [error, setError] = useState<string | null>(null);

    // Refs
    const channelRef = useRef<RealtimeChannel | null>(null);
    const mountedRef = useRef(true);

    // Build topic name based on type
    const topic = topicType === 'phone'
        ? `room:whatsapp:${identifier}`
        : `room:user:${identifier}`;

    // Debug logger
    const log = useCallback((message: string, data?: unknown) => {
        if (debug) {
            console.log(`[RealtimeChat] ${message}`, data ?? '');
        }
    }, [debug]);

    // ========================================
    // FETCH INITIAL MESSAGES
    // ========================================
    const refreshMessages = useCallback(async () => {
        try {
            log('Fetching messages...');

            let query = supabase
                .from('whatsapp_messages')
                .select('*')
                .order('created_at', { ascending: true });

            // Filter by topic type
            if (topicType === 'phone') {
                query = query.eq('phone_number', identifier);
            } else {
                query = query.eq('user_id', identifier);
            }

            const { data, error: fetchError } = await query;

            if (fetchError) {
                throw fetchError;
            }

            if (mountedRef.current) {
                setMessages(data || []);
                log('Messages loaded', { count: data?.length });
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch messages';
            log('Fetch error', errorMessage);
            if (mountedRef.current) {
                setError(errorMessage);
            }
        }
    }, [topicType, identifier, log]);

    // ========================================
    // SEND MESSAGE
    // ========================================
    const sendMessage = useCallback(async (content: string, mediaUrl?: string): Promise<boolean> => {
        try {
            log('Sending message...', { content: content.substring(0, 50) });

            const newMessage: Partial<WhatsAppMessage> = {
                phone_number: topicType === 'phone' ? identifier : undefined,
                user_id: topicType === 'user' ? identifier : undefined,
                message_type: 'outgoing',
                content,
                media_url: mediaUrl,
                status: 'pending',
            };

            const { data, error: insertError } = await supabase
                .from('whatsapp_messages')
                .insert(newMessage)
                .select()
                .single();

            if (insertError) {
                throw insertError;
            }

            log('Message sent successfully', { id: data?.id });
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
            log('Send error', errorMessage);
            setError(errorMessage);
            return false;
        }
    }, [topicType, identifier, log]);

    // ========================================
    // UPDATE CONNECTION STATUS
    // ========================================
    const updateStatus = useCallback((newStatus: typeof status) => {
        if (mountedRef.current) {
            setStatus(newStatus);
            onConnectionChange?.(newStatus);
        }
    }, [onConnectionChange]);

    // ========================================
    // SUBSCRIBE TO REALTIME CHANNEL
    // ========================================
    const subscribe = useCallback(() => {
        log('Subscribing to channel', { topic });
        updateStatus('connecting');
        setError(null);

        // Clean up existing channel
        if (channelRef.current) {
            supabase.removeChannel(channelRef.current);
        }

        // Create new channel with private config
        const channel = supabase.channel(topic, {
            config: {
                private: true, // Requires RLS policies
            },
        });

        // Listen for broadcast events (from trigger function)
        channel
            .on('broadcast', { event: 'INSERT' }, (payload) => {
                log('Broadcast INSERT received', payload);
                const newMessage = payload.payload as WhatsAppMessage;

                if (mountedRef.current) {
                    setMessages(prev => {
                        // Avoid duplicates
                        if (prev.some(m => m.id === newMessage.id)) {
                            return prev;
                        }
                        return [...prev, newMessage];
                    });
                    onNewMessage?.(newMessage);
                }
            })
            .on('broadcast', { event: 'UPDATE' }, (payload) => {
                log('Broadcast UPDATE received', payload);
                const updatedMessage = payload.payload as WhatsAppMessage;

                if (mountedRef.current) {
                    setMessages(prev =>
                        prev.map(m => m.id === updatedMessage.id ? updatedMessage : m)
                    );
                    onMessageUpdate?.(updatedMessage);
                }
            })
            .on('broadcast', { event: 'DELETE' }, (payload) => {
                log('Broadcast DELETE received', payload);
                const deletedId = (payload.payload as { id: string }).id;

                if (mountedRef.current) {
                    setMessages(prev => prev.filter(m => m.id !== deletedId));
                    onMessageDelete?.(deletedId);
                }
            })
            .subscribe((status) => {
                log('Subscription status', status);

                if (status === 'SUBSCRIBED') {
                    updateStatus('connected');
                } else if (status === 'CHANNEL_ERROR') {
                    updateStatus('error');
                    setError('Channel subscription failed');
                } else if (status === 'TIMED_OUT') {
                    updateStatus('error');
                    setError('Connection timed out');
                } else if (status === 'CLOSED') {
                    updateStatus('disconnected');
                }
            });

        channelRef.current = channel;
    }, [topic, log, updateStatus, onNewMessage, onMessageUpdate, onMessageDelete]);

    // ========================================
    // DISCONNECT
    // ========================================
    const disconnect = useCallback(() => {
        log('Disconnecting...');
        if (channelRef.current) {
            supabase.removeChannel(channelRef.current);
            channelRef.current = null;
        }
        updateStatus('disconnected');
    }, [log, updateStatus]);

    // ========================================
    // RECONNECT
    // ========================================
    const reconnect = useCallback(() => {
        log('Reconnecting...');
        disconnect();
        subscribe();
        refreshMessages();
    }, [log, disconnect, subscribe, refreshMessages]);

    // ========================================
    // LIFECYCLE
    // ========================================
    useEffect(() => {
        mountedRef.current = true;

        // Initial fetch and subscribe
        refreshMessages();
        subscribe();

        // Cleanup on unmount
        return () => {
            mountedRef.current = false;
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
            }
        };
    }, [identifier, topicType]); // Re-subscribe when identifier changes

    return {
        messages,
        status,
        error,
        sendMessage,
        refreshMessages,
        disconnect,
        reconnect,
    };
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Simple hook for just receiving notifications (read-only)
 */
export function useRealtimeNotifications(userId: string) {
    const [notifications, setNotifications] = useState<unknown[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const topic = `room:user:${userId}:notifications`;

        const channel = supabase
            .channel(topic, { config: { private: true } })
            .on('broadcast', { event: 'INSERT' }, (payload) => {
                setNotifications(prev => [payload.payload, ...prev]);
                setUnreadCount(prev => prev + 1);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    const markAllRead = useCallback(() => {
        setUnreadCount(0);
    }, []);

    return { notifications, unreadCount, markAllRead };
}

export default useRealtimeChat;
