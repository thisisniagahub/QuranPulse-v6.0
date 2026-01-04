'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import type { FlaggedChat } from '@/types/crud'

function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )
}

// ==================== FLAGGED CONVERSATIONS ====================

export async function getFlaggedChats(page = 1, pageSize = 10, severity?: string) {
    const supabase = getSupabaseAdmin()
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
        .from('ai_flagged_conversations')
        .select('*', { count: 'exact' })
        .eq('status', 'pending')
        .range(from, to)
        .order('created_at', { ascending: false })

    if (severity) {
        query = query.eq('severity', severity)
    }

    const { data, error, count } = await query

    if (error) throw new Error(error.message)
    return { flagged: (data || []) as FlaggedChat[], total: count || 0 }
}

export async function getAIStats() {
    const supabase = getSupabaseAdmin()

    // Count flagged by status
    const { count: pending } = await supabase
        .from('ai_flagged_conversations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

    const { count: approved } = await supabase
        .from('ai_flagged_conversations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved')

    const { count: trained } = await supabase
        .from('ai_flagged_conversations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'trained')

    // Get total queries from chat logs (mock)
    const totalQueries = 12450

    return {
        totalQueries,
        pending: pending || 0,
        approved: approved || 0,
        trained: trained || 0,
        avgResponseTime: 145 // ms, would calculate from actual logs
    }
}

export async function approveFlaggedChat(id: string, reviewerId: string) {
    const supabase = getSupabaseAdmin()

    const { error } = await supabase
        .from('ai_flagged_conversations')
        .update({
            status: 'approved',
            reviewed_by: reviewerId,
            reviewed_at: new Date().toISOString()
        })
        .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/ai-oversight')
    return { success: true }
}

export async function rejectFlaggedChat(id: string, reviewerId: string) {
    const supabase = getSupabaseAdmin()

    const { error } = await supabase
        .from('ai_flagged_conversations')
        .update({
            status: 'rejected',
            reviewed_by: reviewerId,
            reviewed_at: new Date().toISOString()
        })
        .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/ai-oversight')
    return { success: true }
}

export async function addToTraining(id: string, reviewerId: string) {
    const supabase = getSupabaseAdmin()

    // Get the flagged conversation
    const { data: flagged } = await supabase
        .from('ai_flagged_conversations')
        .select('*')
        .eq('id', id)
        .single()

    if (!flagged) throw new Error('Conversation not found')

    // Add to training data queue
    const { error: insertError } = await supabase
        .from('ai_training_queue')
        .insert({
            input: flagged.snippet,
            expected_output: null, // Would be filled during training review
            source: 'flagged_conversation',
            source_id: id
        })

    if (insertError) throw new Error(insertError.message)

    // Update status
    const { error } = await supabase
        .from('ai_flagged_conversations')
        .update({
            status: 'trained',
            reviewed_by: reviewerId,
            reviewed_at: new Date().toISOString()
        })
        .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/ai-oversight')
    return { success: true }
}

export async function deleteFlaggedChat(id: string) {
    const supabase = getSupabaseAdmin()

    const { error } = await supabase
        .from('ai_flagged_conversations')
        .delete()
        .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/ai-oversight')
    return { success: true }
}

// ==================== PROMPT TESTING ====================

export async function testPrompt(systemPrompt: string, userInput: string) {
    // Would call actual AI endpoint for testing
    // For now, mock response
    return {
        output: "This is a mock AI response. In production, this would call the actual Gemini/Groq endpoint.",
        tokensUsed: 150,
        latency: 234
    }
}
