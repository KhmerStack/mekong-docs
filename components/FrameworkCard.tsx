import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface FrameworkCardProps {
  title: string
  description?: string
  href: string
  icon?: React.ReactNode
  badge?: string
}

export function FrameworkCard({ title, description, href, icon, badge }: FrameworkCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-col gap-2 rounded-lg border p-4 transition-all',
        'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm',
        'dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-blue-600'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-gray-500 dark:text-gray-400">{icon}</span>}
          <span className="font-medium text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </span>
        </div>
        {badge && (
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
            {badge}
          </span>
        )}
      </div>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
    </Link>
  )
}
