import { Product, Announcement, Order, SystemLog, CartItem, UserProfile, AppConfigItem } from '../types';
import { GoogleSheetService } from './googleSheetService';

const LS_KEY_PRODUCTS = 'cms_products';
const LS_KEY_SHEET_URL = 'cms_google_sheet_url';
// UPDATED URL V6.7 (Audit Logging Enabled)
const DEFAULT_SHEET_URL = "https://script.google.com/macros/s/AKfycbyCOWrXE80H_M5LBPOgVEbIvbworx7JIA55wTgZQDFs0euWGtbLASiN5CC7_NRAqNHx/exec";

class ApiClient {
    private sheetUrl: string | null = null;
    private mode: 'MOCK' | 'CLOUD' = 'MOCK';

    constructor() {
        const savedUrl = localStorage.getItem(LS_KEY_SHEET_URL);
        this.sheetUrl = savedUrl || DEFAULT_SHEET_URL;
        // Auto-enable cloud if URL exists and looks valid
        if(savedUrl && savedUrl.includes('script.google.com')) {
            this.mode = 'CLOUD';
        } else {
            this.mode = 'MOCK';
        }
    }

    public setSheetUrl(url: string) {
        this.sheetUrl = url;
        this.mode = 'CLOUD';
        localStorage.setItem(LS_KEY_SHEET_URL, url);
        // Reload to force fresh state
        setTimeout(() => window.location.reload(), 500);
    }

    public getMode() { return this.mode; }
    public getSheetUrl() { return this.sheetUrl; }

    // --- CONFIG (GOD MODE) ---
    async getAppConfig(): Promise<AppConfigItem[]> {
        if (this.mode === 'CLOUD' && this.sheetUrl) {
            try {
                return await GoogleSheetService.fetchData(this.sheetUrl, 'getAppConfig') || [];
            } catch (e) {
                console.error("Failed to fetch config from cloud, falling back to mock.", e);
            }
        }
        // Mock Config
        return [
            { key: 'maintenance_mode', value: 'false', group: 'FEATURES', description: 'Enable maintenance screen' },
            { key: 'promo_banner', value: 'Welcome to Genesis Edition', group: 'CONTENT', description: 'Homepage banner text' }
        ];
    }

    async updateAppConfig(key: string, value: string): Promise<boolean> {
        if (this.mode === 'CLOUD' && this.sheetUrl) return await GoogleSheetService.postData(this.sheetUrl, 'updateAppConfig', { key, value });
        return true; // Mock success
    }

    // --- PRODUCTS ---
    async getProducts(): Promise<Product[]> {
        if (this.mode === 'CLOUD' && this.sheetUrl) {
            try {
                const res = await GoogleSheetService.getProducts(this.sheetUrl);
                if (res) return res;
            } catch (e) {
                console.error("Cloud fetch failed", e);
            }
        }
        const local = localStorage.getItem(LS_KEY_PRODUCTS);
        if (local) return JSON.parse(local);
        
        // Return Default Mock Data if empty
        const defaults: Product[] = [
             { id: 'P1', title: 'The Clear Quran', price: 50, category: 'BOOK', image: 'fa-book', stock: 10 },
             { id: 'P2', title: 'Premium Prayer Mat', price: 120, category: 'CLOTHING', image: 'fa-rug', stock: 5 },
             { id: 'P3', title: 'Sunnah Miswak', price: 10, category: 'BOOK', image: 'fa-tooth', stock: 50 },
             { id: 'P4', title: 'Hajj Consultation', price: 0, category: 'SERVICE', image: 'fa-kaaba', stock: 999 }
        ];
        localStorage.setItem(LS_KEY_PRODUCTS, JSON.stringify(defaults));
        return defaults;
    }

    async saveProduct(product: Product): Promise<boolean> {
        if (this.mode === 'CLOUD' && this.sheetUrl) return await GoogleSheetService.addProduct(this.sheetUrl, product);
        
        // MOCK
        const products = await this.getProducts();
        products.push(product);
        localStorage.setItem(LS_KEY_PRODUCTS, JSON.stringify(products));
        return true;
    }

