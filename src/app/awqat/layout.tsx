import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserRole } from '@/lib/auth-utils'

export default async function AwqatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect if not authenticated
  if (!user) {
    redirect('/signin')
  }

  // Check if user has Awqat role
  const userRole = getUserRole(user.email || '')
  if (userRole !== 'awqat') {
    redirect('/')
  }

  return <>{children}</>
}