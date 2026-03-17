import { useEffect } from 'react'

export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = `${title} | Emoji Wordle`
    return () => {
      document.title = 'Emoji Wordle'
    }
  }, [title])
}
