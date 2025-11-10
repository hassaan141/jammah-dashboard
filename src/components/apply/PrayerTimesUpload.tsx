import { useState } from 'react'
import FileInput from '../forms/FileInput'

interface PrayerTimesUploadProps {
  onFileChange: (file: File | null) => void
  required?: boolean
}

export default function PrayerTimesUpload({ onFileChange, required = false }: PrayerTimesUploadProps) {
  const [showFormat, setShowFormat] = useState(false)

  const helperText = (
    <div className="p-3 bg-blue-50 rounded-md">
      <p className="text-sm text-blue-800 mb-2">
        Please upload a JSON file containing your masjid's Azan and Iqamah times.
      </p>
      <div className="text-sm text-blue-700">
        <button 
          type="button"
          onClick={() => setShowFormat(!showFormat)}
          className="cursor-pointer font-medium underline hover:text-blue-900"
        >
          {showFormat ? 'Hide format' : 'View expected format'}
        </button>
      </div>
      {showFormat && (
        <div className="mt-3 p-3 bg-white rounded border">
          <img 
            src="/CalendarFormat.png" 
            alt="Prayer Times JSON Format Example" 
            className="max-w-full h-auto rounded border"
          />
        </div>
      )}
      <p className="text-sm text-blue-800 mt-2">
        Having trouble? Email us at: <a href="mailto:jamahcommunityapp@gmail.com" className="underline">jamahcommunityapp@gmail.com</a>
      </p>
    </div>
  )

  return (
    <FileInput
      id="prayerTimesFile"
      label="Prayer Times Schedule (JSON)"
      onChange={onFileChange}
      accept=".json"
      required={required}
      helperText={helperText}
    />
  )
}