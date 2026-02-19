import { supabase } from '@/lib/supabase';

// Supported Gateways
export type PaymentGateway = 'billplz' | 'toyyibpay' | 'stripe' | 'tng' | 'manual' | 'chip';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  tier: 'PRO' | 'FAMILY';
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_pro',
    name: 'QuranPulse PRO',
    price: 9.90,
    features: ['Satu Akaun', 'Ustaz AI Tanpa Had', 'Analisis Recitation AI', 'Tiada Iklan'],
    tier: 'PRO'
  },
  {
    id: 'plan_family',
    name: 'Keluarga Hub',
    price: 29.90,
    features: ['Hingga 6 Akaun', 'Pantauan Ibu Bapa', 'Leaderboard Keluarga', 'Support Masjid Kariah'],
    tier: 'FAMILY'
  }
];

export interface PaymentIntent {
  id: string; // Internal Transaction ID
  amount: number;
  description: string;
  status: 'pending' | 'success' | 'failed';
  gateway: PaymentGateway;
  gateway_ref_id?: string; // BillCode (Toyyib) or PaymentIntentID (Stripe)
  paymentUrl?: string; // Where to redirect user
}

export const PaymentService = {
  
  /**
   * Create a Subscription Intent
   */
  async createSubscription(
    planId: string,
    gateway: PaymentGateway,
    userId: string
  ): Promise<PaymentIntent> {
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) throw new Error("Plan not found");

    return this.initiatePayment(plan.price, gateway, userId, {
      type: 'SUBSCRIPTION',
      plan_id: planId,
      tier: plan.tier
    });
  },

  /**
   * Initiate a Payment (Facade for multiple gateways)
   */
  async initiatePayment(
    amount: number, 
    gateway: PaymentGateway, 
    userId: string | null, // Nullable for anonymous donations
    metadata: { mosque_id?: string; fund_id?: string; email?: string; type?: string; plan_id?: string; tier?: string }
  ): Promise<PaymentIntent> {
    
    console.log(`[Payment] Initiating RM${amount} via ${gateway}...`);
    
    // 1. Create a Pending Transaction Record in DB
    const { data: tx, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        mosque_id: metadata.mosque_id,
        fund_id: metadata.fund_id,
        amount: amount,
        gateway: gateway,
        status: 'pending',
        metadata: metadata
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create transaction record:", error);
      throw new Error("Database Transaction Failed");
    }

    // 2. Call the Specific Gateway Provider (Mock Implementation)
    let gatewayResponse;
    switch (gateway) {
      case 'toyyibpay':
        gatewayResponse = await mockToyyibPay(amount, tx.id);
        break;
      case 'billplz':
        gatewayResponse = await mockBillplz(amount, tx.id);
        break;
      case 'chip':
        gatewayResponse = await mockChip(amount, tx.id);
        break;
      case 'tng':
        gatewayResponse = await mockTnG(amount, tx.id);
        break;
      case 'stripe':
        gatewayResponse = await mockStripe(amount, tx.id);
        break;
      default:
        gatewayResponse = { ref_id: `MANUAL-${tx.id}`, url: '/payment/manual-confirm' };
    }

    // 3. Update Record with Gateway Reference
    await supabase
      .from('transactions')
      .update({ gateway_ref_id: gatewayResponse.ref_id })
      .eq('id', tx.id);

    return {
      id: tx.id,
      amount: amount,
      description: metadata.type === 'SUBSCRIPTION' ? `Langganan ${metadata.tier}` : "Sumbangan Masjid / Infaq",
      status: 'pending',
      gateway: gateway,
      gateway_ref_id: gatewayResponse.ref_id,
      paymentUrl: gatewayResponse.url
    };
  },

  /**
   * Check Transaction Status (Polling)
   */
  async checkStatus(txId: string): Promise<'pending' | 'success' | 'failed'> {
    const { data } = await supabase
      .from('transactions')
      .select('status')
      .eq('id', txId)
      .single();
    return data?.status || 'pending';
  }
};

// --- MOCK ADAPTERS (Simulating External APIs) ---

async function mockToyyibPay(amount: number, orderId: string) {
  await new Promise(r => setTimeout(r, 1000));
  const billCode = `TP-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  return { ref_id: billCode, url: `https://dev.toyyibpay.com/${billCode}` };
}

async function mockBillplz(amount: number, orderId: string) {
  await new Promise(r => setTimeout(r, 1000));
  const billId = `BP-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  return { ref_id: billId, url: `https://www.billplz.com/bills/${billId}` };
}

async function mockChip(amount: number, orderId: string) {
  await new Promise(r => setTimeout(r, 1000));
  const purchaseId = `CHIP-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  return { ref_id: purchaseId, url: `https://gate.chip-in.asia/p/${purchaseId}` };
}

async function mockTnG(amount: number, orderId: string) {
  await new Promise(r => setTimeout(r, 1000));
  return { ref_id: `TNG-${orderId}`, url: `https://payment.tngdigital.com.my/sc/p/${orderId}` };
}

async function mockStripe(amount: number, orderId: string) {
  await new Promise(r => setTimeout(r, 1500));
  const pi = `pi_${Math.random().toString(36).substr(2, 14)}`;
  return { ref_id: pi, url: `https://checkout.stripe.com/pay/${pi}` };
}