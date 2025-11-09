'use client'

import { useState } from 'react'
import CreateMasjidForm from '@/components/awqat/CreateMasjidForm'
import EditBCMasjids from '@/components/awqat/EditBCMasjids'
import AwqatApplicationsList from '@/components/awqat/AwqatApplicationsList'

export default function AwqatPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'edit' | 'applications'>('edit')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleMasjidCreated = () => {
    // Refresh the edit component when a new masjid is created
    setRefreshKey(prev => prev + 1)
    setActiveTab('edit') // Switch to edit tab to see the new masjid
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Awqat Admin Portal
          </h1>
          <p className="text-xl text-gray-600">
            BC Masjid Management System
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('edit')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'edit'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Manage BC Masjids
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'applications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Applications
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'create'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Create New Masjid
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'create' ? (
            <CreateMasjidForm onSuccess={handleMasjidCreated} />
          ) : activeTab === 'applications' ? (
            <AwqatApplicationsList />
          ) : (
            <EditBCMasjids key={refreshKey} />
          )}
        </div>
      </div>
    </div>
  )
}