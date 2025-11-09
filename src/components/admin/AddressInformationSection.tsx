import EditableTextInput from '@/components/forms/EditableTextInput'

interface AddressInformationSectionProps {
  formData: {
    address: string
    city: string
    province_state: string
    country: string
    postal_code: string
  }
  updateFormData: (field: string, value: string) => void
  isEditMode: boolean
}

export default function AddressInformationSection({
  formData,
  updateFormData,
  isEditMode
}: AddressInformationSectionProps) {
  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-medium text-black mb-4">Address Information</h3>
      
      <EditableTextInput
        id="address"
        label="Street Address"
        value={formData.address}
        onChange={(value) => updateFormData('address', value)}
        placeholder="123 Main Street"
        isEditMode={isEditMode}
      />

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <EditableTextInput
          id="city"
          label="City"
          value={formData.city}
          onChange={(value) => updateFormData('city', value)}
          placeholder="Toronto"
          isEditMode={isEditMode}
        />
        <EditableTextInput
          id="province_state"
          label="Province/State"
          value={formData.province_state}
          onChange={(value) => updateFormData('province_state', value)}
          placeholder="Ontario"
          isEditMode={isEditMode}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <EditableTextInput
          id="country"
          label="Country"
          value={formData.country}
          onChange={(value) => updateFormData('country', value)}
          placeholder="Canada"
          isEditMode={isEditMode}
        />
        <EditableTextInput
          id="postal_code"
          label="Postal/ZIP Code"
          value={formData.postal_code}
          onChange={(value) => updateFormData('postal_code', value)}
          placeholder="L1T 1X5"
          isEditMode={isEditMode}
        />
      </div>
    </div>
  )
}