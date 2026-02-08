import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    if (code) {
      const supabase = await createClient()
      
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (error) {
          console.error('Auth exchange error:', error)
          return NextResponse.redirect(`${origin}/login?error=auth-exchange-failed`)
        }
      } catch (e) {
        console.error('Supabase client error:', e)
        return NextResponse.redirect(`${origin}/login?error=server-error`)
      }

      // Successful login
      const forwardedHost = request.headers.get('x-forwarded-host') 
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }

    return NextResponse.redirect(`${origin}/login?error=no-code`)
    
  } catch (err) {
    console.error('Callback route critical error:', err)
    // Fallback to a safe redirect to prevent 502
    return NextResponse.redirect(new URL('/login?error=critical-error', request.url))
  }
}
