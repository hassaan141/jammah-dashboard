'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

import LoadingPage from '@/components/ui/LoadingPage'
import ErrorMessage from '@/components/ui/ErrorMessage'
import SuccessMessage from '@/components/ui/SuccessMessage'
import EditableTextInput from '@/components/forms/EditableTextInput'
import ReadOnlyLink from '@/components/forms/ReadOnlyLink'
import OrganizationProfileHeader from '@/components/org/OrganizationProfileHeader'
import AccessPending from '@/components/org/AccessPending'

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
  prayer_times_url?: string
  latitude?: number
  longitude?: number
}

interface FormData {
  name: string
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

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const resetFormData = (org: Organization) => {
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
  }

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

  const handleSave = async () => {
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
  }

  const handleEdit = () => {
    setIsEditMode(true)
    setMessage('')
    setError('')
  }

  const handleCancel = () => {
    if (!organization) return
    resetFormData(organization)
    setIsEditMode(false)
    setMessage('')
    setError('')
  }

  if (loading) {
    return <LoadingPage message="Loading organization profile..." />
  }

  if (error && !organization) {
    return <AccessPending message={error} />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-8">
            <OrganizationProfileHeader
              isEditMode={isEditMode}
              isSaving={saving}
              onEdit={handleEdit}
              onCancel={handleCancel}
              onSave={handleSave}
            />

            <SuccessMessage message={message} className="mb-6" />
            <ErrorMessage message={error} className="mb-6" />

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
          </div>
        </div>
      </div>
    </div>
  )
}