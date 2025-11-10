'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import DeleteConfirmationModal from '@/components/shared/DeleteConfirmationModal'

interface Masjid {
  id: string
  name: string
  description?: string
  address?: string
  city?: string
  province_state?: string
  country?: string
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  website?: string
  prayer_times_url?: string
  is_active?: boolean
}

export default function EditBCMasjids() {
  const [masjids, setMasjids] = useState<Masjid[]>([])
  const [filteredMasjids, setFilteredMasjids] = useState<Masjid[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    masjid: Masjid | null
  }>({ isOpen: false, masjid: null })
  
  // Loading states for toggles
  const [toggleLoading, setToggleLoading] = useState<Set<string>>(new Set())

  const supabase = createClient()

  const fetchBCMasjids = useCallback(async () => {
    try {
      // Filter for masjids in British Columbia
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('type', 'masjid')
        .ilike('province_state', '%British Columbia%')
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
        (masjid.contact_email && masjid.contact_email.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredMasjids(filtered)
    }
  }, [searchTerm, masjids])

  // Handle delete masjid
  const handleDelete = async (masjidId: string) => {
    try {
      const { error } = await supabase
        .from('organizations')
        .delete()
        .eq('id', masjidId)

      if (error) throw error

      // Update local state
      const updatedMasjids = masjids.filter(m => m.id !== masjidId)
      setMasjids(updatedMasjids)
      setFilteredMasjids(updatedMasjids.filter(masjid =>
        masjid.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (masjid.city && masjid.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (masjid.contact_email && masjid.contact_email.toLowerCase().includes(searchTerm.toLowerCase()))
      ))

      // Close modal
      setDeleteModal({ isOpen: false, masjid: null })
      
      alert('Masjid deleted successfully!')
    } catch (error) {
      console.error('Error deleting masjid:', error)
      alert('Error deleting masjid. Please try again.')
    }
  }

  // Handle toggle active status
  const handleToggleActive = async (masjid: Masjid) => {
    setToggleLoading(prev => new Set(prev).add(masjid.id))
    
    try {
      const newActiveStatus = !masjid.is_active
      
      const { error } = await supabase
        .from('organizations')
        .update({ is_active: newActiveStatus })
        .eq('id', masjid.id)

      if (error) throw error

      // Update local state
      const updatedMasjids = masjids.map(m =>
        m.id === masjid.id ? { ...m, is_active: newActiveStatus } : m
      )
      setMasjids(updatedMasjids)
      setFilteredMasjids(updatedMasjids.filter(masjid =>
        masjid.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (masjid.city && masjid.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (masjid.contact_email && masjid.contact_email.toLowerCase().includes(searchTerm.toLowerCase()))
      ))

    } catch (error) {
      console.error('Error toggling masjid status:', error)
      alert('Error updating masjid status. Please try again.')
    } finally {
      setToggleLoading(prev => {
        const newSet = new Set(prev)
        newSet.delete(masjid.id)
        return newSet
      })
    }
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
          {filteredMasjids.map((masjid) => (
            <div key={masjid.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-black">{masjid.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      masjid.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {masjid.is_active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {masjid.description && (
                    <p className="text-sm text-gray-600 mt-1">{masjid.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {/* Toggle Active/Inactive */}
                  <button
                    onClick={() => handleToggleActive(masjid)}
                    disabled={toggleLoading.has(masjid.id)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      masjid.is_active !== false
                        ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    } ${toggleLoading.has(masjid.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {toggleLoading.has(masjid.id) ? '...' : (masjid.is_active !== false ? 'Disable' : 'Enable')}
                  </button>
                  
                  {/* Edit Button */}
                  <Link
                    href={`/awqat/edit/${masjid.id}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
                  >
                    Edit
                  </Link>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, masjid })}
                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-black">
                {masjid.contact_email && (
                  <div>
                    <span className="font-medium">Contact Email:</span> {masjid.contact_email}
                  </div>
                )}
                {masjid.contact_phone && (
                  <div>
                    <span className="font-medium">Contact Phone:</span> {masjid.contact_phone}
                  </div>
                )}
                {masjid.city && (
                  <div>
                    <span className="font-medium">City:</span> {masjid.city}
                  </div>
                )}
                {masjid.province_state && (
                  <div>
                    <span className="font-medium">Province:</span> {masjid.province_state}
                  </div>
                )}
                {masjid.address && (
                  <div className="md:col-span-2">
                    <span className="font-medium">Address:</span> {masjid.address}
                  </div>
                )}
                {masjid.website && (
                  <div>
                    <span className="font-medium">Website:</span>{' '}
                    <a href={masjid.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {masjid.website}
                    </a>
                  </div>
                )}
                {masjid.prayer_times_url && (
                  <div>
                    <span className="font-medium">Prayer Times:</span>{' '}
                    <a href={masjid.prayer_times_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View Prayer Times
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, masjid: null })}
        onConfirm={() => deleteModal.masjid && handleDelete(deleteModal.masjid.id)}
        itemName={deleteModal.masjid?.name || ''}
        itemType="masjid"
      />
    </div>
  )
}