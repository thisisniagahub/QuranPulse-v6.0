"use client";

import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Send, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

// Separate Port for Bot Server
const BOT_SERVER_URL = "http://localhost:3002";

export default function BotControlCenter() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [status, setStatus] = useState<'CONNECTING' | 'CONNECTED' | 'DISCONNECTED'>('CONNECTING');
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [whatsappReady, setWhatsappReady] = useState(false); // Restored
    const [telegramStatus, setTelegramStatus] = useState<{ ready: boolean; username?: string; error?: string }>({ ready: false });
    const [logs, setLogs] = useState<any[]>([]); // Restored

    useEffect(() => {
        const newSocket = io(BOT_SERVER_URL);

        newSocket.on('connect', () => {
            console.log("✅ Connected to Bot Server");
            setStatus('CONNECTED');
        });

        newSocket.on('disconnect', () => {
            setStatus('DISCONNECTED');
            setWhatsappReady(false);
            setTelegramStatus({ ready: false });
        });

        newSocket.on('whatsapp_qr', (qr: string) => {
            console.log("📸 Received QR Code");
            setQrCode(qr);
            setWhatsappReady(false);
        });

        newSocket.on('whatsapp_ready', () => {
            console.log("✅ WhatsApp Ready");
            setWhatsappReady(true);
            setQrCode(null);
        });

        newSocket.on('telegram_status', (status: any) => {
            console.log("Example Telegram Status:", status);
            setTelegramStatus(status);
        });

        newSocket.on('logs_history', (history: any[]) => {
            setLogs(history);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-7xl mx-auto">

            {/* 1. WHATSAPP BOT STATUS */}
            <Card className="border-emerald-500/20 bg-emerald-950/10 backdrop-blur">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <i className="fa-brands fa-whatsapp text-emerald-400 text-xl"></i>
                            </div>
                            <div>
                                <CardTitle className="text-emerald-500">Tok Imam AI (WhatsApp)</CardTitle>
                                <CardDescription>Automated Syariah Assistant</CardDescription>
                            </div>
                        </div>
                        <Badge variant={whatsappReady ? "default" : "destructive"} className={whatsappReady ? "bg-emerald-500" : ""}>
                            {whatsappReady ? "ONLINE" : "WAITING FOR SCAN"}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
                    <AnimatePresence mode="wait">
                        {whatsappReady ? (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center"
                            >
                                <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Bot Aktif Berkhidmat</h3>
                                <p className="text-slate-400 text-sm max-w-xs mx-auto">Tok Imam sedang menjawab soalan jemaah secara automatik.</p>
                            </motion.div>
                        ) : qrCode ? (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-center bg-white p-4 rounded-xl shadow-2xl"
                            >
                                <QRCodeSVG value={qrCode} size={200} level={"L"} includeMargin={true} />
                                <p className="text-black text-xs font-bold mt-2 uppercase tracking-widest animate-pulse">Scan Sekarang</p>
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center text-slate-500">
                                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                <p className="text-xs uppercase tracking-widest">Menunggu Server...</p>
                            </div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>

            {/* 2. TELEGRAM BOT STATUS */}
            <Card className="border-blue-500/20 bg-blue-950/10 backdrop-blur">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <i className="fa-brands fa-telegram text-blue-400 text-xl"></i>
                            </div>
                            <div>
                                <CardTitle className="text-blue-500">Ustazah AI (Telegram)</CardTitle>
                                <CardDescription>Visual & Learning Assistant</CardDescription>
                            </div>
                        </div>
                        <Badge variant="outline" className={`border-blue-500 ${telegramStatus.ready ? 'text-blue-400' : 'text-red-400 border-red-500'}`}>
                            {telegramStatus.ready ? 'ONLINE' : telegramStatus.error === 'MISSING_TOKEN' ? 'MISSING TOKEN' : 'OFFLINE'}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="h-[300px] flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
                            <p className="text-xs text-blue-300 font-mono mb-1">BOT USERNAME</p>
                            <p className="text-lg font-bold text-white">
                                {telegramStatus.ready ? `@${telegramStatus.username}` : telegramStatus.error === 'MISSING_TOKEN' ? 'TOKEN MISSING' : 'Connecting...'}
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-slate-900 border border-white/5">
                            <p className="text-xs text-slate-400 font-mono mb-1">FEATURES STATUS</p>
                            <ul className="space-y-2">
                                <li className={`flex items-center gap-2 text-sm ${telegramStatus.ready ? 'text-slate-300' : 'text-slate-600'}`}>
                                    <CheckCircle2 className={`w-4 h-4 ${telegramStatus.ready ? 'text-emerald-500' : 'text-slate-700'}`} /> Vision-X (Image Analysis)
                                </li>
                                <li className={`flex items-center gap-2 text-sm ${telegramStatus.ready ? 'text-slate-300' : 'text-slate-600'}`}>
                                    <CheckCircle2 className={`w-4 h-4 ${telegramStatus.ready ? 'text-emerald-500' : 'text-slate-700'}`} /> Voice Notes
                                </li>
                                <li className={`flex items-center gap-2 text-sm ${telegramStatus.ready ? 'text-slate-300' : 'text-slate-600'}`}>
                                    <CheckCircle2 className={`w-4 h-4 ${telegramStatus.ready ? 'text-emerald-500' : 'text-slate-700'}`} /> User Linking
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-500">
                        <Send className="w-4 h-4 mr-2" /> Test Broadcast
                    </Button>
                </CardContent>
            </Card>

        </div>
    );
}

// Ensure you install: npm install socket.io-client qrcode.react lucide-react
