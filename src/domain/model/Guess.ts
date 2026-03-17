import type { EmojiSequence } from './EmojiSequence.ts'
import type { GuessResult } from './GuessResult.ts'

export class Guess {
  readonly sequence: EmojiSequence
  readonly result: GuessResult

  private constructor(sequence: EmojiSequence, result: GuessResult) {
    this.sequence = sequence
    this.result = result
  }

  static create({
    sequence,
    result,
  }: {
    sequence: EmojiSequence
    result: GuessResult
  }): Guess {
    return new Guess(sequence, result)
  }
}
