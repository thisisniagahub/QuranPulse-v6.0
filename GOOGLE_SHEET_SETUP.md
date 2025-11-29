# Google Apps Script Code (V6.2 Enterprise - GOD MODE ULTIMATE)

**Instructions:**
1. Open your Google Sheet.
2. Go to **Extensions** > **Apps Script**.
3. **Delete everything** in `Code.gs` and **Paste** the code below completely.
4. Click **Deploy** > **New Deployment**.
   - Select type: **Web app**.
   - Description: `V6.2 God Mode Ultimate`.
   - Execute as: **Me**.
   - Who has access: **Anyone** (Must be 'Anyone' for the app to work).
5. Click **Deploy**.
6. **IMPORTANT:** Copy the **Web App URL** and paste it into `services/apiClient.ts`.

```javascript
// ============================================================================
// QURAN PULSE V6.2 - GOD MODE ULTIMATE BACKEND (FIXED & FULL)
// ============================================================================

const CONFIG = {
  SHEET_PRODUCTS: "Products",
  SHEET_ANNOUNCEMENTS: "Announcements",
  SHEET_AUDIT_LOG: "AuditLog",
  SHEET_USERS: "Users",
  SHEET_ORDERS: "Orders",
  SHEET_CONFIG: "AppConfig",
  LOCK_TIMEOUT: 30000,
  CACHE_DURATION: 300
};

// --- MAIN HANDLERS ---

function doGet(e) { 
  return handleRequest(e, "GET"); 
}

function doPost(e) { 
  return handleRequest(e, "POST"); 
}

function handleRequest(e, method) {
  let lock = null;
  
  try {
    // 0. Safety Check for Manual Run in Editor
    if (!e || typeof e === 'undefined') {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "DO NOT RUN IN EDITOR. Please deploy as Web App and access via URL." 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 1. Initialize Database
    const db = new DatabaseManager();
    db.initialize();

    // 2. Parse Request Data
    const request = parseRequest(e, method);
    
    // 3. Write Lock (Prevent race conditions on POST/PUT/DELETE)
    if (method !== "GET") {
        lock = LockService.getScriptLock();
        const success = lock.tryLock(CONFIG.LOCK_TIMEOUT);
        if (!success) {
           return createResponse({ success: false, error: "Server busy. Try again." });
        }
    }

    // 4. Route & Execute Action
    const result = routeAction(request, db);
    
    // 5. Audit Log (Only for non-GET to save space)
    if (method !== "GET") {
        db.log(request.action, JSON.stringify(request.data || {}).substring(0, 200));
    }

    return createResponse(result);

  } catch (error) {
    return createResponse({ success: false, error: error.toString() });
  } finally {
    if (lock) lock.releaseLock();
  }
}

// --- ROUTER (The Brain) ---

function routeAction(req, db) {
  const action = req.action;
  const data = req.data;

  // --- SYSTEM ---
  if (action === "ping") return { success: true, message: "Pong", version: "6.2" };
  
  // --- APP CONFIG (GOD MODE) ---
  if (action === "getAppConfig") return { success: true, data: db.getData(CONFIG.SHEET_CONFIG) };
  if (action === "updateAppConfig") {
      // Upsert logic for config
      const exists = db.updateRow(CONFIG.SHEET_CONFIG, 'key', data.key, { value: data.value });
      if (!exists) {
          db.append(CONFIG.SHEET_CONFIG, { 
            key: data.key, 
            value: data.value, 
            group: data.group || 'GENERAL', 
            description: data.description || 'Auto-added' 
          });
      }
      return { success: true };
  }

  // --- PRODUCTS (SOUQ) ---
  if (action === "getProducts") return { success: true, data: db.getData(CONFIG.SHEET_PRODUCTS) };
  
  if (action === "addProduct") { 
      db.append(CONFIG.SHEET_PRODUCTS, data); 
      return { success: true }; 
  }
  
  if (action === "updateProduct") { 
      db.updateRow(CONFIG.SHEET_PRODUCTS, 'id', data.id, data); 
      return { success: true }; 
  }
  
  if (action === "deleteProduct") { 
      db.deleteRow(CONFIG.SHEET_PRODUCTS, 'id', data.id); 
      return { success: true }; 
  }

  // --- ANNOUNCEMENTS ---
  if (action === "getAnnouncements") return { success: true, data: db.getData(CONFIG.SHEET_ANNOUNCEMENTS) };
  
  if (action === "addAnnouncement") { 
      db.append(CONFIG.SHEET_ANNOUNCEMENTS, data); 
      return { success: true }; 
  }
  
  if (action === "deleteAnnouncement") { 
      db.deleteRow(CONFIG.SHEET_ANNOUNCEMENTS, 'id', data.id); 
      return { success: true }; 
  }

  // --- USERS (GOD MODE) ---
  if (action === "getUsers") return { success: true, data: db.getData(CONFIG.SHEET_USERS) };
  
  if (action === "syncUser") { 
      // User login sync
      db.upsertUser(data); 
      return { success: true }; 
  }
  
  if (action === "adminUpdateUser") { 
      // Full user edit by Admin
      const success = db.updateRow(CONFIG.SHEET_USERS, 'email', data.email, data);
      if (!success) return { success: false, error: "User not found" };
      return { success: true }; 
  }

  // --- ORDERS ---
  if (action === "getOrders") return { success: true, data: db.getData(CONFIG.SHEET_ORDERS) };
  
  if (action === "placeOrder") {
      const cart = data.cart;
      if (!cart || cart.length === 0) return { success: false, error: "Empty Cart" };

      // Deduct Stock
      db.deductStock(cart);
      
      // Save Order
      db.append(CONFIG.SHEET_ORDERS, {
        id: "ORD-" + Date.now(),
        customerName: data.customerName,
        totalAmount: cart.reduce((s, i) => s + (Number(i.price) * Number(i.quantity)), 0),
        items: cart.map(i => i.title + " (x" + i.quantity + ")").join(", "),
        status: "PAID",
        date: new Date().toISOString()
      });
      return { success: true };
  }

  // --- LOGS ---
  if (action === "getLogs") {
     const allLogs = db.getData(CONFIG.SHEET_AUDIT_LOG);
     // Return last 50 logs only to prevent payload bloat
     return { success: true, data: allLogs.slice(-50).reverse() };
  }

  return { success: false, error: "Unknown Action: " + action };
}

// --- DATABASE MANAGER CLASS (Google Sheet Wrapper) ---

class DatabaseManager {
  constructor() { 
    try {
        this.ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch(e) {
        throw new Error("Could not access Active Spreadsheet. Make sure script is bound to a Sheet.");
    }
  }

  initialize() {
    this.ensureSheet(CONFIG.SHEET_PRODUCTS, ["id", "title", "price", "category", "image", "stock"]);
    this.ensureSheet(CONFIG.SHEET_ANNOUNCEMENTS, ["id", "title", "message", "type", "active", "date"]);
    this.ensureSheet(CONFIG.SHEET_USERS, ["email", "name", "role", "xp_total", "barakah_points", "status", "last_login"]);
    this.ensureSheet(CONFIG.SHEET_ORDERS, ["id", "customerName", "totalAmount", "items", "status", "date"]);
    this.ensureSheet(CONFIG.SHEET_CONFIG, ["key", "value", "group", "description"]);
    this.ensureSheet(CONFIG.SHEET_AUDIT_LOG, ["timestamp", "action", "details"]);
  }

  ensureSheet(name, headers) {
    if (!this.ss.getSheetByName(name)) {
      const s = this.ss.insertSheet(name);
      s.appendRow(headers);
    }
  }

  getData(name) {
    const s = this.ss.getSheetByName(name);
    if (!s) return [];
    const rows = s.getDataRange().getValues();
    if (rows.length < 2) return [];
    
    const headers = rows[0];
    return rows.slice(1).map(r => {
      let obj = {};
      headers.forEach((h, i) => obj[h] = r[i]);
      return obj;
    });
  }

  append(name, obj) {
    const s = this.ss.getSheetByName(name);
    if (!s) return;
    const headers = s.getRange(1, 1, 1, s.getLastColumn()).getValues()[0];
    const row = headers.map(h => {
        const val = obj[h];
        // Ensure objects are stringified for cells
        return (typeof val === 'object' && val !== null) ? JSON.stringify(val) : (val !== undefined ? val : "");
    });
    s.appendRow(row);
  }

  updateRow(name, keyField, keyValue, updateData) {
    const s = this.ss.getSheetByName(name);
    if (!s) return false;
    
    const data = s.getDataRange().getValues();
    const headers = data[0];
    const keyIdx = headers.indexOf(keyField);
    
    if (keyIdx === -1) return false;

    for (let i = 1; i < data.length; i++) {
      if (String(data[i][keyIdx]) === String(keyValue)) {
        Object.keys(updateData).forEach(k => {
          const colIdx = headers.indexOf(k);
          if (colIdx > -1) {
             s.getRange(i + 1, colIdx + 1).setValue(updateData[k]);
          }
        });
        return true;
      }
    }
    return false;
  }

  deleteRow(name, keyField, keyValue) {
    const s = this.ss.getSheetByName(name);
    if (!s) return;
    
    const data = s.getDataRange().getValues();
    const keyIdx = data[0].indexOf(keyField);
    
    if (keyIdx === -1) return;

    for (let i = data.length - 1; i >= 1; i--) {
      if (String(data[i][keyIdx]) === String(keyValue)) {
        s.deleteRow(i + 1);
        return;
      }
    }
  }

  upsertUser(u) {
    const s = this.ss.getSheetByName(CONFIG.SHEET_USERS);
    if (!s) return;
    const data = s.getDataRange().getValues();
    const emailIdx = data[0].indexOf('email');
    
    if (emailIdx === -1) return;

    // Check if user exists
    for(let i=1; i<data.length; i++) {
        if(String(data[i][emailIdx]) === String(u.email)) {
            // Found: Update Last Login
            const loginIdx = data[0].indexOf('last_login');
            if(loginIdx > -1) s.getRange(i+1, loginIdx+1).setValue(new Date().toISOString());
            
            // Only update XP/Points if specifically provided (prevent overwrite)
            if (u.xp_total !== undefined) {
                const xpIdx = data[0].indexOf('xp_total');
                if(xpIdx > -1) s.getRange(i+1, xpIdx+1).setValue(u.xp_total);
            }
            if (u.barakah_points !== undefined) {
                const bpIdx = data[0].indexOf('barakah_points');
                if(bpIdx > -1) s.getRange(i+1, bpIdx+1).setValue(u.barakah_points);
            }
            return;
        }
    }
    // New User: Append
    u.last_login = new Date().toISOString();
    u.role = u.role || 'USER';
    u.status = u.status || 'ACTIVE';
    this.append(CONFIG.SHEET_USERS, u);
  }

  deductStock(cart) {
      const s = this.ss.getSheetByName(CONFIG.SHEET_PRODUCTS);
      if (!s) return;
      const data = s.getDataRange().getValues();
      const idIdx = data[0].indexOf('id');
      const stockIdx = data[0].indexOf('stock');
      
      if (idIdx === -1 || stockIdx === -1) return;

      cart.forEach(item => {
          for(let i=1; i<data.length; i++) {
              if(String(data[i][idIdx]) === String(item.id)) {
                  const current = parseInt(data[i][stockIdx]) || 0;
                  const newStock = Math.max(0, current - item.quantity);
                  s.getRange(i+1, stockIdx+1).setValue(newStock);
                  break;
              }
          }
      });
  }

  log(action, details) {
      try {
          this.append(CONFIG.SHEET_AUDIT_LOG, {
              timestamp: new Date().toISOString(),
              action: action,
              details: details
          });
      } catch(e) {
          Logger.log("Audit Log Failed: " + e);
      }
  }
}

// --- UTILITY FUNCTIONS ---

function parseRequest(e, method) {
    let body = {};
    let params = e.parameter || {};
    
    // Parse JSON body if available
    if (e.postData && e.postData.contents) {
        try {
            body = JSON.parse(e.postData.contents);
        } catch(err) {
            body = {};
        }
    }
    
    // Merge Body and Params, Body takes precedence
    return {
        action: body.action || params.action || "",
        data: body.data || {}
    };
}

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
