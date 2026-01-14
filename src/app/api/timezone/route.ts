import { NextRequest, NextResponse } from 'next/server'
// @ts-ignore - tz-lookup doesn't have TypeScript declarations
import tzLookup from 'tz-lookup'
import { timezoneSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate and sanitize input
    const validationResult = timezoneSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ timezone: null })
    }

    const { lat, lng } = validationResult.data

    const timezone = tzLookup(lat, lng)

    console.log('Timezone lookup for', lat, lng, ':', timezone)

    return NextResponse.json({ timezone })

  } catch (error) {
    console.error('Timezone detection error:', error)
    return NextResponse.json({ timezone: null })
  }
}