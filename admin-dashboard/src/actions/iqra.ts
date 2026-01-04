'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import type { IqraLesson } from '@/types/crud'

function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )
}

// ==================== IQRA LESSONS ====================

export async function getLessons(volume?: number, page = 1, pageSize = 20) {
    const supabase = getSupabaseAdmin()
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
        .from('iqra_lessons')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('volume', { ascending: true })
        .order('page', { ascending: true })
        .order('line', { ascending: true })

    if (volume) {
        query = query.eq('volume', volume)
    }

    const { data, error, count } = await query

    if (error) throw new Error(error.message)
    return { lessons: (data || []) as IqraLesson[], total: count || 0 }
}

export async function getIqraStats() {
    const supabase = getSupabaseAdmin()

    // Get counts per volume
    const volumes = []
    for (let v = 1; v <= 6; v++) {
        const { count: total } = await supabase
            .from('iqra_lessons')
            .select('*', { count: 'exact', head: true })
            .eq('volume', v)

        const { count: validated } = await supabase
            .from('iqra_lessons')
            .select('*', { count: 'exact', head: true })
            .eq('volume', v)
            .eq('status', 'validated')

        const { count: live } = await supabase
            .from('iqra_lessons')
            .select('*', { count: 'exact', head: true })
            .eq('volume', v)
            .eq('status', 'live')

        const { count: withAudio } = await supabase
            .from('iqra_lessons')
            .select('*', { count: 'exact', head: true })
            .eq('volume', v)
            .not('audio_url', 'is', null)

        volumes.push({
            volume: v,
            total: total || 0,
            validated: validated || 0,
            live: live || 0,
            withAudio: withAudio || 0
        })
    }

    return { volumes }
}

export async function createLesson(formData: FormData) {
    const supabase = getSupabaseAdmin()

    const lesson = {
        volume: parseInt(formData.get('volume') as string),
        page: parseInt(formData.get('page') as string),
        line: parseInt(formData.get('line') as string),
        arabic_text: formData.get('arabic_text') as string,
        transliteration: formData.get('transliteration') as string,
        audio_url: formData.get('audio_url') as string || null,
        status: 'pending',
    }

    const { error } = await supabase.from('iqra_lessons').insert(lesson)
    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/iqra')
    return { success: true }
}

export async function updateLesson(id: string, formData: FormData) {
    const supabase = getSupabaseAdmin()

    const updates: Partial<IqraLesson> = {}

    const arabic = formData.get('arabic_text')
    const translit = formData.get('transliteration')
    const audio = formData.get('audio_url')
    const status = formData.get('status')

    if (arabic) updates.arabic_text = arabic as string
    if (translit) updates.transliteration = translit as string
    if (audio !== null) updates.audio_url = audio as string || null
    if (status) updates.status = status as IqraLesson['status']

    const { error } = await supabase.from('iqra_lessons').update(updates).eq('id', id)
    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/iqra')
    return { success: true }
}

export async function deleteLesson(id: string) {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('iqra_lessons').delete().eq('id', id)
    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/iqra')
    return { success: true }
}

export async function validateLesson(id: string, validatorId: string) {
    const supabase = getSupabaseAdmin()

    const { error } = await supabase
        .from('iqra_lessons')
        .update({
            status: 'validated',
            validated_by: validatorId
        })
        .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/iqra')
    return { success: true }
}

export async function publishLesson(id: string) {
    const supabase = getSupabaseAdmin()

    const { error } = await supabase
        .from('iqra_lessons')
        .update({ status: 'live' })
        .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/iqra')
    return { success: true }
}

export async function bulkPublishVolume(volume: number) {
    const supabase = getSupabaseAdmin()

    const { error } = await supabase
        .from('iqra_lessons')
        .update({ status: 'live' })
        .eq('volume', volume)
        .eq('status', 'validated')

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/iqra')
    return { success: true }
}
