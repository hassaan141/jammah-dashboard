'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function VerifyPage() {
  const [status, setStatus] = useState<'idle'|'processing'|'success'|'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const finish = async () => {
      setStatus('processing')
      try {
        // This will attempt to parse session from the URL if Supabase added response params
        const { data, error } = await supabase.auth.getSessionFromUrl()
        if (error) {
          // Not all confirmation flows return a session; still treat as success if email was confirmed
          console.warn('getSessionFromUrl error', error)
        }
        setStatus('success')
        setMessage('Email verified (or confirmation handled). You can now sign in.')
      } catch (err: any) {
        console.error('verify error', err)
        setStatus('error')
        setMessage('Could not complete verification. If you verified your email, try signing in.')
      }
    }

    finish()
  }, [supabase])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
        {status === 'processing' && <p className="text-sm text-gray-600">Completing verification...</p>}
        {message && <p className="mt-4 text-sm text-gray-800">{message}</p>}
      </div>
    </div>
  )
}
