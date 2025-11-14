'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: 'masjid',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    city: '',
    provinceState: '',
    country: '',
    postalCode: '',
    website: '',
    facebook: '',
    instagram: '',
    twitter: '',
  })
  const [prayerTimesFile, setPrayerTimesFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()
      
      let prayerTimesUrl = null
      
      // Upload prayer times file if provided (for masjids)
      if (prayerTimesFile && formData.organizationType === 'masjid') {
        const fileName = `prayer-times-${formData.organizationName}-${Date.now()}.json`
        
        const { error: uploadError } = await supabase.storage
          .from('prayer-times')
          .upload(fileName, prayerTimesFile)
          
        if (uploadError) {
          console.error('Prayer times file upload error:', uploadError)
          alert('Error uploading prayer times file. Please try again or contact support.')
          setIsSubmitting(false)
          return
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('prayer-times')
            .getPublicUrl(fileName)
          prayerTimesUrl = publicUrl
        }
      }

      // Submit application
      const { error } = await supabase
        .from('organization_applications')
        .insert({
          organization_name: formData.organizationName,
          organization_type: formData.organizationType,
          contact_name: formData.contactName,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone,
          address: formData.address,
          city: formData.city,
          province_state: formData.provinceState,
          country: formData.country,
          postal_code: formData.postalCode,
          website: formData.website || null,
          facebook: formData.facebook || null,
          instagram: formData.instagram || null,
          twitter: formData.twitter || null,
          prayer_times_url: prayerTimesUrl,
          application_status: 'submitted',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.error('Application submission error:', error)
        console.error('Error details:', JSON.stringify(error, null, 2)) // Add this line
        console.error('Error code:', error.code) // Add this line
        console.error('Error message:', error.message) // Add this line
        alert('Error submitting application. Please try again.')
      } else {
        setSubmitted(true)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      alert('Error submitting application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
            <p className="text-black mb-6">
              Thank you for applying. We&apos;ll review your application and get back to you via email within 3-5 business days.
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply for Community Console Access</h1>
            <p className="text-black">
              Register your masjid or organization to start connecting with your community through our platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-2">
                Organization Name *
              </label>
              <input
                type="text"
                id="organizationName"
                required
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="e.g., Al-Noor Islamic Center"
              />
            </div>

            <div>
              <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700 mb-2">
                Organization Type *
              </label>
              <select
                id="organizationType"
                required
                value={formData.organizationType}
                onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="masjid">Masjid</option>
                <option value="islamic-school">Islamic School</option>
                <option value="sisters-group">Sisters Group</option>
                <option value="youth-group">Youth Group</option>
                <option value="book-club">Book Club</option>
                <option value="book-store">Book Store</option>
                <option value="run-club">Run Club</option>
                {/* 'Other' removed to match mobile UX */}
              </select>
            </div>
            {/* no 'other' option or extra field */}

            {formData.organizationType === 'masjid' && (
              <div>
                <label htmlFor="prayerTimesFile" className="block text-sm font-medium text-gray-700 mb-2">
                  Prayer Times Schedule (JSON) *
                </label>
                <input
                  type="file"
                  id="prayerTimesFile"
                  accept=".json"
                  required
                  onChange={(e) => setPrayerTimesFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"

                />
                <div className="mt-2 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800 mb-2">
                    Please upload a JSON file containing your masjid's Azan and Iqamah times.
                  </p>
                  <div className="text-sm text-blue-700">
                    <button 
                      type="button"
                      onClick={() => {
                        const formatDiv = document.getElementById('formatExample');
                        formatDiv?.classList.toggle('hidden');
                      }}
                      className="cursor-pointer font-medium underline hover:text-blue-900"
                    >
                      View expected format
                    </button>
                  </div>
                  <div id="formatExample" className="hidden mt-3 p-3 bg-white rounded border">
                    <img 
                      src="/CalendarFormat.png" 
                      alt="Prayer Times JSON Format Example" 
                      className="max-w-full h-auto rounded border"
                    />
                  </div>
                  <p className="text-sm text-blue-800 mt-2">
                    Having trouble? Email us at: <a href="mailto:jamahcommunityapp@gmail.com" className="underline">jamahcommunityapp@gmail.com</a>
                  </p>
                </div>
              </div>
            )}


            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Name *
                </label>
                <input
                  type="text"
                  id="contactName"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  required
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone *
              </label>
              <input
                type="tel"
                id="contactPhone"
                required
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="(555) 555-5555"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Addrress (Optional)
              </label>
              <input
                type="text"
                id="adress"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="123 Sesame Street"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City (Optional)
              </label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="Toronto"
              />
            </div>

            <div>
              <label htmlFor="province_state" className="block text-sm font-medium text-gray-700 mb-2">
                Province/State (Optional)
              </label>
              <input
                type="text"
                id="province_state"
                value={formData.provinceState}
                onChange={(e) => setFormData({ ...formData, provinceState: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="Ontario"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country (Optional)
              </label>
              <input
                type="text"
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="Canada"
              />
            </div>
            <div>
              <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code (Optional)
              </label>
              <input
                type="text"
                id="postal_code"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="L1T 1X5"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                Website (Optional)
              </label>
              <input
                type="url"
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="https://yourorganization.com"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook (Optional)
                </label>
                <input
                  type="url"
                  id="facebook"
                  value={formData.facebook || ''}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram (Optional)
                </label>
                <input
                  type="url"
                  id="instagram"
                  value={formData.instagram || ''}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="https://instagram.com/yourprofile"
                />
              </div>
              <div>
                <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter (Optional)
                </label>
                <input
                  type="url"
                  id="twitter"
                  value={formData.twitter || ''}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="https://twitter.com/yourprofile"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-6">
              <Link
                href="/"
                className="text-black hover:text-gray-700 font-medium"
              >
                ← Back to Home
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
