interface FileInputProps {
  id: string
  label: string
  onChange: (file: File | null) => void
  accept?: string
  required?: boolean
  className?: string
  helperText?: React.ReactNode
}

export default function FileInput({
  id,
  label,
  onChange,
  accept,
  required = false,
  className = '',
  helperText
}: FileInputProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <input
        type="file"
        id={id}
        accept={accept}
        required={required}
        onChange={(e) => onChange(e.target.files?.[0] || null)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
      />
      {helperText && (
        <div className="mt-2">
          {helperText}
        </div>
      )}
    </div>
  )
}