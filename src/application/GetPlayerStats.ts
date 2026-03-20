import type { IStatsRepository } from '@domain/ports/IStatsRepository.ts'
import type { PlayerStats } from '@domain/model/PlayerStats.ts'

export class GetPlayerStats {
  private readonly statsRepo: IStatsRepository

  constructor(statsRepo: IStatsRepository) {
    this.statsRepo = statsRepo
  }

  execute(): PlayerStats {
    return this.statsRepo.load()
  }
}
