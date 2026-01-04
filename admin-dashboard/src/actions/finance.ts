'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import type { Transaction } from '@/types/crud'

function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )
}

// ==================== TRANSACTIONS ====================

export async function getTransactions(page = 1, pageSize = 10, filters?: { type?: string; status?: string }) {
    const supabase = getSupabaseAdmin()
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
        .from('payments')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false })

    if (filters?.type) {
        query = query.eq('type', filters.type)
    }
    if (filters?.status) {
        query = query.eq('status', filters.status)
    }

    const { data, error, count } = await query

    if (error) throw new Error(error.message)
    return { transactions: (data || []) as Transaction[], total: count || 0 }
}

export async function getTransactionStats() {
    const supabase = getSupabaseAdmin()

    // Get MRR (Monthly Recurring Revenue)
    const { data: subscriptions } = await supabase
        .from('payments')
        .select('amount')
        .eq('type', 'subscription')
        .eq('status', 'success')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

    const mrr = subscriptions?.reduce((sum, p) => sum + p.amount, 0) || 0

    // Get total Infaq
    const { data: infaq } = await supabase
        .from('payments')
        .select('amount')
        .eq('type', 'infaq')
        .eq('status', 'success')

    const totalInfaq = infaq?.reduce((sum, p) => sum + p.amount, 0) || 0

    // Get refunds
    const { data: refunds, count: refundCount } = await supabase
        .from('payments')
        .select('*', { count: 'exact' })
        .eq('status', 'refunded')

    return {
        mrr,
        totalInfaq,
        refundCount: refundCount || 0,
        refundAmount: refunds?.reduce((sum, p) => sum + p.amount, 0) || 0
    }
}

export async function processRefund(transactionId: string) {
    const supabase = getSupabaseAdmin()

    // Get original transaction
    const { data: transaction } = await supabase
        .from('payments')
        .select('*')
        .eq('id', transactionId)
        .single()

    if (!transaction) throw new Error('Transaction not found')
    if (transaction.status === 'refunded') throw new Error('Transaction already refunded')

    // Update status to refunded
    const { error } = await supabase
        .from('payments')
        .update({ status: 'refunded' })
        .eq('id', transactionId)

    if (error) throw new Error(error.message)

    // In production, would integrate with ToyyibPay/Stripe refund API here

    revalidatePath('/dashboard/finance')
    return { success: true }
}

// ==================== MERCHANT KEYS ====================

export async function getMerchantKeys() {
    // Would fetch from secure storage/vault
    return [
        {
            provider: 'toyyibpay',
            name: 'ToyyibPay',
            keyPrefix: 'tp_sk_****',
            lastRotated: '2025-12-15',
            status: 'active'
        },
        {
            provider: 'stripe',
            name: 'Stripe',
            keyPrefix: 'sk_live_****',
            lastRotated: '2025-11-20',
            status: 'active'
        },
    ]
}

export async function rotateMerchantKey(provider: string) {
    // Would integrate with key rotation service
    console.log(`Rotating key for: ${provider}`)
    revalidatePath('/dashboard/finance')
    return { success: true, message: `Key rotation initiated for ${provider}` }
}

// ==================== ANALYTICS ====================

export async function getRevenueByMonth() {
    const supabase = getSupabaseAdmin()

    // Get last 6 months of revenue
    const months = []
    for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)

        const { data } = await supabase
            .from('payments')
            .select('amount')
            .eq('status', 'success')
            .gte('created_at', startOfMonth.toISOString())
            .lte('created_at', endOfMonth.toISOString())

        const total = data?.reduce((sum, p) => sum + p.amount, 0) || 0
        months.push({
            month: startOfMonth.toLocaleDateString('en-US', { month: 'short' }),
            revenue: total
        })
    }

    return months
}
