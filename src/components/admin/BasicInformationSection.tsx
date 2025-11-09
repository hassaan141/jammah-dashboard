import EditableTextInput from '@/components/forms/EditableTextInput'
import EditableTextArea from '@/components/forms/EditableTextArea'

interface BasicInformationSectionProps {
  formData: {
    name: string
    description: string
    is_active: boolean
  }
  updateFormData: (field: string, value: string | boolean) => void
  isEditMode: boolean
  organizationId?: string
}

export default function BasicInformationSection({
  formData,
  updateFormData,
  isEditMode,
  organizationId
}: BasicInformationSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-black mb-4">Basic Information</h3>
      
      {organizationId && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-black mb-2">
            Organization ID
          </label>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
            {organizationId}
          </div>
          <p className="text-xs text-gray-500 mt-1">This ID cannot be changed</p>
        </div>
      )}
      
      <EditableTextInput
        id="name"
        label="Organization Name"
        value={formData.name}
        onChange={(value) => updateFormData('name', value)}
        placeholder="Your Organization Name"
        required
        isEditMode={isEditMode}
      />

      <EditableTextArea
        id="description"
        label="Description"
        value={formData.description}
        onChange={(value) => updateFormData('description', value)}
        placeholder="Describe your organization..."
        isEditMode={isEditMode}
        rows={4}
        className="mt-6"
      />

      <div className="mt-6">
        <label className="block text-sm font-medium text-black mb-2">
          Active Status
        </label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              checked={formData.is_active === true}
              onChange={() => updateFormData('is_active', true)}
              disabled={!isEditMode}
              className="mr-2"
            />
            <span className={`text-sm ${!isEditMode ? 'text-gray-500' : 'text-black'}`}>Active</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={formData.is_active === false}
              onChange={() => updateFormData('is_active', false)}
              disabled={!isEditMode}
              className="mr-2"
            />
            <span className={`text-sm ${!isEditMode ? 'text-gray-500' : 'text-black'}`}>Inactive</span>
          </label>
        </div>
      </div>
    </div>
  )
}