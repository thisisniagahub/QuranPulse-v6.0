
import { Product, Announcement, Order, SystemLog, CartItem, UserProfile, AppConfigItem } from '../types';
import { supabase } from '../lib/supabase';
import { retryWithBackoff } from '../utils/retry';

class ApiClient {
    // --- CONFIG ---
    async getAppConfig(): Promise<AppConfigItem[]> {
        const { data, error } = await supabase
            .from('app_config')
            .select('*');

        if (error) {
            console.error('Error fetching config:', error);
            return [];
        }
        return data || [];
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
            console.error('Error fetching products:', error);
            return [];
        }
        return data || [];
    }

    async saveProduct(product: Product): Promise<Product> {
        // If it has an ID, update; otherwise insert
        const { data, error } = await supabase
            .from('products')
            .upsert(product)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async updateProduct(product: Product): Promise<void> {
        await this.saveProduct(product);
    }

    async deleteProduct(id: string): Promise<void> {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    // --- ANNOUNCEMENTS ---
    async getAnnouncements(): Promise<Announcement[]> {
        const { data, error } = await supabase
            .from('announcements')
            .select('*')
            .eq('active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching announcements:', error);
            return [];
        }
        return data || [];
    }

    async addAnnouncement(ann: Announcement): Promise<void> {
        const { error } = await supabase
            .from('announcements')
            .insert(ann);

        if (error) throw error;
    }

    async deleteAnnouncement(id: string): Promise<void> {
        const { error } = await supabase
            .from('announcements')
            .update({ active: false }) // Soft delete
            .eq('id', id);

        if (error) throw error;
    }

    // --- USERS & ORDERS ---
    async getUsers(): Promise<UserProfile[]> {
        // Warning: This requires admin privileges in RLS
        const { data, error } = await supabase
            .from('profiles')
            .select('*');

        if (error) return [];
        return (data as any[]) || [];
    }

    async adminUpdateUser(updates: { id: string; role?: string; status?: string }): Promise<void> {
        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', updates.id);

        if (error) throw error;
    }

    async placeOrder(cart: CartItem[], customerName: string): Promise<boolean> {
        const { data: { user } } = await supabase.auth.getUser();

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const { error } = await supabase
            .from('orders')
            .insert({
                user_id: user?.id,
                customer_name: customerName,
                items: cart,
                total_amount: total,
                status: 'pending'
            });

        if (error) {
            console.error('Error placing order:', error);
            return false;
        }
        return true;
    }

    async getOrders(): Promise<Order[]> {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) return [];
        return data || [];
    }

    async getLogs(): Promise<SystemLog[]> {
        // Assuming a 'system_logs' table exists
        const { data, error } = await supabase
            .from('system_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) return [];
        return data || [];
    }

    // Legacy method stub - Supabase Auth handles this automatically
    async syncUser(user: UserProfile): Promise<boolean> {
        return true;
    }

    getMode(): 'MOCK' | 'CLOUD' {
        // Simple logic (could be env var based)
        return 'CLOUD';
    }

    setSheetUrl(url: string) {
        // Placeholder for runtime config
        console.log("Setting sheet URL:", url);
    }
}

export const api = new ApiClient();
// End of file
