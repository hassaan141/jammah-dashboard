import Link from 'next/link'

export default function ApplicationSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Thank You for Signing Up!</h2>
          
          <p className="text-gray-600 mb-2">
            Assalamu Alaykum and Welcome to Jammah!
          </p>
          
          <p className="text-gray-600 mb-6">
            Your account has been created and your application has been submitted successfully. Please check your email to verify your account. We&apos;ll review your application and get back to you within 3-5 business days.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              📧 Check your email for a verification link to activate your account.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/signin"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Sign In to Your Account
            </Link>
            
            <Link
              href="/"
              className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Return to App
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}