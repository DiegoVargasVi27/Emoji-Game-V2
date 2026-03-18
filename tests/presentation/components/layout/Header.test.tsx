import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from '@presentation/components/layout/Header.tsx'

describe('Header', () => {
  it('renders the title "Emoji Wordle"', () => {
    render(<Header onMenuClick={vi.fn()} onStatsClick={vi.fn()} />)

    expect(screen.getByText('Emoji Wordle')).toBeDefined()
  })

  it('calls onMenuClick when the hamburger button is clicked', async () => {
    const user = userEvent.setup()
    const onMenuClick = vi.fn()
    render(<Header onMenuClick={onMenuClick} onStatsClick={vi.fn()} />)

    await user.click(screen.getByLabelText('Abrir menú de navegación'))

    expect(onMenuClick).toHaveBeenCalledOnce()
  })

  it('calls onStatsClick when the stats button is clicked', async () => {
    const user = userEvent.setup()
    const onStatsClick = vi.fn()
    render(<Header onMenuClick={vi.fn()} onStatsClick={onStatsClick} />)

    await user.click(screen.getByLabelText('Ver estadísticas'))

    expect(onStatsClick).toHaveBeenCalledOnce()
  })

  it('renders as a header element', () => {
    render(<Header onMenuClick={vi.fn()} onStatsClick={vi.fn()} />)

    expect(screen.getByRole('banner')).toBeDefined()
  })

  it('has the hamburger button on the left and stats button on the right', () => {
    render(<Header onMenuClick={vi.fn()} onStatsClick={vi.fn()} />)

    const hamburger = screen.getByLabelText('Abrir menú de navegación')
    const stats = screen.getByLabelText('Ver estadísticas')

    expect(hamburger.className).toContain('left-0')
    expect(stats.className).toContain('right-0')
  })
})
