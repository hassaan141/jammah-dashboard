import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { masjidIngestionKeySchema } from '@/lib/validation'
import { withMultiAdminAuth } from '@/lib/api-helpers'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const validationResult = masjidIngestionKeySchema.safeParse(body)

  if (!validationResult.success) {
    return NextResponse.json({
      error: 'Invalid input data',
      details: validationResult.error.issues
    }, { status: 400 })
  }

  const { organizationId } = validationResult.data

  return withMultiAdminAuth(request, async (user, supabase) => {
    try {
      const { data: existing, error: selErr } = await supabase
        .from('masjid_ingestion_keys')
        .select('organization_id')
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .limit(1)
        .maybeSingle()

      if (selErr) return NextResponse.json({ error: selErr.message || 'DB error' }, { status: 500 })
      if (existing) return NextResponse.json({ error: 'Key already exists' }, { status: 409 })

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

      return NextResponse.json({ secret }, { status: 201 })

    } catch (error) {
      console.error(error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  })
}