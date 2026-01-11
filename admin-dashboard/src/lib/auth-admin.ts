import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Create a generic Supabase Admin client (Service Role)
// INTERNAL USE ONLY - Do not expose to client
function getServiceRoleClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )
}

/**
 * Securely verifies the current user is an admin.
 * Returns the Service Role client (for admin ops) and the User object (for logging).
 * Throws an error if unauthorized.
 */
export async function requireAdmin() {
    const cookieStore = await cookies()

    // 1. Verify User Identity
    const supabaseUser = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )

    const { data: { user }, error } = await supabaseUser.auth.getUser()

    if (error || !user) {
        throw new Error('Unauthorized: Please log in.')
    }

    // 2. Verify Admin Role
    const role = user.app_metadata?.role || user.user_metadata?.role
    if (role !== 'admin') {
        throw new Error('Forbidden: Access denied.')
    }

    // 3. Return Privileged Client
    return {
        adminClient: getServiceRoleClient(),
        user
    }
}
