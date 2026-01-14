'use client'

import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

import LoadingPage from '@/components/ui/LoadingPage'
import ErrorMessage from '@/components/ui/ErrorMessage'
import SuccessMessage from '@/components/ui/SuccessMessage'

// Lazy load form components
const EditableTextInput = lazy(() => import('@/components/forms/EditableTextInput'))
const ReadOnlyLink = lazy(() => import('@/components/forms/ReadOnlyLink'))
const OrganizationProfileHeader = lazy(() => import('@/components/org/OrganizationProfileHeader'))

interface Organization {
  id: string
  name: string
  type?: string
  description?: string
  amenities?: {
    street_parking?: boolean
    women_washroom?: boolean
    on_site_parking?: boolean
    women_prayer_space?: boolean
    wheelchair_accessible?: boolean
  }
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
  prayer_times_url?: string
  latitude?: number
  longitude?: number
}

interface FormData {
  name: string
  description: string
  amenities: {
    street_parking: boolean
    women_washroom: boolean
    on_site_parking: boolean
    women_prayer_space: boolean
    wheelchair_accessible: boolean
  }
  address: string
  city: string
  province_state: string
  country: string
  postal_code: string
  contact_name: string
  contact_email: string
  contact_phone: string
  website: string
  facebook: string
  instagram: string
  twitter: string
  donate_link: string
}

