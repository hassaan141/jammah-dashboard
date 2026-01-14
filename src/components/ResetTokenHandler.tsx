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
    const type = hashParams.get('type')
    
    // If we have reset tokens, redirect to reset password page
    if (accessToken && type === 'recovery') {
      router.replace('/reset-password')
    }
  }, [router])

  return null // This component doesn't render anything
}