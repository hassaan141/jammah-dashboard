import EditableTextInput from '@/components/forms/EditableTextInput'

interface ContactInformationSectionProps {
  formData: {
    contact_name: string
    contact_phone: string
    contact_email: string
  }
  updateFormData: (field: string, value: string) => void
  isEditMode: boolean
}

export default function ContactInformationSection({
  formData,
  updateFormData,
  isEditMode
}: ContactInformationSectionProps) {
  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-medium text-black mb-4">Contact Information</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <EditableTextInput
          id="contact_name"
          label="Contact Person"
          value={formData.contact_name}
          onChange={(value) => updateFormData('contact_name', value)}
          placeholder="John Smith"
          isEditMode={isEditMode}
        />
        <EditableTextInput
          id="contact_phone"
          label="Phone Number"
          type="tel"
          value={formData.contact_phone}
          onChange={(value) => updateFormData('contact_phone', value)}
          placeholder="+1 (555) 123-4567"
          isEditMode={isEditMode}
        />
      </div>

      <EditableTextInput
        id="contact_email"
        label="Contact Email"
        type="email"
        value={formData.contact_email}
        onChange={(value) => updateFormData('contact_email', value)}
        placeholder="contact@yourorganization.com"
        isEditMode={isEditMode}
        className="mt-6"
      />
    </div>
  )
}