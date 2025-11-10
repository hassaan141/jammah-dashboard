interface TextAreaInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  rows?: number
  className?: string
}

export default function TextAreaInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
  className = ''
}: TextAreaInputProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <textarea
        id={id}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black resize-vertical"
        placeholder={placeholder}
      />
    </div>
  )
}