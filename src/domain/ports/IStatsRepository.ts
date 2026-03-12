import type { PlayerStats } from '@domain/model/PlayerStats'

export interface IStatsRepository {
  load(): PlayerStats
  save(stats: PlayerStats): void
}
