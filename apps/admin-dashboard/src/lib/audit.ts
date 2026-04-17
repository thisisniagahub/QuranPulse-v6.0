import { createClient } from '@supabase/supabase-js'

// We create a fresh client here to ensure we don't depend on the caller's context
// This uses the SERVICE ROLE key to ensure we can always write to the audit log
function getAuditClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )
}

export async function logAdminAction(
    adminId: string,
    action: string,
    targetResource: string | null,
    details: any
) {
    try {
        const supabase = getAuditClient()
        
        await supabase.from('admin_audit_logs').insert({
            admin_id: adminId,
            action,
            target_resource: targetResource,
            details
        })
    } catch (error) {
        // We do not want to fail the main operation if logging fails, 
        // but we should log the error to the console.
        console.error('FAILED TO LOG ADMIN ACTION:', error)
    }
}
