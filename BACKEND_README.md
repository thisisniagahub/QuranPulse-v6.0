# Quran Pulse v6.0 - Backend Server Implementation

This folder contains the logic for the "Real" backend required to run WhatsApp Web Automation and a persistent MongoDB database.

## 1. Setup

Create a new folder outside of your frontend project (e.g., `quran-pulse-server`) and run:

```bash
npm init -y
npm install express mongoose socket.io whatsapp-web.js qrcode cors dotenv
npm install -g nodemon
```

## 2. server.js (Create this file)

```javascript
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

// --- CONFIG ---
const app = express();
const server = http.createServer(app);
// Allow connection from your Frontend URL
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());

// --- MONGODB CONNECTION ---
// Replace with your connection string from MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/quranpulse";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// --- SCHEMAS ---
const ProductSchema = new mongoose.Schema({
  id: String,
  title: String,
  price: Number,
  category: String,
  image: String,
  stock: Number
});
const Product = mongoose.model('Product', ProductSchema);

const AnnouncementSchema = new mongoose.Schema({
  id: String,
  title: String,
  message: String,
  type: String,
  active: Boolean,
  date: String
});
const Announcement = mongoose.model('Announcement', AnnouncementSchema);

// --- REST API ENDPOINTS ---

// GET Products
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ADD Product
app.post('/api/products', async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  io.emit('cms_update', { type: 'PRODUCT_UPDATE', data: newProduct });
  res.json(newProduct);
});

// DELETE Product
app.delete('/api/products/:id', async (req, res) => {
  await Product.findOneAndDelete({ id: req.params.id });
  io.emit('cms_update', { type: 'PRODUCT_UPDATE' });
  res.json({ success: true });
});

// GET Announcements
app.get('/api/announcements', async (req, res) => {
  const announcements = await Announcement.find();
  res.json(announcements);
});

// ADD Announcement
app.post('/api/announcements', async (req, res) => {
  const newAnn = new Announcement(req.body);
  await newAnn.save();
  io.emit('cms_update', { type: 'ANNOUNCEMENT_UPDATE' });
  res.json(newAnn);
});

// --- WHATSAPP BOT LOGIC ---
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  }
});

client.on('qr', (qr) => {
  qrcode.toDataURL(qr, (err, url) => {
    io.emit('wa_qr', url);
    console.log('QR Generated');
  });
});

client.on('ready', () => {
  io.emit('wa_status', 'CONNECTED');
  console.log('WhatsApp Ready');
});

client.on('message', async (msg) => {
  // Simple Auto-Reply Logic
  if (msg.body.toLowerCase().includes('waktu solat')) {
     msg.reply('Sila buka app Quran Pulse untuk waktu solat terkini.');
  }
  
  // Forward log to Frontend Admin
  io.emit('wa_log', {
      id: Date.now().toString(),
      type: 'MSG_IN',
      message: `${msg.from}: ${msg.body}`,
      timestamp: new Date().toLocaleTimeString()
  });
});

client.initialize();

// --- START SERVER ---
server.listen(3001, () => {
  console.log('🚀 Server running on http://localhost:3001');
});
```

## 3. Running

Run `node server.js` or `nodemon server.js`.
The Frontend `apiClient.ts` is already configured to look for `http://localhost:3001`. If it finds it, it will switch to "Live Mode".