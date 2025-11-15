'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface Event {
  id: string
  title: string
  description: string
  start_time: string
  end_time: string
  venue_name: string
  image_url?: string
  status: 'draft' | 'published' | 'unpublished'
  created_at: string
}

interface EventsListProps {
  events: Event[]
  organizationId: string
}

export default function EventsList({ events, organizationId }: EventsListProps) {
  const [eventsList, setEventsList] = useState(events)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'unpublished'>('all')
  const router = useRouter()

  const filteredEvents = eventsList.filter(event => {
    if (filter === 'all') return true
    return event.status === filter
  })

  const updateEventStatus = async (eventId: string, newStatus: 'published' | 'unpublished') => {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('events')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', eventId)

    if (!error) {
      setEventsList(eventsList.map(event => 
        event.id === eventId ? { ...event, status: newStatus } : event
      ))
      
      // If publishing, this will trigger the database trigger for notifications
      if (newStatus === 'published') {
        // You might want to show a success message here
        console.log('Event published successfully')
      }
    }
  }

  const deleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return
    }

    const supabase = createClient()
    
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)

    if (!error) {
      setEventsList(eventsList.filter(event => event.id !== eventId))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'unpublished':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date()
  }

  if (eventsList.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No events yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first event.
          </p>
          <div className="mt-6">
            <Link
              href="/org/events/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Event
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex space-x-1">
          {['all', 'published', 'draft', 'unpublished'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-2 text-xs">
                ({status === 'all' ? eventsList.length : eventsList.filter(e => e.status === status).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                    {isUpcoming(event.start_time) && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Upcoming
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(event.start_time)}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.venue_name}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Created {new Date(event.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {event.image_url && (
                  <div className="ml-6 flex-shrink-0">
                    <Image 
                      src={event.image_url} 
                      alt={event.title}
                      width={96}
                      height={96}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Link
                    href={`/org/events/${event.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Edit
                  </Link>
                  
                  {event.status === 'draft' && (
                    <button
                      onClick={() => updateEventStatus(event.id, 'published')}
                      className="text-green-600 hover:text-green-800 font-medium text-sm"
                    >
                      Publish
                    </button>
                  )}
                  
                  {event.status === 'published' && (
                    <button
                      onClick={() => updateEventStatus(event.id, 'unpublished')}
                      className="text-yellow-600 hover:text-yellow-800 font-medium text-sm"
                    >
                      Unpublish
                    </button>
                  )}
                  
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                  >
                    Delete
                  </button>
                </div>

                {event.status === 'published' && (
                  <div className="text-sm text-gray-500">
                    📱 Notifications sent to subscribers
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && filter !== 'all' && (
        <div className="text-center py-8">
          <p className="text-gray-500">No {filter} events found.</p>
        </div>
      )}
    </div>
  )
}
