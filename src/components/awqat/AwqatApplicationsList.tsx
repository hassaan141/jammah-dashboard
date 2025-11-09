'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import AwqatStatusDropdown from '@/app/awqat/applications/AwqatStatusDropdown'

export default function AwqatApplicationsList() {
  const [applications, setApplications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchApplications = async () => {
    try {
      const supabase = createClient()
      
      // Fetch pending applications
      const { data: pendingApps, error: pendingError } = await supabase
        .from('organization_applications')
        .select('*')
        .eq('organization_type', 'masjid')
        .eq('province_state', 'British Columbia')
        .order('created_at', { ascending: false })

      if (pendingError) {
        console.error('Error fetching pending applications:', pendingError)
        return
      }

      // Fetch approved organizations (BC masjids)
      const { data: approvedOrgs, error: approvedError } = await supabase
        .from('organizations')
        .select('*')
        .eq('type', 'masjid')
        .eq('province_state', 'British Columbia')
        .order('created_at', { ascending: false })

      if (approvedError) {
        console.error('Error fetching approved organizations:', approvedError)
        return
      }

      // Filter out applications that are already approved (to avoid duplicates)
      const filteredPendingApps = (pendingApps || []).filter(app => 
        app.application_status !== 'approved'
      )

      // Combine and mark which are approved vs pending
      const combinedData = [
        ...filteredPendingApps.map(app => ({ ...app, isApproved: false })),
        ...(approvedOrgs || []).map(org => ({ 
          ...org, 
          isApproved: true,
          // Map organization fields to application field names for consistency
          organization_name: org.name,
          organization_type: org.type,
          application_status: 'approved'
        }))
      ]

      // Sort by created_at descending
      combinedData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setApplications(combinedData)
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">BC Masjid Applications</h2>
        <p className="mt-2 text-gray-600">
          Review and approve BC masjid applications
        </p>
      </div>

      {applications.length > 0 ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Masjid Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application: any) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {application.organization_name}
                        </div>
                        {application.description && (
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {application.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">
                          {application.contact_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.contact_email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.contact_phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {application.city ? `${application.city}, ` : ''}BC
                      </div>
                      {application.address && (
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {application.address}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {application.isApproved ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Approved & Active
                        </span>
                      ) : (
                        <AwqatStatusDropdown 
                          applicationId={application.id}
                          currentStatus={application.application_status}
                          organizationData={application}
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(application.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {application.isApproved ? (
                        <a
                          href={`/awqat/edit/${application.id}`}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          Edit
                        </a>
                      ) : (
                        <span className="text-gray-400">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No BC masjid applications yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              BC masjid applications will appear here when submitted.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}