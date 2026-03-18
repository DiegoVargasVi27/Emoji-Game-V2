import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { Routes, Route, Navigate } from 'react-router'
import { lazy, Suspense } from 'react'

// Mock useDocumentTitle to avoid side effects
vi.mock('@presentation/hooks/useDocumentTitle.ts', () => ({
  useDocumentTitle: vi.fn(),
}))

// Lazy pages (same as App.tsx)
const HowToPlayPage = lazy(() => import('@presentation/pages/HowToPlayPage.tsx'))
const AboutProjectPage = lazy(() => import('@presentation/pages/AboutProjectPage.tsx'))
const AboutMePage = lazy(() => import('@presentation/pages/AboutMePage.tsx'))

function TestRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<div>Game Page</div>} />
        <Route path="/how-to-play" element={<HowToPlayPage />} />
        <Route path="/about" element={<AboutProjectPage />} />
        <Route path="/about-me" element={<AboutMePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

describe('Route Navigation', () => {
  it('renders the game page at /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <TestRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByText('Game Page')).toBeDefined()
  })

  it('renders HowToPlayPage at /how-to-play', async () => {
    render(
      <MemoryRouter initialEntries={['/how-to-play']}>
        <TestRoutes />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('Objetivo')).toBeDefined()
    })
  })

  it('renders AboutProjectPage at /about', async () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <TestRoutes />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('Arquitectura')).toBeDefined()
    })
  })

  it('renders AboutMePage at /about-me', async () => {
    render(
      <MemoryRouter initialEntries={['/about-me']}>
        <TestRoutes />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('Diego Vargas Vidaurre')).toBeDefined()
    })
  })

  it('redirects unknown routes to /', () => {
    render(
      <MemoryRouter initialEntries={['/non-existent']}>
        <TestRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByText('Game Page')).toBeDefined()
  })

  it('navigates from HowToPlayPage to game via "Jugar Ahora" link', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/how-to-play']}>
        <TestRoutes />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('Jugar Ahora')).toBeDefined()
    })

    await user.click(screen.getByText('Jugar Ahora'))

    await waitFor(() => {
      expect(screen.getByText('Game Page')).toBeDefined()
    })
  })
})
