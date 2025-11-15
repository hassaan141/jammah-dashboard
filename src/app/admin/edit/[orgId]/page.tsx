'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import BasicInformationSection from '@/components/admin/BasicInformationSection'
import ContactInformationSection from '@/components/admin/ContactInformationSection'
import AddressInformationSection from '@/components/admin/AddressInformationSection'
import OnlinePresenceSection from '@/components/admin/OnlinePresenceSection'
import AdminEditActions from '@/components/admin/AdminEditActions'
import ErrorMessage from '@/components/ui/ErrorMessage'
import SuccessMessage from '@/components/ui/SuccessMessage'

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
    type: '',
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
    donate_link: '',
    prayer_times_url: '',
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
            type: (appData as any).organization_type || '',
            description: mappedData.description || '',
            amenities: normalizeAmenities((appData as any).amenities),
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
            prayer_times_url: mappedData.prayer_times_url || '',
            is_active: mappedData.is_active ?? true
          })
        }
      } else if (data) {
        setOrganization(data)
        setFormData({
          name: data.name || '',
          type: data.type || '',
          description: data.description || '',
          amenities: normalizeAmenities(data.amenities),
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
          prayer_times_url: data.prayer_times_url || '',
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

  const updateAmenity = (amenityKey: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenityKey]: value
      }
    }))
  }

  const normalizeAmenities = (amenities: any) => {
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
  }

  const resetFormData = (org: Organization) => {
    setFormData({
      name: org.name || '',
      type: org.type || '',
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
      donate_link: org.donate_link || '',
      prayer_times_url: org.prayer_times_url || '',
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
      const response = await fetch('/api/geocode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return { lat: data.lat, lng: data.lng }
    } catch (error) {
      console.error('Geocoding error:', error)
      return { lat: null, lng: null }
    }
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
        amenities: formData.type === 'masjid' ? formData.amenities : null,
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
        <AdminEditActions
          organizationName={organization?.name}
          isEditMode={isEditMode}
          saving={saving}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onBack={handleBack}
        />

        <ErrorMessage message={error} className="mb-6" />
        <SuccessMessage message={success} className="mb-6" />

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <div className="space-y-6">
              <BasicInformationSection
                formData={{
                  name: formData.name,
                  description: formData.description,
                  is_active: formData.is_active
                }}
                updateFormData={updateFormData}
                isEditMode={isEditMode}
                organizationId={orgId}
              />

              {formData.type === 'masjid' && (
                <div>
                  <h3 className="text-lg font-medium text-black mb-4">Amenities</h3>
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

              <ContactInformationSection
                formData={{
                  contact_name: formData.contact_name,
                  contact_phone: formData.contact_phone,
                  contact_email: formData.contact_email
                }}
                updateFormData={updateFormData}
                isEditMode={isEditMode}
              />

              <AddressInformationSection
                formData={{
                  address: formData.address,
                  city: formData.city,
                  province_state: formData.province_state,
                  country: formData.country,
                  postal_code: formData.postal_code
                }}
                updateFormData={updateFormData}
                isEditMode={isEditMode}
              />

              <OnlinePresenceSection
                formData={{
                  website: formData.website,
                  donate_link: formData.donate_link,
                  prayer_times_url: formData.prayer_times_url,
                  facebook: formData.facebook,
                  instagram: formData.instagram,
                  twitter: formData.twitter
                }}
                updateFormData={updateFormData}
                isEditMode={isEditMode}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}