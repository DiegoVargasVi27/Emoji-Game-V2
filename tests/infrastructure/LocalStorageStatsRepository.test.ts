import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LocalStorageStatsRepository } from '@infrastructure/persistence/LocalStorageStatsRepository'
import { PlayerStats } from '@domain/model/PlayerStats'
import { GameDate } from '@domain/model/GameDate'

describe('LocalStorageStatsRepository', () => {
  let store: Record<string, string>
  let repo: LocalStorageStatsRepository

  beforeEach(() => {
    store = {}
    const mockStorage = {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key]
      }),
      clear: vi.fn(() => {
        store = {}
      }),
      length: 0,
      key: vi.fn(() => null),
    }
    vi.stubGlobal('localStorage', mockStorage)
    repo = new LocalStorageStatsRepository()
  })

  it('should return PlayerStats.empty() from empty localStorage', () => {
    const stats = repo.load()
    const empty = PlayerStats.empty()

    expect(stats.gamesPlayed).toBe(empty.gamesPlayed)
    expect(stats.gamesWon).toBe(empty.gamesWon)
    expect(stats.currentStreak).toBe(empty.currentStreak)
    expect(stats.bestStreak).toBe(empty.bestStreak)
    expect(stats.lastPlayedDate).toBeNull()
    expect(stats.guessDistribution).toEqual(empty.guessDistribution)
  })

  it('should return equivalent PlayerStats after save and load', () => {
    const date = GameDate.create('2026-03-12')
    const stats = PlayerStats.empty().recordResult(date, 'won', 3)
    repo.save(stats)

    const loaded = repo.load()
    expect(loaded.gamesPlayed).toBe(1)
    expect(loaded.gamesWon).toBe(1)
    expect(loaded.currentStreak).toBe(1)
    expect(loaded.bestStreak).toBe(1)
    expect(loaded.lastPlayedDate?.value).toBe('2026-03-12')
    expect(loaded.guessDistribution[3]).toBe(1)
  })

  it('should return PlayerStats.empty() for corrupt localStorage', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    store['emoji-wordle:stats'] = 'not valid json!!!'
    const stats = repo.load()

    expect(stats.gamesPlayed).toBe(0)
    expect(stats.gamesWon).toBe(0)
    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()
  })

  it('should overwrite existing stats on save', () => {
    const date1 = GameDate.create('2026-03-11')
    const date2 = GameDate.create('2026-03-12')
    const stats1 = PlayerStats.empty().recordResult(date1, 'won', 2)
    repo.save(stats1)

    const stats2 = stats1.recordResult(date2, 'won', 4)
    repo.save(stats2)

    const loaded = repo.load()
    expect(loaded.gamesPlayed).toBe(2)
    expect(loaded.gamesWon).toBe(2)
    expect(loaded.guessDistribution[2]).toBe(1)
    expect(loaded.guessDistribution[4]).toBe(1)
  })
})
