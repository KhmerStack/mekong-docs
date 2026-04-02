import React, { useEffect, useState } from 'react'
import { WifiOff, Wifi } from 'lucide-react'

export function OfflineBanner() {
  const [status, setStatus] = useState<'online' | 'offline' | 'restored'>('online')

  useEffect(() => {
    // Set initial state
    if (!navigator.onLine) setStatus('offline')

    const handleOffline = () => setStatus('offline')
    const handleOnline = () => {
      setStatus('restored')
      // Hide the "back online" message after 3s
      setTimeout(() => setStatus('online'), 3000)
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)
    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  if (status === 'online') return null

  const isOffline = status === 'offline'

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999]
        flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg
        text-sm font-medium
        border transition-all duration-300
        ${isOffline
          ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
          : 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
        }
      `}
    >
      {isOffline ? (
        <>
          <WifiOff className="h-4 w-4 shrink-0" />
          <span>No internet connection</span>
        </>
      ) : (
        <>
          <Wifi className="h-4 w-4 shrink-0" />
          <span>Back online</span>
        </>
      )}
    </div>
  )
}
