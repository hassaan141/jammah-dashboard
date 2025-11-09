import { memo } from 'react'

interface LoadingSkeletonProps {
  className?: string
  rows?: number
}

export const LoadingSkeleton = memo(function LoadingSkeleton({ 
  className = '', 
  rows = 3 
}: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div 
          key={i} 
          className={`h-4 bg-gray-200 rounded ${i < rows - 1 ? 'mb-3' : ''}`}
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  )
})

interface FormSkeletonProps {
  className?: string
}

export const FormSkeleton = memo(function FormSkeleton({ className = '' }: FormSkeletonProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  )
})

export default LoadingSkeleton