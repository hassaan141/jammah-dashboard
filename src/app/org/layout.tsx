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

  // Check if user needs to reset password (for newly approved organizations)
  if (user.user_metadata?.requires_password_reset) {
    redirect('/reset-password')
  }

  // Get user profile to check organization access
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_org, org_id')
    .eq('id', user.id)
    .single()

  if (!profile?.is_org || !profile?.org_id) {
    redirect('/')
  }

  // Get organization details
  const { data: organization } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', profile.org_id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      <OrgNavigation 
        user={user} 
        organization={organization}
      />
      <main>{children}</main>
    </div>
  )
}
