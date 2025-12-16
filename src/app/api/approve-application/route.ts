import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { find as findTimezone } from 'geo-tz'

export async function POST(request: NextRequest) {
  try {
    const { applicationId, orgId: providedOrgId } = await request.json()

    if (!applicationId) {
      return NextResponse.json({ error: 'applicationId is required' }, { status: 400 })
    }

    // Check authorization header (must be an admin)
    const authorization = request.headers.get('authorization')
    if (!authorization) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    // Verify admin access using the bearer token
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
        console.error('Auth error:', userAuthError, 'User:', currentUser?.email, 'Expected:', process.env.ADMIN_EMAIL)
        return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 })
      }
    } catch (authErr) {
      console.error('Error verifying admin token:', authErr)
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 })
    }

    // Use regular client with RLS policies
    const supabase = adminClient

    // Fetch the application first (to get organization data if we need to create org)
    const { data: application, error: appFetchError } = await supabase
      .from('organization_applications')
      .select('*')
      .eq('id', applicationId)
      .maybeSingle()

    if (appFetchError) {
      console.error('Error fetching application:', appFetchError)
      return NextResponse.json({ error: appFetchError.message || 'Failed to fetch application' }, { status: 500 })
    }

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Update application status to 'approved' and return user_id
    const { data: updatedApp, error: updateAppError } = await supabase
      .from('organization_applications')
      .update({ application_status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', applicationId)
      .select('id,user_id')
      .maybeSingle()

    if (updateAppError) {
      console.error('Error updating application status:', updateAppError)
      return NextResponse.json({ error: updateAppError.message || 'Failed to update application status' }, { status: 500 })
    }

    const userId = updatedApp?.user_id
    if (!userId) {
      return NextResponse.json({ error: 'Application has no associated user_id' }, { status: 400 })
    }

    // Determine orgId: use provided or create a new organizations row
    let orgId = providedOrgId ?? null

    // Geocode address and create organization if orgId not provided
    if (!orgId) {
      // Build address string
      const addressString = [
        application.address,
        application.city,
        application.province_state,
        application.country
      ].filter(Boolean).join(', ')

      const geoApiKey = process.env.OPENROUTE_API_KEY
      let lat: number | null = null
      let lng: number | null = null
      let timezone: string | null = null

      if (geoApiKey && addressString) {
        try {
          const url = `https://api.openrouteservice.org/geocode/search?api_key=${encodeURIComponent(geoApiKey)}&text=${encodeURIComponent(addressString)}`
          const geoResp = await fetch(url)
          if (geoResp.ok) {
            const geoData = await geoResp.json()
            if (geoData?.features?.[0]?.geometry?.coordinates) {
              const [longitude, latitude] = geoData.features[0].geometry.coordinates
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
          } else {
            console.error('Geocode request failed:', geoResp.status, await geoResp.text())
          }
        } catch (geoErr) {
          console.error('Geocode error:', geoErr)
        }
      }

      try {
        const { data: createdOrg, error: orgError } = await supabase
          .from('organizations')
          .insert({
            name: application.organization_name,
            type: application.organization_type,
            address: application.address,
            city: application.city,
            country: application.country,
            postal_code: application.postal_code,
            province_state: application.province_state,
            contact_name: application.contact_name,
            contact_email: application.contact_email,
            contact_phone: application.contact_phone,
            website: application.website,
            facebook: application.facebook,
            instagram: application.instagram,
            twitter: application.twitter,
            is_active: true,
            approved_at: new Date().toISOString(),
            prayer_times_url: application.prayer_times_url,
            latitude: lat,
            longitude: lng,
            timezone: timezone
          })
          .select('id')
          .maybeSingle()

        if (orgError) {
          console.error('Error creating organization:', orgError)
        } else if (createdOrg?.id) {
          orgId = createdOrg.id
        }
      } catch (err) {
        console.error('Unexpected error creating organization:', err)
      }
    }

    // Update the profile row for the user
    try {
      // Ensure there's at least one daily_prayer_times row for this organization for today.
      // Use YYYY-MM-DD date (UTC) to match the table's DATE column.
      try {
        const today = new Date().toISOString().slice(0, 10)
        if (orgId) {
          try {
            const payload = { organization_id: orgId, prayer_date: today }
            const { data: dptData, error: dptError } = await supabase
              .from('daily_prayer_times')
              .upsert([payload], { onConflict: 'organization_id,prayer_date' })
              .select('id')
              .maybeSingle()

            if (dptError) {
              console.error('daily_prayer_times upsert warning:', dptError)
            }
          } catch (dptErr) {
            console.error('Unexpected error upserting daily_prayer_times:', dptErr)
          }
        }
      } catch (dptErr) {
        console.error('Unexpected error inserting daily_prayer_times:', dptErr)
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_org: true, org_id: orgId, updated_at: new Date().toISOString() })
        .eq('id', userId)

      if (profileError) {
        console.error('Error updating profile:', profileError)
        // still return success for application update but note profile failure
        return NextResponse.json({ success: true, orgId, profileUpdated: false })
      }
    } catch (err) {
      console.error('Unexpected error updating profile:', err)
      return NextResponse.json({ success: true, orgId, profileUpdated: false })
    }

    return NextResponse.json({ success: true, orgId, profileUpdated: true })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
