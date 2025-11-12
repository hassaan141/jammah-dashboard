// 'use client'

// import { useState } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import { useRouter } from 'next/navigation'

// interface StatusDropdownProps {
//   applicationId: string
//   currentStatus: string
//   organizationData: any
// }

// export default function StatusDropdown({ applicationId, currentStatus, organizationData }: StatusDropdownProps) {
//   const [isLoading, setIsLoading] = useState(false)
//   const router = useRouter()

//   const handleStatusChange = async (newStatus: string) => {
//     console.log('Status change:', currentStatus, '->', newStatus)
    
//     setIsLoading(true)
    
//     try {
//       const supabase = createClient()
      
//       // For privileged updates (marking approved and promoting profile to org)
//       // call the server-side API which uses the service role key. This keeps
//       // service credentials out of the browser and runs the approval logic
//       // atomically on the server.
//       try {
//         // Get current session token to authenticate the admin call
//         const { data: sessionData } = await supabase.auth.getSession()
//         const token = (sessionData as any)?.session?.access_token

//         const resp = await fetch('/api/approve-application', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             ...(token ? { Authorization: `Bearer ${token}` } : {})
//           },
//           body: JSON.stringify({ applicationId })
//         })

//         const result = await resp.json()
//         if (!resp.ok || !result.success) {
//           console.error('Approval API error:', result)
//           alert('Failed to approve application')
//           return
//         }
//       } catch (err) {
//         console.error('Error calling approval API:', err)
//         alert('Failed to approve application')
//         return
//       }

//       router.refresh()
      
//     } catch (error) {
//       console.error('Unexpected error:', error)
//       alert('An unexpected error occurred')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'submitted':
//         return 'border-yellow-300 text-yellow-800'
//       case 'in_review':
//         return 'border-blue-300 text-blue-800'
//       case 'approved':
//         return 'border-green-300 text-green-800'
//       case 'rejected':
//         return 'border-red-300 text-red-800'
//       default:
//         return 'border-gray-300 text-gray-800'
//     }
//   }

//   return (
//     <select
//       value={currentStatus}
//       onChange={(e) => handleStatusChange(e.target.value)}
//       disabled={isLoading}
//       className={`text-sm rounded border px-2 py-1 ${getStatusColor(currentStatus)} ${
//         isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'
//       }`}
//     >
//       <option value="submitted">Submitted</option>
//       <option value="in_review">In Review</option>
//       <option value="approved">Approved</option>
//       <option value="rejected">Rejected</option>
//     </select>
//   )
// }

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
    if (newStatus === currentStatus) return
    
    setIsLoading(true)
    
    try {
      const supabase = createClient()
      
      if (newStatus === 'approved') {
        // 1. Geocode the address to get latitude and longitude
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

        // 2. Create organization from application data
        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .insert({
            name: organizationData.organization_name,
            type: organizationData.organization_type,
            address: organizationData.address,
            city: organizationData.city,
            province_state: organizationData.province_state,
            country: organizationData.country,
            postal_code: organizationData.postal_code,
            contact_name: organizationData.contact_name,
            contact_phone: organizationData.contact_phone,
            contact_email: organizationData.contact_email,
            website: organizationData.website,
            facebook: organizationData.facebook,
            instagram: organizationData.instagram,
            twitter: organizationData.twitter,
            prayer_times_url: organizationData.prayer_times_url,
            donate_link: organizationData.donate_link,
            description: organizationData.description,
            amenities: organizationData.amenities || null,
            is_active: true,
            approved_at: new Date().toISOString(),
            latitude: latitude,
            longitude: longitude
          })
          .select()
          .single()

        if (orgError) throw orgError

        // 3. Update application status
        const { error: appError } = await supabase
          .from('organization_applications')
          .update({ 
            application_status: 'approved',
            updated_at: new Date().toISOString()
          })
          .eq('id', applicationId)

        if (appError) throw appError

        // 4. Update user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            is_org: true, 
            org_id: org.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', organizationData.user_id)

        if (profileError) throw profileError

      } else {
        // For other status changes
        const { error } = await supabase
          .from('organization_applications')
          .update({ 
            application_status: newStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', applicationId)

        if (error) throw error
      }

      router.refresh()
      
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
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
