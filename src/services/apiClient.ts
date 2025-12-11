
import { Product, Announcement, Order, SystemLog, CartItem, UserProfile, AppConfigItem } from '../types';
import { GoogleSheetService } from './googleSheetService';
import { retryWithBackoff } from '../utils/retry';
import { validateUrl, sanitizeString } from '../utils/validation';

const LS_KEY_PRODUCTS = 'cms_products';
const LS_KEY_SHEET_URL = 'cms_google_sheet_url';
// UPDATED URL V6.1
const DEFAULT_SHEET_URL = "https://script.google.com/macros/s/AKfycbwOs4n3G0m5QSqBX-BdAs1r-e8QL3h07xvgGPVE6rqgrNzkmwtpUwbQRvPBua0OknH5/exec";

class ApiClient {
    private sheetUrl: string | null = null;
    private mode: 'MOCK' | 'CLOUD' = 'MOCK';

    constructor() {
        const savedUrl = localStorage.getItem(LS_KEY_SHEET_URL);
        this.sheetUrl = savedUrl || DEFAULT_SHEET_URL;
        // Auto-enable cloud if URL exists
        if(savedUrl) this.mode = 'CLOUD';
    }

    public setSheetUrl(url: string) {
        const urlValidation = validateUrl(url);
        if (!urlValidation.isValid) {
            throw new Error(urlValidation.error || 'Invalid URL provided');
        }
        this.sheetUrl = sanitizeString(url);
        if (!this.sheetUrl) {
            throw new Error('URL sanitization failed');
        }
        this.mode = 'CLOUD';
        localStorage.setItem(LS_KEY_SHEET_URL, this.sheetUrl);
        setTimeout(() => window.location.reload(), 500);
    }

    public getMode() { return this.mode; }
    public getSheetUrl() { return this.sheetUrl; }

    // --- CONFIG (GOD MODE) ---
    async getAppConfig(): Promise<AppConfigItem[]> {
        if (this.mode === 'CLOUD' && this.sheetUrl) return await GoogleSheetService.fetchData(this.sheetUrl, 'getAppConfig') || [];
        return [];
    }

    async updateAppConfig(key: string, value: string): Promise<boolean> {
        if (this.mode === 'CLOUD' && this.sheetUrl) return await GoogleSheetService.postData(this.sheetUrl, 'updateAppConfig', { key, value });
        return false;
    }

    // --- PRODUCTS ---
    async getProducts(): Promise<Product[]> {
        if (this.mode === 'CLOUD' && this.sheetUrl) {
            const res = await retryWithBackoff(() => GoogleSheetService.fetchData(this.sheetUrl!, 'getProducts'));
            if (res) return res;
        }
        const saved = localStorage.getItem(LS_KEY_PRODUCTS);
        return saved ? JSON.parse(saved) : [];
    }

    async saveProduct(product: Product): Promise<Product> {
        if (this.mode === 'CLOUD' && this.sheetUrl) {
            await retryWithBackoff(() => GoogleSheetService.postData(this.sheetUrl!, 'addProduct', product));
        }
        return product;
    }

    async updateProduct(product: Product): Promise<void> {
        if (this.mode === 'CLOUD' && this.sheetUrl) {
            await retryWithBackoff(() => GoogleSheetService.postData(this.sheetUrl!, 'updateProduct', product));
        }
    }
    
    async deleteProduct(id: string): Promise<void> {
        if (this.mode === 'CLOUD' && this.sheetUrl) {
            await retryWithBackoff(() => GoogleSheetService.postData(this.sheetUrl!, 'deleteProduct', { id }));
        }
    }

    // --- ANNOUNCEMENTS ---
    async getAnnouncements(): Promise<Announcement[]> {
        if (this.mode === 'CLOUD' && this.sheetUrl) {
            return await retryWithBackoff(() => GoogleSheetService.fetchData(this.sheetUrl!, 'getAnnouncements')) || [];
        }
        return [];
    }
    
    async addAnnouncement(ann: Announcement): Promise<void> {
        if (this.mode === 'CLOUD' && this.sheetUrl) {
            await retryWithBackoff(() => GoogleSheetService.postData(this.sheetUrl!, 'addAnnouncement', ann));
        }
    }

    async deleteAnnouncement(id: string): Promise<void> {
        if (this.mode === 'CLOUD' && this.sheetUrl) {
            await retryWithBackoff(() => GoogleSheetService.postData(this.sheetUrl!, 'deleteAnnouncement', { id }));
        }
    }

    // --- USERS & ORDERS ---
    async getUsers(): Promise<UserProfile[]> {
        if (this.mode === 'CLOUD' && this.sheetUrl) return await GoogleSheetService.fetchData(this.sheetUrl, 'getUsers') || [];
        return [];
    }

    async adminUpdateUser(user: Partial<UserProfile>): Promise<void> {
         if (this.mode === 'CLOUD' && this.sheetUrl) await GoogleSheetService.postData(this.sheetUrl, 'adminUpdateUser', user);
    }

    async placeOrder(cart: CartItem[], customerName: string): Promise<boolean> {
        if (this.mode === 'CLOUD' && this.sheetUrl) {
            return await retryWithBackoff(() => GoogleSheetService.postData(this.sheetUrl!, 'placeOrder', {
                cart,
                customerName: sanitizeString(customerName)
            }));
        }
        return true;
    }

    async getOrders(): Promise<Order[]> {
        if (this.mode === 'CLOUD' && this.sheetUrl) return await GoogleSheetService.fetchData(this.sheetUrl, 'getOrders') || [];
        return [];
    }

    async getLogs(): Promise<SystemLog[]> {
        if (this.mode === 'CLOUD' && this.sheetUrl) return await GoogleSheetService.fetchData(this.sheetUrl, 'getLogs') || [];
        return [];
    }

    async syncUser(user: UserProfile): Promise<boolean> {
        if (this.mode === 'CLOUD' && this.sheetUrl) return await GoogleSheetService.postData(this.sheetUrl, 'syncUser', user);
        return true;
    }
}

export const api = new ApiClient();
