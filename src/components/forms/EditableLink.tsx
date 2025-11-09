import { memo, useCallback, useMemo } from 'react'

interface EditableLinkProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  linkText?: string
  placeholder?: string
  isEditMode: boolean
  className?: string
}

const EditableLink = memo(function EditableLink({
  id,
  label,
  value,
  onChange,
  linkText = 'Open Link',
  placeholder = 'Enter URL...',
  isEditMode,
  className = ''
}: EditableLinkProps) {
  const isValidUrl = useMemo(() => 
    value && value.trim() && (value.startsWith('http://') || value.startsWith('https://')), 
    [value]
  )

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }, [onChange])

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-black mb-2">
        {label}
      </label>
      
      {isEditMode ? (
        <input
          type="url"
          id={id}
          value={value}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
          placeholder={placeholder}
        />
      ) : (
        <div className="min-h-[42px] flex items-center">
          {isValidUrl ? (
            <div className="space-y-2">
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 underline font-medium"
              >
                {linkText}
                <svg className="w-4 h-4 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <p className="text-xs text-gray-500 break-all">{value}</p>
            </div>
          ) : (
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
              <p className="text-gray-500 italic">No link provided - click edit to add one</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
})

export default EditableLink