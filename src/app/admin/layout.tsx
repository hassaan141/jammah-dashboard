import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminNavigation from '../../components/AdminNavigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  // Check if user is a platform admin
  // You can customize this logic based on your needs
  const isAdmin = user.email?.includes('@jamah.admin') || 
                  user.email === 'admin@jamah.com' || 
                  false // Add more admin email conditions here

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don&apos;t have permission to access the admin area.
          </p>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation user={user} />
      <main>{children}</main>
    </div>
  )
}
