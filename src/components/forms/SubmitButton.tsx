interface SubmitButtonProps {
  isSubmitting: boolean
  submittingText?: string
  children: React.ReactNode
  className?: string
}

export default function SubmitButton({
  isSubmitting,
  submittingText = 'Submitting...',
  children,
  className = ''
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {isSubmitting ? submittingText : children}
    </button>
  )
}