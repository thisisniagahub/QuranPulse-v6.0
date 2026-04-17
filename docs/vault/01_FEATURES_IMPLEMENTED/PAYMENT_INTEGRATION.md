# QuranPulse FinTech Integration: The Complete Guide

> **Role:** FinTech Integration Specialist Report
> **Objective:** Zero-friction subscription payments (PRO/FAMILY).
> **Market:** Malaysia (FPX Priority) + Global Cards.
> **Constraint:** Solo Dev, 30-Day Launch.

---

## 💳 PART 1: Gateway Strategy & Recommendation

### The Contenders

#### Option A: ToyyibPay (Recommended for Pure MY Market)
*   **Pros:** Cheap (RM1/transaction for FPX), Syariah-friendy branding, Trusted by local masjids.
*   **Cons:** UX is "Gov-tech" style (redirects), requires manual business verification (SSM).
*   **Verdict:** **Backup**. Good for v2 cost optimization.

#### Option B: Stripe (Recommended for UX & Global)
*   **Pros:** World-class DX, Apple Pay / Google Pay support, seamless "No-Redirect" cards.
*   **Cons:** Higher fees (3%+), strict on recurring billing compliance.
*   **Verdict:** **No**. Too operational heavy for a single dev to handle tax/invoicing properly.

#### Option C: Lemonsqueezy / Gumroad (WINNER for MVP) 🏆
*   **Why?** They act as "Merchant of Record" (MoR).
*   **Benefit:** They handle **Global Tax (SST/VAT)**, Invoicing, and Fraud. You just get one payout.
*   **MVP Strategy:** Use **ToyyibPay (Billplz)** for simple FPX hook if 100% focused on Malaysia. BUT, for a Modern SaaS feel: **Stripe via Supabase Wrappers** or **Lemonsqueezy** is easiest.

**DECISION:** We will use **ToyyibPay** for the MVP launch because:
1.  Target audience is Malaysia.
2.  FPX is king (Bank Islam, Maybank2u).
3.  RM1 flat rate is unbeatable for RM9.90 subscriptions.

---

## 🗄️ PART 2: Database Schema (SQL)

Add these tables to handle subscription life-cycles.

```sql
-- Table: subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  tier TEXT NOT NULL CHECK (tier IN ('PRO', 'FAMILY')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  
  -- Billing Details
  amount_myr DECIMAL(10,2) NOT NULL,
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  
  -- Provider Refs
  provider TEXT DEFAULT 'toyyibpay',
  external_subscription_id TEXT, -- e.g., BillCode
  
  -- Timestamps
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id) -- Enforce 1 sub per user
);

-- Table: payment_transactions (Audit Log)
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  subscription_id UUID REFERENCES subscriptions(id),
  
  amount_myr DECIMAL(10,2) NOT NULL,
  
  status TEXT CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  
  -- ToyyibPay specific
  bill_code TEXT,
  transaction_id TEXT, 
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🛠️ PART 3: Service Layer (`PaymentService.ts`)

Encapsulate the complexity. Don't let payment logic leak into UI.

```typescript
// src/services/payment/PaymentService.ts

import { supabase } from '@/lib/supabase/client';

const TOYYIB_URL = 'https://dev.toyyibpay.com/index.php/api'; // Use prod URL for launch

export class PaymentService {
  
