import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ShareModal } from '@presentation/components/modals/ShareModal.tsx'

const STORAGE_KEY = 'emoji-wordle-player-name'

describe('ShareModal', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('renders the input when isOpen is true', () => {
    render(
      <ShareModal isOpen={true} onClose={vi.fn()} onShare={vi.fn()} />,
    )

    expect(screen.getByLabelText('Nombre del jugador')).toBeDefined()
  })

  it('does not render when isOpen is false', () => {
    render(
      <ShareModal isOpen={false} onClose={vi.fn()} onShare={vi.fn()} />,
    )

    expect(screen.queryByLabelText('Nombre del jugador')).toBeNull()
  })

  it('pre-fills the input with the saved name from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'Diego')

    render(
      <ShareModal isOpen={true} onClose={vi.fn()} onShare={vi.fn()} />,
    )

    const input = screen.getByLabelText('Nombre del jugador') as HTMLInputElement
    expect(input.value).toBe('Diego')
  })

  it('shows empty input when no name is saved in localStorage', () => {
    render(
      <ShareModal isOpen={true} onClose={vi.fn()} onShare={vi.fn()} />,
    )

    const input = screen.getByLabelText('Nombre del jugador') as HTMLInputElement
    expect(input.value).toBe('')
  })

  it('calls onShare with the input value when the Compartir button is clicked', async () => {
    const user = userEvent.setup()
    const onShare = vi.fn()

    render(
      <ShareModal isOpen={true} onClose={vi.fn()} onShare={onShare} />,
    )

    const input = screen.getByLabelText('Nombre del jugador')
    await user.clear(input)
    await user.type(input, 'Mariana')

    await user.click(screen.getByRole('button', { name: 'Compartir' }))

    expect(onShare).toHaveBeenCalledOnce()
    expect(onShare).toHaveBeenCalledWith('Mariana')
  })

  it('calls onShare with the trimmed name on Enter key press', async () => {
    const user = userEvent.setup()
    const onShare = vi.fn()

    render(
      <ShareModal isOpen={true} onClose={vi.fn()} onShare={onShare} />,
    )

    const input = screen.getByLabelText('Nombre del jugador')
    await user.clear(input)
    await user.type(input, 'Diego')
    await user.keyboard('{Enter}')

    expect(onShare).toHaveBeenCalledOnce()
    expect(onShare).toHaveBeenCalledWith('Diego')
  })

  it('calls onShare with empty string when name is only whitespace', async () => {
    const user = userEvent.setup()
    const onShare = vi.fn()

    render(
      <ShareModal isOpen={true} onClose={vi.fn()} onShare={onShare} />,
    )

    const input = screen.getByLabelText('Nombre del jugador')
    await user.clear(input)
    await user.type(input, '   ')

    await user.click(screen.getByRole('button', { name: 'Compartir' }))

    expect(onShare).toHaveBeenCalledWith('')
  })

  it('calls onClose when the Cancelar button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <ShareModal isOpen={true} onClose={onClose} onShare={vi.fn()} />,
    )

    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <ShareModal isOpen={true} onClose={onClose} onShare={vi.fn()} />,
    )

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('saves the name to localStorage when sharing', async () => {
    const user = userEvent.setup()

    render(
      <ShareModal isOpen={true} onClose={vi.fn()} onShare={vi.fn()} />,
    )

    const input = screen.getByLabelText('Nombre del jugador')
    await user.clear(input)
    await user.type(input, 'Mariana')

    await user.click(screen.getByRole('button', { name: 'Compartir' }))

    expect(localStorage.getItem(STORAGE_KEY)).toBe('Mariana')
  })
})
