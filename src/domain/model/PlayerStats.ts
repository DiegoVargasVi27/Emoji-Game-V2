import { GameDate } from './GameDate.ts'

type GuessDistribution = Readonly<Record<1 | 2 | 3 | 4 | 5 | 6, number>>

export class PlayerStats {
  readonly gamesPlayed: number
  readonly gamesWon: number
  readonly currentStreak: number
  readonly bestStreak: number
  readonly lastPlayedDate: GameDate | null
  readonly guessDistribution: GuessDistribution

  private constructor(
    gamesPlayed: number,
    gamesWon: number,
    currentStreak: number,
    bestStreak: number,
    lastPlayedDate: GameDate | null,
    guessDistribution: GuessDistribution,
  ) {
    this.gamesPlayed = gamesPlayed
    this.gamesWon = gamesWon
    this.currentStreak = currentStreak
    this.bestStreak = bestStreak
    this.lastPlayedDate = lastPlayedDate
    this.guessDistribution = guessDistribution
  }

  static empty(): PlayerStats {
    return new PlayerStats(0, 0, 0, 0, null, {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
    })
  }

  static restore({
    gamesPlayed,
    gamesWon,
    currentStreak,
    bestStreak,
    lastPlayedDate,
    guessDistribution,
  }: {
    gamesPlayed: number
    gamesWon: number
    currentStreak: number
    bestStreak: number
    lastPlayedDate: GameDate | null
    guessDistribution: Readonly<Record<1 | 2 | 3 | 4 | 5 | 6, number>>
  }): PlayerStats {
    return new PlayerStats(
      gamesPlayed,
      gamesWon,
      currentStreak,
      bestStreak,
      lastPlayedDate,
      guessDistribution,
    )
  }

  recordResult(
    date: GameDate,
    outcome: 'won' | 'lost',
    attemptsUsed: number,
  ): PlayerStats {
    const newGamesPlayed = this.gamesPlayed + 1
    const newGamesWon = outcome === 'won' ? this.gamesWon + 1 : this.gamesWon

    const yesterday = this.getYesterday(date)
    const isConsecutive =
      this.lastPlayedDate !== null && this.lastPlayedDate.equals(yesterday)

    let newCurrentStreak: number
    if (outcome === 'won') {
      newCurrentStreak = isConsecutive ? this.currentStreak + 1 : 1
    } else {
      newCurrentStreak = 0
    }

    const newBestStreak = Math.max(this.bestStreak, newCurrentStreak)

    const newDistribution = { ...this.guessDistribution }
    if (outcome === 'won') {
      const key = attemptsUsed as 1 | 2 | 3 | 4 | 5 | 6
      newDistribution[key] = (newDistribution[key] ?? 0) + 1
    }

    return new PlayerStats(
      newGamesPlayed,
      newGamesWon,
      newCurrentStreak,
      newBestStreak,
      date,
      newDistribution,
    )
  }

  private getYesterday(date: GameDate): GameDate {
    const d = new Date(date.value + 'T00:00:00Z')
    d.setUTCDate(d.getUTCDate() - 1)
    return GameDate.fromUTCDate(d)
  }
}
