'use server'

import { revalidatePath } from 'next/cache'
import type { User } from '@/types/crud'
import { requireAdmin } from '@/lib/auth-admin'
import { logAdminAction } from '@/lib/audit'

export async function getUsers(page = 1, pageSize = 10) {
    const { adminClient } = await requireAdmin()
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await adminClient
        .from('profiles')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return { users: data as User[], total: count || 0 }
}

export async function createUser(formData: FormData) {
    const { adminClient, user: adminUser } = await requireAdmin()

    const email = formData.get('email') as string
    const full_name = formData.get('full_name') as string
    const role = formData.get('role') as string || 'user'
    const subscription_tier = formData.get('subscription_tier') as string || 'FREE'

    // Create auth user first
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { full_name, role }
    })

    if (authError) throw new Error(authError.message)

    // Update profile with additional fields
    const { error: profileError } = await adminClient
        .from('profiles')
        .update({
            full_name,
            role,
            subscription_tier,
            is_active: true
        })
        .eq('id', authData.user.id)

    if (profileError) throw new Error(profileError.message)

    await logAdminAction(adminUser.id, 'CREATE_USER', authData.user.id, { email, role, tier: subscription_tier })

    revalidatePath('/dashboard/users')
    return { success: true, user_id: authData.user.id }
}

export async function updateUser(id: string, formData: FormData) {
    const { adminClient, user: adminUser } = await requireAdmin()

    const updates: Partial<User> = {}

    const full_name = formData.get('full_name')
    const role = formData.get('role')
    const subscription_tier = formData.get('subscription_tier')
    const is_active = formData.get('is_active')

    if (full_name) updates.full_name = full_name as string
    if (role) updates.role = role as User['role']
    if (subscription_tier) updates.subscription_tier = subscription_tier as User['subscription_tier']
    if (is_active !== null) updates.is_active = is_active === 'on' || is_active === 'true'

    const { error } = await adminClient
        .from('profiles')
        .update(updates)
        .eq('id', id)

    if (error) throw new Error(error.message)

    await logAdminAction(adminUser.id, 'UPDATE_USER', id, updates)

    revalidatePath('/dashboard/users')
    return { success: true }
}

export async function deleteUser(id: string) {
    const { adminClient, user: adminUser } = await requireAdmin()

    // Delete from auth (this will cascade to profile if trigger exists)
    const { error } = await adminClient.auth.admin.deleteUser(id)

    if (error) throw new Error(error.message)

    await logAdminAction(adminUser.id, 'DELETE_USER', id, {})

    revalidatePath('/dashboard/users')
    return { success: true }
}

export async function banUser(id: string, banned: boolean) {
    const { adminClient, user: adminUser } = await requireAdmin()

    const { error } = await adminClient
        .from('profiles')
        .update({ is_active: !banned })
        .eq('id', id)

    if (error) throw new Error(error.message)

    await logAdminAction(adminUser.id, 'BAN_USER', id, { banned })

    revalidatePath('/dashboard/users')
    return { success: true }
}

export async function updateUserRole(id: string, role: User['role']) {
    const { adminClient, user: adminUser } = await requireAdmin()

    const { error } = await adminClient
        .from('profiles')
        .update({ role })
        .eq('id', id)

    if (error) throw new Error(error.message)

    // Also update auth.users app_metadata
    await adminClient.auth.admin.updateUserById(id, {
        app_metadata: { role }
    })

    await logAdminAction(adminUser.id, 'UPDATE_ROLE', id, { role })

    revalidatePath('/dashboard/users')
    return { success: true }
}

export async function updateUserSubscription(id: string, tier: User['subscription_tier']) {
    const { adminClient, user: adminUser } = await requireAdmin()

    const { error } = await adminClient
        .from('profiles')
        .update({ subscription_tier: tier })
        .eq('id', id)

    if (error) throw new Error(error.message)

    await logAdminAction(adminUser.id, 'UPDATE_SUBSCRIPTION', id, { tier })

    revalidatePath('/dashboard/users')
    return { success: true }
}
