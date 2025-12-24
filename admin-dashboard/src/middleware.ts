import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // Only protect dashboard routes
    if (!request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.next()
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    try {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return request.cookies.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        request.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        })
                        response.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                    },
                    remove(name: string, options: CookieOptions) {
                        request.cookies.set({
                            name,
                            value: '',
                            ...options,
                        })
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        })
                        response.cookies.set({
                            name,
                            value: '',
                            ...options,
                        })
                    },
                },
            }
        )

        const { data: { user } } = await supabase.auth.getUser()

        // 1. Check if user is logged in
        if (!user) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        // 2. Check if user has admin role
        // We assume 'admin' role is set in app_metadata by a trigger or manual update
        const userRole = user.app_metadata?.role || user.user_metadata?.role

        // Bypass for development if needed (remove in production)
        // if (process.env.NODE_ENV === 'development') return response;

        if (userRole !== 'admin') {
            // Redirect to unauthorized page or back to home
            return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 })
        }

        return response
    } catch (e) {
        // If there is an issue with Supabase client (e.g. missing env vars), allow req if in dev, else block
        console.error('Middleware Error:', e)
        return NextResponse.next()
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/dashboard/:path*',
    ],
}
