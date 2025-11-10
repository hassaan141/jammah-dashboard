import { useCallback, useRef, useState } from 'react'

export function useDebounce(callback: (...args: any[]) => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  return useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }, [callback, delay])
}

export function useOptimisticUpdate<T>(
  initialValue: T,
  updateFn: (value: T) => Promise<void>
) {
  const [optimisticValue, setOptimisticValue] = useState(initialValue)
  const [actualValue, setActualValue] = useState(initialValue)
  const [isPending, setIsPending] = useState(false)

  const performUpdate = useCallback(async (newValue: T) => {
    setOptimisticValue(newValue)
    setIsPending(true)
    
    try {
      await updateFn(newValue)
      setActualValue(newValue)
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticValue(actualValue)
      throw error
    } finally {
      setIsPending(false)
    }
  }, [actualValue, updateFn])

  return {
    value: optimisticValue,
    isPending,
    update: performUpdate,
    sync: (newValue: T) => {
      setOptimisticValue(newValue)
      setActualValue(newValue)
    }
  }
}