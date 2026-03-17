import type { ReactNode } from 'react'
import { useDocumentTitle } from '@presentation/hooks/useDocumentTitle.ts'

interface PageLayoutProps {
  children: ReactNode
  title: string
}

export function PageLayout({ children, title }: PageLayoutProps) {
  useDocumentTitle(title)

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
        {children}
      </div>
    </div>
  )
}
