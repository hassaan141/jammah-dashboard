'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewEventPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    venue: '',
    status: 'draft' as 'draft' | 'published'
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const supabase = createClient()
      
      // Get current user and organization
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('You must be logged in to create events')
        return
      }

      const { data: orgAdmin } = await supabase
        .from('organization_admins')
        .select(`organization:organizations(id)`)
        .eq('user_id', user.id)
        .single()

      if (!orgAdmin?.organization) {
        setError('Organization not found')
        return
      }

      let imageUrl = null

      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(fileName, imageFile)
          
        if (uploadError) {
          console.error('Image upload error:', uploadError)
          // Continue without image if upload fails
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('event-images')
            .getPublicUrl(fileName)
          imageUrl = publicUrl
        }
      }

      // Create event
      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert({
          organization_id: (orgAdmin.organization as any).id,
          title: formData.title,
          description: formData.description,
          start_time: formData.start_time,
          end_time: formData.end_time,
          venue: formData.venue,
          image_url: imageUrl,
          status: formData.status,
          created_by: user.id
        })
        .select()
        .single()

      if (eventError) {
        setError('Error creating event. Please try again.')
        console.error('Event creation error:', eventError)
      } else {
        // If published, the database trigger will handle notification creation
        router.push('/org/events')
      }
    } catch (error) {
      setError('Error creating event. Please try again.')
      console.error('Unexpected error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().slice(0, 16)
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
              <p className="mt-2 text-gray-600">
                Add a new event or announcement for your community.
              </p>
            </div>
            <Link
              href="/org/events"
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Back to Events
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Friday Jummah Prayer, Community Iftar, Youth Meeting"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Provide details about the event, what to expect, who should attend, etc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    id="start_time"
                    required
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    min={getTomorrowDate()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-2">
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    id="end_time"
                    required
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    min={formData.start_time || getTomorrowDate()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-2">
                  Venue/Location *
                </label>
                <input
                  type="text"
                  id="venue"
                  required
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Main Prayer Hall, Community Center, Online via Zoom"
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Image (Optional)
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Upload a banner or promotional image for your event (JPG, PNG - max 5MB)
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center space-x-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="draft"
                          checked={formData.status === 'draft'}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Save as Draft</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="published"
                          checked={formData.status === 'published'}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Publish Immediately</span>
                      </label>
                    </div>
                  </div>
                </div>

                {formData.status === 'published' && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex">
                      <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="text-sm font-medium text-blue-800">Publishing this event will:</h4>
                        <ul className="mt-1 text-sm text-blue-700 list-disc list-inside">
                          <li>Make it visible to all community members</li>
                          <li>Send push notifications to subscribers</li>
                          <li>Add it to the mobile app's events feed</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-6">
                <Link
                  href="/org/events"
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  {isSubmitting 
                    ? 'Creating...' 
                    : formData.status === 'published' 
                      ? 'Create & Publish Event' 
                      : 'Save as Draft'
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