  /**
   * 1. Initiate a Bill (Payment Link)
   */
  async createSubscriptionBill(
    userId: string,
    tier: 'PRO' | 'FAMILY',
    userEmail: string,
    userName: string
  ): Promise<{ paymentUrl: string, billCode: string }> {
    
    const amount = tier === 'PRO' ? 990 : 1990; // In sen (cents)
    
    // Call ToyyibPay API (Ideally via Edge Function to hide Secret Key)
    const response = await fetch(`${TOYYIB_URL}/createBill`, {
      method: 'POST',
      body: new URLSearchParams({
        userSecretKey: process.env.TOYYIB_SECRET,
        categoryCode: process.env.TOYYIB_CATEGORY,
        billName: `QuranPulse ${tier}`,
        billDescription: `Subscription upgrade to ${tier}`,
        billPriceSetting: 1,
        billPayorInfo: 1,
        billAmount: amount,
        billReturnUrl: `${window.location.origin}/payment/status`,
        billCallbackUrl: `${process.env.SUPABASE_FUNCTIONS_URL}/payment-webhook`,
        billExternalReferenceNo: userId,
        billTo: userName,
        billEmail: userEmail
      })
    });

    const data = await response.json();
    const billCode = data[0].BillCode;

    // Log Pending Transaction
    await supabase.from('payment_transactions').insert({
      user_id: userId,
      amount_myr: amount / 100,
      status: 'pending',
      bill_code: billCode,
      provider: 'toyyibpay'
    });

    return {
      paymentUrl: `https://dev.toyyibpay.com/${billCode}`,
      billCode
    };
  }
}
```

---

## 💻 PART 4: Frontend Flow

### 1. The Pricing Card
```typescript
// src/modules/payment/features/PricingSection.tsx

export function PricingSection() {
  const { user } = useAuth();
  
  const handleUpgrade = async (tier) => {
    if (!user) return loginModal.open();
    
    const { paymentUrl } = await PaymentService.createSubscriptionBill(
      user.id, tier, user.email, user.user_metadata.full_name
    );
    
    // Redirect User
    window.location.href = paymentUrl;
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <PricingCard 
        tier="PRO" 
        price="RM9.90" 
        features={['AI Ustaz Verified', 'Iqra Access']}
        onClick={() => handleUpgrade('PRO')}
      />
      {/* ... */}
    </div>
  );
}
```

### 2. The Return/Success Page
File: `src/app/payment/status/page.tsx`

```typescript
export default function PaymentStatusPage() {
  const params = useSearchParams();
  const status = params.get('status_id'); // 1 = Success
  const billCode = params.get('billcode');

  useEffect(() => {
    if (status === '1') {
      // Poll DB for active subscription or wait for polling
      toast.success("Alhamdulillah! Pembayaran berjaya.");
      router.push('/dashboard');
    } else {
      toast.error("Pembayaran tidak berjaya.");
    }
  }, []);

  return <LoadingSpinner />;
}
```

---

## 📡 PART 5: The Webhook (Critical)

This acts as the "Source of Truth". If the user closes the browser early, this ensures they still get the upgrade.

File: `supabase/functions/payment-webhook/index.ts`

```typescript
serve(async (req) => {
  const formData = await req.formData();
  const billCode = formData.get('billcode');
  const status = formData.get('status'); // 1 = Success
  const refNo = formData.get('refno'); // Payor Ref (userId)

  if (status === '1') {
    // 1. Update Transaction
    await supabase.from('payment_transactions')
      .update({ status: 'success', transaction_id: formData.get('transaction_id') })
      .eq('bill_code', billCode);

    // 2. Activate Subscription
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    await supabase.from('subscriptions').upsert({
      user_id: refNo,
      tier: 'PRO', // Ideally fetch tier from transaction metadata
      status: 'active',
      current_period_end: expiresAt
    });
    
    // 3. Update Profile Cache
    await supabase.from('profiles').update({
      subscription_tier: 'PRO'
    }).eq('id', refNo);
  }

  return new Response('OK');
});
```

---

## ✅ PART 6: Testing Checklist (Pre-Flight)

1.  **Mock Payment:** Use ToyyibPay "Test Mode" bank.
2.  **Webhook:** Use `ngrok` to test local webhook handling if developing locally.
3.  **Expiry Logic:** Ensure users lose access when `current_period_end` passes.
4.  **Cancellation:** Simple button to set `status = 'cancelled'` (Access remains until period end).

---

## ⚖️ PART 7: Legal & Trust

*   **Terms:** State clearly "Monthly Recurring" (Currently ToyyibPay is mostly manual recurring for bills, auto-debit requires special approval).
*   **Refunds:** "No refunds for partial months" (Standard SaaS policy).
*   **Receipts:** ToyyibPay emails the receipt automatically. Zero effort for you.
