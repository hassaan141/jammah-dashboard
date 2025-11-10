interface ReadOnlyLinkProps {
  id: string
  label: string
  url?: string
  linkText?: string
  placeholder?: string
  className?: string
}

export default function ReadOnlyLink({
  id,
  label,
  url,
  linkText,
  placeholder = 'Not provided',
  className = ''
}: ReadOnlyLinkProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {url ? (
        <div className="space-y-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 underline font-medium"
          >
            {linkText || 'View Link'}
            <svg className="w-4 h-4 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <p className="text-xs text-gray-500 break-all">{url}</p>
        </div>
      ) : (
        <p className="text-gray-500 italic">{placeholder}</p>
      )}
    </div>
  )
}