import type { IStatsRepository } from '@domain/ports/IStatsRepository'
import { PlayerStats } from '@domain/model/PlayerStats'
import { GameDate } from '@domain/model/GameDate'

interface SerializedStats {
  gamesPlayed: number
  gamesWon: number
  currentStreak: number
  bestStreak: number
  lastPlayedDate: string | null
  guessDistribution: Record<string, number>
}

const STATS_KEY = 'emoji-wordle:stats'

export class LocalStorageStatsRepository implements IStatsRepository {
  load(): PlayerStats {
    const raw = localStorage.getItem(STATS_KEY)
    if (raw === null) {
      return PlayerStats.empty()
    }

    try {
      const data = JSON.parse(raw) as SerializedStats

      const lastPlayedDate = data.lastPlayedDate
        ? GameDate.create(data.lastPlayedDate)
        : null

      const dist = data.guessDistribution
      const guessDistribution = {
        1: (dist['1'] ?? 0) as number,
        2: (dist['2'] ?? 0) as number,
        3: (dist['3'] ?? 0) as number,
        4: (dist['4'] ?? 0) as number,
        5: (dist['5'] ?? 0) as number,
        6: (dist['6'] ?? 0) as number,
      } as const

      return PlayerStats.restore({
        gamesPlayed: data.gamesPlayed,
        gamesWon: data.gamesWon,
        currentStreak: data.currentStreak,
        bestStreak: data.bestStreak,
        lastPlayedDate,
        guessDistribution,
      })
    } catch (error) {
      console.warn('Failed to load player stats:', error)
      return PlayerStats.empty()
    }
  }

  save(stats: PlayerStats): void {
    const serialized: SerializedStats = {
      gamesPlayed: stats.gamesPlayed,
      gamesWon: stats.gamesWon,
      currentStreak: stats.currentStreak,
      bestStreak: stats.bestStreak,
      lastPlayedDate: stats.lastPlayedDate?.value ?? null,
      guessDistribution: { ...stats.guessDistribution },
    }
    localStorage.setItem(STATS_KEY, JSON.stringify(serialized))
  }
}
