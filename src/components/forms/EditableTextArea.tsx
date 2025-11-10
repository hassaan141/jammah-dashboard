import { memo, useCallback } from 'react'

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

const EditableTextArea = memo(function EditableTextArea({
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
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }, [onChange])

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
        onChange={handleChange}
        rows={rows}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black resize-vertical ${
          !isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''
        }`}
        placeholder={placeholder}
      />
    </div>
  )
})

export default EditableTextArea