import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { VERSIONS, LATEST_VERSION } from '../lib/versions'

export function VersionSwitcher() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Only detect version on client to avoid SSR hydration mismatch
  useEffect(() => { setMounted(true) }, [])

  const pathParts = router.asPath.split('/')
  const versionInPath = mounted
    ? pathParts.find((p) => VERSIONS.some((v) => v.id === p))
    : undefined
  const currentId = versionInPath ?? LATEST_VERSION
  const current = VERSIONS.find((v) => v.id === currentId) ?? VERSIONS[0]
  const isLatest = current.id === VERSIONS[0].id

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function switchVersion(nextId: string) {
    setOpen(false)
    if (nextId === currentId) return
    if (versionInPath) {
      router.push(router.asPath.replace(`/${versionInPath}/`, `/${nextId}/`))
    } else {
      router.push(`/docs/${nextId}/getting-started`)
    }
  }

  return (
    <div ref={ref} className="relative flex items-center">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 items-center gap-1 px-2 rounded-lg text-xs font-medium sm:h-9 sm:gap-1.5 sm:px-3 sm:text-sm
                   text-gray-600 dark:text-gray-400
                   hover:text-gray-900 dark:hover:text-white
                   hover:bg-gray-100 dark:hover:bg-gray-800
                   border border-gray-200 dark:border-gray-700
                   transition-all duration-150 select-none"
        aria-haspopup="listbox"
        aria-expanded={open}
        suppressHydrationWarning
      >
        <span suppressHydrationWarning>{current.label}</span>
        {current.beta && (
          <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wide
                           text-amber-600 dark:text-amber-400
                           bg-amber-50 dark:bg-amber-900/30
                           px-1.5 py-0.5 rounded">
            beta
          </span>
        )}
        {isLatest && !current.beta && (
          <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wide
                           text-emerald-600 dark:text-emerald-400
                           bg-emerald-50 dark:bg-emerald-900/30
                           px-1.5 py-0.5 rounded">
            latest
          </span>
        )}
        <svg
          className={`h-3 w-3 shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full right-0 z-50 mt-1 min-w-[9rem] sm:min-w-[10rem]
                     bg-white dark:bg-gray-900
                     border border-gray-200 dark:border-gray-700
                     rounded-lg shadow-lg overflow-hidden"
          role="listbox"
        >
          {VERSIONS.map((v, i) => {
            const isActive = v.id === currentId
            const isLatestEntry = i === 0
            return (
              <button
                key={v.id}
                role="option"
                aria-selected={isActive}
                onClick={() => switchVersion(v.id)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm
                            transition-colors duration-100
                            ${isActive
                              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
              >
                <span className="font-medium">{v.label}</span>
                <span className="flex items-center gap-1">
                  {v.beta && (
                    <span className="text-[10px] font-bold uppercase tracking-wide
                                     text-amber-600 dark:text-amber-400
                                     bg-amber-50 dark:bg-amber-900/30
                                     px-1.5 py-0.5 rounded">
                      beta
                    </span>
                  )}
                  {isLatestEntry && !v.beta && (
                    <span className="text-[10px] font-bold uppercase tracking-wide
                                     text-emerald-600 dark:text-emerald-400
                                     bg-emerald-50 dark:bg-emerald-900/30
                                     px-1.5 py-0.5 rounded">
                      latest
                    </span>
                  )}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
