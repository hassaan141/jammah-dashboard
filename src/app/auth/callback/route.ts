import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { getRedirectPath } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/org'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Get user to determine redirect
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user?.email) {
        const redirectPath = getRedirectPath(user.email)
        return NextResponse.redirect(`${origin}${redirectPath}`)
      } else {
        // Fallback to org page if no email
        return NextResponse.redirect(`${origin}/org`)
      }
    }
  }

  // Return to sign in page if something went wrong
  return NextResponse.redirect(`${origin}/signin`)
}