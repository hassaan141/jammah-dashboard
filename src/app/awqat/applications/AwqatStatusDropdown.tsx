'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AwqatStatusDropdownProps {
  applicationId: string
  currentStatus: string
  organizationData: any
}

export default function AwqatStatusDropdown({ applicationId, currentStatus, organizationData }: AwqatStatusDropdownProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleStatusChange = async (newStatus: string) => {
    console.log('Awqat status change:', currentStatus, '->', newStatus)
    
    setIsLoading(true)
    
    try {
      const supabase = createClient()
      
      // For approval, create organization record and update application status
      if (newStatus === 'approved') {
        try {
          // First, geocode the address to get coordinates
          let latitude = null
          let longitude = null
          
          if (organizationData.address && organizationData.city && organizationData.province_state) {
            const fullAddress = `${organizationData.address}, ${organizationData.city}, ${organizationData.province_state}, ${organizationData.country || 'Canada'}`
            
            try {
              const geocodeResponse = await fetch('/api/geocode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: fullAddress })
              })
              
              if (geocodeResponse.ok) {
                const geocodeData = await geocodeResponse.json()
                if (geocodeData.lat && geocodeData.lng) {
                  latitude = geocodeData.lat
                  longitude = geocodeData.lng
                }
              }
            } catch (geocodeError) {
              console.warn('Geocoding failed, creating organization without location:', geocodeError)
            }
          }

          // Create the organization record with calculated coordinates
          const { error: orgError } = await supabase
            .from('organizations')
            .insert({
              name: organizationData.organization_name,
              type: organizationData.organization_type,
              description: organizationData.description || null,
              contact_name: organizationData.contact_name,
              contact_email: organizationData.contact_email,
              contact_phone: organizationData.contact_phone,
              address: organizationData.address,
              city: organizationData.city,
              province_state: organizationData.province_state,
              country: organizationData.country,
              postal_code: organizationData.postal_code,
              website: organizationData.website || null,
              donate_link: organizationData.donate_link || null,
              amenities: organizationData.amenities || null,
              facebook: organizationData.facebook || null,
              instagram: organizationData.instagram || null,
              twitter: organizationData.twitter || null,
              prayer_times_url: organizationData.prayer_times_url || null,
              latitude: latitude,
              longitude: longitude
            })

          if (orgError) {
            console.error('Error creating organization:', orgError)
            alert('Failed to create organization: ' + orgError.message)
            return
          }

          // Then update the application status
          const { error: appError } = await supabase
            .from('organization_applications')
            .update({ 
              application_status: 'approved',
              updated_at: new Date().toISOString()
            })
            .eq('id', applicationId)

          if (appError) {
            console.error('Error updating application status:', appError)
            alert('Organization created but failed to update application status')
            return
          }
          
          alert('Application approved successfully! Organization has been created.')
        } catch (err) {
          console.error('Error in approval process:', err)
          alert('Failed to approve application')
          return
        }
      } else {
        // For other status changes, just update the application status
        const { error } = await supabase
          .from('organization_applications')
          .update({ 
            application_status: newStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', applicationId)

        if (error) {
          console.error('Error updating status:', error)
          alert('Failed to update status: ' + error.message)
          return
        }
      }

      // Refresh the parent component to show updated data
      window.location.reload()
      
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