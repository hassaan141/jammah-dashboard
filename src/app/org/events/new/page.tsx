'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import TextInput from '@/components/forms/TextInput'
import TextAreaInput from '@/components/forms/TextAreaInput'
import DateTimeInput from '@/components/forms/DateTimeInput'
import ErrorMessage from '@/components/ui/ErrorMessage'
import EventFormHeader from '@/components/events/EventFormHeader'
import EventImageUpload from '@/components/events/EventImageUpload'
import EventStatusSelector from '@/components/events/EventStatusSelector'

interface FormData {
  title: string
  description: string
  start_time: string
  end_time: string
  venue: string
  status: 'draft' | 'published'
}

export default function NewEventPage() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    venue: '',
    status: 'draft'
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().slice(0, 16)
  }

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

  const getSubmitButtonText = () => {
    if (isSubmitting) return 'Creating...'
    return formData.status === 'published' ? 'Create & Publish Event' : 'Save as Draft'
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <EventFormHeader
          title="Create New Event"
          subtitle="Add a new event or announcement for your community."
          backHref="/org/events"
          backText="← Back to Events"
        />

        <ErrorMessage message={error} className="mb-6" />

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <TextInput
                id="title"
                label="Event Title"
                value={formData.title}
                onChange={(value) => updateFormData('title', value)}
                placeholder="e.g., Friday Jummah Prayer, Community Iftar, Youth Meeting"
                required
              />

              <TextAreaInput
                id="description"
                label="Description"
                value={formData.description}
                onChange={(value) => updateFormData('description', value)}
                placeholder="Provide details about the event, what to expect, who should attend, etc."
                rows={4}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DateTimeInput
                  id="start_time"
                  label="Start Date & Time"
                  value={formData.start_time}
                  onChange={(value) => updateFormData('start_time', value)}
                  min={getTomorrowDate()}
                  required
                />

                <DateTimeInput
                  id="end_time"
                  label="End Date & Time"
                  value={formData.end_time}
                  onChange={(value) => updateFormData('end_time', value)}
                  min={formData.start_time || getTomorrowDate()}
                  required
                />
              </div>

              <TextInput
                id="venue"
                label="Venue/Location"
                value={formData.venue}
                onChange={(value) => updateFormData('venue', value)}
                placeholder="e.g., Main Prayer Hall, Community Center, Online via Zoom"
                required
              />

              <EventImageUpload onFileChange={setImageFile} />

              <EventStatusSelector
                status={formData.status}
                onChange={(status) => updateFormData('status', status)}
              />

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
                  {getSubmitButtonText()}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}