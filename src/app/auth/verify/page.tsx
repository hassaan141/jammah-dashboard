'use client'

import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function VerifyPageContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleEmailVerification = async () => {
      const supabase = createClient()
      
      try {
        // Check if this is an email confirmation callback
        const token_hash = searchParams.get('token_hash')
        const type = searchParams.get('type')
        
        if (token_hash && type) {
          // Handle the email verification
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
          })
          
          if (error) {
            console.error('Email verification error:', error)
            setStatus('error')
            setMessage('Email verification failed. The link may have expired or already been used.')
          } else {
            setStatus('success')
            setMessage('Email verified successfully! You can now sign in to your account.')
          }
        } else {
          // No verification parameters, just check if user is already verified
          const { data: { user } } = await supabase.auth.getUser()
          
          if (user?.email_confirmed_at) {
            setStatus('success')
            setMessage('Your email is already verified! You can sign in to your account.')
          } else {
            setStatus('error')
            setMessage('No verification link detected. Please check your email for the verification link.')
          }
        }
      } catch (error: any) {
        console.error('Verification error:', error)
        setStatus('error')
        setMessage('An unexpected error occurred during verification.')
      }
    }

    handleEmailVerification()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-6">
              {status === 'loading' && (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              )}
              {status === 'success' && (
                <div className="bg-green-100 rounded-full p-2">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              {status === 'error' && (
                <div className="bg-red-100 rounded-full p-2">
                  <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {status === 'loading' && 'Verifying Email...'}
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Failed'}
            </h2>

            <p className="text-gray-600 mb-6">
              {message}
            </p>

            <div className="space-y-4">
              {status === 'success' && (
                <Link
                  href="/signin"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
                >
                  Sign In to Your Account
                </Link>
              )}

              {status === 'error' && (
                <div className="space-y-2">
                  <Link
                    href="/apply"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
                  >
                    Apply Again
                  </Link>
                  <Link
                    href="/signin"
                    className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
                  >
                    Try to Sign In
                  </Link>
                </div>
              )}

              <Link
                href="/"
                className="w-full flex justify-center py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
              <p className="text-gray-600 mb-6">Please wait while we verify your email.</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <VerifyPageContent />
    </Suspense>
  )
}
