import type { IStatsRepository } from '@domain/ports/IStatsRepository.ts'
import type { PlayerStats } from '@domain/model/PlayerStats.ts'

export class GetPlayerStats {
  constructor(
    private readonly statsRepo: IStatsRepository,
  ) {}

  execute(): PlayerStats {
    return this.statsRepo.load()
  }
}
