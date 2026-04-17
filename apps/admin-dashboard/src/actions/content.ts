'use server'

import { revalidatePath } from 'next/cache'
import type { Banner, KnowledgeBase } from '@/types/crud'
import { requireAdmin } from '@/lib/auth-admin'
import { logAdminAction } from '@/lib/audit'

import { BannerSchema, BannerUpdateSchema, KnowledgeBaseSchema, KnowledgeBaseUpdateSchema } from '@/lib/validations'

// ==================== BANNERS ====================

export async function getBanners(page = 1, pageSize = 10) {
    const { adminClient } = await requireAdmin()
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await adminClient
        .from('content_banners')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return { banners: (data || []) as Banner[], total: count || 0 }
}

export async function createBanner(formData: FormData) {
    const { adminClient, user: adminUser } = await requireAdmin()

    const rawData = {
        title: formData.get('title'),
        description: formData.get('description'),
        image_url: formData.get('image_url'),
        link_url: formData.get('link_url') || null,
        active: formData.get('active') === 'on',
        start_date: formData.get('start_date') || null,
        end_date: formData.get('end_date') || null,
    }

    const validated = BannerSchema.safeParse(rawData)
    if (!validated.success) throw new Error(validated.error.message)
    const banner = validated.data

    const { error } = await adminClient.from('content_banners').insert(banner)
    if (error) throw new Error(error.message)

    await logAdminAction(adminUser.id, 'CREATE_BANNER', banner.title, banner)

    revalidatePath('/dashboard/content')
    return { success: true }
}

export async function updateBanner(id: string, formData: FormData) {
    const { adminClient, user: adminUser } = await requireAdmin()

    const rawData: Record<string, any> = {}
    if (formData.has('title')) rawData.title = formData.get('title')
    if (formData.has('description')) rawData.description = formData.get('description')
    if (formData.has('image_url')) rawData.image_url = formData.get('image_url')
    if (formData.has('link_url')) rawData.link_url = formData.get('link_url')
    if (formData.has('active')) rawData.active = formData.get('active') === 'on' || formData.get('active') === 'true'

    const validated = BannerUpdateSchema.safeParse(rawData)
    if (!validated.success) throw new Error(validated.error.message)
    const updates = validated.data

    const { error } = await adminClient.from('content_banners').update(updates).eq('id', id)
    if (error) throw new Error(error.message)

    await logAdminAction(adminUser.id, 'UPDATE_BANNER', id, updates)

    revalidatePath('/dashboard/content')
    return { success: true }
}

export async function deleteBanner(id: string) {
    const { adminClient, user: adminUser } = await requireAdmin()
    const { error } = await adminClient.from('content_banners').delete().eq('id', id)
    if (error) throw new Error(error.message)

    await logAdminAction(adminUser.id, 'DELETE_BANNER', id, {})

    revalidatePath('/dashboard/content')
    return { success: true }
}

export async function toggleBannerActive(id: string, active: boolean) {
    const { adminClient, user: adminUser } = await requireAdmin()
    const { error } = await adminClient.from('content_banners').update({ active }).eq('id', id)
    if (error) throw new Error(error.message)

    await logAdminAction(adminUser.id, 'TOGGLE_BANNER', id, { active })

    revalidatePath('/dashboard/content')
    return { success: true }
}

// ==================== KNOWLEDGE BASE ====================

export async function getKnowledgeBase(page = 1, pageSize = 10) {
    const { adminClient } = await requireAdmin()
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await adminClient
        .from('ai_knowledge_base')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return { items: (data || []) as KnowledgeBase[], total: count || 0 }
}

export async function createKnowledgeEntry(formData: FormData) {
    const { adminClient, user: adminUser } = await requireAdmin()

    const rawData = {
        title: formData.get('title'),
        content: formData.get('content'),
        source: formData.get('source'),
        category: formData.get('category'),
    }

    const validated = KnowledgeBaseSchema.safeParse(rawData)
    if (!validated.success) throw new Error(validated.error.message)
    const entry = validated.data

    const { error } = await adminClient.from('ai_knowledge_base').insert(entry)
    if (error) throw new Error(error.message)

    await logAdminAction(adminUser.id, 'CREATE_KB_ENTRY', entry.title, entry)

    revalidatePath('/dashboard/content')
    return { success: true }
}

export async function updateKnowledgeEntry(id: string, formData: FormData) {
    const { adminClient, user: adminUser } = await requireAdmin()

    const rawData: Record<string, any> = {}
    if (formData.has('title')) rawData.title = formData.get('title')
    if (formData.has('content')) rawData.content = formData.get('content')
    if (formData.has('source')) rawData.source = formData.get('source')
    if (formData.has('category')) rawData.category = formData.get('category')

    const validated = KnowledgeBaseUpdateSchema.safeParse(rawData)
    if (!validated.success) throw new Error(validated.error.message)
    const updates = validated.data

    const { error } = await adminClient.from('ai_knowledge_base').update(updates).eq('id', id)
    if (error) throw new Error(error.message)

    await logAdminAction(adminUser.id, 'UPDATE_KB_ENTRY', id, updates)

    revalidatePath('/dashboard/content')
    return { success: true }
}

export async function deleteKnowledgeEntry(id: string) {
    const { adminClient, user: adminUser } = await requireAdmin()
    const { error } = await adminClient.from('ai_knowledge_base').delete().eq('id', id)
    if (error) throw new Error(error.message)

    await logAdminAction(adminUser.id, 'DELETE_KB_ENTRY', id, {})

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
    const { adminClient, user: adminUser } = await requireAdmin()
    // Would trigger actual sync job
    console.log(`Triggering sync for: ${source}`)
    
    await logAdminAction(adminUser.id, 'TRIGGER_SYNC', source, {})
    
    return { success: true, message: `Sync started for ${source}` }
}
