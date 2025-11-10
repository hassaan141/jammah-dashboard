import { memo, useCallback } from 'react'

interface EditableTextInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'tel' | 'url'
  placeholder?: string
  required?: boolean
  isEditMode: boolean
  className?: string
}

const EditableTextInput = memo(function EditableTextInput({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  isEditMode,
  className = ''
}: EditableTextInputProps) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }, [onChange])

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        id={id}
        required={required}
        disabled={!isEditMode}
        value={value}
        onChange={handleChange}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
          !isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''
        }`}
        placeholder={placeholder}
      />
    </div>
  )
})

export default EditableTextInput