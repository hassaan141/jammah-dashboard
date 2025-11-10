// Admin-specific client that bypasses RLS for organization editing
import { createClient } from '@/lib/supabase/server'

export async function getAdminSupabaseClient() {
  const supabase = await createClient()
  
  // Get current session
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user || user.email !== process.env.ADMIN_EMAIL) {
    throw new Error('Unauthorized: Admin access required')
  }
  
  return supabase
}