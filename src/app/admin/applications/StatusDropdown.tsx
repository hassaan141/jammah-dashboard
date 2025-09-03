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
      
      const { error } = await supabase
        .from('organization_applications')
        .update({ 
          application_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId)

      if (error) {
        console.error('Error updating application:', error)
        alert('Failed to update application status')
        return
      }

      if (newStatus === 'approved') {
        let lat = null
        let lng = null
        
        try {
          const addressString = [
            organizationData.address,
            organizationData.city,
            organizationData.province_state,
            organizationData.country
          ].filter(Boolean).join(', ')
                
          const apiKey = process.env.NEXT_PUBLIC_OPENROUTE_API
          if (apiKey && addressString) {
            const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(addressString)}`
            const response = await fetch(url)
            if (response.ok) {
              const data = await response.json()
              if (data?.features?.[0]?.geometry?.coordinates) {
                const [longitude, latitude] = data.features[0].geometry.coordinates
                lat = latitude
                lng = longitude
              }
            }
          }
        } catch (geoErr) {
        }

        const { error: orgError } = await supabase
          .from('organizations')
          .insert({
            name: organizationData.organization_name,
            type: organizationData.organization_type,
            address: organizationData.address,
            city: organizationData.city,
            country: organizationData.country,
            postal_code: organizationData.postal_code,
            province_state: organizationData.province_state,
            contact_name: organizationData.contact_name,
            contact_email: organizationData.contact_email,
            contact_phone: organizationData.contact_phone,
            website: organizationData.website,
            facebook: organizationData.facebook,
            instagram: organizationData.instagram,
            twitter: organizationData.twitter,
            is_active: true,
            approved_at: new Date().toISOString(),
            prayer_times_url: organizationData.prayer_times_url,
            latitude: lat,
            longitude: lng,
          })

        if (orgError) {
          console.error('Error creating organization:', orgError)
        }
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
