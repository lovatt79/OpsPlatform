import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { Database } from '@/types/database'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isAuthRoute = pathname === '/login' || pathname.startsWith('/auth/')
  const isPublicAsset =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/api/health')

  if (isPublicAsset) return response

  if (!user && !isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if (user && pathname === '/login') {
    const { data: staff } = await supabase
      .from('staff')
      .select('is_manager')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    const url = request.nextUrl.clone()
    url.pathname = staff?.is_manager ? '/manager/dashboard' : '/staff/schedule'
    url.searchParams.delete('redirect')
    return NextResponse.redirect(url)
  }

  if (user && pathname.startsWith('/manager')) {
    const { data: staff } = await supabase
      .from('staff')
      .select('is_manager')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    if (!staff?.is_manager) {
      const url = request.nextUrl.clone()
      url.pathname = '/staff/schedule'
      return NextResponse.redirect(url)
    }
  }

  return response
}
