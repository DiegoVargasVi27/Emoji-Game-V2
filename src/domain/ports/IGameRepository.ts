import type { Game } from '@domain/model/Game'
import type { GameDate } from '@domain/model/GameDate'

export interface IGameRepository {
  save(game: Game): void
  loadByDate(date: GameDate): Game | null
}
