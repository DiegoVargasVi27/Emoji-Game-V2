import { lazy, Suspense, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router'
import { useStore } from 'zustand'
import { gameStore } from '../../../main.tsx'
import { Header } from './Header.tsx'
import { NavigationDrawer } from './NavigationDrawer.tsx'
import { AdSidePanel } from '@presentation/components/ads/AdSidePanel.tsx'
import { GamePage } from '@presentation/pages/GamePage.tsx'

const HowToPlayPage = lazy(() => import('@presentation/pages/HowToPlayPage.tsx'))
const AboutProjectPage = lazy(() => import('@presentation/pages/AboutProjectPage.tsx'))
const AboutMePage = lazy(() => import('@presentation/pages/AboutMePage.tsx'))

function LoadingSpinner() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="h-8 w-8 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
    </div>
  )
}

const AD_SLOTS = {
  LEFT_PANEL: import.meta.env.VITE_AD_SLOT_LEFT_PANEL ?? '',
  RIGHT_PANEL: import.meta.env.VITE_AD_SLOT_RIGHT_PANEL ?? '',
} as const

export function App() {
  const toggleStatsModal = useStore(gameStore, (s) => s.toggleStatsModal)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const isGameRoute = pathname === '/'

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header
        onStatsClick={toggleStatsModal}
        onMenuClick={() => setIsMenuOpen(true)}
      />
      <NavigationDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
      <div className="flex flex-row justify-center w-full flex-1 min-h-0">
        {isGameRoute && (
          <AdSidePanel adSlot={AD_SLOTS.LEFT_PANEL} side="left" />
        )}
        <main className="flex-1 flex flex-col min-h-0 w-full max-w-lg mx-auto">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<GamePage />} />
              <Route path="/how-to-play" element={<HowToPlayPage />} />
              <Route path="/about" element={<AboutProjectPage />} />
              <Route path="/about-me" element={<AboutMePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
        {isGameRoute && (
          <AdSidePanel adSlot={AD_SLOTS.RIGHT_PANEL} side="right" />
        )}
      </div>
    </div>
  )
}
