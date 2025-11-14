'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Country, State, City } from 'country-state-city'

import TextInput from '@/components/forms/TextInput'
import Select from '@/components/forms/Select'
import SubmitButton from '@/components/forms/SubmitButton'
import OrganizationTypeSelect from '@/components/apply/OrganizationTypeSelect'

export default function SignUpPage() {
  const [credentials, setCredentials] = useState({ email: '', password: '', confirmPassword: '' })
  const [formData, setFormData] = useState<any>({
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
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  type Option = { label: string; value: string }
  const countryOptions = useMemo<Option[]>(
    () => Country.getAllCountries().map((c) => ({ label: c.name, value: c.isoCode })),
    [],
  )

  const stateOptions = useMemo<Option[]>(() => {
    if (!formData.country) return []
    return State.getStatesOfCountry(formData.country).map((s) => ({ label: s.name, value: s.isoCode }))
  }, [formData.country])

  const cityOptions = useMemo<Option[]>(() => {
    if (!formData.country || !formData.provinceState) return []
    return City.getCitiesOfState(formData.country, formData.provinceState).map((ct) => ({ label: ct.name, value: ct.name }))
  }, [formData.country, formData.provinceState])

  const updateForm = (field: string, value: any) => setFormData((p: any) => ({ ...p, [field]: value }))
  const updateCred = (field: string, value: string) => setCredentials((p) => ({ ...p, [field]: value }))

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      if (!credentials.email || !credentials.password || !credentials.confirmPassword) {
        setMessage('Please fill email and password')
        return
      }
      if (credentials.password !== credentials.confirmPassword) {
        setMessage('Passwords do not match')
        return
      }

      // Sign up user with verification redirect to /auth/verify
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

      // Create application row; attach user_id if available from response
      await supabase.from('organization_applications').insert({
        organization_name: formData.organizationName,
        organization_type: formData.organizationType,
        description: formData.description || null,
        amenities: formData.organizationType === 'masjid' ? formData.amenities : null,
        contact_name: formData.contactName,
        contact_email: credentials.email,
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
        prayer_times_url: null,
        application_status: 'submitted',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...(data.user?.id ? { user_id: data.user.id } : {}),
      })

      setMessage('Account created. Check your email to verify your account before signing in.')
      // Optionally navigate to a dedicated 'check email' page
    } catch (err: any) {
      console.error('Signup error', err)
      setMessage(err?.message || 'Error creating account')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Sign up and submit an organization application</h2>
        {message && <div className="mb-4 text-sm text-gray-700">{message}</div>}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <TextInput id="email" label="Email" value={credentials.email} onChange={(v) => updateCred('email', v)} required />
            <TextInput id="password" label="Password" type="password" value={credentials.password} onChange={(v) => updateCred('password', v)} required />
            <TextInput id="confirmPassword" label="Confirm Password" type="password" value={credentials.confirmPassword} onChange={(v) => updateCred('confirmPassword', v)} required />
          </div>

          <TextInput id="organizationName" label="Organization Name" value={formData.organizationName} onChange={(v) => updateForm('organizationName', v)} required />

          <OrganizationTypeSelect
            organizationType={formData.organizationType}
            onOrganizationTypeChange={(v) => updateForm('organizationType', v)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <textarea className="w-full px-3 py-2 border rounded" rows={3} value={formData.description} onChange={(e) => updateForm('description', e.target.value)} />
          </div>

          {formData.organizationType === 'masjid' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amenities (optional)</label>
              <div className="grid grid-cols-2 gap-2">
                {['street_parking','women_washroom','on_site_parking','women_prayer_space','wheelchair_accessible'].map((key) => (
                  <label key={key} className="flex items-center space-x-2">
                    <input type="checkbox" checked={formData.amenities[key as keyof typeof formData.amenities]} onChange={() => updateForm('amenities', { ...formData.amenities, [key]: !formData.amenities[key as keyof typeof formData.amenities] })} />
                    <span className="text-sm text-black">{key.replace(/_/g, ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <TextInput id="contactName" label="Contact Name" value={formData.contactName} onChange={(v) => updateForm('contactName', v)} required />
            <TextInput id="contactPhone" label="Contact Phone" value={formData.contactPhone} onChange={(v) => updateForm('contactPhone', v)} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Select id="country" label="Country" value={formData.country} options={countryOptions} onChange={(v) => updateForm('country', v)} />
            <Select id="provinceState" label="Province/State" value={formData.provinceState} options={stateOptions} onChange={(v) => updateForm('provinceState', v)} />
          </div>

          <div className="flex justify-between items-center pt-4">
            <SubmitButton isSubmitting={isSubmitting} submittingText="Creating account...">Create account & submit application</SubmitButton>
          </div>
        </form>
      </div>
    </div>
  )
}
