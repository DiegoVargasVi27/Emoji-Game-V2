import { PlayerStats } from '@domain/model/PlayerStats'
import { GameDate } from '@domain/model/GameDate'

describe('PlayerStats', () => {
  it('should return all zeros from empty()', () => {
    const stats = PlayerStats.empty()

    expect(stats.gamesPlayed).toBe(0)
    expect(stats.gamesWon).toBe(0)
    expect(stats.currentStreak).toBe(0)
    expect(stats.bestStreak).toBe(0)
    expect(stats.lastPlayedDate).toBeNull()
    expect(stats.guessDistribution).toEqual({
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0,
    })
  })

  it('should record first win correctly', () => {
    const stats = PlayerStats.empty()
    const date = GameDate.create('2026-03-10')
    const updated = stats.recordResult(date, 'won', 3)

    expect(updated.gamesPlayed).toBe(1)
    expect(updated.gamesWon).toBe(1)
    expect(updated.currentStreak).toBe(1)
    expect(updated.bestStreak).toBe(1)
  })

  it('should record first loss correctly', () => {
    const stats = PlayerStats.empty()
    const date = GameDate.create('2026-03-10')
    const updated = stats.recordResult(date, 'lost', 6)

    expect(updated.gamesPlayed).toBe(1)
    expect(updated.gamesWon).toBe(0)
    expect(updated.currentStreak).toBe(0)
  })

  it('should increment streak on consecutive wins', () => {
    let stats = PlayerStats.empty()
    stats = stats.recordResult(GameDate.create('2026-03-10'), 'won', 2)
    stats = stats.recordResult(GameDate.create('2026-03-11'), 'won', 4)
    stats = stats.recordResult(GameDate.create('2026-03-12'), 'won', 1)

    expect(stats.currentStreak).toBe(3)
    expect(stats.bestStreak).toBe(3)
  })

  it('should reset currentStreak on loss but keep bestStreak', () => {
    let stats = PlayerStats.empty()
    stats = stats.recordResult(GameDate.create('2026-03-10'), 'won', 2)
    stats = stats.recordResult(GameDate.create('2026-03-11'), 'won', 4)
    stats = stats.recordResult(GameDate.create('2026-03-12'), 'lost', 6)

    expect(stats.currentStreak).toBe(0)
    expect(stats.bestStreak).toBe(2)
  })

  it('should reset streak when skipping a day', () => {
    let stats = PlayerStats.empty()
    stats = stats.recordResult(GameDate.create('2026-03-10'), 'won', 2)
    // skip 2026-03-11
    stats = stats.recordResult(GameDate.create('2026-03-12'), 'won', 3)

    expect(stats.currentStreak).toBe(1)
    expect(stats.bestStreak).toBe(1)
  })

  it('should increment correct bucket in guessDistribution on win', () => {
    let stats = PlayerStats.empty()
    stats = stats.recordResult(GameDate.create('2026-03-10'), 'won', 3)
    stats = stats.recordResult(GameDate.create('2026-03-11'), 'won', 3)

    expect(stats.guessDistribution[3]).toBe(2)
    expect(stats.guessDistribution[1]).toBe(0)
  })

  it('should not change guessDistribution on loss', () => {
    let stats = PlayerStats.empty()
    stats = stats.recordResult(GameDate.create('2026-03-10'), 'lost', 6)

    expect(stats.guessDistribution).toEqual({
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0,
    })
  })
})
