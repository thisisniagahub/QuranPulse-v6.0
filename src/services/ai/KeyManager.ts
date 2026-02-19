export class KeyUsageTracker {
  private usage: Record<string, number[]> = {};
  private readonly RPM_LIMIT = 15;
  private readonly SAFE_BUFFER = 3; // Stop using key when it hits 12 RPM

  constructor() {
    // Load from localStorage if needed, but in-memory is usually enough for RPM
    // We strictly track RPM here. Daily limit is harder to track client-side reliably without auth.
  }

  recordUsage(key: string) {
    const now = Date.now();
    if (!this.usage[key]) this.usage[key] = [];
    this.usage[key].push(now);
    
    // Cleanup old logs (> 1 minute ago)
    this.usage[key] = this.usage[key].filter(timestamp => now - timestamp < 60000);
  }

  isKeyHealthy(key: string): boolean {
    const now = Date.now();
    if (!this.usage[key]) return true;
    
    // Filter strictly for last 60s check
    const recentRequests = this.usage[key].filter(timestamp => now - timestamp < 60000).length;
    
    // If usage > 12, consider it "Unhealthy" / "Hot"
    return recentRequests < (this.RPM_LIMIT - this.SAFE_BUFFER);
  }

  getUsageStats(key: string) {
    const now = Date.now();
    const count = this.usage[key]?.filter(t => now - t < 60000).length || 0;
    return { count, healthy: count < (this.RPM_LIMIT - this.SAFE_BUFFER) };
  }
}

export const usageTracker = new KeyUsageTracker();
