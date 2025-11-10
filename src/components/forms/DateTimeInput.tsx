interface DateTimeInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  min?: string
  required?: boolean
  className?: string
}

export default function DateTimeInput({
  id,
  label,
  value,
  onChange,
  min,
  required = false,
  className = ''
}: DateTimeInputProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <input
        type="datetime-local"
        id={id}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  )
}