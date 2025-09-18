import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

    // Create admin client with service role
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Step 1: Create Supabase Auth User
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: organizationData.contact_email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        user_type: 'organization',
        organization_name: organizationData.organization_name,
        contact_name: organizationData.contact_name,
        requires_password_reset: true
      }
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 })
    }

    // Step 2: Geocode address (optional)
    let lat = null
    let lng = null
    
    try {
      const addressString = [
        organizationData.address,
        organizationData.city,
        organizationData.province_state,
        organizationData.country
      ].filter(Boolean).join(', ')
      
      const apiKey = process.env.NEXT_PUBLIC_OPENROUTE_API
      if (apiKey && addressString) {
        const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(addressString)}`
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          if (data?.features?.[0]?.geometry?.coordinates) {
            const [longitude, latitude] = data.features[0].geometry.coordinates
            lat = latitude
            lng = longitude
          }
        }
      }
    } catch (geoErr) {
      console.error('Geocode error:', geoErr)
    }

    // Step 3: Create organization record with auth user ID
    const { data: organization, error: orgError } = await supabaseAdmin
      .from('organizations')
      .insert({
        id: authUser.user?.id,
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
      })
      .select()
      .single()

    if (orgError) {
      console.error('Error creating organization:', orgError)
      // If org creation fails, delete the auth user
      await supabaseAdmin.auth.admin.deleteUser(authUser.user!.id)
      return NextResponse.json({ error: 'Failed to create organization record' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      user: authUser.user,
      organization: organization,
      temporaryPassword: temporaryPassword // Include password in response
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}