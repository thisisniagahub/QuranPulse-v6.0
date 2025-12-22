
import { Product, Announcement, Order, SystemLog, CartItem, UserProfile, AppConfigItem } from '../types';
import { supabase } from '../lib/supabase';

// Deprecated: GoogleSheetService references removed
// Migrated to Supabase

class ApiClient {
    // Mode is now always CLOUD (Supabase)
    private mode: 'CLOUD' = 'CLOUD';

    constructor() {
        console.log("🌐 ApiClient initialized with Supabase backend.");
    }

    public getMode() { return this.mode; }

    // --- CONFIG (GOD MODE) ---
    async getAppConfig(): Promise<AppConfigItem[]> {
        const { data, error } = await supabase
            .from('app_config')
            .select('*');

        if (error) {
            console.error("Failed to fetch app config:", error);
            return [];
        }
        return data as AppConfigItem[];
    }

    async updateAppConfig(key: string, value: string): Promise<boolean> {
        const { error } = await supabase
            .from('app_config')
            .upsert({ key, value, updated_at: new Date().toISOString() });

        return !error;
    }

    // --- PRODUCTS ---
    async getProducts(): Promise<Product[]> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Failed to fetch products:", error);
            return [];
        }
        return data as Product[];
    }

    async saveProduct(product: Product): Promise<Product> {
        // Remove ID if empty string to allow auto-generation
        const { id, ...productData } = product;
        const payload = id ? product : productData;

        const { data, error } = await supabase
            .from('products')
            .upsert(payload)
            .select()
            .single();

        if (error) throw error;
        return data as Product;
    }

    async updateProduct(product: Product): Promise<void> {
        await this.saveProduct(product);
    }
    
    async deleteProduct(id: string): Promise<void> {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) console.error("Delete product error:", error);
    }

    // --- ANNOUNCEMENTS ---
    async getAnnouncements(): Promise<Announcement[]> {
        const { data, error } = await supabase
            .from('announcements')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) return [];
        return data as Announcement[];
    }
    
    async addAnnouncement(ann: Announcement): Promise<void> {
        const { id, ...annData } = ann;
        await supabase.from('announcements').insert(annData);
    }

    async deleteAnnouncement(id: string): Promise<void> {
        await supabase.from('announcements').delete().eq('id', id);
    }

    // --- USERS & ORDERS ---
    async getUsers(): Promise<UserProfile[]> {
        // Only admins should see this (RLS protected)
        const { data, error } = await supabase.from('profiles').select('*');
        if (error) return [];
        return data as UserProfile[];
    }

    async adminUpdateUser(user: Partial<UserProfile>): Promise<void> {
         if (!user.id) return;
         await supabase.from('profiles').update(user).eq('id', user.id);
    }

    async placeOrder(cart: CartItem[], customerName: string): Promise<boolean> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const { error } = await supabase.from('orders').insert({
            user_id: user.id,
            customer_name: customerName,
            items: cart, // Supabase handles JSONB
            total_amount: totalAmount,
            status: 'PENDING'
        });

        return !error;
    }

    async getOrders(): Promise<Order[]> {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) return [];
        return data as Order[];
    }

    async getLogs(): Promise<SystemLog[]> {
        const { data, error } = await supabase
            .from('system_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) return [];
        return data as SystemLog[];
    }

    async syncUser(user: UserProfile): Promise<boolean> {
        // Handled by AuthContext and Triggers
        return true;
    }
}

export const api = new ApiClient();
