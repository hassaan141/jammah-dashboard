import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      organizationId,
      name,
      address,
      city,
      province_state,
      country,
      postal_code,
      contact_name,
      contact_email,
      contact_phone,
      website,
      facebook,
      instagram,
      twitter,
      donate_link
    } = body

    // Get user from server-side session
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has access to this organization
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_org, org_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.is_org) {
      return NextResponse.json({ error: 'User is not an organization' }, { status: 403 })
    }

    // If organizationId is provided, check it matches user's org_id
    // If not provided, use the user's org_id
    const targetOrgId = organizationId || profile.org_id
    
    if (organizationId && profile.org_id !== organizationId) {
      return NextResponse.json({ error: 'You do not have permission to edit this organization' }, { status: 403 })
    }

    if (!targetOrgId) {
      return NextResponse.json({ error: 'No organization ID found' }, { status: 400 })
    }

    // Geocode address if provided
    let lat: number | null = null
    let lng: number | null = null

    if (address || city || province_state || country) {
      const addressString = [
        address,
        city,
        province_state,
        country
      ].filter(Boolean).join(', ')

      const geoApiKey = process.env.OPENROUTE_API_KEY || process.env.NEXT_PUBLIC_OPENROUTE_API || ''
      
      if (geoApiKey && addressString.trim()) {
        try {
          const url = `https://api.openrouteservice.org/geocode/search?api_key=${encodeURIComponent(geoApiKey)}&text=${encodeURIComponent(addressString)}`
          const geoResp = await fetch(url)
          if (geoResp.ok) {
            const geoData = await geoResp.json()
            if (geoData?.features?.[0]?.geometry?.coordinates) {
              const [longitude, latitude] = geoData.features[0].geometry.coordinates
              lat = latitude
              lng = longitude
            }
          } else {
            console.error('Geocode request failed:', geoResp.status, await geoResp.text())
          }
        } catch (geoErr) {
          console.error('Geocode error:', geoErr)
        }
      }
    }

    // Update organization
    const updateData: any = {
      name,
      address,
      city,
      province_state,
      country,
      postal_code,
      contact_name,
      contact_email,
      contact_phone,
      website: website || null,
      facebook: facebook || null,
      instagram: instagram || null,
      twitter: twitter || null,
      donate_link: donate_link || null
      // Note: updated_at will be automatically set by database trigger
    }

    // Only update coordinates if we got them
    if (lat !== null && lng !== null) {
      updateData.latitude = lat
      updateData.longitude = lng
    }

    console.log('=== UPDATE ORGANIZATION DEBUG ===')
    console.log('User ID:', user.id)
    console.log('Target Org ID:', targetOrgId)
    console.log('Update Data:', updateData)
    console.log('Profile:', profile)

    const { data: updateResult, error: updateError } = await supabase
      .from('organizations')
      .update(updateData)
      .eq('id', targetOrgId)
      .select()

    console.log('Update Result:', updateResult)
    console.log('Update Error:', updateError)

    if (updateError) {
      console.error('Error updating organization:', updateError)
      return NextResponse.json({ 
        error: updateError.message || 'Failed to update organization' 
      }, { status: 500 })
    }

    if (!updateResult || updateResult.length === 0) {
      console.error('No rows updated - possible RLS issue')
      return NextResponse.json({ 
        error: 'No organization was updated. Check permissions.' 
      }, { status: 403 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Organization updated successfully',
      coordinates: lat !== null && lng !== null ? { latitude: lat, longitude: lng } : null
    })

  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}