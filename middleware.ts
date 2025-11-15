import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './src/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Rate limiting for API routes (basic)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown'
    // You can implement more sophisticated rate limiting here
    console.log(`API request from IP: ${ip} to ${request.nextUrl.pathname}`)
  }

  // Security headers
  const response = await updateSession(request)
  
  // Add security headers if not already present
  if (response) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, nosnippet, noarchive')
    
    // Only allow embedding in same origin
    if (!response.headers.get('X-Frame-Options')) {
      response.headers.set('X-Frame-Options', 'SAMEORIGIN')
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
