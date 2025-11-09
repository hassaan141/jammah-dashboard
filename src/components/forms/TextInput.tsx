interface TextInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'tel' | 'url' | 'password'
  placeholder?: string
  required?: boolean
  className?: string
}

export default function TextInput({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  className = ''
}: TextInputProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        id={id}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
        placeholder={placeholder}
      />
    </div>
  )
}