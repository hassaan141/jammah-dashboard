import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/org/edit'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Get user to determine redirect
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user?.email === 'jamahcommunityapp@gmail.com') {
        return NextResponse.redirect(`${origin}/admin`)
      } else {
        return NextResponse.redirect(`${origin}/org/profile`)
      }
    }
  }

  // Return to sign in page if something went wrong
  return NextResponse.redirect(`${origin}/signin`)
}