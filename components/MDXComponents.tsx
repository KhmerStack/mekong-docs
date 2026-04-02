import React from 'react'
import { cn } from '@/lib/utils'

// Custom MDX components that apply shadcn/Tailwind styling
export const MDXComponents = {
  // Tables
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-auto">
      <table className={cn('w-full border-collapse text-sm', className)} {...props} />
    </div>
  ),
  thead: ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className={cn('border-b', className)} {...props} />
  ),
  tbody: ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn('border-b border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50', className)}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        'h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400 [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn('px-4 py-3 align-middle [&:has([role=checkbox])]:pr-0', className)}
      {...props}
    />
  ),

  // Inline code
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        'relative rounded bg-gray-100 dark:bg-gray-800 px-[0.3rem] py-[0.2rem] font-mono text-sm',
        className
      )}
      {...props}
    />
  ),

  // Blockquote
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <blockquote
      className={cn(
        'mt-6 border-l-2 border-gray-300 dark:border-gray-600 pl-6 italic text-gray-600 dark:text-gray-400',
        className
      )}
      {...props}
    />
  ),
}
