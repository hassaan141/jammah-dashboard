interface EventStatusSelectorProps {
  status: 'draft' | 'published'
  onChange: (status: 'draft' | 'published') => void
}

export default function EventStatusSelector({ status, onChange }: EventStatusSelectorProps) {
  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex items-center space-x-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="draft"
                checked={status === 'draft'}
                onChange={(e) => onChange(e.target.value as 'draft' | 'published')}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Save as Draft</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="published"
                checked={status === 'published'}
                onChange={(e) => onChange(e.target.value as 'draft' | 'published')}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Publish Immediately</span>
            </label>
          </div>
        </div>
      </div>

      {status === 'published' && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex">
            <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-blue-800">Publishing this event will:</h4>
              <ul className="mt-1 text-sm text-blue-700 list-disc list-inside">
                <li>Make it visible to all community members</li>
                <li>Send push notifications to subscribers</li>
                <li>Add it to the mobile app's events feed</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}