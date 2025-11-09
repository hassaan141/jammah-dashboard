'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Country, State, City } from 'country-state-city'
import { useMemo } from 'react'

interface Masjid {
  id: string
  name: string
  description?: string
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

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
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
          .ilike('province_state', '%British Columbia%')
          .single()

        if (error) throw error

        if (!data) {
          setError('Masjid not found or not accessible.')
          setLoading(false)
          return
        }

        setMasjid(data)
        setFormData({
          name: data.name || '',
          description: data.description || '',
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
          prayer_times_url: data.prayer_times_url || ''
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          name: formData.name,
          description: formData.description || null,
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
          updated_at: new Date().toISOString()
        })
        .eq('id', masjidId)
        .eq('type', 'masjid')
        .ilike('province_state', '%British Columbia%')

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
        </div>
      </div>
    </div>
  )
}