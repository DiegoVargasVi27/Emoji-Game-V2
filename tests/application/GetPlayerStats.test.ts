import { GetPlayerStats } from '@application/GetPlayerStats'
import { PlayerStats } from '@domain/model/PlayerStats'
import { GameDate } from '@domain/model/GameDate'
import type { IStatsRepository } from '@domain/ports/IStatsRepository'

const createMocks = () => {
  const statsRepo: IStatsRepository = {
    load: vi.fn(),
    save: vi.fn(),
  }
  return { statsRepo }
}

describe('GetPlayerStats', () => {
  it('should return stats from repository', () => {
    const { statsRepo } = createMocks()
    const stats = PlayerStats.empty().recordResult(
      GameDate.create('2026-03-11'),
      'won',
      3,
    )
    vi.mocked(statsRepo.load).mockReturnValue(stats)

    const useCase = new GetPlayerStats(statsRepo)
    const result = useCase.execute()

    expect(result).toBe(stats)
    expect(result.gamesPlayed).toBe(1)
    expect(result.gamesWon).toBe(1)
  })

  it('should return empty stats if repository returns empty', () => {
    const { statsRepo } = createMocks()
    vi.mocked(statsRepo.load).mockReturnValue(PlayerStats.empty())

    const useCase = new GetPlayerStats(statsRepo)
    const result = useCase.execute()

    expect(result.gamesPlayed).toBe(0)
    expect(result.gamesWon).toBe(0)
    expect(result.currentStreak).toBe(0)
    expect(result.bestStreak).toBe(0)
  })
})
