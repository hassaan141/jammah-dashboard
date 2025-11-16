import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { organizationId } = await request.json()
    if (!organizationId) return NextResponse.json({ error: 'organizationId required' }, { status: 400 })

    const authorization = request.headers.get('authorization')
    if (!authorization) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const token = authorization.replace('Bearer ', '')
    const supabase = await createClient()

    // verify only the single admin email may create keys
    let currentUser: any = null
    try {
      const getUserRes = await supabase.auth.getUser(token)
      currentUser = (getUserRes as any)?.data?.user
      if (!currentUser || currentUser.email !== process.env.AQWAT_ADMIN_EMAIL) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } catch {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // ensure only one active key per org
    const { data: existing, error: selErr } = await supabase
      .from('masjid_ingestion_keys')
      .select('organization_id')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()

    if (selErr) return NextResponse.json({ error: selErr.message || 'DB error' }, { status: 500 })
    if (existing) return NextResponse.json({ error: 'Key already exists' }, { status: 409 })

    // generate secret (50 random bytes -> base64) and store only hash
    const secret = crypto.randomBytes(50).toString('base64')

    const { error: insErr } = await supabase
      .from('masjid_ingestion_keys')
      .insert({
        organization_id: organizationId,
        secret_value: secret,
        ingestion_type: 'sheets_hmac',
        is_active: true,
        created_at: new Date().toISOString()
      })

    if (insErr) return NextResponse.json({ error: insErr.message || 'Insert failed' }, { status: 500 })

    // return plaintext secret only once
    return NextResponse.json({ secret }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}