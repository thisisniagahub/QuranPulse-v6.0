import { supabase } from '@/lib/supabase';

// --- TYPES ---

export interface IncomeData {
  grossIncome: number;
  bonus: number;
  otherIncome: number;
}

export interface DeductionsData {
  self: number; // Usually auto-calculated (e.g. 12000)
  wife: number; // e.g. 5000 per wife
  children: number; // Total amount
  epf: number;
  tabungHaji: number;
  parents: number;
}

export interface BusinessData {
  currentAssets: number; // Cash + Stock + Debtors
  currentLiabilities: number; // Creditors + Bills
  adjustments?: number; // Bad debts / Obsolete stock
}

// --- CONSTANTS ---

// Mock Nisab Rates (In production, fetch from State Zakat APIs)
// Based on 85g Gold Price (~RM 280/g -> ~RM 23,800)
const NISAB_RATES: Record<string, number> = {
  'WLY': 24000, // Wilayah Persekutuan
  'SGR': 24000, // Selangor
  'JHR': 23000, // Johor
  'DEFAULT': 24000
};

// --- SERVICE ---

export const ZakatService = {
  
  /**
   * Get current Nisab for a state
   */
  getNisab(stateCode: string = 'DEFAULT'): number {
    return NISAB_RATES[stateCode] || NISAB_RATES['DEFAULT'];
  },

  /**
   * Calculate Income Zakat (Zakat Pendapatan)
   * Method: Net Income (With Deductions)
   */
  calculateIncomeZakat(income: IncomeData, deductions: DeductionsData, stateCode: string): { 
    totalIncome: number, 
    totalDeductions: number, 
    zakatableIncome: number, 
    zakatAmount: number,
    isEligible: boolean
  } {
    const totalIncome = income.grossIncome + income.bonus + income.otherIncome;
    const totalDeductions = deductions.self + deductions.wife + deductions.children + deductions.epf + deductions.tabungHaji + deductions.parents;
    
    const zakatableIncome = Math.max(0, totalIncome - totalDeductions);
    const nisab = this.getNisab(stateCode);
    
    // Eligibility: Net Income must exceed Nisab
    const isEligible = zakatableIncome >= nisab;
    const zakatAmount = isEligible ? zakatableIncome * 0.025 : 0;

    return {
      totalIncome,
      totalDeductions,
      zakatableIncome,
      zakatAmount,
      isEligible
    };
  },

  /**
   * Calculate Business Zakat (Zakat Perniagaan)
   * Method: Working Capital (Modal Kerja)
   */
  calculateBusinessZakat(business: BusinessData, stateCode: string): {
    netAssets: number,
    zakatAmount: number,
    isEligible: boolean
  } {
    const netAssets = (business.currentAssets - business.currentLiabilities) - (business.adjustments || 0);
    const nisab = this.getNisab(stateCode);
    
    // Eligibility: Net Assets (Working Capital) must exceed Nisab
    const isEligible = netAssets >= nisab;
    const zakatAmount = isEligible ? netAssets * 0.025 : 0;

    return {
      netAssets,
      zakatAmount,
      isEligible
    };
  },

  /**
   * Save Calculation to History
   */
  async saveRecord(userId: string, type: 'income' | 'business', amount: number, snapshot: any) {
    const { error } = await supabase.from('zakat_records').insert({
      user_id: userId,
      year: new Date().getFullYear(),
      zakat_type: type,
      amount_payable: amount,
      data_snapshot: snapshot,
      status: amount > 0 ? 'payable' : 'draft'
    });
    
    if (error) throw error;
  }
};
