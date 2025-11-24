
import { Product, Announcement, Order, SystemLog, CartItem, UserProfile, AppConfigItem } from '../types';

const GOOGLE_SCRIPT_TEMPLATE = `(See GOOGLE_SHEET_SETUP.md for the full code)`;
const DEFAULT_API_KEY = "master-key";

export const GoogleSheetService = {
  
  getScriptTemplate() { return GOOGLE_SCRIPT_TEMPLATE; },

  async diagnoseConnection(url: string): Promise<{ success: boolean; message: string; details?: string }> {
      try {
          const res = await fetch(`${url}?action=ping&apiKey=${DEFAULT_API_KEY}`);
          if (!res.ok) return { success: false, message: `HTTP Error: ${res.status}` };
          const json = await res.json();
          return json.success ? { success: true, message: "Connected!" } : { success: false, message: "Script Error", details: json.error };
      } catch (e: any) { return { success: false, message: "Network Error", details: e.message }; }
  },

  async fetchData(url: string, action: string): Promise<any[] | null> {
      try {
          const res = await fetch(`${url}?action=${action}&apiKey=${DEFAULT_API_KEY}`);
          if (!res.ok) return null;
          const json = await res.json();
          return json.success && json.data ? json.data : [];
      } catch(e) { return null; }
  },

  async postData(url: string, action: string, data: any): Promise<boolean> {
      try {
          await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain' },
              body: JSON.stringify({ action, data, apiKey: DEFAULT_API_KEY })
          });
          return true;
      } catch(e) { return false; }
  },

  // --- ENTITY METHODS ---

  async getAppConfig(scriptUrl: string): Promise<AppConfigItem[]> {
      const data = await this.fetchData(scriptUrl, 'getAppConfig');
      return data || [];
  },

  async updateAppConfig(scriptUrl: string, key: string, value: string): Promise<boolean> {
      return this.postData(scriptUrl, 'updateAppConfig', { key, value });
  },

  async getProducts(scriptUrl: string): Promise<Product[] | null> { return this.fetchData(scriptUrl, 'getProducts'); },
  async getOrders(scriptUrl: string): Promise<Order[] | null> { return this.fetchData(scriptUrl, 'getOrders'); },
  async getUsers(scriptUrl: string): Promise<UserProfile[] | null> { return this.fetchData(scriptUrl, 'getUsers'); },
  
  // NOTE: Logs schema might differ slightly in V6.0 Enterprise
  async getLogs(scriptUrl: string): Promise<SystemLog[] | null> { return this.fetchData(scriptUrl, 'getLogs'); },

  async addProduct(scriptUrl: string, product: Product): Promise<boolean> { return this.postData(scriptUrl, 'addProduct', product); },
  async deleteProduct(scriptUrl: string, id: string): Promise<boolean> { return this.postData(scriptUrl, 'deleteProduct', { id }); },
  
  async placeOrder(scriptUrl: string, cart: CartItem[], customerName: string): Promise<boolean> {
      return this.postData(scriptUrl, 'placeOrder', { cart, customerName });
  },

  async syncUser(scriptUrl: string, user: UserProfile): Promise<boolean> {
      return this.postData(scriptUrl, 'syncUser', user);
  }
};
