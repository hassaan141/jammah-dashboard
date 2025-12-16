import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { find as findTimezone } from 'geo-tz'

export async function POST(request: NextRequest) {
  try {
    const { applicationId, organizationData, temporaryPassword } = await request.json()

    // Get the authorization header
    const authorization = request.headers.get('authorization')
    if (!authorization) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    // Verify admin access using the bearer token
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Set the session from the authorization header
    const token = authorization.replace('Bearer ', '')
    const { data: { user: currentUser }, error: userAuthError } = await adminClient.auth.getUser(token)
    
    if (userAuthError || !currentUser || currentUser.email !== process.env.ADMIN_EMAIL) {
      console.error('Auth error:', userAuthError, 'User:', currentUser?.email, 'Expected:', process.env.ADMIN_EMAIL)
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 })
    }

    // Use regular client with RLS policies
    const supabase = adminClient

    // Step 1: Geocode address (optional)
    let lat = null
    let lng = null
    let timezone = null
    
    try {
      const addressString = [
        organizationData.address,
        organizationData.city,
        organizationData.province_state,
        organizationData.country
      ].filter(Boolean).join(', ')
      
      const apiKey = process.env.OPENROUTE_API
      if (apiKey && addressString) {
        const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(addressString)}`
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          if (data?.features?.[0]?.geometry?.coordinates) {
            const [longitude, latitude] = data.features[0].geometry.coordinates
            lat = latitude
            lng = longitude
            
            // Get timezone from lat/long
            try {
              const timezones = findTimezone(lat, lng)
              if (timezones && timezones.length > 0) {
                timezone = timezones[0]
              }
            } catch (tzError) {
              console.error('Timezone detection failed:', tzError)
            }
          }
        }
      }
    } catch (geoErr) {
      console.error('Geocode error:', geoErr)
    }

    // Step 2: Create organization record using regular client with RLS
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: organizationData.organization_name,
        type: organizationData.organization_type,
        address: organizationData.address,
        city: organizationData.city,
        country: organizationData.country,
        postal_code: organizationData.postal_code,
        province_state: organizationData.province_state,
        contact_name: organizationData.contact_name,
        contact_email: organizationData.contact_email,
        contact_phone: organizationData.contact_phone,
        website: organizationData.website,
        facebook: organizationData.facebook,
        instagram: organizationData.instagram,
        twitter: organizationData.twitter,
        is_active: true,
        approved_at: new Date().toISOString(),
        prayer_times_url: organizationData.prayer_times_url,
        latitude: lat,
        longitude: lng,
        timezone: timezone,
      })
      .select()
      .single()

    if (orgError) {
      console.error('Error creating organization:', orgError)
      return NextResponse.json({ error: 'Failed to create organization record' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      organization: organization
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}