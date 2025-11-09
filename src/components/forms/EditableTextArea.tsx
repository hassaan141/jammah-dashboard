interface EditableTextAreaProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  isEditMode: boolean
  className?: string
  rows?: number
}

export default function EditableTextArea({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  isEditMode,
  className = '',
  rows = 4
}: EditableTextAreaProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <textarea
        id={id}
        required={required}
        disabled={!isEditMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black resize-vertical ${
          !isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''
        }`}
        placeholder={placeholder}
      />
    </div>
  )
}