# ⚖️ Zakat Module — Calculation & Distribution

> **Last Updated**: 21 Feb 2026
> **Status**: Active
> **Module**: Smart Deen / Zakat

---

> **Vision:** A comprehensive tool to help users calculate, track, and pay their Zakat (Income & Business) with confidence and precision.

## 1. Zakat Pendapatan (Income Zakat)

### The Concept
Zakat on all income derived from employment or professional services.
*   **Rate:** 2.5% of Eligible Income.
*   **Haul (Period):** 1 Lunar Year (practically calculated yearly or monthly).
*   **Nisab (Threshold):** Varies by state (approx. RM 20,000 - RM 24,000 / year).

### Calculation Models
We support two accepted methods in Malaysia (e.g., LZS/PPZ):

#### Method A: Gross Income (Tanpa Tolakan)
The safest and most preferred method by scholars for those who can afford it.
`Zakat = Gross Yearly Income * 2.5%`

#### Method B: Net Income (Dengan Tolakan Had Kifayah)
Deducting basic necessities (Daruriyat) before calculating.
`Zakat = (Gross Income - Allowable Deductions) * 2.5%`

**Allowable Deductions (Had Kifayah - Avg Estimates):**
*   Self: RM 12,000/year
*   Wife: RM 5,000/year
*   Child (School): RM 2,000/head
*   Child (Uni): RM 5,000/head
*   KWSP (EPF): Amount deducted
*   Parents Support: Amount given

---

## 2. Zakat Perniagaan (Business Zakat)

### The Concept
Zakat on productive assets of a business. Based on the **Working Capital** model (Kaedah Modal Kerja), which is standard for SMEs.

### The Formula
`Zakat = (Current Assets - Current Liabilities) * 2.5%`

**Adjustments:**
*   **Current Assets:** Cash + Bank + Stock + Trade Debtors.
*   **Current Liabilities:** Trade Creditors + Operational Bills.
*   *Exclusions:* Non-halal revenue, bad debts.

**Requirements:**
1.  **Islam:** Business owned by Muslims.
2.  **Sempurna Milik:** Full ownership.
3.  **Cukup Haul:** Operations > 1 year.
4.  **Cukup Nisab:** Net Current Assets > Value of 85g Gold (approx. RM 24,000).

---

## 3. The "Pulse" Features (Innovation)

### 📊 Zakat Dashboard
*   **Nisab Tracker:** Real-time graph of Gold Price vs User's Wealth. Alert user: "Anda kini Wajib Zakat!" when lines cross.
*   **Auto-Deduct Calculator:** "Pay RM 550 today OR RM 45.80/month via Auto-Debit."

### 📄 Reporting (LHDN Ready)
*   Generate a PDF Receipt specifically formatted for Malaysian Income Tax Relief (Rebat Cukai).
*   History Log: "Tahun 2024: RM 1,200 (Paid via PPZ-MAIWP)".

### 🤝 Integration
*   **Payment:** Direct link to State Zakat Centers via `PaymentService`.
*   **Profile:** Updates `barakah_points` (Gamification for spiritual duties).

---

## 4. Technical Architecture

### Database (`zakat_records`)
Stores the history of calculations and payments.
*   `year`: 2025
*   `type`: 'INCOME' | 'BUSINESS' | 'SAVINGS' | 'GOLD'
*   `amount_payable`: Calculated value
*   `amount_paid`: Actual payment
*   `receipt_image`: URL

### Service (`ZakatService.ts`)
*   `calculateIncomeZakat(income, deductions)`
*   `calculateBusinessZakat(assets, liabilities)`
*   `checkNisabStatus(netWealth, stateCode)`

