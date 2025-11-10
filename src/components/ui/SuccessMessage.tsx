interface SuccessMessageProps {
  message: string
  className?: string
}

export default function SuccessMessage({ message, className = '' }: SuccessMessageProps) {
  if (!message) return null

  return (
    <div className={`bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md ${className}`}>
      <p className="text-sm">{message}</p>
    </div>
  )
}