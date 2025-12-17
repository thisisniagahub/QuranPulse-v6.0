import { supabase } from '@/lib/supabase';

export interface PaymentIntent {
  id: string;
  amount: number;
  description: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  gateway: 'TOYYIBPAY' | 'STRIPE' | 'MANUAL';
  paymentUrl?: string;
}

export const PaymentService = {
  /**
   * Create a payment intent (Simulates calling ToyyibPay API)
   */
  async createInfaqIntent(amount: number, userEmail: string): Promise<PaymentIntent> {
    console.log(`Creating payment intent for RM${amount} via ToyyibPay (Mock)...`);
    
    // In a real app, we would fetch(https://toyyibpay.com/index.php/api/createBill) here.
    // For MVP, we simulate a successful API handshake.
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockBillCode = `BILL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    return {
      id: mockBillCode,
      amount: amount,
      description: "Sumbangan Infaq Pendidikan QuranPulse",
      status: 'PENDING',
      gateway: 'TOYYIBPAY',
      // We point to a local "success" route for demo purposes
      paymentUrl: `https://dev.toyyibpay.com/${mockBillCode}` 
    };
  },

  /**
   * Record the transaction in Supabase
   */
  async recordTransaction(intent: PaymentIntent, userId: string) {
    try {
      // Ensure 'transactions' table exists or mock it
      // For MVP, we'll try to insert, but catch error if table missing
      const { error } = await supabase.from('transactions').insert({
        user_id: userId,
        amount: intent.amount,
        reference_id: intent.id,
        status: 'SUCCESS', // Assuming we only record successes for now
        type: 'INFAQ',
        created_at: new Date().toISOString()
      });

      if (error) {
        console.warn("Failed to record transaction in DB (Table might be missing):", error);
        // Fallback: Just log it
      }
    } catch (e) {
      console.error("Payment Record Error:", e);
    }
  }
};
