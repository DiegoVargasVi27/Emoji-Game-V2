import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageLayout } from '@presentation/components/layout/PageLayout.tsx'

vi.mock('@presentation/hooks/useDocumentTitle.ts', () => ({
  useDocumentTitle: vi.fn(),
}))

describe('PageLayout', () => {
  it('renders children content', () => {
    render(
      <PageLayout title="Test">
        <p>Hello World</p>
      </PageLayout>,
    )

    expect(screen.getByText('Hello World')).toBeDefined()
  })

  it('applies overflow-y-auto class to the outer wrapper', () => {
    const { container } = render(
      <PageLayout title="Test">
        <p>Content</p>
      </PageLayout>,
    )

    const outer = container.firstElementChild as HTMLElement
    expect(outer.className).toContain('overflow-y-auto')
  })

  it('applies max-w-2xl class to the inner content wrapper', () => {
    const { container } = render(
      <PageLayout title="Test">
        <p>Content</p>
      </PageLayout>,
    )

    const inner = container.firstElementChild?.firstElementChild as HTMLElement
    expect(inner.className).toContain('max-w-2xl')
  })

  it('calls useDocumentTitle with the provided title', async () => {
    const { useDocumentTitle } = await import(
      '@presentation/hooks/useDocumentTitle.ts'
    )

    render(
      <PageLayout title="Mi Página">
        <p>Content</p>
      </PageLayout>,
    )

    expect(useDocumentTitle).toHaveBeenCalledWith('Mi Página')
  })
})
