import EditableTextInput from '@/components/forms/EditableTextInput'
import EditableLink from '@/components/forms/EditableLink'

interface OnlinePresenceSectionProps {
  formData: {
    website: string
    donate_link: string
    prayer_times_url: string
    facebook: string
    instagram: string
    twitter: string
    whatsapp: string
    youtube: string
  }
  updateFormData: (field: string, value: string) => void
  isEditMode: boolean
}

export default function OnlinePresenceSection({
  formData,
  updateFormData,
  isEditMode
}: OnlinePresenceSectionProps) {
  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-medium text-black mb-4">Online Presence</h3>
      
      <EditableTextInput
        id="website"
        label="Website"
        type="url"
        value={formData.website}
        onChange={(value) => updateFormData('website', value)}
        placeholder="https://yourorganization.com"
        isEditMode={isEditMode}
      />

      <EditableTextInput
        id="donate_link"
        label="Donation Link"
        type="url"
        value={formData.donate_link}
        onChange={(value) => updateFormData('donate_link', value)}
        placeholder="https://donate.yourorganization.com"
        isEditMode={isEditMode}
        className="mt-6"
      />

      <EditableLink
        id="prayer_times_url"
        label="Prayer Times Schedule"
        value={formData.prayer_times_url}
        onChange={(value) => updateFormData('prayer_times_url', value)}
        linkText="View Prayer Times"
        placeholder="Enter prayer times URL..."
        isEditMode={isEditMode}
        className="mt-6"
      />

      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <EditableTextInput
          id="facebook"
          label="Facebook"
          type="url"
          value={formData.facebook}
          onChange={(value) => updateFormData('facebook', value)}
          placeholder="https://facebook.com/yourpage"
          isEditMode={isEditMode}
        />
        <EditableTextInput
          id="instagram"
          label="Instagram"
          type="url"
          value={formData.instagram}
          onChange={(value) => updateFormData('instagram', value)}
          placeholder="https://instagram.com/yourprofile"
          isEditMode={isEditMode}
        />
        <EditableTextInput
          id="twitter"
          label="Twitter"
          type="url"
          value={formData.twitter}
          onChange={(value) => updateFormData('twitter', value)}
          placeholder="https://twitter.com/yourprofile"
          isEditMode={isEditMode}
        />
        <EditableTextInput
          id="whatsapp"
          label="WhatsApp"
          type="url"
          value={formData.whatsapp}
          onChange={(value) => updateFormData('whatsapp', value)}
          placeholder="https://wa.me/1234567890"
          isEditMode={isEditMode}
        />
        <EditableTextInput
          id="youtube"
          label="YouTube"
          type="url"
          value={formData.youtube}
          onChange={(value) => updateFormData('youtube', value)}
          placeholder="https://youtube.com/@yourchannel"
          isEditMode={isEditMode}
        />
      </div>
    </div>
  )
}