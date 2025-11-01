import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // Require admin auth (same pattern as other admin APIs)
    const authorization = request.headers.get('authorization')
    if (!authorization) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )

    const token = authorization.replace('Bearer ', '')
    let currentUser: any = null
    try {
      const getUserRes = await adminClient.auth.getUser(token)
      currentUser = (getUserRes as any)?.data?.user
      const userAuthError = (getUserRes as any)?.error
      if (userAuthError || !currentUser || currentUser.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    } catch (err) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check supabase service role availability
    const serviceKeyPresent = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
    const openRouteKeyPresent = Boolean(process.env.OPENROUTE_API_KEY || process.env.NEXT_PUBLIC_OPENROUTE_API)

    const result: any = { ok: true, checks: { serviceKeyPresent, openRouteKeyPresent } }

    if (!serviceKeyPresent) {
      result.ok = false
      result.checks.service = { ok: false, message: 'SUPABASE_SERVICE_ROLE_KEY not set' }
      return NextResponse.json(result, { status: 500 })
    }

    // Try a simple privileged query using service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    )

    try {
      const { data, error } = await supabaseAdmin.from('organizations').select('id').limit(1)
      if (error) {
        result.ok = false
        result.supabase = { ok: false, message: error.message }
        return NextResponse.json(result, { status: 500 })
      }
      result.supabase = { ok: true, message: 'connected' }
    } catch (err: any) {
      result.ok = false
      result.supabase = { ok: false, message: err.message || String(err) }
      return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Health check error:', error)
    return NextResponse.json({ error: error.message || 'internal' }, { status: 500 })
  }
}
