'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [hasValidSession, setHasValidSession] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const validateResetSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setHasValidSession(true)
      } else {
        // Extract tokens from URL hash
        const urlHash = window.location.hash.substring(1)
        const hashParams = new URLSearchParams(urlHash)
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        
        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })
          
          if (data.session && !error) {
            setHasValidSession(true)
            window.history.replaceState({}, document.title, window.location.pathname)
          } else {
            setErrorMsg('Reset link has expired or is invalid')
          }
        } else {
          setErrorMsg('No reset session detected')
        }
      }
    }
    
    validateResetSession()
  }, [supabase.auth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!newPassword || !confirmPassword) {
      setErrorMsg('Both password fields are required')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Password confirmation does not match')
      return
    }

    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      })

      if (error) {
        setErrorMsg(error.message)
        return
      }

      alert('Password successfully updated!')
      router.push('/admin')
      
    } catch (err) {
      console.error('Password update failed:', err)
      setErrorMsg('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!hasValidSession && !errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    )
  }

  if (errorMsg && !hasValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Reset</h2>
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <p className="text-red-700">{errorMsg}</p>
            </div>
            <button
              onClick={() => router.push('/signin')}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Set New Password
          </h2>
          <p className="mt-2 text-gray-600">
            Choose a strong password for your admin account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <p className="text-red-700 text-sm">{errorMsg}</p>
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter new password"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Confirm new password"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {isLoading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/signin')}
            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}