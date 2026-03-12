import { DomainError } from './DomainError.ts'
import type { EmojiCategory } from './EmojiCategory.ts'
import type { EmojiSequence } from './EmojiSequence.ts'
import type { GameDate } from './GameDate.ts'
import type { GameStatus } from './GameStatus.ts'
import { Guess } from './Guess.ts'
import { GuessEvaluator } from '../services/GuessEvaluator.ts'

const MAX_ATTEMPTS = 6

export class Game {
  readonly id: GameDate
  readonly category: EmojiCategory
  readonly answer: EmojiSequence
  readonly attempts: readonly Guess[]
  readonly status: GameStatus
  readonly maxAttempts = 6 as const

  private constructor(
    id: GameDate,
    category: EmojiCategory,
    answer: EmojiSequence,
    attempts: readonly Guess[],
    status: GameStatus,
  ) {
    this.id = id
    this.category = category
    this.answer = answer
    this.attempts = attempts
    this.status = status
  }

  static create({
    date,
    category,
    answer,
  }: {
    date: GameDate
    category: EmojiCategory
    answer: EmojiSequence
  }): Game {
    return new Game(date, category, answer, [], 'playing')
  }

  static restore({
    date,
    category,
    answer,
    attempts,
    status,
  }: {
    date: GameDate
    category: EmojiCategory
    answer: EmojiSequence
    attempts: readonly Guess[]
    status: GameStatus
  }): Game {
    return new Game(date, category, answer, attempts, status)
  }

  submitGuess(sequence: EmojiSequence): Game {
    if (this.status !== 'playing') {
      throw new DomainError('Cannot submit guess: game is already over')
    }

    const evaluator = new GuessEvaluator()
    const result = evaluator.evaluate(sequence, this.answer)
    const guess = Guess.create({ sequence, result })
    const newAttempts = [...this.attempts, guess]

    let newStatus: GameStatus = 'playing'
    if (result.isAllCorrect()) {
      newStatus = 'won'
    } else if (newAttempts.length === MAX_ATTEMPTS) {
      newStatus = 'lost'
    }

    return new Game(this.id, this.category, this.answer, newAttempts, newStatus)
  }
}
