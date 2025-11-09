import EditModeControls from '../forms/EditModeControls'

interface OrganizationProfileHeaderProps {
  isEditMode: boolean
  isSaving: boolean
  onEdit: () => void
  onCancel: () => void
  onSave?: () => void
}

export default function OrganizationProfileHeader({
  isEditMode,
  isSaving,
  onEdit,
  onCancel,
  onSave
}: OrganizationProfileHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Organization Profile</h1>
        <p className="text-gray-600 mt-1">
          {isEditMode ? 'Update your organization information' : 'View and manage your organization details'}
        </p>
      </div>
      <EditModeControls
        isEditMode={isEditMode}
        isSaving={isSaving}
        onEdit={onEdit}
        onCancel={onCancel}
        onSave={onSave}
      />
    </div>
  )
}