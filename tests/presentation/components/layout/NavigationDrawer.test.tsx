import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { NavigationDrawer } from '@presentation/components/layout/NavigationDrawer.tsx'

function renderDrawer(props: { isOpen: boolean; onClose?: () => void }) {
  const onClose = props.onClose ?? vi.fn()
  const result = render(
    <MemoryRouter>
      <NavigationDrawer isOpen={props.isOpen} onClose={onClose} />
    </MemoryRouter>,
  )
  return { ...result, onClose }
}

describe('NavigationDrawer', () => {
  it('renders all navigation links', () => {
    renderDrawer({ isOpen: true })

    expect(screen.getByText('Inicio')).toBeDefined()
    expect(screen.getByText('Cómo jugar')).toBeDefined()
    expect(screen.getByText('Sobre el proyecto')).toBeDefined()
    expect(screen.getByText('Sobre mí')).toBeDefined()
  })

  it('has correct href for each link', () => {
    renderDrawer({ isOpen: true })

    expect(screen.getByText('Inicio').closest('a')?.getAttribute('href')).toBe(
      '/',
    )
    expect(
      screen.getByText('Cómo jugar').closest('a')?.getAttribute('href'),
    ).toBe('/how-to-play')
    expect(
      screen.getByText('Sobre el proyecto').closest('a')?.getAttribute('href'),
    ).toBe('/about')
    expect(
      screen.getByText('Sobre mí').closest('a')?.getAttribute('href'),
    ).toBe('/about-me')
  })

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn()
    render(
      <MemoryRouter>
        <NavigationDrawer isOpen={true} onClose={onClose} />
      </MemoryRouter>,
    )

    const backdrop = document.querySelector('[aria-hidden="true"]') as HTMLElement
    fireEvent.click(backdrop)

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when Escape key is pressed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <MemoryRouter>
        <NavigationDrawer isOpen={true} onClose={onClose} />
      </MemoryRouter>,
    )

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not listen for Escape when closed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <MemoryRouter>
        <NavigationDrawer isOpen={false} onClose={onClose} />
      </MemoryRouter>,
    )

    await user.keyboard('{Escape}')

    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls onClose when a navigation link is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <MemoryRouter>
        <NavigationDrawer isOpen={true} onClose={onClose} />
      </MemoryRouter>,
    )

    await user.click(screen.getByText('Cómo jugar'))

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <MemoryRouter>
        <NavigationDrawer isOpen={true} onClose={onClose} />
      </MemoryRouter>,
    )

    await user.click(screen.getByLabelText('Cerrar menú de navegación'))

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('has dialog role with aria-modal and aria-label', () => {
    renderDrawer({ isOpen: true })

    const dialog = screen.getByRole('dialog')
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(dialog.getAttribute('aria-label')).toBe('Menú de navegación')
  })

  it('sets body overflow to hidden when open', () => {
    renderDrawer({ isOpen: true })

    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restores body overflow when closed', () => {
    const { unmount } = renderDrawer({ isOpen: true })

    expect(document.body.style.overflow).toBe('hidden')

    unmount()

    expect(document.body.style.overflow).toBe('')
  })
})
