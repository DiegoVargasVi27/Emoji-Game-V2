import { useEffect } from 'react'
import { useStore } from 'zustand'
import { gameStore } from '../../main.tsx'

export function useGame() {
  const viewModel = useStore(gameStore, (s) => s.viewModel)
  const isLoading = useStore(gameStore, (s) => s.isLoading)
  const error = useStore(gameStore, (s) => s.error)
  const addEmoji = useStore(gameStore, (s) => s.addEmoji)
  const removeLastEmoji = useStore(gameStore, (s) => s.removeLastEmoji)
  const submitGuess = useStore(gameStore, (s) => s.submitGuess)
  const showResultModal = useStore(gameStore, (s) => s.showResultModal)
  const showStatsModal = useStore(gameStore, (s) => s.showStatsModal)
  const toggleResultModal = useStore(gameStore, (s) => s.toggleResultModal)
  const toggleStatsModal = useStore(gameStore, (s) => s.toggleStatsModal)
  const stats = useStore(gameStore, (s) => s.stats)
  const startGame = useStore(gameStore, (s) => s.startGame)
  const isShaking = useStore(gameStore, (s) => s.isShaking)
  const isRevealing = useStore(gameStore, (s) => s.isRevealing)
  const isWinBouncing = useStore(gameStore, (s) => s.isWinBouncing)
  const clearShake = useStore(gameStore, (s) => s.clearShake)
  const revealedKeyStatuses = useStore(gameStore, (s) => s.revealedKeyStatuses)
  const getGame = useStore(gameStore, (s) => s.getGame)

  useEffect(() => {
    void startGame()
  }, [startGame])

  return {
    viewModel,
    isLoading,
    error,
    addEmoji,
    removeLastEmoji,
    submitGuess,
    showResultModal,
    showStatsModal,
    toggleResultModal,
    toggleStatsModal,
    stats,
    isShaking,
    isRevealing,
    isWinBouncing,
    clearShake,
    revealedKeyStatuses,
    getGame,
  }
}
