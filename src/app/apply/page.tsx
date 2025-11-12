'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Country, State, City } from 'country-state-city'

import TextInput from '@/components/forms/TextInput'
import Select from '@/components/forms/Select'
import SubmitButton from '@/components/forms/SubmitButton'
import OrganizationTypeSelect from '@/components/apply/OrganizationTypeSelect'
import PrayerTimesUpload from '@/components/apply/PrayerTimesUpload'
import ApplicationSuccess from '@/components/apply/ApplicationSuccess'

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: 'masjid',
    organizationTypeOther: '',
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
  const [prayerTimesFile, setPrayerTimesFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
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
          organization_type: formData.organizationType === 'other' ? formData.organizationTypeOther : formData.organizationType,
          description: formData.description || null,
          amenities: formData.organizationType === 'masjid' ? formData.amenities : null,
          contact_name: formData.contactName,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone,
          address: formData.address,
          city: formData.city,
          province_state: formData.provinceState,
          country: formData.country,
          postal_code: formData.postalCode,
          website: formData.website || null,
          donate_link: formData.donateLink || null,
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
        console.error('Error details:', JSON.stringify(error, null, 2))
        console.error('Error code:', error.code)
        console.error('Error message:', error.message)
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

          <form onSubmit={handleSubmit} className="space-y-6">
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
              organizationTypeOther={formData.organizationTypeOther}
              onOrganizationTypeChange={(value) => updateFormData('organizationType', value)}
              onOrganizationTypeOtherChange={(value) => updateFormData('organizationTypeOther', value)}
            />

            <div>
              <label htmlFor="descriptios" className="block text-sm font-medium text-gray-700 mb-2">
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
              <>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities (optional)</label>
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
              </>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <TextInput
                id="contactName"
                label="Contact Name"
                value={formData.contactName}
                onChange={(value) => updateFormData('contactName', value)}
                placeholder="Full name"
                required
              />

              <TextInput
                id="contactEmail"
                label="Contact Email"
                type="email"
                value={formData.contactEmail}
                onChange={(value) => updateFormData('contactEmail', value)}
                placeholder="email@example.com"
                required
              />
            </div>

            <TextInput
              id="contactPhone"
              label="Contact Phone"
              type="tel"
              value={formData.contactPhone}
              onChange={(value) => updateFormData('contactPhone', value)}
              placeholder="(555) 555-5555"
              required
            />

            <TextInput
              id="address"
              label="Address (Optional)"
              value={formData.address}
              onChange={(value) => updateFormData('address', value)}
              placeholder="123 Sesame Street"
            />

            <div className="grid md:grid-cols-2 gap-6">
              <Select
                id="country"
                label="Country (Optional)"
                value={formData.country}
                options={countryOptions}
                onChange={(value) => updateFormData('country', value)}
                placeholder="Select a country..."
              />

              <Select
                id="provinceState"
                label="Province/State (Optional)"
                value={formData.provinceState}
                options={stateOptions}
                onChange={(value) => updateFormData('provinceState', value)}
                placeholder="Select a province/state..."
                disabled={!formData.country}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Select
                id="city"
                label="City (Optional)"
                value={formData.city}
                options={cityOptions}
                onChange={(value) => updateFormData('city', value)}
                placeholder="Select a city..."
                disabled={!formData.country || !formData.provinceState}
              />

              <TextInput
                id="postalCode"
                label="Postal Code (Optional)"
                value={formData.postalCode}
                onChange={(value) => updateFormData('postalCode', value)}
                placeholder="L1T 1X5"
              />
            </div>

            <TextInput
              id="website"
              label="Website (Optional)"
              type="url"
              value={formData.website}
              onChange={(value) => updateFormData('website', value)}
              placeholder="https://yourorganization.com"
            />

            <TextInput
              id="donateLink"
              label="Donation Link (Optional)"
              type="url"
              value={formData.donateLink}
              onChange={(value) => updateFormData('donateLink', value)}
              placeholder="https://donations.yourorganization.com"
            />

            <div className="grid md:grid-cols-3 gap-6">
              <TextInput
                id="facebook"
                label="Facebook (Optional)"
                type="url"
                value={formData.facebook}
                onChange={(value) => updateFormData('facebook', value)}
                placeholder="https://facebook.com/yourpage"
              />

              <TextInput
                id="instagram"
                label="Instagram (Optional)"
                type="url"
                value={formData.instagram}
                onChange={(value) => updateFormData('instagram', value)}
                placeholder="https://instagram.com/yourprofile"
              />

              <TextInput
                id="twitter"
                label="Twitter (Optional)"
                type="url"
                value={formData.twitter}
                onChange={(value) => updateFormData('twitter', value)}
                placeholder="https://twitter.com/yourprofile"
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
                submittingText="Submitting..."
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 py-2 px-6"
              >
                Submit Application
              </SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}