export default function OrgProfilePage() {
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    amenities: {
      street_parking: false,
      women_washroom: false,
      on_site_parking: false,
      women_prayer_space: false,
      wheelchair_accessible: false,
    },
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

  const updateFormData = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const updateAmenity = useCallback((amenityKey: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenityKey]: value
      }
    }))
  }, [])

  const normalizeAmenities = useCallback((amenities: any) => {
    if (!amenities) {
      return {
        street_parking: false,
        women_washroom: false,
        on_site_parking: false,
        women_prayer_space: false,
        wheelchair_accessible: false,
      }
    }
    return {
      street_parking: amenities.street_parking || false,
      women_washroom: amenities.women_washroom || false,
      on_site_parking: amenities.on_site_parking || false,
      women_prayer_space: amenities.women_prayer_space || false,
      wheelchair_accessible: amenities.wheelchair_accessible || false,
    }
  }, [])

  const resetFormData = useCallback((org: Organization) => {
    setFormData({
      name: org.name || '',
      description: org.description || '',
      amenities: normalizeAmenities(org.amenities),
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
  }, [normalizeAmenities])

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
      resetFormData(org)
      setLoading(false)
    }

    loadOrganization()
  }, [router])

  const handleSave = useCallback(async () => {
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
            const geoResp = await fetch('/api/geocode', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ address: addressString })
            })
            
            if (geoResp.ok) {
              const geoData = await geoResp.json()
              if (geoData.lat !== null && geoData.lng !== null) {
                lat = geoData.lat
                lng = geoData.lng
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
        description: formData.description || null,
        amenities: organization?.type === 'masjid' ? formData.amenities : null,
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

      // Update using client-side Supabase (respects RLS)
      const { data, error } = await supabase
        .from('organizations')
        .update(updateData)
        .eq('id', organization.id)
        .select()

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
  }, [organization, formData])

  const handleEdit = useCallback(() => {
    setIsEditMode(true)
    setMessage('')
    setError('')
  }, [])

  const handleCancel = useCallback(() => {
    if (!organization) return
    resetFormData(organization)
    setIsEditMode(false)
    setMessage('')
    setError('')
  }, [organization, resetFormData])

  if (loading) {
    return <LoadingPage message="Loading organization profile..." />
  }

  if (error && !organization) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-8">
            <Suspense fallback={<div className="h-16 animate-pulse bg-gray-200 rounded"></div>}>
              <OrganizationProfileHeader
                isEditMode={isEditMode}
                isSaving={saving}
                onEdit={handleEdit}
                onCancel={handleCancel}
                onSave={handleSave}
              />
            </Suspense>

            <SuccessMessage message={message} className="mb-6" />
            <ErrorMessage message={error} className="mb-6" />

            <Suspense fallback={<div className="space-y-6"><div className="h-20 animate-pulse bg-gray-200 rounded"></div><div className="h-20 animate-pulse bg-gray-200 rounded"></div><div className="h-20 animate-pulse bg-gray-200 rounded"></div></div>}>
              <div className="space-y-6">
                <EditableTextInput
                id="name"
                label="Organization Name"
                value={formData.name}
                onChange={(value) => updateFormData('name', value)}
                placeholder="Your Organization Name"
                required
                isEditMode={isEditMode}
              />

              <div className="mt-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                {isEditMode ? (
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Brief description of your organization..."
                  />
                ) : (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                    {formData.description || 'No description provided'}
                  </div>
                )}
              </div>

              {organization?.type === 'masjid' && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={formData.amenities.street_parking} 
                        onChange={(e) => updateAmenity('street_parking', e.target.checked)}
                        disabled={!isEditMode}
                        className="rounded"
                      />
                      <span className={`text-sm ${!isEditMode ? 'text-gray-500' : 'text-black'}`}>Street parking</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={formData.amenities.women_washroom} 
                        onChange={(e) => updateAmenity('women_washroom', e.target.checked)}
                        disabled={!isEditMode}
                        className="rounded"
                      />
                      <span className={`text-sm ${!isEditMode ? 'text-gray-500' : 'text-black'}`}>Women washroom</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={formData.amenities.on_site_parking} 
                        onChange={(e) => updateAmenity('on_site_parking', e.target.checked)}
                        disabled={!isEditMode}
                        className="rounded"
                      />
                      <span className={`text-sm ${!isEditMode ? 'text-gray-500' : 'text-black'}`}>On-site parking</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={formData.amenities.women_prayer_space} 
                        onChange={(e) => updateAmenity('women_prayer_space', e.target.checked)}
                        disabled={!isEditMode}
                        className="rounded"
                      />
                      <span className={`text-sm ${!isEditMode ? 'text-gray-500' : 'text-black'}`}>Women prayer space</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={formData.amenities.wheelchair_accessible} 
                        onChange={(e) => updateAmenity('wheelchair_accessible', e.target.checked)}
                        disabled={!isEditMode}
                        className="rounded"
                      />
                      <span className={`text-sm ${!isEditMode ? 'text-gray-500' : 'text-black'}`}>Wheelchair accessible</span>
                    </label>
                  </div>
                </div>
              )}

              <EditableTextInput
                id="address"
                label="Street Address"
                value={formData.address}
                onChange={(value) => updateFormData('address', value)}
                placeholder="123 Main Street"
                isEditMode={isEditMode}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <EditableTextInput
                  id="city"
                  label="City"
                  value={formData.city}
                  onChange={(value) => updateFormData('city', value)}
                  placeholder="Toronto"
                  isEditMode={isEditMode}
                />
                <EditableTextInput
                  id="province_state"
                  label="Province/State"
                  value={formData.province_state}
                  onChange={(value) => updateFormData('province_state', value)}
                  placeholder="Ontario"
                  isEditMode={isEditMode}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <EditableTextInput
                  id="country"
                  label="Country"
                  value={formData.country}
                  onChange={(value) => updateFormData('country', value)}
                  placeholder="Canada"
                  isEditMode={isEditMode}
                />
                <EditableTextInput
                  id="postal_code"
                  label="Postal/ZIP Code"
                  value={formData.postal_code}
                  onChange={(value) => updateFormData('postal_code', value)}
                  placeholder="L1T 1X5"
                  isEditMode={isEditMode}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <EditableTextInput
                    id="contact_name"
                    label="Contact Person"
                    value={formData.contact_name}
                    onChange={(value) => updateFormData('contact_name', value)}
                    placeholder="John Smith"
                    isEditMode={isEditMode}
                  />
                  <EditableTextInput
                    id="contact_phone"
                    label="Phone Number"
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(value) => updateFormData('contact_phone', value)}
                    placeholder="+1 (555) 123-4567"
                    isEditMode={isEditMode}
                  />
                </div>

                <EditableTextInput
                  id="contact_email"
                  label="Contact Email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(value) => updateFormData('contact_email', value)}
                  placeholder="contact@yourorganization.com"
                  isEditMode={isEditMode}
                  className="mt-6"
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Online Presence</h3>
                
                <EditableTextInput
                  id="website"
                  label="Website"
                  type="url"
                  value={formData.website}
                  onChange={(value) => updateFormData('website', value)}
                  placeholder="https://yourorganization.com"
                  isEditMode={isEditMode}
                />

                <EditableTextInput
                  id="donate_link"
                  label="Donation Link"
                  type="url"
                  value={formData.donate_link}
                  onChange={(value) => updateFormData('donate_link', value)}
                  placeholder="https://donate.yourorganization.com"
                  isEditMode={isEditMode}
                  className="mt-6"
                />

                <ReadOnlyLink
                  id="prayer_times_url"
                  label="Prayer Times Schedule"
                  url={organization?.prayer_times_url}
                  linkText="View Prayer Times"
                  placeholder="No prayer times schedule uploaded"
                  className="mt-6"
                />

                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  <EditableTextInput
                    id="facebook"
                    label="Facebook"
                    type="url"
                    value={formData.facebook}
                    onChange={(value) => updateFormData('facebook', value)}
                    placeholder="https://facebook.com/yourpage"
                    isEditMode={isEditMode}
                  />
                  <EditableTextInput
                    id="instagram"
                    label="Instagram"
                    type="url"
                    value={formData.instagram}
                    onChange={(value) => updateFormData('instagram', value)}
                    placeholder="https://instagram.com/yourprofile"
                    isEditMode={isEditMode}
                  />
                  <EditableTextInput
                    id="twitter"
                    label="Twitter"
                    type="url"
                    value={formData.twitter}
                    onChange={(value) => updateFormData('twitter', value)}
                    placeholder="https://twitter.com/yourprofile"
                    isEditMode={isEditMode}
                  />
                </div>
              </div>
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}