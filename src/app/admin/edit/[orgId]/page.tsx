'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import EditableTextInput from '@/components/forms/EditableTextInput'
import EditableTextArea from '@/components/forms/EditableTextArea'
import ReadOnlyLink from '@/components/forms/ReadOnlyLink'
import ErrorMessage from '@/components/ui/ErrorMessage'
import SuccessMessage from '@/components/ui/SuccessMessage'

interface Organization {
  id: string
  name: string
  description?: string
  address?: string
  city?: string
  province_state?: string
  country?: string
  postal_code?: string
  latitude?: number
  longitude?: number
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  website?: string
  facebook?: string
  instagram?: string
  twitter?: string
  donate_link?: string
  prayer_times_url?: string
  is_active?: boolean
}

export default function AdminEditOrganizationPage() {
  const params = useParams()
  const router = useRouter()
  const orgId = params.orgId as string
  
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    description: '',
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
    donate_link: '',
    is_active: true
  })

  useEffect(() => {
    async function loadOrganization() {
      const supabase = createClient()
      
      // Try organizations table first
      let { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', orgId)
        .single()

      if (error) {
        console.log('Error loading from organizations, trying applications:', error)
        
        // Fall back to applications table
        const { data: appData, error: appError } = await supabase
          .from('applications')
          .select('*')
          .eq('id', orgId)
          .single()

        if (appError) {
          console.error('Error loading from applications:', appError)
          setError('Failed to load organization')
        } else if (appData) {
          // Map application data to organization format
          const mappedData = {
            id: appData.id,
            name: appData.organization_name,
            description: appData.description || '',
            address: appData.address,
            city: appData.city,
            province_state: appData.province_state,
            country: appData.country,
            postal_code: appData.postal_code,
            latitude: appData.latitude,
            longitude: appData.longitude,
            contact_name: appData.contact_name,
            contact_email: appData.contact_email,
            contact_phone: appData.contact_phone,
            website: appData.website,
            facebook: (appData as any).facebook || '',
            instagram: (appData as any).instagram || '',
            twitter: (appData as any).twitter || '',
            donate_link: (appData as any).donate_link || '',
            is_active: (appData as any).is_active ?? true,
            prayer_times_url: (appData as any).prayer_times_url || ''
          }
          
          setOrganization(mappedData)
          setFormData({
            name: mappedData.name || '',
            description: mappedData.description || '',
            address: mappedData.address || '',
            city: mappedData.city || '',
            province_state: mappedData.province_state || '',
            country: mappedData.country || '',
            postal_code: mappedData.postal_code || '',
            contact_name: mappedData.contact_name || '',
            contact_email: mappedData.contact_email || '',
            contact_phone: mappedData.contact_phone || '',
            website: mappedData.website || '',
            facebook: mappedData.facebook || '',
            instagram: mappedData.instagram || '',
            twitter: mappedData.twitter || '',
            donate_link: mappedData.donate_link || '',
            is_active: mappedData.is_active ?? true
          })
        }
      } else if (data) {
        setOrganization(data)
        setFormData({
          name: data.name || '',
          description: data.description || '',
          address: data.address || '',
          city: data.city || '',
          province_state: data.province_state || '',
          country: data.country || '',
          postal_code: data.postal_code || '',
          contact_name: data.contact_name || '',
          contact_email: data.contact_email || '',
          contact_phone: data.contact_phone || '',
          website: data.website || '',
          facebook: data.facebook || '',
          instagram: data.instagram || '',
          twitter: data.twitter || '',
          donate_link: data.donate_link || '',
          is_active: data.is_active ?? true
        })
      }
      setLoading(false)
    }

    if (orgId) {
      loadOrganization()
    }
  }, [orgId])

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const resetFormData = (org: Organization) => {
    setFormData({
      name: org.name || '',
      description: org.description || '',
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
      donate_link: org.donate_link || '',
      is_active: org.is_active ?? true
    })
  }

  const handleEdit = () => {
    setIsEditMode(true)
    setError('')
    setSuccess('')
  }

  const handleCancel = () => {
    if (organization) {
      resetFormData(organization)
    }
    setIsEditMode(false)
    setError('')
    setSuccess('')
  }

  const geocodeAddress = async (address: string) => {
    if (!address.trim()) return { lat: null, lng: null }

    try {
      const response = await fetch(`https://api.openrouteservice.org/geocode/search?api_key=5b3ce3597851110001cf6248bfe86ed54c294ac8af42b6ea19ee7013&text=${encodeURIComponent(address)}`)
      const data = await response.json()
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].geometry.coordinates
        return { lat, lng }
      }
    } catch (error) {
      console.error('Geocoding error:', error)
    }
    
    return { lat: null, lng: null }
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Organization name is required')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      console.log('Admin saving organization:', orgId, formData)
      
      // Geocode the full address if it exists
      const fullAddress = [formData.address, formData.city, formData.province_state, formData.country]
        .filter(Boolean)
        .join(', ')
      
      const { lat, lng } = await geocodeAddress(fullAddress)

      const updateData = {
        ...formData,
        latitude: lat,
        longitude: lng,
        updated_at: new Date().toISOString()
      }

      const supabase = createClient()
      
      // Try to update organizations table first
      let { error } = await supabase
        .from('organizations')
        .update(updateData)
        .eq('id', orgId)

      if (error) {
        console.log('Error updating organizations, trying applications:', error)
        
        // Fall back to updating applications table
        const appUpdateData = {
          organization_name: updateData.name,
          description: updateData.description,
          address: updateData.address,
          city: updateData.city,
          province_state: updateData.province_state,
          country: updateData.country,
          postal_code: updateData.postal_code,
          latitude: updateData.latitude,
          longitude: updateData.longitude,
          contact_name: updateData.contact_name,
          contact_email: updateData.contact_email,
          contact_phone: updateData.contact_phone,
          website: updateData.website,
          updated_at: updateData.updated_at
        }
        
        const { error: appError } = await supabase
          .from('applications')
          .update(appUpdateData)
          .eq('id', orgId)

        if (appError) {
          console.error('Error updating applications:', appError)
          setError(`Failed to update organization: ${appError.message}`)
        } else {
          console.log('Application updated successfully')
          setSuccess('Organization updated successfully!')
          setIsEditMode(false)
          
          // Refresh the organization data from applications
          const { data: appData } = await supabase
            .from('applications')
            .select('*')
            .eq('id', orgId)
            .single()
          
          if (appData) {
            const mappedData = {
              id: appData.id,
              name: appData.organization_name,
              description: appData.description || '',
              address: appData.address,
              city: appData.city,
              province_state: appData.province_state,
              country: appData.country,
              postal_code: appData.postal_code,
              latitude: appData.latitude,
              longitude: appData.longitude,
              contact_name: appData.contact_name,
              contact_email: appData.contact_email,
              contact_phone: appData.contact_phone,
              website: appData.website
            }
            setOrganization(mappedData)
          }
        }
      } else {
        console.log('Organization updated successfully')
        setSuccess('Organization updated successfully!')
        setIsEditMode(false)
        
        // Refresh the organization data
        const { data } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', orgId)
          .single()
        
        if (data) {
          setOrganization(data)
        }
      }
    } catch (error) {
      console.error('Error updating organization:', error)
      setError('An unexpected error occurred while updating the organization')
    } finally {
      setSaving(false)
    }
  }

  const handleBack = () => {
    router.push('/admin/organizations')
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !organization) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            <div className="text-red-600 font-medium">{error}</div>
            <button
              onClick={() => router.push('/admin/organizations')}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              ← Back to Organizations
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Organizations
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-black">Edit Organization</h1>
              <p className="mt-2 text-black">
                {isEditMode ? 'Update organization information' : `Viewing: ${organization?.name}`}
              </p>
            </div>
            {!isEditMode ? (
              <button
                onClick={handleEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Edit Organization
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        <ErrorMessage message={error} className="mb-6" />
        <SuccessMessage message={success} className="mb-6" />

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-black mb-4">Basic Information</h3>
                
                <EditableTextInput
                  id="name"
                  label="Organization Name"
                  value={formData.name}
                  onChange={(value) => updateFormData('name', value)}
                  placeholder="Your Organization Name"
                  required
                  isEditMode={isEditMode}
                />

                <EditableTextArea
                  id="description"
                  label="Description"
                  value={formData.description}
                  onChange={(value) => updateFormData('description', value)}
                  placeholder="Describe your organization..."
                  isEditMode={isEditMode}
                  rows={4}
                  className="mt-6"
                />

                <div className="mt-6">
                  <label className="block text-sm font-medium text-black mb-2">
                    Active Status
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.is_active === true}
                        onChange={() => updateFormData('is_active', true)}
                        disabled={!isEditMode}
                        className="mr-2"
                      />
                      <span className={`text-sm ${!isEditMode ? 'text-gray-500' : 'text-black'}`}>Active</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.is_active === false}
                        onChange={() => updateFormData('is_active', false)}
                        disabled={!isEditMode}
                        className="mr-2"
                      />
                      <span className={`text-sm ${!isEditMode ? 'text-gray-500' : 'text-black'}`}>Inactive</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-black mb-4">Contact Information</h3>
                
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

              {/* Address Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-black mb-4">Address Information</h3>
                
                <EditableTextInput
                  id="address"
                  label="Street Address"
                  value={formData.address}
                  onChange={(value) => updateFormData('address', value)}
                  placeholder="123 Main Street"
                  isEditMode={isEditMode}
                />

                <div className="grid md:grid-cols-2 gap-6 mt-6">
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

                <div className="grid md:grid-cols-2 gap-6 mt-6">
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
              </div>

              {/* Online Presence */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-black mb-4">Online Presence</h3>
                
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