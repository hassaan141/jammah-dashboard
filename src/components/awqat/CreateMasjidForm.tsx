'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface CreateMasjidFormProps {
  onSuccess?: () => void
}

export default function CreateMasjidForm({ onSuccess }: CreateMasjidFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    email: '',
    website: '',
    city: '',
    bio: ''
  })

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create the organization with masjid type and BC location
      const { data, error } = await supabase
        .from('organizations')
        .insert({
          name: formData.name,
          display_name: formData.display_name || formData.name,
          email: formData.email,
          website: formData.website || null,
          bio: formData.bio || null,
          city: formData.city,
          province_state: 'British Columbia',
          country: 'Canada',
          type: 'masjid',
          verified: true // Auto-approve masjids created by Awqat admin
        })
        .select()
        .single()

      if (error) throw error

      // Reset form
      setFormData({
        name: '',
        display_name: '',
        email: '',
        website: '',
        city: '',
        bio: ''
      })

      alert('Masjid created successfully!')
      onSuccess?.()
    } catch (error) {
      console.error('Error creating masjid:', error)
      alert('Error creating masjid. Please try again.')
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
            placeholder="Enter masjid name"
          />
        </div>

        <div>
          <label htmlFor="display_name" className="block text-sm font-medium text-black mb-1">
            Display Name
          </label>
          <input
            type="text"
            id="display_name"
            name="display_name"
            value={formData.display_name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Public display name (optional, defaults to name)"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="contact@masjid.com"
          />
        </div>



        <div>
          <label htmlFor="city" className="block text-sm font-medium text-black mb-1">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Vancouver"
          />
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
            placeholder="https://masjid.com"
          />
        </div>



        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-black mb-1">
            Description
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Brief description of the masjid (optional)"
          />
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