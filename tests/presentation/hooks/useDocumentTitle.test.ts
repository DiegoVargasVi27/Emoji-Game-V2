import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDocumentTitle } from '@presentation/hooks/useDocumentTitle.ts'

describe('useDocumentTitle', () => {
  it('sets document.title with the given title on mount', () => {
    renderHook(() => useDocumentTitle('Cómo jugar'))

    expect(document.title).toBe('Cómo jugar | Emoji Wordle')
  })

  it('restores document.title to "Emoji Wordle" on unmount', () => {
    const { unmount } = renderHook(() => useDocumentTitle('About'))

    expect(document.title).toBe('About | Emoji Wordle')

    unmount()

    expect(document.title).toBe('Emoji Wordle')
  })

  it('updates document.title when the title prop changes', () => {
    const { rerender } = renderHook(({ title }) => useDocumentTitle(title), {
      initialProps: { title: 'Page A' },
    })

    expect(document.title).toBe('Page A | Emoji Wordle')

    rerender({ title: 'Page B' })

    expect(document.title).toBe('Page B | Emoji Wordle')
  })
})
