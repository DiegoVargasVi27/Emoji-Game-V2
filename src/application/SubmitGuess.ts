import type { IGameRepository } from '@domain/ports/IGameRepository.ts'
import type { IStatsRepository } from '@domain/ports/IStatsRepository.ts'
import type { GameDate } from '@domain/model/GameDate.ts'
import type { EmojiSequence } from '@domain/model/EmojiSequence.ts'
import type { Game } from '@domain/model/Game.ts'
import { ApplicationError } from './ApplicationError.ts'

export class SubmitGuess {
  private readonly gameRepo: IGameRepository
  private readonly statsRepo: IStatsRepository

  constructor(gameRepo: IGameRepository, statsRepo: IStatsRepository) {
    this.gameRepo = gameRepo
    this.statsRepo = statsRepo
  }

  execute(date: GameDate, sequence: EmojiSequence): Game {
    const game = this.gameRepo.loadByDate(date)
    if (!game) throw new ApplicationError('No active game found')

    const updatedGame = game.submitGuess(sequence)
    this.gameRepo.save(updatedGame)

    if (updatedGame.status !== 'playing') {
      const stats = this.statsRepo.load()
      const outcome = updatedGame.status === 'won' ? 'won' : 'lost'
      const updatedStats = stats.recordResult(date, outcome, updatedGame.attempts.length)
      this.statsRepo.save(updatedStats)
    }

    return updatedGame
  }
}
