import React from 'react'
import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react'

type CalloutType = 'info' | 'warning' | 'error' | 'success'

interface CalloutProps {
  type?: CalloutType
  title?: string
  children: React.ReactNode
}

const icons: Record<CalloutType, React.ReactNode> = {
  info: <Info className="h-4 w-4" />,
  warning: <AlertTriangle className="h-4 w-4" />,
  error: <AlertCircle className="h-4 w-4" />,
  success: <CheckCircle2 className="h-4 w-4" />,
}

const styles: Record<CalloutType, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-100',
  warning: 'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-100',
  error: 'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-100',
  success: 'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950/50 dark:text-green-100',
}

const iconStyles: Record<CalloutType, string> = {
  info: 'text-blue-500',
  warning: 'text-yellow-500',
  error: 'text-red-500',
  success: 'text-green-500',
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  return (
    <div className={cn('my-6 flex gap-3 rounded-lg border p-4', styles[type])}>
      <span className={cn('mt-0.5 shrink-0', iconStyles[type])}>{icons[type]}</span>
      <div className="min-w-0">
        {title && <p className="mb-1 font-semibold">{title}</p>}
        <div className="text-sm leading-relaxed [&>p]:m-0">{children}</div>
      </div>
    </div>
  )
}
