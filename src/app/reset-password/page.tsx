'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Session } from '@supabase/supabase-js'

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const [isValidToken, setIsValidToken] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const verifyUser = async () => {
      const applyRecoverySession = (session: Session | null) => {
        if (!session?.user) {
          return false
        }

        setUser(session.user)
        setIsValidToken(true)
        return true
      }

      try {
        const currentUrl = new URL(window.location.href)
        const recoveryMode = currentUrl.searchParams.get('mode')
        const authCode = currentUrl.searchParams.get('code')
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')
        const hasRecoveryIntent =
          recoveryMode === 'recovery' ||
          Boolean(authCode) ||
          (Boolean(accessToken) && Boolean(refreshToken) && type === 'recovery')

        if (!hasRecoveryIntent) {
          setError('Invalid or expired reset link. Please request a new password reset.')
          return
        }

        const { data: { session } } = await supabase.auth.getSession()

        if (!authCode && !accessToken && applyRecoverySession(session)) {
          return
        }

        if (authCode) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(authCode)

          if (exchangeError) {
            setError('Invalid or expired reset link. Please request a new password reset.')
            return
          }

          if (applyRecoverySession(data.session)) {
            window.history.replaceState({}, document.title, currentUrl.pathname)
            return
          }
        }

        if (accessToken && refreshToken && type === 'recovery') {
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })

          if (sessionError) {
            setError('Invalid or expired reset link. Please request a new password reset.')
            return
          }

          if (applyRecoverySession(data.session)) {
            window.history.replaceState({}, document.title, currentUrl.pathname)
            return
          }
        }

        setError('Invalid or expired reset link. Please request a new password reset.')
      } catch (err) {
        console.error('Reset link verification failed:', err)
        setError('Invalid or expired reset link. Please request a new password reset.')
      } finally {
        setIsVerifying(false)
      }
    }

    verifyUser()
  }, [supabase.auth])

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setIsLoading(true)

    try {
      // Update password
      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword,
        data: {
          ...user?.user_metadata,
          requires_password_reset: false // Remove the reset requirement
        }
      })

      if (passwordError) {
        setError(passwordError.message)
        return
      }

      alert('Password updated successfully! You can now access your organization dashboard.')
      // Sign out after password reset to ensure clean session
      await supabase.auth.signOut()
      router.push('/signin')
      
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    )
  }

  if (!isValidToken || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Reset Link Invalid
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {error || 'This password reset link is no longer valid.'}
            </p>
            <button
              onClick={() => router.push('/forgot-password')}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Request a new password reset
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Set Your New Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome to Jammah Dashboard, {user?.user_metadata?.contact_name || 'Organization'}!
          </p>
          <p className="mt-1 text-center text-sm text-gray-500">
            For security reasons, please create a new password for your account.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handlePasswordReset}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="new-password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
              />
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating Password...' : 'Update Password & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
