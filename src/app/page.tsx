import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Check if user is a platform admin
    // For now, we'll check if they have a specific email domain or role
    // You can customize this logic based on your needs
    const isAdmin = user.email?.includes('@jamah.admin') || false // Customize this
    
    if (isAdmin) {
      redirect('/admin')
    } else {
      redirect('/org')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Community Console
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Management platform for Muslim community organizations. Connect with your congregation and manage events seamlessly.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Apply for Access
              </h2>
              <p className="text-gray-600 mb-6">
                Register your masjid or organization to start connecting with your community.
              </p>
              <Link
                href="/apply"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Submit Application
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Organization Login
              </h2>
              <p className="text-gray-600 mb-6">
                Already approved? Sign in to manage your organization and events.
              </p>
              <Link
                href="/signin"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
          
          <div className="mt-16 text-sm text-gray-500">
            <p>Part of the Jamah ecosystem - helping Muslims stay connected to their local masjid</p>
          </div>
        </div>
      </div>
    </div>
  )
}
