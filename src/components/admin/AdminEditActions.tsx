interface AdminEditActionsProps {
  organizationName?: string
  isEditMode: boolean
  saving: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onBack: () => void
}

export default function AdminEditActions({
  organizationName,
  isEditMode,
  saving,
  onEdit,
  onSave,
  onCancel,
  onBack
}: AdminEditActionsProps) {
  return (
    <div className="mb-8">
      <button
        onClick={onBack}
        className="text-blue-600 hover:text-blue-800 mb-4"
      >
        ← Back to Organizations
      </button>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black">Edit Organization</h1>
          <p className="mt-2 text-black">
            {isEditMode ? 'Update organization information' : `Viewing: ${organizationName}`}
          </p>
        </div>
        {!isEditMode ? (
          <button
            onClick={onEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Edit Organization
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              disabled={saving}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}