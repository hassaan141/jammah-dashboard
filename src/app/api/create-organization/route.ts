import { NextRequest, NextResponse } from 'next/server'
// @ts-ignore - tz-lookup doesn't have TypeScript declarations
import tzLookup from 'tz-lookup'
import { createOrganizationSchema } from '@/lib/validation'
import { withAdminAuth } from '@/lib/api-helpers'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const validationResult = createOrganizationSchema.safeParse(body)

  if (!validationResult.success) {
    return NextResponse.json({
      error: 'Invalid input data',
      details: validationResult.error.issues
    }, { status: 400 })
  }

  const { applicationId, organizationData, temporaryPassword } = validationResult.data

  return withAdminAuth(request, async (user, supabase) => {
    try {
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

              try {
                timezone = tzLookup(lat, lng)
              } catch (tzError) {
                console.error('Timezone detection failed:', tzError)
              }
            }
          }
        }
      } catch (geoErr) {
        console.error('Geocode error:', geoErr)
      }

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
  })
}