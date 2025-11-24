
# Google Apps Script Code (V6.7 - Audit Logging Finalized)

**Instructions:**
1. Open your Google Sheet.
2. Go to **Extensions** > **Apps Script**.
3. **Delete everything** in `Code.gs`.
4. **Paste** the code below.
5. **Deploy** > **New Deployment** > **Web App** > **Anyone**.

```javascript
// ============================================================================
// QURAN PULSE V6.7 - AUDIT LOGGING SYSTEM
// ============================================================================

const CONFIG = {
  SHEET_PRODUCTS: "Products",
  SHEET_ANNOUNCEMENTS: "Announcements",
  SHEET_AUDIT_LOG: "AuditLog",
  SHEET_USERS: "Users",
  SHEET_ORDERS: "Orders",
  SHEET_CONFIG: "AppConfig",
  LOCK_TIMEOUT: 30000
};

// --- MAIN HANDLERS ---

function doGet(e) { 
  return handleRequest(e, "GET"); 
}

function doPost(e) { 
  return handleRequest(e, "POST"); 
}

function handleRequest(e, method) {
  const startTime = Date.now();
  let lock = null;
  let db = null;
  let result = null;
  // Default request object to prevent logging errors if parsing fails
  let request = { action: "unknown", data: {}, apiKey: "unknown" };
  
  try {
    // 0. CRASH PREVENTION FOR MANUAL RUNS
    if (!e) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "NO EVENT DATA. Please do not run manually. Use the Web App URL." 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 1. Initialize Database
    db = new DatabaseManager();
    db.initialize();

    // 2. Parse Request
    request = parseRequest(e, method);
    
    // 3. Write Lock (Only for non-read operations to prevent race conditions)
    if (method !== "GET" && request.action !== "ping" && request.action !== "getLogs") {
        lock = LockService.getScriptLock();
        const success = lock.tryLock(CONFIG.LOCK_TIMEOUT);
        if (!success) {
           result = { success: false, error: "Server busy. Try again." };
           return createResponse(result);
        }
    }

    // 4. Route & Execute Action
    result = routeAction(request, db);
    return createResponse(result);

  } catch (error) {
    result = { success: false, error: error.toString() };
    return createResponse(result);
  } finally {
    if (lock) lock.releaseLock();

    // 5. AUDIT LOGGING IMPLEMENTATION
    if (db) {
        try {
            const duration = Date.now() - startTime;
            const logEntry = {
                timestamp: new Date().toISOString(),
                apiKey: request.apiKey || "unknown",
                action: request.action || "unknown",
                method: method,
                status: (result && result.success) ? "SUCCESS" : "ERROR",
                duration: duration
            };
            db.addAuditLog(logEntry);
        } catch (logErr) {
            // Log failed silently to avoid crashing the response, 
            // but print to Stackdriver logging for debugging
            Logger.log("Audit Log Failed: " + logErr);
        }
    }
  }
}

// --- ROUTER ---

function routeAction(req, db) {
  // SAFETY CHECK: Prevent crash if req is undefined (manual run)
  if (!req || !db) {
      return { success: false, error: "Internal Error: Request or DB missing" };
  }

  const action = req.action;
  const data = req.data;

  // --- SYSTEM ---
  if (action === "ping") return { success: true, message: "Pong", version: "6.7" };
  
  // --- APP CONFIG (GOD MODE) ---
  if (action === "getAppConfig") return { success: true, data: db.getData(CONFIG.SHEET_CONFIG) };
  if (action === "updateAppConfig") {
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

  // --- PRODUCTS