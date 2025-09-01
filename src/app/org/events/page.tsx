import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import EventsList from '../../../components/EventsList'

export default async function EventsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get organization
  const { data: orgAdmin } = await supabase
    .from('organization_admins')
    .select(`
      *,
      organization:organizations(*)
    `)
    .eq('user_id', user.id)
    .single()

  const organization = orgAdmin?.organization as any

  if (!organization) return null

  // Get events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('organization_id', organization.id)
    .order('start_time', { ascending: true })

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events</h1>
            <p className="mt-2 text-gray-600">
              Manage your organization's events and announcements.
            </p>
          </div>
          <Link
            href="/org/events/new"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Event
          </Link>
        </div>

        <EventsList 
          events={events || []} 
          organizationId={organization.id}
        />
      </div>
    </div>
  )
}
