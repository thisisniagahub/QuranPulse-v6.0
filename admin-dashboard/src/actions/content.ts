'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import type { Banner, KnowledgeBase } from '@/types/crud'

function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )
}

// ==================== BANNERS ====================

export async function getBanners(page = 1, pageSize = 10) {
    const supabase = getSupabaseAdmin()
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await supabase
        .from('content_banners')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return { banners: (data || []) as Banner[], total: count || 0 }
}

export async function createBanner(formData: FormData) {
    const supabase = getSupabaseAdmin()

    const banner = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        image_url: formData.get('image_url') as string,
        link_url: formData.get('link_url') as string || null,
        active: formData.get('active') === 'on',
        start_date: formData.get('start_date') as string || null,
        end_date: formData.get('end_date') as string || null,
    }

    const { error } = await supabase.from('content_banners').insert(banner)
    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/content')
    return { success: true }
}

export async function updateBanner(id: string, formData: FormData) {
    const supabase = getSupabaseAdmin()

    const updates: Partial<Banner> = {}

    const title = formData.get('title')
    const description = formData.get('description')
    const image_url = formData.get('image_url')
    const link_url = formData.get('link_url')
    const active = formData.get('active')

    if (title) updates.title = title as string
    if (description) updates.description = description as string
    if (image_url) updates.image_url = image_url as string
    if (link_url !== null) updates.link_url = link_url as string || null
    if (active !== null) updates.active = active === 'on' || active === 'true'

    const { error } = await supabase.from('content_banners').update(updates).eq('id', id)
    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/content')
    return { success: true }
}

export async function deleteBanner(id: string) {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('content_banners').delete().eq('id', id)
    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/content')
    return { success: true }
}

export async function toggleBannerActive(id: string, active: boolean) {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('content_banners').update({ active }).eq('id', id)
    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/content')
    return { success: true }
}

// ==================== KNOWLEDGE BASE ====================

export async function getKnowledgeBase(page = 1, pageSize = 10) {
    const supabase = getSupabaseAdmin()
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await supabase
        .from('ai_knowledge_base')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return { items: (data || []) as KnowledgeBase[], total: count || 0 }
}

export async function createKnowledgeEntry(formData: FormData) {
    const supabase = getSupabaseAdmin()

    const entry = {
        title: formData.get('title') as string,
        content: formData.get('content') as string,
        source: formData.get('source') as string,
        category: formData.get('category') as KnowledgeBase['category'],
    }

    const { error } = await supabase.from('ai_knowledge_base').insert(entry)
    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/content')
    return { success: true }
}

export async function updateKnowledgeEntry(id: string, formData: FormData) {
    const supabase = getSupabaseAdmin()

    const updates: Partial<KnowledgeBase> = {}

    const title = formData.get('title')
    const content = formData.get('content')
    const source = formData.get('source')
    const category = formData.get('category')

    if (title) updates.title = title as string
    if (content) updates.content = content as string
    if (source) updates.source = source as string
    if (category) updates.category = category as KnowledgeBase['category']

    const { error } = await supabase.from('ai_knowledge_base').update(updates).eq('id', id)
    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/content')
    return { success: true }
}

export async function deleteKnowledgeEntry(id: string) {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('ai_knowledge_base').delete().eq('id', id)
    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/content')
    return { success: true }
}

// ==================== SYNC STATUS ====================

export async function getDataSources() {
    // Mock data for now - would connect to actual sync service
    return [
        { name: 'JAKIM Prayer Times', status: 'synced', lastSync: new Date().toISOString(), records: 14 },
        { name: 'Halal Directory', status: 'synced', lastSync: new Date().toISOString(), records: 5420 },
        { name: 'Fatwa Database', status: 'synced', lastSync: new Date().toISOString(), records: 342 },
        { name: 'Zakat Centers', status: 'pending', lastSync: null, records: 0 },
    ]
}

export async function triggerSync(source: string) {
    // Would trigger actual sync job
    console.log(`Triggering sync for: ${source}`)
    return { success: true, message: `Sync started for ${source}` }
}
