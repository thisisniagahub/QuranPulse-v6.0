/**
 * 💰 ToyyibPay Service — Malaysian FPX Payment Gateway
 * 
 * Handles Pro subscription payments via ToyyibPay API.
 * Supports FPX (Malaysian online banking) and card payments.
 */

// =====================================
// TYPES
// =====================================

export interface PaymentPlan {
    id: 'pro_monthly' | 'pro_yearly' | 'family_monthly';
    name: string;
    price: number;       // in MYR (sen)
    currency: 'MYR';
    description: string;
    interval: 'monthly' | 'yearly';
    features: string[];
}

export interface PaymentBill {
    billId: string;
    billUrl: string;
    amount: number;
    status: 'pending' | 'paid' | 'failed';
}

export interface PaymentCallback {
    billcode: string;
    order_id: string;
    status_id: string;    // '1' = success, '2' = pending, '3' = failed
    msg: string;
    transaction_id: string;
}

// =====================================
// PLANS
// =====================================

export const SUBSCRIPTION_PLANS: PaymentPlan[] = [
    {
        id: 'pro_monthly',
        name: 'QuranPulse Pro',
        price: 2990,  // RM 29.90
        currency: 'MYR',
        description: 'Akses penuh semua ciri Premium',
        interval: 'monthly',
        features: [
            'Ustaz AI tanpa had',
            'Semantic Search',
            'Tadabbur AI Mode',
            'Voice Recitation Analysis',
            'Tiada iklan',
            'Tema Premium',
            'Family Dashboard (1 pengguna)',
        ],
    },
    {
        id: 'pro_yearly',
        name: 'QuranPulse Pro (Tahunan)',
        price: 28900,  // RM 289.00 (save RM 69.80)
        currency: 'MYR',
        description: 'Jimat RM 69.80 dengan langganan tahunan',
        interval: 'yearly',
        features: [
            'Semua ciri Pro',
            'Jimat 19% berbanding bulanan',
            'Early access ciri baru',
            'Priority support',
        ],
    },
    {
        id: 'family_monthly',
        name: 'QuranPulse Family',
        price: 4990,  // RM 49.90
        currency: 'MYR',
        description: '6 ahli keluarga, 1 langganan',
        interval: 'monthly',
        features: [
            'Semua ciri Pro',
            '6 ahli keluarga',
            'Family Dashboard',
            'Parental Controls',
            'Khatam Tracker keluarga',
        ],
    },
];

// =====================================
// TOYYIBPAY API
// =====================================

const TOYYIBPAY_BASE = 'https://toyyibpay.com';

interface CreateBillParams {
    categoryCode: string;
    billName: string;
    billDescription: string;
    billPriceSetting: 1;      // Fixed price
    billPayorInfo: 1;         // Require payer info
    billAmount: number;        // In sen (e.g. 2990 = RM29.90)
    billReturnUrl: string;
    billCallbackUrl: string;
    billExternalReferenceNo: string;
    billPaymentChannel: '0' | '1' | '2'; // 0=FPX, 1=Credit Card, 2=Both
}

export class ToyyibPayService {
    private secretKey: string;
    private categoryCode: string;

    constructor() {
        this.secretKey = import.meta.env.VITE_TOYYIBPAY_SECRET || '';
        this.categoryCode = import.meta.env.VITE_TOYYIBPAY_CATEGORY || '';
    }

    /**
     * Create a payment bill and return the payment URL
     */
    async createBill(plan: PaymentPlan, userId: string, email: string): Promise<PaymentBill> {
        if (!this.secretKey || !this.categoryCode) {
            // Demo mode — return mock bill
            return {
                billId: `demo_${Date.now()}`,
                billUrl: `${TOYYIBPAY_BASE}/demo`,
                amount: plan.price,
                status: 'pending',
            };
        }

        const params: CreateBillParams = {
            categoryCode: this.categoryCode,
            billName: plan.name,
            billDescription: plan.description,
            billPriceSetting: 1,
            billPayorInfo: 1,
            billAmount: plan.price,
            billReturnUrl: `${window.location.origin}/subscription/callback`,
            billCallbackUrl: `${import.meta.env.VITE_API_URL || ''}/api/payment/callback`,
            billExternalReferenceNo: `${userId}_${plan.id}_${Date.now()}`,
            billPaymentChannel: '2', // Both FPX + Card
        };

        try {
            const response = await fetch(`${TOYYIBPAY_BASE}/index.php/api/createBill`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    userSecretKey: this.secretKey,
                    ...Object.fromEntries(
                        Object.entries(params).map(([k, v]) => [k, String(v)])
                    ),
                    billTo: email,
                    billEmail: email,
                }),
            });

            const data = await response.json();

            if (data && data[0]?.BillCode) {
                return {
                    billId: data[0].BillCode,
                    billUrl: `${TOYYIBPAY_BASE}/${data[0].BillCode}`,
                    amount: plan.price,
                    status: 'pending',
                };
            }

            throw new Error('Failed to create bill');
        } catch (error) {
            console.error('ToyyibPay error:', error);
            throw error;
        }
    }

    /**
     * Check bill status
     */
    async checkBillStatus(billCode: string): Promise<'paid' | 'pending' | 'failed'> {
        try {
            const response = await fetch(`${TOYYIBPAY_BASE}/index.php/api/getBillTransactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ billCode }),
            });

            const data = await response.json();
            if (data && data[0]) {
                const status = data[0].billpaymentStatus;
                return status === '1' ? 'paid' : status === '3' ? 'failed' : 'pending';
            }
            return 'pending';
        } catch {
            return 'pending';
        }
    }

    /**
     * Process payment callback
     */
    processCallback(callback: PaymentCallback): { success: boolean; orderId: string } {
        const success = callback.status_id === '1';
        return {
            success,
            orderId: callback.order_id,
        };
    }

    /**
     * Format price for display
     */
    static formatPrice(priceInSen: number): string {
        return `RM ${(priceInSen / 100).toFixed(2)}`;
    }
}

// Singleton
export const toyyibPay = new ToyyibPayService();
