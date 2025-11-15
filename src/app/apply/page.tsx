'use client'

import { useState, useMemo, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Country, State, City } from 'country-state-city'

import TextInput from '@/components/forms/TextInput'
import Select from '@/components/forms/Select'
import SubmitButton from '@/components/forms/SubmitButton'
import OrganizationTypeSelect from '@/components/apply/OrganizationTypeSelect'
import ApplicationSuccess from '@/components/apply/ApplicationSuccess'

export default function ApplyPage() {
  const [credentials, setCredentials] = useState({ email: '', password: '', confirmPassword: '' })
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: 'masjid',
    description: '',
    amenities: {
      street_parking: false,
      women_washroom: false,
      on_site_parking: false,
      women_prayer_space: false,
      wheelchair_accessible: false,
    },
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    city: '',
    provinceState: '',
    country: '',
    postalCode: '',
    website: '',
    donateLink: '',
    facebook: '',
    instagram: '',
    twitter: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  // Country-State-City dropdown options
  type Option = { label: string; value: string }
  const countryOptions = useMemo<Option[]>(
    () =>
      Country.getAllCountries().map((c) => ({
        label: c.name,
        value: c.isoCode,
      })),
    [],
  )
  
  const stateOptions = useMemo<Option[]>(() => {
    if (!formData.country) return []
    return State.getStatesOfCountry(formData.country).map((s) => ({
      label: s.name,
      value: s.isoCode,
    }))
  }, [formData.country])
  
  const cityOptions = useMemo<Option[]>(() => {
    if (!formData.country || !formData.provinceState) return []
    return City.getCitiesOfState(formData.country, formData.provinceState).map((ct) => ({
      label: ct.name,
      value: ct.name,
    }))
  }, [formData.country, formData.provinceState])

  const updateCredentials = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }))
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      // Reset dependent fields when parent changes
      if (field === 'country') {
        newData.provinceState = ''
        newData.city = ''
      } else if (field === 'provinceState') {
        newData.city = ''
      }
      
      return newData
    })
  }

  // Auto-sync contact email with login email
  useEffect(() => {
    setFormData(prev => ({ ...prev, contactEmail: credentials.email }))
  }, [credentials.email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      // Validation
      if (!credentials.email || !credentials.password || !credentials.confirmPassword) {
        setMessage('Please fill in email and password fields')
        return
      }
      if (credentials.password !== credentials.confirmPassword) {
        setMessage('Passwords do not match')
        return
      }
      if (!formData.organizationName || !formData.contactName || !formData.country || !formData.provinceState || !formData.city || !formData.postalCode) {
        setMessage('Please fill in all required fields')
        return
      }

      const supabase = createClient()

      // Sign up user with verification redirect
      const { data, error: signError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`,
          data: {
            user_type: 'organization',
            organization_name: formData.organizationName,
            display_name: formData.organizationName,
            contact_name: formData.contactName,
            contact_email: credentials.email,
          },
        },
      })

      if (signError) throw signError

      // Submit application and link to user if account was created
      const { error: appError } = await supabase
        .from('organization_applications')
        .insert({
          organization_name: formData.organizationName,
          organization_type: formData.organizationType,
          description: formData.description || null,
          amenities: formData.organizationType === 'masjid' ? formData.amenities : null,
          contact_name: formData.contactName,
          contact_email: credentials.email,
          contact_phone: formData.contactPhone || null,
          address: formData.address || null,
          city: formData.city || null,
          province_state: formData.provinceState || null,
          country: formData.country || null,
          postal_code: formData.postalCode || null,
          website: formData.website || null,
          donate_link: formData.donateLink || null,
          facebook: formData.facebook || null,
          instagram: formData.instagram || null,
          twitter: formData.twitter || null,
          prayer_times_url: null,
          application_status: 'submitted',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...(data.user?.id ? { user_id: data.user.id } : {}),
        })

      if (appError) {
        console.error('Application submission error:', appError)
        setMessage('Account created but error submitting application. Please contact support.')
        return
      }

      setSubmitted(true)
    } catch (error: any) {
      console.error('Unexpected error:', error)
      setMessage(error?.message || 'Error creating account and submitting application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return <ApplicationSuccess />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Apply to Join Jammah
            </h1>
            <p className="text-gray-600">
              Fill out the form below to apply for your organization to be listed on Jammah.
            </p>
          </div>

          {message && (
            <div className={`p-4 rounded-lg ${message.includes('Error') || message.includes('error') ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Authentication Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Account Information</h3>
              
              <TextInput
                id="email"
                label="Email"
                type="email"
                value={credentials.email}
                onChange={(value) => updateCredentials('email', value)}
                placeholder="your-email@example.com"
                required
              />

              <div className="grid md:grid-cols-2 gap-6">
                <TextInput
                  id="password"
                  label="Password"
                  type="password"
                  value={credentials.password}
                  onChange={(value) => updateCredentials('password', value)}
                  placeholder="Enter secure password"
                  required
                />

                <TextInput
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={credentials.confirmPassword}
                  onChange={(value) => updateCredentials('confirmPassword', value)}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            {/* Organization Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Organization Details</h3>
              
              <TextInput
                id="organizationName"
                label="Organization Name"
                value={formData.organizationName}
                onChange={(value) => updateFormData('organizationName', value)}
                placeholder="e.g., Al-Noor Islamic Center"
                required
              />

              <OrganizationTypeSelect
                organizationType={formData.organizationType}
                onOrganizationTypeChange={(value) => updateFormData('organizationType', value)}
              />

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="Brief description of your organization..."
                />
              </div>

              {formData.organizationType === 'masjid' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities (Optional)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" checked={formData.amenities.street_parking} onChange={() => setFormData(prev => ({ ...prev, amenities: { ...prev.amenities, street_parking: !prev.amenities.street_parking } }))} />
                      <span className="text-sm text-black">Street parking</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" checked={formData.amenities.women_washroom} onChange={() => setFormData(prev => ({ ...prev, amenities: { ...prev.amenities, women_washroom: !prev.amenities.women_washroom } }))} />
                      <span className="text-sm text-black">Women washroom</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" checked={formData.amenities.on_site_parking} onChange={() => setFormData(prev => ({ ...prev, amenities: { ...prev.amenities, on_site_parking: !prev.amenities.on_site_parking } }))} />
                      <span className="text-sm text-black">On-site parking</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" checked={formData.amenities.women_prayer_space} onChange={() => setFormData(prev => ({ ...prev, amenities: { ...prev.amenities, women_prayer_space: !prev.amenities.women_prayer_space } }))} />
                      <span className="text-sm text-black">Women prayer space</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" checked={formData.amenities.wheelchair_accessible} onChange={() => setFormData(prev => ({ ...prev, amenities: { ...prev.amenities, wheelchair_accessible: !prev.amenities.wheelchair_accessible } }))} />
                      <span className="text-sm text-black">Wheelchair accessible</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Address Information</h3>

              <TextInput
                id="address"
                label="Street Address"
                value={formData.address}
                onChange={(value) => updateFormData('address', value)}
                placeholder="123 Sesame Street"
              />

              <Select
                id="country"
                label="Country"
                value={formData.country}
                options={countryOptions}
                onChange={(value) => updateFormData('country', value)}
                placeholder="Select a country..."
                required
              />

              <Select
                id="provinceState"
                label="Province/State"
                value={formData.provinceState}
                options={stateOptions}
                onChange={(value) => updateFormData('provinceState', value)}
                placeholder="Select a province/state..."
                disabled={!formData.country}
                required
              />

              <Select
                id="city"
                label="City"
                value={formData.city}
                options={cityOptions}
                onChange={(value) => updateFormData('city', value)}
                placeholder="Select a city..."
                disabled={!formData.country || !formData.provinceState}
                required
              />

              <TextInput
                id="postalCode"
                label="Postal Code"
                value={formData.postalCode}
                onChange={(value) => updateFormData('postalCode', value)}
                placeholder="L1T 1X5"
                required
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Contact Information</h3>
              
              <TextInput
                id="contactName"
                label="Contact Person Name"
                value={formData.contactName}
                onChange={(value) => updateFormData('contactName', value)}
                placeholder="Full name"
                required
              />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    value={formData.contactEmail}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                    placeholder="Same as login email"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">This will be the same as your login email</p>
                </div>

                <TextInput
                  id="contactPhone"
                  label="Contact Phone (Optional)"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(value) => updateFormData('contactPhone', value)}
                  placeholder="(555) 555-5555"
                />
              </div>
            </div>

            {/* Online Presence */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Online Presence (Optional)</h3>

              <TextInput
                id="website"
                label="Website URL"
                type="url"
                value={formData.website}
                onChange={(value) => updateFormData('website', value)}
                placeholder="https://yourorganization.com"
              />

              <div className="grid md:grid-cols-3 gap-6">
                <TextInput
                  id="facebook"
                  label="Facebook Page"
                  type="url"
                  value={formData.facebook}
                  onChange={(value) => updateFormData('facebook', value)}
                  placeholder="https://facebook.com/yourpage"
                />

                <TextInput
                  id="instagram"
                  label="Instagram"
                  type="url"
                  value={formData.instagram}
                  onChange={(value) => updateFormData('instagram', value)}
                  placeholder="https://instagram.com/yourprofile"
                />

                <TextInput
                  id="twitter"
                  label="Twitter"
                  type="url"
                  value={formData.twitter}
                  onChange={(value) => updateFormData('twitter', value)}
                  placeholder="https://twitter.com/yourprofile"
                />
              </div>

              <TextInput
                id="donateLink"
                label="Donation URL"
                type="url"
                value={formData.donateLink}
                onChange={(value) => updateFormData('donateLink', value)}
                placeholder="https://donations.yourorganization.com"
              />
            </div>

            <div className="flex justify-between items-center pt-6">
              <Link
                href="/"
                className="text-black hover:text-gray-700 font-medium"
              >
                ← Back to Home
              </Link>
              <SubmitButton
                isSubmitting={isSubmitting}
                submittingText="Creating Account & Submitting..."
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 py-2 px-6"
              >
                Create Account & Submit Application
              </SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}