import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    try {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                        supabaseResponse = NextResponse.next({
                            request,
                        })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        const {
            data: { user },
        } = await supabase.auth.getUser()

        // Protect dashboard routes
        if (
            !user &&
            request.nextUrl.pathname.startsWith('/dashboard')
        ) {
            const url = request.nextUrl.clone()
            url.pathname = '/auth/login'
            return NextResponse.redirect(url)
        }

        // Allow signed in users to bypass auth pages
        if (
            user &&
            request.nextUrl.pathname.startsWith('/auth')
        ) {
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }

        return supabaseResponse
    } catch (e) {
        // If we fail to initialize supabase (e.g. missing env vars in Vercel before setup), 
        // just return the next response to prevent a hard 500 on all pages.
        console.error('Middleware Supabase error:', e)
        return NextResponse.next({
            request: {
                headers: request.headers,
            },
        })
    }
}
