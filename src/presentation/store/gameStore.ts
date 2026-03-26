import { createStore } from 'zustand/vanilla'
import type { Emoji } from '@domain/model/Emoji.ts'
import type { PlayerStats } from '@domain/model/PlayerStats.ts'
import { EmojiSequence } from '@domain/model/EmojiSequence.ts'
import { GameDate } from '@domain/model/GameDate.ts'
import { Game } from '@domain/model/Game.ts'
import { GameStateMapper } from '@presentation/mappers/GameStateMapper.ts'
import type { GameViewModel } from '@presentation/viewmodels/GameViewModel.ts'
import type { StartDailyGame } from '@application/StartDailyGame.ts'
import type { SubmitGuess } from '@application/SubmitGuess.ts'
import type { GetPlayerStats } from '@application/GetPlayerStats.ts'

export interface GameState {
  viewModel: GameViewModel | null
  isLoading: boolean
  error: string | null
  currentInput: Emoji[]
  showResultModal: boolean
  showStatsModal: boolean
  stats: PlayerStats | null
  isShaking: boolean
  isRevealing: boolean
  isWinBouncing: boolean
  revealedKeyStatuses: Record<string, 'correct' | 'misplaced' | 'absent' | 'unused'>
  modalDelay: number
}

export interface GameActions {
  startGame(): Promise<void>
  addEmoji(emoji: Emoji): void
  removeLastEmoji(): void
  submitGuess(): Promise<void>
  toggleResultModal(): void
  toggleStatsModal(): void
  loadStats(): Promise<void>
  clearShake(): void
  getGame(): Game | null
}

export type GameStore = GameState & GameActions

interface UseCases {
  startDailyGame: StartDailyGame
  submitGuess: SubmitGuess
  getPlayerStats: GetPlayerStats
}

function getTodayDate(): GameDate {
  return GameDate.fromUTCDate(new Date())
}

export function createGameStore(useCases: UseCases) {
  let currentGame: Game | null = null

  const store = createStore<GameStore>((set, get) => ({
    // State
    viewModel: null,
    isLoading: false,
    error: null,
    currentInput: [],
    showResultModal: false,
    showStatsModal: false,
    stats: null,
    isShaking: false,
    isRevealing: false,
    isWinBouncing: false,
    revealedKeyStatuses: {},
    modalDelay: 0,

    // Actions
    async startGame() {
      set({ isLoading: true, error: null })
      try {
        const date = getTodayDate()
        const game = useCases.startDailyGame.execute(date)
        currentGame = game

        const { currentInput } = get()
        const viewModel = GameStateMapper.toViewModel(game, currentInput)

        const showResultModal = game.status !== 'playing'
        set({ viewModel, isLoading: false, showResultModal })

        if (showResultModal) {
          const stats = useCases.getPlayerStats.execute()
          set({ stats })
        }
      } catch (err) {
        set({
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to start game',
        })
      }
    },

    addEmoji(emoji: Emoji) {
      const { currentInput } = get()
      if (currentInput.length >= 5) return
      if (!currentGame) return

      const newInput = [...currentInput, emoji]
      const viewModel = GameStateMapper.toViewModel(currentGame, newInput)
      set({ currentInput: newInput, viewModel })
    },

    removeLastEmoji() {
      const { currentInput } = get()
      if (currentInput.length === 0) return
      if (!currentGame) return

      const newInput = currentInput.slice(0, -1)
      const viewModel = GameStateMapper.toViewModel(currentGame, newInput)
      set({ currentInput: newInput, viewModel })
    },

    async submitGuess() {
      const { currentInput } = get()
      if (!currentGame) return

      // 7.3: Shake if incomplete
      if (currentInput.length !== 5) {
        set({ isShaking: true })
        return
      }

      try {
        const date = currentGame.id
        const sequence = EmojiSequence.create(currentInput)
        const updatedGame = useCases.submitGuess.execute(date, sequence)
        currentGame = updatedGame

        const newInput: Emoji[] = []
        const viewModel = GameStateMapper.toViewModel(updatedGame, newInput)

        const gameEnded = updatedGame.status !== 'playing'

        // Start reveal animation
        set({
          currentInput: newInput,
          viewModel,
          isRevealing: true,
          revealedKeyStatuses: {},
        })

        // 7.6: Cascade keyboard color updates to match tile flips
        const lastGuess = updatedGame.attempts[updatedGame.attempts.length - 1]
        if (lastGuess) {
          for (let i = 0; i < 5; i++) {
            const delay = i * 300 + 500 // flip delay + flip duration
            setTimeout(() => {
              const emoji = lastGuess.sequence.emojis[i]
              const tile = lastGuess.result.tiles[i]
              if (emoji && tile) {
                set((state) => ({
                  revealedKeyStatuses: {
                    ...state.revealedKeyStatuses,
                    [emoji.code]: tile as 'correct' | 'misplaced' | 'absent',
                  },
                }))
              }
            }, delay)
          }
        }

        // After reveal completes (~1700ms)
        const REVEAL_DURATION = 1700

        if (gameEnded && updatedGame.status === 'won') {
          // 7.4: Win bounce after reveal
          setTimeout(() => {
            set({ isRevealing: false, isWinBouncing: true })
          }, REVEAL_DURATION)

          // Show modal after bounce (~2200ms after flip start = ~4s total)
          const WIN_MODAL_DELAY = REVEAL_DURATION + 2200
          setTimeout(() => {
            set({ isWinBouncing: false, showResultModal: true })
          }, WIN_MODAL_DELAY)

          const stats = useCases.getPlayerStats.execute()
          set({ stats, modalDelay: WIN_MODAL_DELAY })
        } else if (gameEnded) {
          // Loss: show modal after reveal + buffer
          const LOSS_MODAL_DELAY = REVEAL_DURATION + 500
          setTimeout(() => {
            set({ isRevealing: false, showResultModal: true })
          }, LOSS_MODAL_DELAY)

          const stats = useCases.getPlayerStats.execute()
          set({ stats, modalDelay: LOSS_MODAL_DELAY })
        } else {
          // Normal guess, just end reveal
          setTimeout(() => {
            set({ isRevealing: false, revealedKeyStatuses: {} })
          }, REVEAL_DURATION)
        }
      } catch (err) {
        set({
          error: err instanceof Error ? err.message : 'Failed to submit guess',
        })
      }
    },

    clearShake() {
      set({ isShaking: false })
    },

    getGame() {
      return currentGame
    },

    toggleResultModal() {
      set((state) => ({ showResultModal: !state.showResultModal }))
    },

    toggleStatsModal() {
      set((state) => ({ showStatsModal: !state.showStatsModal }))
    },

    async loadStats() {
      try {
        const stats = useCases.getPlayerStats.execute()
        set({ stats })
      } catch (err) {
        set({
          error:
            err instanceof Error ? err.message : 'Failed to load stats',
        })
      }
    },
  }))

  return store
}
