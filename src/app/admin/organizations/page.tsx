'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import SearchBar from '@/components/forms/SearchBar'
import DeleteConfirmationModal from '@/components/shared/DeleteConfirmationModal'

interface Organization {
  id: string
  name: string
  address?: string
  city?: string
  province_state?: string
  country?: string
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  website?: string
  is_active?: boolean
  created_at?: string
}

export default function AdminOrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    organization: Organization | null
  }>({ isOpen: false, organization: null })
  
  // Loading states for toggles
  const [toggleLoading, setToggleLoading] = useState<Set<string>>(new Set())

  // Filter organizations based on search query
  const filteredOrganizations = useMemo(() => {
    if (!searchQuery.trim()) return organizations

    const query = searchQuery.toLowerCase()
    return organizations.filter(org => 
      org.name?.toLowerCase().includes(query) ||
      org.contact_name?.toLowerCase().includes(query) ||
      org.contact_email?.toLowerCase().includes(query) ||
      org.city?.toLowerCase().includes(query) ||
      org.province_state?.toLowerCase().includes(query) ||
      org.country?.toLowerCase().includes(query) ||
      org.address?.toLowerCase().includes(query)
    )
  }, [organizations, searchQuery])

  useEffect(() => {
    async function loadOrganizations() {
      const supabase = createClient()
      
      try {
        // Optimize: Only select necessary fields and limit initial load
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('id, name, address, city, province_state, country, contact_name, contact_email, contact_phone, website, is_active, created_at')
          .order('created_at', { ascending: false })
          .limit(100) // Limit to 100 organizations for better performance

        if (orgError || !orgData || orgData.length === 0) {
          console.log('No organizations table data, trying applications table:', orgError)
          
          // Fall back to applications table with optimized query
          const { data: appData, error: appError } = await supabase
            .from('applications')
            .select('id, organization_name, address, city, province_state, country, contact_name, contact_email, contact_phone, website, created_at')
            .eq('application_status', 'approved')
            .order('created_at', { ascending: false })
            .limit(100)

        if (appError) {
          console.error('Error loading from applications:', appError)
          setError('Failed to load organizations')
        } else {
          // Map applications data to organization format
          const mappedData = (appData || []).map(app => ({
            id: app.id,
            name: app.organization_name,
            address: app.address,
            city: app.city,
            province_state: app.province_state,
            country: app.country,
            contact_name: app.contact_name,
            contact_email: app.contact_email,
            contact_phone: app.contact_phone,
            website: app.website,
            created_at: app.created_at
          }))
            setOrganizations(mappedData)
          }
        } else {
          setOrganizations(orgData)
        }
      } catch (err) {
        console.error('Error loading organizations:', err)
        setError('Failed to load organizations')
      } finally {
        setLoading(false)
      }
    }

    loadOrganizations()
  }, [])

  // Handle delete organization
  const handleDelete = async (organizationId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('organizations')
        .delete()
        .eq('id', organizationId)

      if (error) throw error

      // Update local state
      const updatedOrganizations = organizations.filter(org => org.id !== organizationId)
      setOrganizations(updatedOrganizations)

      // Close modal
      setDeleteModal({ isOpen: false, organization: null })
      
      alert('Organization deleted successfully!')
    } catch (error) {
      console.error('Error deleting organization:', error)
      alert('Error deleting organization. Please try again.')
    }
  }

  // Handle toggle active status
  const handleToggleActive = async (organization: Organization) => {
    setToggleLoading(prev => new Set(prev).add(organization.id))
    
    try {
      const supabase = createClient()
      const newActiveStatus = !organization.is_active
      
      const { error } = await supabase
        .from('organizations')
        .update({ is_active: newActiveStatus })
        .eq('id', organization.id)

      if (error) throw error

      // Update local state
      const updatedOrganizations = organizations.map(org =>
        org.id === organization.id ? { ...org, is_active: newActiveStatus } : org
      )
      setOrganizations(updatedOrganizations)

    } catch (error) {
      console.error('Error toggling organization status:', error)
      alert('Error updating organization status. Please try again.')
    } finally {
      setToggleLoading(prev => {
        const newSet = new Set(prev)
        newSet.delete(organization.id)
        return newSet
      })
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            <div className="text-red-600 font-medium">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
              <p className="mt-2 text-gray-600">
                Manage and edit all verified organizations
              </p>
            </div>
            {organizations.length > 0 && (
              <div className="text-right">
                <p className="text-2xl font-semibold text-gray-900">{organizations.length}</p>
                <p className="text-sm text-gray-600">Total Organizations</p>
              </div>
            )}
          </div>
        </div>

        {organizations.length > 0 && (
          <div className="mb-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search organizations by name, contact, location..."
              className="max-w-md"
            />
            {searchQuery && (
              <p className="mt-2 text-sm text-gray-600">
                {filteredOrganizations.length} of {organizations.length} organizations match "{searchQuery}"
              </p>
            )}
          </div>
        )}

        {organizations.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2M5 21h2m0 0h2m-4 0v-5a2 2 0 012-2h2a2 2 0 012 2v5" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No Organizations</h3>
            <p className="mt-1 text-gray-500">
              No organizations have been approved yet.
            </p>
          </div>
        ) : filteredOrganizations.length === 0 && searchQuery ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No results found</h3>
            <p className="mt-1 text-gray-500">
              No organizations match your search for "{searchQuery}".
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredOrganizations.map((org) => (
              <div key={org.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {org.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          org.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {org.is_active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            {org.contact_name && <div>👤 {org.contact_name}</div>}
                            {org.contact_email && <div>📧 {org.contact_email}</div>}
                            {org.contact_phone && <div>📞 {org.contact_phone}</div>}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Location</h4>
                          <div className="text-sm text-gray-600">
                            {org.address && <div>{org.address}</div>}
                            <div>
                              {[org.city, org.province_state, org.country].filter(Boolean).join(', ')}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {org.website && (
                          <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                            🌐 Website
                          </a>
                        )}
                        {org.created_at && (
                          <span>📅 Added {new Date(org.created_at).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>

                    <div className="ml-6 flex-shrink-0 flex items-center gap-2">
                      {/* Toggle Active/Inactive */}
                      <button
                        onClick={() => handleToggleActive(org)}
                        disabled={toggleLoading.has(org.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          org.is_active !== false
                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        } ${toggleLoading.has(org.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {toggleLoading.has(org.id) ? '...' : (org.is_active !== false ? 'Disable' : 'Enable')}
                      </button>
                      
                      {/* Edit Button */}
                      <Link
                        href={`/admin/edit/${org.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        Edit
                      </Link>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, organization: org })}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, organization: null })}
          onConfirm={() => deleteModal.organization && handleDelete(deleteModal.organization.id)}
          itemName={deleteModal.organization?.name || ''}
          itemType="organization"
        />
      </div>
    </div>
  )
}