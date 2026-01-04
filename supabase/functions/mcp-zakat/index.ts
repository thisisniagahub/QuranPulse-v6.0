import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// --- CONSTANTS (2025 Rates - Can be moved to DB) ---
const ZAKAT_RATES = {
    gold_uruf: {
        'WLP': 85, // Wilayah Persekutuan
        'SGR': 85, // Selangor
        'JHR': 85,
    },
    nisab_income_yearly: 24000, // Approx
    silver_price_g: 4.50, // Mock
    gold_price_g: 380.00 // Mock
};

interface ZakatRequest {
    type: "income" | "gold" | "savings";
    amount: number; // Gross amount
    state?: string; // State code e.g. 'SGR'
    deductions?: number; // For income zakat
}

serve(async (req) => {
    try {
        const payload = await req.json() as ZakatRequest;
        const { type, amount, state = 'WLP', deductions = 0 } = payload;
        
        console.log(`💰 [MCP Zakat] Calculating ${type} for ${state}`);

        let zakatPayable = 0;
        let nisabThreshold = 0;
        let status = "not_eligible";
        let breakdown = {};

        // 1. ZAKAT PENDAPATAN (Income)
        if (type === "income") {
            nisabThreshold = ZAKAT_RATES.nisab_income_yearly;
            const netAmount = amount - deductions;
            
            if (netAmount >= nisabThreshold) {
                zakatPayable = netAmount * 0.025;
                status = "eligible";
            }

            breakdown = {
                gross_income: amount,
                total_deductions: deductions,
                net_assessable: netAmount,
                nisab_2025: nisabThreshold,
                rate: "2.5%"
            };
        }

        // 2. ZAKAT EMAS (Gold)
        if (type === "gold") {
            // Logic: Only pay on weight EXCEEDING uruf (User usually wears it)
            // Or investment gold (pay on total)
            // Simplified: Investment Gold
            const uruf = (ZAKAT_RATES.gold_uruf as any)[state] || 85;
            nisabThreshold = 85; // Grams

            if (amount >= nisabThreshold) {
                zakatPayable = (amount * ZAKAT_RATES.gold_price_g) * 0.025;
                status = "eligible";
            }
            
            breakdown = {
                gold_weight_g: amount,
                current_gold_price: ZAKAT_RATES.gold_price_g,
                uruf_limit: uruf,
                market_value: amount * ZAKAT_RATES.gold_price_g
            };
        }

        // 3. ZAKAT WANG SIMPANAN (Savings)
        if (type === "savings") {
             // Nisab is value of 85g gold
             nisabThreshold = 85 * ZAKAT_RATES.gold_price_g;
             
             if (amount >= nisabThreshold) {
                 zakatPayable = amount * 0.025;
                 status = "eligible";
             }
             
             breakdown = {
                 lowest_balance_yearly: amount,
                 nisab_value: nisabThreshold
             };
        }

        return new Response(JSON.stringify({
            meta: { type, state, year: 2025 },
            result: {
                status,
                zakat_payable_myr: parseFloat(zakatPayable.toFixed(2)),
                currency: "MYR",
                breakdown
            }
        }), { headers: { "Content-Type": "application/json" } });

    } catch (err) {
        return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
    }
});
