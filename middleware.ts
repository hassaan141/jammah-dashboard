import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './src/lib/supabase/middleware'
import { checkRateLimit, checkStrictRateLimit, checkAuthRateLimit } from './src/lib/rate-limiter'

export async function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  if (request.nextUrl.pathname.startsWith('/api/')) {
    let rateLimitResult

    if (request.nextUrl.pathname.startsWith('/api/approve-application') ||
      request.nextUrl.pathname.startsWith('/api/create-organization')) {
      rateLimitResult = checkStrictRateLimit(ip)
    }
    else if (request.nextUrl.pathname.startsWith('/api/forgot-password') ||
      request.nextUrl.pathname.startsWith('/api/send-welcome-email')) {
      rateLimitResult = checkAuthRateLimit(ip)
    }
    else {
      rateLimitResult = checkRateLimit(ip)
    }

    if (!rateLimitResult.success) {
      const retryAfter = Math.ceil((rateLimitResult.reset - Date.now()) / 1000)

      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
          }
        }
      )
    }
  }

  if (request.nextUrl.pathname.startsWith('/signin') ||
    request.nextUrl.pathname.startsWith('/forgot-password') ||
    request.nextUrl.pathname.startsWith('/reset-password')) {
    const rateLimitResult = checkAuthRateLimit(ip)

    if (!rateLimitResult.success) {
      return NextResponse.redirect(new URL('/?error=rate-limit', request.url))
    }
  }

  const response = await updateSession(request)

  if (response) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, nosnippet, noarchive')

    if (!response.headers.get('X-Frame-Options')) {
      response.headers.set('X-Frame-Options', 'DENY')
    }

    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()')
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '') || ''
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https: blob:",
        `connect-src 'self' https://${supabaseUrl} https://api.openrouteservice.org`,
        "font-src 'self' data:",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join('; ')
    )
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
