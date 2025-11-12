'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Country, State, City } from 'country-state-city'

interface CreateMasjidFormProps {
  onSuccess?: () => void
}

export default function CreateMasjidForm({ onSuccess }: CreateMasjidFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    organizationName: '',
    description: '',
    amenities: {
      street_parking: false,
      women_washroom: false,
      on_site_parking: false,
      women_prayer_space: false,
      wheelchair_accessible: false,
    },
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    city: '',
    provinceState: 'British Columbia',
    country: 'Canada',
    postalCode: '',
    website: '',
    donateLink: '',
    facebook: '',
    instagram: '',
    twitter: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create application entry first (same as normal flow)
      const { data, error } = await supabase
        .from('organization_applications')
        .insert({
          organization_name: formData.organizationName,
          organization_type: 'masjid',
          description: formData.description || null,
          amenities: formData.amenities || null,
          contact_name: formData.contactName,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone,
          address: formData.address,
          city: formData.city,
          province_state: formData.provinceState,
          country: formData.country,
          postal_code: formData.postalCode,
          website: formData.website || null,
          donate_link: formData.donateLink || null,
          facebook: formData.facebook || null,
          instagram: formData.instagram || null,
          twitter: formData.twitter || null,
          prayer_times_url: null,
          application_status: 'submitted',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Reset form
      setFormData({
        organizationName: '',
        description: '',
        amenities: {
          street_parking: false,
          women_washroom: false,
          on_site_parking: false,
          women_prayer_space: false,
          wheelchair_accessible: false,
        },
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
        city: '',
        provinceState: 'British Columbia',
        country: 'Canada',
        postalCode: '',
        website: '',
        donateLink: '',
        facebook: '',
        instagram: '',
        twitter: '',
      })

      alert('Masjid application submitted successfully! It will appear in the Awqat applications list for approval.')
      onSuccess?.()
    } catch (error) {
      console.error('Error submitting masjid application:', error)
      alert('Error submitting masjid application. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-black">Create New Masjid in BC</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="organizationName" className="block text-sm font-medium text-black mb-1">
            Masjid Name *
          </label>
          <input
            type="text"
            id="organizationName"
            name="organizationName"
            value={formData.organizationName}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="e.g., Al-Noor Islamic Center"
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
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Brief description of the masjid..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-black mb-1">
              Contact Name *
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Full name"
            />
          </div>

          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-black mb-1">
              Contact Email *
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="email@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="contactPhone" className="block text-sm font-medium text-black mb-1">
            Contact Phone *
          </label>
          <input
            type="tel"
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="(555) 555-5555"
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
            placeholder="123 Sesame Street"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-black mb-1">
              City
            </label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
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
            <label htmlFor="postalCode" className="block text-sm font-medium text-black mb-1">
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="V6B 1A1"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="provinceState" className="block text-sm font-medium text-black mb-1">
              Province/State
            </label>
            <input
              type="text"
              id="provinceState"
              name="provinceState"
              value={formData.provinceState}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-gray-50"
              readOnly
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-black mb-1">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-gray-50"
              readOnly
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
            placeholder="https://yourmasjid.com"
          />
        </div>

        <div>
          <label htmlFor="donateLink" className="block text-sm font-medium text-black mb-1">
            Donation Link
          </label>
          <input
            type="url"
            id="donateLink"
            name="donateLink"
            value={formData.donateLink}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="https://donations.yourmasjid.com"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
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
              placeholder="https://facebook.com/yourpage"
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
              placeholder="https://instagram.com/yourprofile"
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
              placeholder="https://twitter.com/yourprofile"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Amenities (optional)</label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={formData.amenities.street_parking} onChange={() => setFormData(prev => ({ ...prev, amenities: { ...prev.amenities, street_parking: !prev.amenities.street_parking } }))} />
              <span className="text-sm text-black">Street parking</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={formData.amenities.women_washroom} onChange={() => setFormData(prev => ({ ...prev, amenities: { ...prev.amenities, women_washroom: !prev.amenities.women_washroom } }))} />
              <span className="text-sm text-black">Women washroom</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={formData.amenities.on_site_parking} onChange={() => setFormData(prev => ({ ...prev, amenities: { ...prev.amenities, on_site_parking: !prev.amenities.on_site_parking } }))} />
              <span className="text-sm text-black">On-site parking</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={formData.amenities.women_prayer_space} onChange={() => setFormData(prev => ({ ...prev, amenities: { ...prev.amenities, women_prayer_space: !prev.amenities.women_prayer_space } }))} />
              <span className="text-sm text-black">Women prayer space</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={formData.amenities.wheelchair_accessible} onChange={() => setFormData(prev => ({ ...prev, amenities: { ...prev.amenities, wheelchair_accessible: !prev.amenities.wheelchair_accessible } }))} />
              <span className="text-sm text-black">Wheelchair accessible</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating Masjid...' : 'Create Masjid'}
        </button>
      </form>
    </div>
  )
}