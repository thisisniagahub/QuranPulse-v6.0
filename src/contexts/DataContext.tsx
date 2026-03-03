
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Product, UserProfile, Announcement, Order, SystemLog, CartItem, AppConfigItem } from '../types';
import { api } from '../services/apiClient';

interface DataContextType {
    products: Product[];
    users: UserProfile[];
    announcements: Announcement[];
    orders: Order[];
    logs: SystemLog[];
    appConfig: AppConfigItem[];
    loading: boolean;

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
    const [loading, setLoading] = useState(false);
    const [backendMode, setBackendMode] = useState<'MOCK' | 'CLOUD'>(api.getMode());

    useEffect(() => { refreshData(); }, []);

    const refreshData = async () => {
        try {
            setLoading(true);
            const productsPromise = api.getProducts();

            if (api.getMode() === 'CLOUD') {
                const [loadedProducts, o, l, u, c, a] = await Promise.all([
                    productsPromise,
                    api.getOrders(),
                    api.getLogs(),
                    api.getUsers(),
                    api.getAppConfig(),
                    api.getAnnouncements()
                ]);
                setProducts(loadedProducts);
                setOrders(o);
                setLogs(l);
                setUsers(u);
                setAppConfig(c);
                setAnnouncements(a);
            } else {
                setProducts(await productsPromise);
            }
            setBackendMode(api.getMode());
        } catch (err) {
            console.error('DataContext refresh error:', err);
        } finally {
            setLoading(false);
        }
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
        if (!user.id) return;
        await api.adminUpdateUser({ id: user.id, ...user });
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

    const contextValue = useMemo(() => ({
        products,
        users,
        announcements,
        orders,
        logs,
        appConfig,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        addAnnouncement,
        deleteAnnouncement,
        updateUser,
        placeOrder,
        updateAppConfig,
        refreshData,
        backendMode,
        connectCloud
    }), [
        products,
        users,
        announcements,
        orders,
        logs,
        appConfig,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        addAnnouncement,
        deleteAnnouncement,
        updateUser,
        placeOrder,
        updateAppConfig,
        refreshData,
        backendMode,
        connectCloud
    ]);

    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("useData must be used within a DataProvider");
    return context;
};
