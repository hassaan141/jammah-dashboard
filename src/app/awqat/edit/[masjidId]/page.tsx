'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { City } from 'country-state-city'
import { id } from 'date-fns/locale'

interface Masjid {
  id: string
  name: string
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
  prayer_times_url?: string
  donate_link?: string
}

export default function AwqatEditMasjidPage() {
  const params = useParams()
  const router = useRouter()
  const masjidId = params.masjidId as string
  
  const [masjid, setMasjid] = useState<Masjid | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // ingestion key UI state
  const [creatingKey, setCreatingKey] = useState(false)
  const [oneTimeSecret, setOneTimeSecret] = useState<string | null>(null)
  const [keyError, setKeyError] = useState<string | null>(null)
  const [keyCreated, setKeyCreated] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    id: '',
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
    province_state: 'British Columbia',
    country: 'Canada',
    postal_code: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    website: '',
    facebook: '',
    instagram: '',
    twitter: '',
    prayer_times_url: ''
    ,
    donate_link: ''
  })

  const supabase = createClient()

  // Get BC cities only (Canada = CA, British Columbia = BC)
  type Option = { label: string; value: string }
  const bcCityOptions = useMemo<Option[]>(() => {
    return City.getCitiesOfState('CA', 'BC').map((city) => ({
      label: city.name,
      value: city.name,
    }))
  }, [])

  useEffect(() => {
    async function loadMasjid() {
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', masjidId)
          .eq('type', 'masjid')
          .or('province_state.ilike.%British Columbia%,province_state.ilike.%BC%')  
          .single()

        if (error) throw error

        if (!data) {
          setError('Masjid not found or not accessible.')
          setLoading(false)
          return
        }

        setMasjid(data)
        setFormData({
          id: data.id,
          name: data.name || '',
          description: data.description || '',
          amenities: normalizeAmenities(data.amenities),
          address: data.address || '',
          city: data.city || '',
          province_state: data.province_state || 'British Columbia',
          country: data.country || 'Canada',
          postal_code: data.postal_code || '',
          contact_name: data.contact_name || '',
          contact_email: data.contact_email || '',
          contact_phone: data.contact_phone || '',
          website: data.website || '',
          facebook: data.facebook || '',
          instagram: data.instagram || '',
          twitter: data.twitter || '',
          prayer_times_url: data.prayer_times_url || '',
          donate_link: data.donate_link || ''
        })
      } catch (error) {
        console.error('Error loading masjid:', error)
        setError('Failed to load masjid details.')
      } finally {
        setLoading(false)
      }
    }

    if (masjidId) {
      loadMasjid()
    }
  }, [masjidId, supabase])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          id: formData.id,
          name: formData.name,
          description: formData.description || null,
          amenities: formData.amenities,
          address: formData.address || null,
          city: formData.city || null,
          province_state: formData.province_state,
          country: formData.country,
          postal_code: formData.postal_code || null,
          contact_name: formData.contact_name || null,
          contact_email: formData.contact_email || null,
          contact_phone: formData.contact_phone || null,
          website: formData.website || null,
          facebook: formData.facebook || null,
          instagram: formData.instagram || null,
          twitter: formData.twitter || null,
          prayer_times_url: formData.prayer_times_url || null,
          donate_link: formData.donate_link || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', masjidId)
        .eq('type', 'masjid')
        .or('province_state.ilike.%British Columbia%,province_state.ilike.%BC%')  // Catches both!

      if (error) throw error

      setSuccess('Masjid updated successfully!')
      
      // Refresh the masjid data
      const { data } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', masjidId)
        .single()
      
      if (data) {
        setMasjid(data)
      }
    } catch (error) {
      console.error('Error updating masjid:', error)
      setError('Failed to update masjid. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleBack = () => {
    router.push('/awqat')
  }

  const handleCreateIngestionKey = async () => {
    if (!masjidId) return
    setCreatingKey(true)
    setKeyError(null)
    try {
      const sessionRes = await supabase.auth.getSession()
      const session = (sessionRes as any)?.data?.session
      const token = session?.access_token
      if (!token) {
        setKeyError('No active session')
        setCreatingKey(false)
        return
      }

      const res = await fetch('/api/masjid-ingestion-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ organizationId: masjidId }),
      })

      if (res.status === 201) {
        const json = await res.json()
        setOneTimeSecret(json.secret)
        setKeyCreated(true)
      } else if (res.status === 409) {
        setKeyError('An ingestion key already exists for this organization.')
        setKeyCreated(true)
      } else {
        const json = await res.json().catch(() => ({}))
        setKeyError(json?.error || 'Failed to create ingestion key')
      }
    } catch (err: any) {
      setKeyError(err?.message || 'Network error')
    } finally {
      setCreatingKey(false)
    }
  }

  const handleCopySecret = async () => {
    if (!oneTimeSecret) return
    try {
      await navigator.clipboard.writeText(oneTimeSecret)
      setOneTimeSecret(null) // hide after copy — never show again
    } catch {
      setKeyError('Failed to copy to clipboard')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

  if (error && !masjid) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-600 font-medium">{error}</div>
            <button
              onClick={handleBack}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              ← Back to Masjid List
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to BC Masjids
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            Edit {masjid?.name}
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="text-red-800">{error}</div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <div className="text-green-800">{success}</div>
          </div>
        )}

      <div>
          <label htmlFor="id" className="block text-sm font-medium text-black mb-1">Masjid ID</label>
          <input
            type="text"
            id="id"
            name="id"
            value={formData.id}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-text font-mono"
            aria-readonly="true"
            tabIndex={0}
          />
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
                Masjid Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-black mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Brief description of the masjid"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Amenities</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={formData.amenities.street_parking} 
                    onChange={(e) => updateAmenity('street_parking', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-black">Street parking</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={formData.amenities.women_washroom} 
                    onChange={(e) => updateAmenity('women_washroom', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-black">Women washroom</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={formData.amenities.on_site_parking} 
                    onChange={(e) => updateAmenity('on_site_parking', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-black">On-site parking</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={formData.amenities.women_prayer_space} 
                    onChange={(e) => updateAmenity('women_prayer_space', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-black">Women prayer space</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={formData.amenities.wheelchair_accessible} 
                    onChange={(e) => updateAmenity('wheelchair_accessible', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-black">Wheelchair accessible</span>
                </label>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contact_name" className="block text-sm font-medium text-black mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  id="contact_name"
                  name="contact_name"
                  value={formData.contact_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>

              <div>
                <label htmlFor="contact_email" className="block text-sm font-medium text-black mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  id="contact_email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact_phone" className="block text-sm font-medium text-black mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                id="contact_phone"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-black mb-1">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-black mb-1">
                  City
                </label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                  <option value="">Select a city...</option>
                  {bcCityOptions.map((city) => (
                    <option key={city.value} value={city.value}>
                      {city.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="province_state" className="block text-sm font-medium text-black mb-1">
                  Province
                </label>
                <input
                  type="text"
                  id="province_state"
                  name="province_state"
                  value={formData.province_state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-gray-50"
                  readOnly
                />
              </div>

              <div>
                <label htmlFor="postal_code" className="block text-sm font-medium text-black mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-black mb-1">
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            <div>
              <label htmlFor="prayer_times_url" className="block text-sm font-medium text-black mb-1">
                Prayer Times URL
              </label>
              <input
                type="url"
                id="prayer_times_url"
                name="prayer_times_url"
                value={formData.prayer_times_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

              <div>
                <label htmlFor="donate_link" className="block text-sm font-medium text-black mb-1">
                  Donate Link
                </label>
                <input
                  type="url"
                  id="donate_link"
                  name="donate_link"
                  value={formData.donate_link}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="https://"
                />
              </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="facebook" className="block text-sm font-medium text-black mb-1">
                  Facebook
                </label>
                <input
                  type="url"
                  id="facebook"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>

              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-black mb-1">
                  Instagram
                </label>
                <input
                  type="url"
                  id="instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>

              <div>
                <label htmlFor="twitter" className="block text-sm font-medium text-black mb-1">
                  Twitter
                </label>
                <input
                  type="url"
                  id="twitter"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>

          {/* Google Sheet Config Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Google Sheet Integration</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
              <p className="text-sm text-yellow-800">
                Generate a secure key for Google Sheets integration. This can only be done once per organization.
              </p>
            </div>
            
            <button
              type="button"
              onClick={handleCreateIngestionKey}
              disabled={creatingKey || keyCreated}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creatingKey ? 'Creating...' : (keyCreated ? 'Ingestion Key Created' : 'Get Google Sheet Config')}
            </button>

            {keyError && (
              <div className="mt-3 text-sm text-red-600">{keyError}</div>
            )}

            {oneTimeSecret && (
              <div className="mt-4 p-4 bg-gray-50 border rounded-md">
                <p className="text-sm text-gray-700 mb-2">
                  Copy this secret now — it will only be shown once:
                </p>
                <pre className="bg-white p-3 border rounded text-xs overflow-x-auto font-mono text-gray-900">
                  {oneTimeSecret}
                </pre>
                <button
                  onClick={handleCopySecret}
                  className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Copy & Hide
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}