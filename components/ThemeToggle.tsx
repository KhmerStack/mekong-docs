'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent opacity-0 sm:h-9 sm:w-9">
        <span className="h-4 w-4" />
      </button>
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="
        flex h-8 w-8 items-center justify-center rounded-lg sm:h-9 sm:w-9
        text-gray-600 dark:text-gray-400
        hover:text-gray-900 dark:hover:text-white
        hover:bg-gray-100 dark:hover:bg-gray-800
        border border-transparent hover:border-gray-200 dark:hover:border-gray-700
        transition-all duration-150
      "
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
