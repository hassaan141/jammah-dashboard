'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Masjid {
  id: string
  name: string
  display_name: string
  email: string | null
  website: string | null
  city: string | null
  province_state: string | null
  country: string | null
  bio: string | null
  type: string
}

export default function EditBCMasjids() {
  const [masjids, setMasjids] = useState<Masjid[]>([])
  const [filteredMasjids, setFilteredMasjids] = useState<Masjid[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<Masjid | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const supabase = createClient()

  const fetchBCMasjids = useCallback(async () => {
    try {
      // Filter for masjids in British Columbia
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('type', 'masjid')
        .ilike('province_state', '%British Columbia%') // Use ilike for case-insensitive partial match
        .order('name')

      if (error) throw error

      console.log('BC Masjids found:', data)
      
      setMasjids(data as Masjid[])
      setFilteredMasjids(data as Masjid[])
    } catch (error) {
      console.error('Error fetching BC masjids:', error)
      alert('Error loading BC masjids. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchBCMasjids()
  }, [fetchBCMasjids])

  // Filter masjids based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMasjids(masjids)
    } else {
      const filtered = masjids.filter(masjid =>
        masjid.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (masjid.city && masjid.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (masjid.email && masjid.email.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredMasjids(filtered)
    }
  }, [searchTerm, masjids])

  const handleEdit = (masjid: Masjid) => {
    setEditingId(masjid.id)
    setEditFormData({ ...masjid })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditFormData(null)
  }

  const handleSaveEdit = async () => {
    if (!editFormData) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          name: editFormData.name,
          display_name: editFormData.display_name,
          email: editFormData.email,
          website: editFormData.website,
          city: editFormData.city,
          province_state: editFormData.province_state,
          bio: editFormData.bio
        })
        .eq('id', editFormData.id)

      if (error) throw error

      // Update local state
      setMasjids(prev => prev.map(masjid => 
        masjid.id === editFormData.id ? editFormData : masjid
      ))

      setEditingId(null)
      setEditFormData(null)
      alert('Organization updated successfully!')
    } catch (error) {
      console.error('Error updating organization:', error)
      alert('Error updating organization. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editFormData) return
    
    const { name, value } = e.target
    setEditFormData(prev => prev ? { ...prev, [name]: value } : null)
  }

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center text-black">Loading BC masjids...</div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-black">Manage BC Masjids</h2>
      
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search BC masjids by name, city, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
      </div>

      {filteredMasjids.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          {masjids.length === 0 ? 'No BC masjids found.' : 'No BC masjids match your search.'}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMasjids.map((org) => (
            <div key={org.id} className="border border-gray-200 rounded-lg p-4">
              {editingId === org.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editFormData?.name || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Display Name</label>
                      <input
                        type="text"
                        name="display_name"
                        value={editFormData?.display_name || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editFormData?.email || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={editFormData?.city || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Province</label>
                      <input
                        type="text"
                        name="province_state"
                        value={editFormData?.province_state || 'British Columbia'}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Website</label>
                      <input
                        type="url"
                        name="website"
                        value={editFormData?.website || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-black mb-1">Description</label>
                      <textarea
                        name="bio"
                        value={editFormData?.bio || ''}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      disabled={isSaving}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-black">{org.name}</h3>
                      {org.display_name && org.display_name !== org.name && (
                        <p className="text-sm text-gray-600">Display: {org.display_name}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleEdit(org)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-black">
                    {org.email && (
                      <div>
                        <span className="font-medium">Email:</span> {org.email}
                      </div>
                    )}
                    {org.city && (
                      <div>
                        <span className="font-medium">City:</span> {org.city}
                      </div>
                    )}
                    {org.province_state && (
                      <div>
                        <span className="font-medium">Province:</span> {org.province_state}
                      </div>
                    )}
                    {org.type && (
                      <div>
                        <span className="font-medium">Type:</span> {org.type}
                      </div>
                    )}
                    {org.website && (
                      <div>
                        <span className="font-medium">Website:</span>{' '}
                        <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {org.website}
                        </a>
                      </div>
                    )}
                    {org.bio && (
                      <div className="md:col-span-2">
                        <span className="font-medium">Description:</span> {org.bio}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}