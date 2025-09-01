import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OrgNavigation from '@/components/OrgNavigation'

export default async function OrgLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  // Check if user has an approved organization
  const { data: orgAdmin } = await supabase
    .from('organization_admins')
    .select(`
      *,
      organization:organizations(*)
    `)
    .eq('user_id', user.id)
    .single()

  if (!orgAdmin || !orgAdmin.organization || !(orgAdmin.organization as any).verified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Pending</h2>
          <p className="text-gray-600 mb-6">
            Your organization application is still being reviewed. You'll receive an email once it's approved.
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
      <OrgNavigation 
        user={user} 
        organization={orgAdmin.organization}
      />
      <main>{children}</main>
    </div>
  )
}
