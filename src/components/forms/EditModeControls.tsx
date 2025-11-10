interface EditModeControlsProps {
  isEditMode: boolean
  isSaving: boolean
  onEdit: () => void
  onCancel: () => void
  onSave?: () => void
  editButtonText?: string
  savingText?: string
}

export default function EditModeControls({
  isEditMode,
  isSaving,
  onEdit,
  onCancel,
  onSave,
  editButtonText = 'Edit Profile',
  savingText = 'Saving...'
}: EditModeControlsProps) {
  if (!isEditMode) {
    return (
      <button
        onClick={onEdit}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        {editButtonText}
      </button>
    )
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSaving}
        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type={onSave ? "button" : "submit"}
        onClick={onSave}
        disabled={isSaving}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
      >
        {isSaving ? savingText : 'Save Changes'}
      </button>
    </div>
  )
}