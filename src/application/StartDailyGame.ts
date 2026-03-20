import type { IGameRepository } from '@domain/ports/IGameRepository.ts'
import type { IChallengeGenerator } from '@domain/ports/IChallengeGenerator.ts'
import type { GameDate } from '@domain/model/GameDate.ts'
import { Game } from '@domain/model/Game.ts'

export class StartDailyGame {
  private readonly gameRepo: IGameRepository
  private readonly challengeGenerator: IChallengeGenerator

  constructor(gameRepo: IGameRepository, challengeGenerator: IChallengeGenerator) {
    this.gameRepo = gameRepo
    this.challengeGenerator = challengeGenerator
  }

  execute(date: GameDate): Game {
    const existing = this.gameRepo.loadByDate(date)
    if (existing) return existing

    const { category, answer } = this.challengeGenerator.generate(date)
    const game = Game.create({ date, category, answer })
    this.gameRepo.save(game)
    return game
  }
}
