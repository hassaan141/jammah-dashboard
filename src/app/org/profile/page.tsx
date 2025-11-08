'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Organization {
  id: string
  name: string
  address?: string
  city?: string
  province_state?: string
  country?: string
  postal_code?: string
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  website?: string
  facebook?: string
  instagram?: string
  twitter?: string
  donate_link?: string
  latitude?: number
  longitude?: number
}

export default function OrgProfilePage() {
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    province_state: '',
    country: '',
    postal_code: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    website: '',
    facebook: '',
    instagram: '',
    twitter: '',
    donate_link: ''
  })

  useEffect(() => {
    async function loadOrganization() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/signin')
        return
      }

      // Get user profile to find their org_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_org, org_id')
        .eq('id', user.id)
        .single()

      if (!profile?.is_org || !profile?.org_id) {
        setError('Your organization application is still being reviewed.')
        setLoading(false)
        return
      }

      // Get organization details
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', profile.org_id)
        .single()

      if (orgError || !org) {
        setError('Failed to load organization details.')
        setLoading(false)
        return
      }

      setOrganization(org)
      setFormData({
        name: org.name || '',
        address: org.address || '',
        city: org.city || '',
        province_state: org.province_state || '',
        country: org.country || '',
        postal_code: org.postal_code || '',
        contact_name: org.contact_name || '',
        contact_email: org.contact_email || '',
        contact_phone: org.contact_phone || '',
        website: org.website || '',
        facebook: org.facebook || '',
        instagram: org.instagram || '',
        twitter: org.twitter || '',
        donate_link: org.donate_link || ''
      })
      setLoading(false)
    }

    loadOrganization()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!organization) return

    setSaving(true)
    setError('')
    setMessage('')

    try {
      const supabase = createClient()

      // Optional: Geocode address if provided
      let lat: number | null = null
      let lng: number | null = null

      if (formData.address || formData.city || formData.province_state || formData.country) {
        const addressString = [
          formData.address,
          formData.city,
          formData.province_state,
          formData.country
        ].filter(Boolean).join(', ')

        if (addressString.trim()) {
          try {
            const geoApiKey = process.env.NEXT_PUBLIC_OPENROUTE_API
            if (geoApiKey) {
              const url = `https://api.openrouteservice.org/geocode/search?api_key=${encodeURIComponent(geoApiKey)}&text=${encodeURIComponent(addressString)}`
              const geoResp = await fetch(url)
              if (geoResp.ok) {
                const geoData = await geoResp.json()
                if (geoData?.features?.[0]?.geometry?.coordinates) {
                  const [longitude, latitude] = geoData.features[0].geometry.coordinates
                  lat = latitude
                  lng = longitude
                }
              }
            }
          } catch (geoErr) {
            console.log('Geocoding failed, continuing without coordinates:', geoErr)
          }
        }
      }

      // Prepare update data
      const updateData: any = {
        name: formData.name,
        address: formData.address || null,
        city: formData.city || null,
        province_state: formData.province_state || null,
        country: formData.country || null,
        postal_code: formData.postal_code || null,
        contact_name: formData.contact_name || null,
        contact_email: formData.contact_email || null,
        contact_phone: formData.contact_phone || null,
        website: formData.website || null,
        facebook: formData.facebook || null,
        instagram: formData.instagram || null,
        twitter: formData.twitter || null,
        donate_link: formData.donate_link || null,
      }

      // Add coordinates if we got them
      if (lat !== null && lng !== null) {
        updateData.latitude = lat
        updateData.longitude = lng
      }

      // Debug: Check current user
      const { data: { user } } = await supabase.auth.getUser()
      console.log('Current user ID:', user?.id)
      console.log('Organization ID:', organization.id)
      console.log('IDs match?', user?.id === organization.id)
      console.log('Updating organization with data:', updateData)

      // Update using client-side Supabase (respects RLS)
      const { data, error } = await supabase
        .from('organizations')
        .update(updateData)
        .eq('id', organization.id)
        .select()

      console.log('Update result:', { data, error })

      if (error) {
        console.error('Supabase update error:', error)
        setError(`Failed to update: ${error.message}`)
        return
      }

      if (!data || data.length === 0) {
        setError('No organization was updated. Please check your permissions.')
        return
      }

      // Success!
      setMessage('Organization profile updated successfully!')
      setOrganization({ ...organization, ...updateData })
      setIsEditMode(false) // Exit edit mode after successful save

    } catch (error) {
      console.error('Update error:', error)
      setError('Failed to update organization. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = () => {
    setIsEditMode(true)
    setMessage('')
    setError('')
  }

  const handleCancel = () => {
    if (!organization) return
    
    // Reset form data to original values
    setFormData({
      name: organization.name || '',
      address: organization.address || '',
      city: organization.city || '',
      province_state: organization.province_state || '',
      country: organization.country || '',
      postal_code: organization.postal_code || '',
      contact_name: organization.contact_name || '',
      contact_email: organization.contact_email || '',
      contact_phone: organization.contact_phone || '',
      website: organization.website || '',
      facebook: organization.facebook || '',
      instagram: organization.instagram || '',
      twitter: organization.twitter || '',
      donate_link: organization.donate_link || ''
    })
    setIsEditMode(false)
    setMessage('')
    setError('')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-8 h-8 bg-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading organization profile...</p>
        </div>
      </div>
    )
  }

  if (error && !organization) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Pending</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Organization Profile</h1>
                <p className="text-gray-600 mt-1">
                  {isEditMode ? 'Update your organization information' : 'View and manage your organization details'}
                </p>
              </div>
              {!isEditMode ? (
                <button
                  onClick={handleEdit}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {message && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                <p className="text-green-600 text-sm">{message}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  disabled={!isEditMode}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                    !isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''
                  }`}
                  placeholder="Your Organization Name"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  id="address"
                  disabled={!isEditMode}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                    !isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''
                  }`}
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    disabled={!isEditMode}
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                      !isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''
                    }`}
                    placeholder="Toronto"
                  />
                </div>
                <div>
                  <label htmlFor="province_state" className="block text-sm font-medium text-gray-700 mb-2">
                    Province/State
                  </label>
                  <input
                    type="text"
                    id="province_state"
                    disabled={!isEditMode}
                    value={formData.province_state}
                    onChange={(e) => setFormData({ ...formData, province_state: e.target.value })}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                      !isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''
                    }`}
                    placeholder="Ontario"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    disabled={!isEditMode}
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                      !isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''
                    }`}
                    placeholder="Canada"
                  />
                </div>
                <div>
                  <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-2">
                    Postal/ZIP Code
                  </label>
                  <input
                    type="text"
                    id="postal_code"
                    disabled={!isEditMode}
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                      !isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''
                    }`}
                    placeholder="L1T 1X5"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      id="contact_name"
                      disabled={!isEditMode}
                      value={formData.contact_name}
                      onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                        !isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''
                      }`}
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="contact_phone"
                      disabled={!isEditMode}
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                        !isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id="contact_email"
                    disabled={!isEditMode}
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                      !isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''
                    }`}
                    placeholder="contact@yourorganization.com"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Online Presence</h3>
                
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    disabled={!isEditMode}
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                      !isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''
                    }`}
                    placeholder="https://yourorganization.com"
                  />
                </div>

                <div className="mt-6">
                  <label htmlFor="donate_link" className="block text-sm font-medium text-gray-700 mb-2">
                    Donation Link
                  </label>
                  <input
                    type="url"
                    id="donate_link"
                    disabled={!isEditMode}
                    value={formData.donate_link}
                    onChange={(e) => setFormData({ ...formData, donate_link: e.target.value })}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                      !isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''
                    }`}
                    placeholder="https://donate.yourorganization.com"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  <div>
                    <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook
                    </label>
                    <input
                      type="url"
                      id="facebook"
                      disabled={!isEditMode}
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                        !isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''
                      }`}
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div>
                    <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <input
                      type="url"
                      id="instagram"
                      disabled={!isEditMode}
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                        !isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''
                      }`}
                      placeholder="https://instagram.com/yourprofile"
                    />
                  </div>
                  <div>
                    <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter/X
                    </label>
                    <input
                      type="url"
                      id="twitter"
                      disabled={!isEditMode}
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                        !isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''
                      }`}
                      placeholder="https://twitter.com/yourprofile"
                    />
                  </div>
                </div>
              </div>

              {isEditMode && (
                <div className="flex justify-end pt-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="mt-4 text-center">
          <form action="/auth/signout" method="POST" className="inline">
            <button
              type="submit"
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
