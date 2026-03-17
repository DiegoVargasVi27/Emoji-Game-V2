import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { EMOJI_CATALOG } from '@infrastructure/catalog/emojiCatalog.ts'
import { SeededChallengeGenerator } from '@infrastructure/challenge/SeededChallengeGenerator.ts'
import { LocalStorageGameRepository } from '@infrastructure/persistence/LocalStorageGameRepository.ts'
import { LocalStorageStatsRepository } from '@infrastructure/persistence/LocalStorageStatsRepository.ts'
import { StartDailyGame } from '@application/StartDailyGame.ts'
import { SubmitGuess } from '@application/SubmitGuess.ts'
import { GetPlayerStats } from '@application/GetPlayerStats.ts'
import { createGameStore } from '@presentation/store/gameStore.ts'

// Infrastructure
const challengeGenerator = new SeededChallengeGenerator(EMOJI_CATALOG)
const gameRepo = new LocalStorageGameRepository()
const statsRepo = new LocalStorageStatsRepository()

// Use cases
const startDailyGame = new StartDailyGame(gameRepo, challengeGenerator)
const submitGuess = new SubmitGuess(gameRepo, statsRepo)
const getPlayerStats = new GetPlayerStats(statsRepo)

// Store
export const gameStore = createGameStore({
  startDailyGame,
  submitGuess,
  getPlayerStats,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
