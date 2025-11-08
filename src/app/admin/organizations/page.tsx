'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

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
  created_at?: string
}

export default function AdminOrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadOrganizations() {
      const supabase = createClient()
      
      // Try to get from organizations table first
      let { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false })

      if (orgError || !orgData || orgData.length === 0) {
        console.log('No organizations table data, trying applications table:', orgError)
        
        // Fall back to applications table if organizations table is empty or doesn't exist
        const { data: appData, error: appError } = await supabase
          .from('applications')
          .select('*')
          .eq('application_status', 'approved')
          .order('created_at', { ascending: false })

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
      setLoading(false)
    }

    loadOrganizations()
  }, [])

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
          <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
          <p className="mt-2 text-gray-600">
            Manage and edit all verified organizations
          </p>
        </div>

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
        ) : (
          <div className="grid gap-6">
            {organizations.map((org) => (
              <div key={org.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {org.name}
                      </h3>
                      
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

                    <div className="ml-6 flex-shrink-0">
                      <Link
                        href={`/admin/edit/${org.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        Edit Organization
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}