    async updateProduct(product: Product): Promise<boolean> {
        if (this.mode === 'CLOUD' && this.sheetUrl) return await GoogleSheetService.postData(this.sheetUrl, 'updateProduct', product);
        
        // MOCK
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === product.id);
        if (index !== -1) {
            products[index] = product;
            localStorage.setItem(LS_KEY_PRODUCTS, JSON.stringify(products));
        }
        return true;
    }

    async deleteProduct(id: string): Promise<boolean> {
        if (this.mode === 'CLOUD' && this.sheetUrl) return await GoogleSheetService.deleteProduct(this.sheetUrl, id);
        
        // MOCK
        const products = await this.getProducts();
        const newProducts = products.filter(p => p.id !== id);
        localStorage.setItem(LS_KEY_PRODUCTS, JSON.stringify(newProducts));
        return true;
    }

    // --- ORDERS & USERS ---
    async getOrders(): Promise<Order[]> {
        if (this.mode === 'CLOUD' && this.sheetUrl) {
            const res = await GoogleSheetService.getOrders(this.sheetUrl);
            return res || [];
        }
        const local = localStorage.getItem('cms_orders');
        return local ? JSON.parse(local) : [];
    }

    async getUsers(): Promise<UserProfile[]> {
        if (this.mode === 'CLOUD' && this.sheetUrl) {
            const res = await GoogleSheetService.getUsers(this.sheetUrl);
            return res || [];
        }
        // Mock Users
        return [
            { id: 'u1', name: 'Ali', email: 'ali@example.com', role: 'ADMIN', status: 'ACTIVE', xp_total: 5000, barakah_points: 200, streak: 10, last_read_ayah: 1, last_read_surah: 1 },
            { id: 'u2', name: 'Siti', email: 'siti@example.com', role: 'USER', status: 'ACTIVE', xp_total: 1200, barakah_points: 50, streak: 3, last_read_ayah: 1, last_read_surah: 1 }
        ];
    }

    async adminUpdateUser(user: Partial<UserProfile>): Promise<boolean> {
        if (this.mode === 'CLOUD' && this.sheetUrl) return await GoogleSheetService.postData(this.sheetUrl, 'adminUpdateUser', user);
        return true;
    }

    async syncUser(user: UserProfile): Promise<boolean> {
        if (this.mode === 'CLOUD' && this.sheetUrl) return await GoogleSheetService.syncUser(this.sheetUrl, user);
        return true;
    }

    async placeOrder(cart: CartItem[], customerName: string): Promise<boolean> {
        if (this.mode === 'CLOUD' && this.sheetUrl) return await GoogleSheetService.placeOrder(this.sheetUrl, cart, customerName);
        
        // Mock Order Placement
        const newOrder: Order = {
            id: 'ORD-' + Date.now(),
            customerName,
            totalAmount: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0),
            items: JSON.stringify(cart),
            status: 'PAID',
            date: new Date().toISOString()
        };
        const orders = await this.getOrders();
        orders.push(newOrder);
        localStorage.setItem('cms_orders', JSON.stringify(orders));
        return true;
    }

    // --- ANNOUNCEMENTS & LOGS ---
    async getAnnouncements(): Promise<Announcement[]> {
        if (this.mode === 'CLOUD' && this.sheetUrl) {
            try {
                return await GoogleSheetService.fetchData(this.sheetUrl, 'getAnnouncements') || [];
            } catch (e) { console.error(e); }
        }
        
        const local = localStorage.getItem('cms_announcements');
        return local ? JSON.parse(local) : [
            { id: 'a1', title: 'System Update', message: 'Quran Pulse v6.0 is live!', type: 'SUCCESS', active: true, date: new Date().toISOString() }
        ];
    }

    async addAnnouncement(ann: Announcement): Promise<boolean> {
        if (this.mode === 'CLOUD' && this.sheetUrl) return await GoogleSheetService.postData(this.sheetUrl, 'addAnnouncement', ann);
        
        const anns = await this.getAnnouncements();
        anns.push(ann);
        localStorage.setItem('cms_announcements', JSON.stringify(anns));
        return true;
    }

    async deleteAnnouncement(id: string): Promise<boolean> {
        if (this.mode === 'CLOUD' && this.sheetUrl) return await GoogleSheetService.postData(this.sheetUrl, 'deleteAnnouncement', { id });
        
        const anns = await this.getAnnouncements();
        const newAnns = anns.filter(a => a.id !== id);
        localStorage.setItem('cms_announcements', JSON.stringify(newAnns));
        return true;
    }

    async getLogs(): Promise<SystemLog[]> {
        if (this.mode === 'CLOUD' && this.sheetUrl) {
            try {
                const res = await GoogleSheetService.getLogs(this.sheetUrl);
                return res || [];
            } catch (e) { console.error(e); }
        }
        return [
            { timestamp: new Date().toISOString(), action: 'SYSTEM_BOOT', status: 'SUCCESS', apiKey: 'local' }
        ];
    }
}

export const api = new ApiClient();
