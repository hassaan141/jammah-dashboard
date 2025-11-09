import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import AwqatStatusDropdown from './AwqatStatusDropdown'

export default async function AwqatApplicationsPage() {
  const supabase = await createClient()

  // Get BC masjid applications only
  const { data: applications } = await supabase
    .from('organization_applications')
    .select('*')
    .eq('organization_type', 'masjid')
    .eq('province_state', 'British Columbia')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">BC Masjid Applications</h1>
          <p className="mt-2 text-gray-600">
            Review and approve BC masjid applications
          </p>
        </div>

        {applications && applications.length > 0 ? (
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
                            <div className="text-sm text-gray-500">
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
                          <div className="text-sm text-gray-500">
                            {application.address}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <AwqatStatusDropdown 
                          applicationId={application.id}
                          currentStatus={application.application_status}
                          organizationData={application}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(application.created_at).toLocaleDateString()}
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
    </div>
  )
}