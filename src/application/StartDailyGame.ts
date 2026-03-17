import type { IGameRepository } from '@domain/ports/IGameRepository.ts'
import type { IChallengeGenerator } from '@domain/ports/IChallengeGenerator.ts'
import type { GameDate } from '@domain/model/GameDate.ts'
import { Game } from '@domain/model/Game.ts'

export class StartDailyGame {
  constructor(
    private readonly gameRepo: IGameRepository,
    private readonly challengeGenerator: IChallengeGenerator,
  ) {}

  execute(date: GameDate): Game {
    const existing = this.gameRepo.loadByDate(date)
    if (existing) return existing

    const { category, answer } = this.challengeGenerator.generate(date)
    const game = Game.create({ date, category, answer })
    this.gameRepo.save(game)
    return game
  }
}
