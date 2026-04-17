'use server'

'use server'

import { revalidatePath } from 'next/cache'
import type { IqraLesson } from '@/types/crud'
import { requireAdmin } from '@/lib/auth-admin'
import { logAdminAction } from '@/lib/audit'
import { IqraLessonSchema, IqraLessonUpdateSchema } from '@/lib/validations'

// ==================== IQRA LESSONS ====================

export async function getLessons(volume?: number, page = 1, pageSize = 20) {
    const { adminClient } = await requireAdmin()
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = adminClient
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
    const { adminClient } = await requireAdmin()

    // Get counts per volume
    const volumes = []
    for (let v = 1; v <= 6; v++) {
        const { count: total } = await adminClient
            .from('iqra_lessons')
            .select('*', { count: 'exact', head: true })
            .eq('volume', v)

        const { count: validated } = await adminClient
            .from('iqra_lessons')
            .select('*', { count: 'exact', head: true })
            .eq('volume', v)
            .eq('status', 'validated')

        const { count: live } = await adminClient
            .from('iqra_lessons')
            .select('*', { count: 'exact', head: true })
            .eq('volume', v)
            .eq('status', 'live')

        const { count: withAudio } = await adminClient
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
    const { adminClient, user: adminUser } = await requireAdmin()

    const rawData = {
        volume: parseInt(formData.get('volume') as string),
        page: parseInt(formData.get('page') as string),
        line: parseInt(formData.get('line') as string),
        arabic_text: formData.get('arabic_text'),
        transliteration: formData.get('transliteration'),
        audio_url: formData.get('audio_url') || null,
        status: 'pending',
    }

    const validated = IqraLessonSchema.safeParse(rawData)
    if (!validated.success) throw new Error(validated.error.message)
    const lesson = validated.data

    const { error } = await adminClient.from('iqra_lessons').insert(lesson)
    if (error) throw new Error(error.message)

    await logAdminAction(adminUser.id, 'CREATE_LESSON', `Vol ${lesson.volume} P${lesson.page}`, lesson)

    revalidatePath('/dashboard/iqra')
    return { success: true }
}

export async function updateLesson(id: string, formData: FormData) {
    const { adminClient, user: adminUser } = await requireAdmin()

    const rawData: Record<string, any> = {}
    if (formData.has('arabic_text')) rawData.arabic_text = formData.get('arabic_text')
    if (formData.has('transliteration')) rawData.transliteration = formData.get('transliteration')
    if (formData.has('audio_url')) rawData.audio_url = formData.get('audio_url')
    if (formData.has('status')) rawData.status = formData.get('status')

    const validated = IqraLessonUpdateSchema.safeParse(rawData)
    if (!validated.success) throw new Error(validated.error.message)
    const updates = validated.data

    const { error } = await adminClient.from('iqra_lessons').update(updates).eq('id', id)
    if (error) throw new Error(error.message)

    await logAdminAction(adminUser.id, 'UPDATE_LESSON', id, updates)

    revalidatePath('/dashboard/iqra')
    return { success: true }
}

export async function deleteLesson(id: string) {
    const { adminClient, user: adminUser } = await requireAdmin()
    const { error } = await adminClient.from('iqra_lessons').delete().eq('id', id)
    if (error) throw new Error(error.message)

    await logAdminAction(adminUser.id, 'DELETE_LESSON', id, {})

    revalidatePath('/dashboard/iqra')
    return { success: true }
}

export async function validateLesson(id: string, validatorId: string) {
    const { adminClient, user: adminUser } = await requireAdmin()

    const { error } = await adminClient
        .from('iqra_lessons')
        .update({
            status: 'validated',
            validated_by: validatorId
        })
        .eq('id', id)

    if (error) throw new Error(error.message)

    await logAdminAction(adminUser.id, 'VALIDATE_LESSON', id, { validatorId })

    revalidatePath('/dashboard/iqra')
    return { success: true }
}

export async function publishLesson(id: string) {
    const { adminClient, user: adminUser } = await requireAdmin()

    const { error } = await adminClient
        .from('iqra_lessons')
        .update({ status: 'live' })
        .eq('id', id)

    if (error) throw new Error(error.message)

    await logAdminAction(adminUser.id, 'PUBLISH_LESSON', id, {})

    revalidatePath('/dashboard/iqra')
    return { success: true }
}

export async function bulkPublishVolume(volume: number) {
    const { adminClient, user: adminUser } = await requireAdmin()

    const { error } = await adminClient
        .from('iqra_lessons')
        .update({ status: 'live' })
        .eq('volume', volume)
        .eq('status', 'validated')

    if (error) throw new Error(error.message)

    await logAdminAction(adminUser.id, 'BULK_PUBLISH', `Vol ${volume}`, {})

    revalidatePath('/dashboard/iqra')
    return { success: true }
}
