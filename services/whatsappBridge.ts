
import { SystemLog } from '../types';

// Types for WhatsApp Status
export type WAStatus = 'OFFLINE' | 'STARTING' | 'QR_READY' | 'AUTHENTICATING' | 'READY';

interface WAEventCallbacks {
  onStatusChange: (status: WAStatus) => void;
  onQR: (qrUrl: string) => void;
  onLog: (log: string) => void;
}

// Simulated Bridge for whatsapp-web.js
// In a real production, this would use socket.io-client to talk to the Node.js server
export const WhatsAppBridge = {
  status: 'OFFLINE' as WAStatus,
  callbacks: null as WAEventCallbacks | null,
  timers: [] as any[],

  init(callbacks: WAEventCallbacks) {
    this.callbacks = callbacks;
  },

  startServer() {
    this.clearTimers();
    this.updateStatus('STARTING');
    this.log('>> Initializing whatsapp-web.js Client...');
    this.log('>> Browser: Chrome/Puppeteer (Headless)');

    // Simulate Boot Sequence
    this.addTimer(() => {
        this.log('>> Loading Module: LocalAuth strategy...');
    }, 800);

    this.addTimer(() => {
        this.log('>> Puppeteer started. Navigating to web.whatsapp.com...');
    }, 1500);

    this.addTimer(() => {
        this.updateStatus('QR_READY');
        // Generate a real dummy QR for visual effect (Points to a demo text)
        const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=QuranPulse-WhatsApp-Auth-Session-V6";
        if (this.callbacks) this.callbacks.onQR(qrUrl);
        this.log('>> QR Code received. Waiting for scan...');
    }, 3000);
  },

  simulateScan() {
    if (this.status !== 'QR_READY') return;
    
    this.updateStatus('AUTHENTICATING');
    this.log('>> QR Scanned! Authenticating session...');
    if (this.callbacks) this.callbacks.onQR(''); // Clear QR

    this.addTimer(() => {
        this.log('>> Decrypting session tokens...');
    }, 1000);

    this.addTimer(() => {
        this.log('>> Syncing contacts (142 found)...');
    }, 2000);

    this.addTimer(() => {
        this.updateStatus('READY');
        this.log('>> CLIENT READY!');
        this.log('>> Listening for incoming messages...');
    }, 3500);
  },

  stopServer() {
    this.clearTimers();
    this.log('>> Stopping Puppeteer instance...');
    this.updateStatus('OFFLINE');
    if (this.callbacks) this.callbacks.onQR('');
    this.log('>> Server stopped.');
  },

  sendMessage(phone: string, message: string) {
      if (this.status !== 'READY') return;
      this.log(`>> OUTGOING [${phone}]: ${message}`);
  },

  // Helpers
  updateStatus(s: WAStatus) {
      this.status = s;
      if (this.callbacks) this.callbacks.onStatusChange(s);
  },

  log(msg: string) {
      if (this.callbacks) this.callbacks.onLog(`[${new Date().toLocaleTimeString()}] ${msg}`);
  },

  addTimer(fn: Function, ms: number) {
      this.timers.push(setTimeout(fn, ms));
  },

  clearTimers() {
      this.timers.forEach(t => clearTimeout(t));
      this.timers = [];
  }
};
