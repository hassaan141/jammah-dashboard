'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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
    website: ''
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
            website: appData.website
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
            website: mappedData.website || ''
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
          website: data.website || ''
        })
      }
      setLoading(false)
    }

    if (orgId) {
      loadOrganization()
    }
  }, [orgId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
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

  const handleCancel = () => {
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
            onClick={handleCancel}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Organizations
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Organization</h1>
          <p className="mt-2 text-gray-600">
            Admin editing: {organization?.name}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="text-red-700">{error}</div>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="text-green-700">{success}</div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your organization..."
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      id="contact_name"
                      name="contact_name"
                      value={formData.contact_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      id="contact_email"
                      name="contact_email"
                      value={formData.contact_email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      id="contact_phone"
                      name="contact_phone"
                      value={formData.contact_phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="province_state" className="block text-sm font-medium text-gray-700 mb-1">
                        Province/State
                      </label>
                      <input
                        type="text"
                        id="province_state"
                        name="province_state"
                        value={formData.province_state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="postal_code"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}