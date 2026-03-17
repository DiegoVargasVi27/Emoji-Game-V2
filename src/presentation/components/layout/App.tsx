import { lazy, Suspense, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { useStore } from 'zustand'
import { gameStore } from '../../../main.tsx'
import { Header } from './Header.tsx'
import { NavigationDrawer } from './NavigationDrawer.tsx'
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

export function App() {
  const toggleStatsModal = useStore(gameStore, (s) => s.toggleStatsModal)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
      </div>
    </div>
  )
}
