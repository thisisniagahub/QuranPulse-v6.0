'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import type { User } from '@/types/crud'

// Server-side Supabase client with service role
function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )
}

export async function getUsers(page = 1, pageSize = 10) {
    const supabase = getSupabaseAdmin()
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return { users: data as User[], total: count || 0 }
}

export async function createUser(formData: FormData) {
    const supabase = getSupabaseAdmin()

    const email = formData.get('email') as string
    const full_name = formData.get('full_name') as string
    const role = formData.get('role') as string || 'user'
    const subscription_tier = formData.get('subscription_tier') as string || 'FREE'

    // Create auth user first
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { full_name, role }
    })

    if (authError) throw new Error(authError.message)

    // Update profile with additional fields
    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            full_name,
            role,
            subscription_tier,
            is_active: true
        })
        .eq('id', authData.user.id)

    if (profileError) throw new Error(profileError.message)

    revalidatePath('/dashboard/users')
    return { success: true, user_id: authData.user.id }
}

export async function updateUser(id: string, formData: FormData) {
    const supabase = getSupabaseAdmin()

    const updates: Partial<User> = {}

    const full_name = formData.get('full_name')
    const role = formData.get('role')
    const subscription_tier = formData.get('subscription_tier')
    const is_active = formData.get('is_active')

    if (full_name) updates.full_name = full_name as string
    if (role) updates.role = role as User['role']
    if (subscription_tier) updates.subscription_tier = subscription_tier as User['subscription_tier']
    if (is_active !== null) updates.is_active = is_active === 'on' || is_active === 'true'

    const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/users')
    return { success: true }
}

export async function deleteUser(id: string) {
    const supabase = getSupabaseAdmin()

    // Delete from auth (this will cascade to profile if trigger exists)
    const { error } = await supabase.auth.admin.deleteUser(id)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/users')
    return { success: true }
}

export async function banUser(id: string, banned: boolean) {
    const supabase = getSupabaseAdmin()

    const { error } = await supabase
        .from('profiles')
        .update({ is_active: !banned })
        .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/users')
    return { success: true }
}

export async function updateUserRole(id: string, role: User['role']) {
    const supabase = getSupabaseAdmin()

    const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', id)

    if (error) throw new Error(error.message)

    // Also update auth.users app_metadata
    await supabase.auth.admin.updateUserById(id, {
        app_metadata: { role }
    })

    revalidatePath('/dashboard/users')
    return { success: true }
}

export async function updateUserSubscription(id: string, tier: User['subscription_tier']) {
    const supabase = getSupabaseAdmin()

    const { error } = await supabase
        .from('profiles')
        .update({ subscription_tier: tier })
        .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/users')
    return { success: true }
}
