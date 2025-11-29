
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, UserProfile, Announcement, Order, SystemLog, CartItem, AppConfigItem } from '../types';
import { api } from './apiClient'; 

interface DataContextType {
    products: Product[];
    users: UserProfile[];
    announcements: Announcement[];
    orders: Order[];
    logs: SystemLog[];
    appConfig: AppConfigItem[];
    
    addProduct: (product: Product) => Promise<void>;
    updateProduct: (product: Product) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    
    addAnnouncement: (ann: Announcement) => Promise<void>;
    deleteAnnouncement: (id: string) => Promise<void>;
    
    updateUser: (user: Partial<UserProfile>) => Promise<void>;
    
    placeOrder: (cart: CartItem[], name: string) => Promise<boolean>;
    updateAppConfig: (key: string, value: string) => Promise<void>;
    refreshData: () => Promise<void>;
    backendMode: 'MOCK' | 'CLOUD';
    connectCloud: (url: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [users, setUsers] = useState<UserProfile[]>([]); 
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [logs, setLogs] = useState<SystemLog[]>([]);
    const [appConfig, setAppConfig] = useState<AppConfigItem[]>([]);
    const [backendMode, setBackendMode] = useState<'MOCK' | 'CLOUD'>(api.getMode());

    useEffect(() => { refreshData(); }, []);

    const refreshData = async () => {
        const loadedProducts = await api.getProducts();
        setProducts(loadedProducts);

        if (api.getMode() === 'CLOUD') {
            const [o, l, u, c, a] = await Promise.all([
                api.getOrders(), api.getLogs(), api.getUsers(), api.getAppConfig(), api.getAnnouncements()
            ]);
            setOrders(o); setLogs(l); setUsers(u); setAppConfig(c); setAnnouncements(a);
        }
        setBackendMode(api.getMode());
    };

    const updateAppConfig = async (key: string, value: string) => {
        setAppConfig(prev => prev.map(item => item.key === key ? { ...item, value } : item));
        await api.updateAppConfig(key, value);
        await refreshData();
    };

    const addProduct = async (product: Product) => {
        await api.saveProduct(product);
        await refreshData();
    };

    const updateProduct = async (product: Product) => {
        await api.updateProduct(product);
        await refreshData();
    };

    const deleteProduct = async (id: string) => {
        await api.deleteProduct(id);
        await refreshData();
    };

    const addAnnouncement = async (ann: Announcement) => {
        await api.addAnnouncement(ann);
        await refreshData();
    };

    const deleteAnnouncement = async (id: string) => {
        await api.deleteAnnouncement(id);
        await refreshData();
    };

    const updateUser = async (user: Partial<UserProfile>) => {
        await api.adminUpdateUser(user);
        await refreshData();
    }

    const placeOrder = async (cart: CartItem[], name: string) => {
        const success = await api.placeOrder(cart, name);
        if (success) await refreshData();
        return success;
    };

    const connectCloud = (url: string) => {
        api.setSheetUrl(url);
        setBackendMode('CLOUD');
    };

    return (
        <DataContext.Provider value={{
            products, users, announcements, orders, logs, appConfig,
            addProduct, updateProduct, deleteProduct,
            addAnnouncement, deleteAnnouncement,
            updateUser,
            placeOrder, updateAppConfig, refreshData, backendMode, connectCloud
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("useData must be used within a DataProvider");
    return context;
};
