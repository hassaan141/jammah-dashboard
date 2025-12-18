import { NextRequest, NextResponse } from 'next/server'
// @ts-ignore - tz-lookup doesn't have TypeScript declarations
import tzLookup from 'tz-lookup'

export async function POST(request: NextRequest) {
  try {
    const { lat, lng } = await request.json()
    
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return NextResponse.json({ timezone: null })
    }

    const timezone = tzLookup(lat, lng)
    
    console.log('Timezone lookup for', lat, lng, ':', timezone)
    
    return NextResponse.json({ timezone })
    
  } catch (error) {
    console.error('Timezone detection error:', error)
    return NextResponse.json({ timezone: null })
  }
}