import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // --- MOCK MODE: Bypass middleware if Supabase is not configured ---
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // In mock mode, we rely on client-side checks or simple cookie checks if implemented.
    // Since this is a demo, we'll allow the request to proceed.
    // Ideally, we could check for a 'mock_session' cookie here if we wanted to be stricter.
    return supabaseResponse
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
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

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // 1. Защита маршрутов автора
  if (request.nextUrl.pathname.startsWith('/author') && !user) {
    url.pathname = '/login' // Redirect to login instead of home
    return NextResponse.redirect(url)
  }

  // 2. Защита маршрутов покупателя/студента
  if (request.nextUrl.pathname.startsWith('/buyer') && !user) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // TODO: Здесь можно добавить проверку ролей (RBAC)
  // Например, чтение из metadata пользователя: user.user_metadata.role

  return supabaseResponse
}
