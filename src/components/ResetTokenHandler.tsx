'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ResetTokenHandler() {
  const router = useRouter()

  useEffect(() => {
    // Check if there are password reset tokens in the URL hash
    const hash = window.location.hash.substring(1)
    const hashParams = new URLSearchParams(hash)
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')
    const type = hashParams.get('type')
    
    // If we have reset tokens, redirect to admin reset page
    if (accessToken && refreshToken && type === 'recovery') {
      const newUrl = `/admin-reset${window.location.hash}`
      router.replace(newUrl)
    }
  }, [router])

  return null // This component doesn't render anything
}