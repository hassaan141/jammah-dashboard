import FileInput from '../forms/FileInput'

interface EventImageUploadProps {
  onFileChange: (file: File | null) => void
}

export default function EventImageUpload({ onFileChange }: EventImageUploadProps) {
  const helperText = (
    <p className="text-sm text-gray-500 mt-1">
      Upload a banner or promotional image for your event (JPG, PNG - max 5MB)
    </p>
  )

  return (
    <FileInput
      id="image"
      label="Event Image (Optional)"
      onChange={onFileChange}
      accept="image/*"
      helperText={helperText}
    />
  )
}