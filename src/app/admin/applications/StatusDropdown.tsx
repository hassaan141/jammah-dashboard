'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface StatusDropdownProps {
  applicationId: string
  currentStatus: string
  organizationData: any
}

export default function StatusDropdown({ applicationId, currentStatus, organizationData }: StatusDropdownProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleStatusChange = async (newStatus: string) => {
    console.log('Status change:', currentStatus, '->', newStatus)
    
    setIsLoading(true)
    
    try {
      const supabase = createClient()
      
      // For privileged updates (marking approved and promoting profile to org)
      // call the server-side API which uses the service role key. This keeps
      // service credentials out of the browser and runs the approval logic
      // atomically on the server.
      try {
        // Get current session token to authenticate the admin call
        const { data: sessionData } = await supabase.auth.getSession()
        const token = (sessionData as any)?.session?.access_token

        const resp = await fetch('/api/approve-application', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ applicationId })
        })

        const result = await resp.json()
        if (!resp.ok || !result.success) {
          console.error('Approval API error:', result)
          alert('Failed to approve application')
          return
        }
      } catch (err) {
        console.error('Error calling approval API:', err)
        alert('Failed to approve application')
        return
      }

      router.refresh()
      
    } catch (error) {
      console.error('Unexpected error:', error)
      alert('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'border-yellow-300 text-yellow-800'
      case 'in_review':
        return 'border-blue-300 text-blue-800'
      case 'approved':
        return 'border-green-300 text-green-800'
      case 'rejected':
        return 'border-red-300 text-red-800'
      default:
        return 'border-gray-300 text-gray-800'
    }
  }

  return (
    <select
      value={currentStatus}
      onChange={(e) => handleStatusChange(e.target.value)}
      disabled={isLoading}
      className={`text-sm rounded border px-2 py-1 ${getStatusColor(currentStatus)} ${
        isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'
      }`}
    >
      <option value="submitted">Submitted</option>
      <option value="in_review">In Review</option>
      <option value="approved">Approved</option>
      <option value="rejected">Rejected</option>
    </select>
  )
}
