import type { EmojiSequence } from '../model/EmojiSequence.ts'
import { GuessResult } from '../model/GuessResult.ts'
import type { TileResult } from '../model/TileResult.ts'

export class GuessEvaluator {
  evaluate(guess: EmojiSequence, answer: EmojiSequence): GuessResult {
    const tiles: TileResult[] = Array(5).fill('absent') as TileResult[]

    const frequency = new Map<string, number>()
    for (const emoji of answer.emojis) {
      frequency.set(emoji.code, (frequency.get(emoji.code) ?? 0) + 1)
    }

    // Pass 1: mark correct
    for (let i = 0; i < 5; i++) {
      const guessEmoji = guess.emojis[i]!
      const answerEmoji = answer.emojis[i]!
      if (guessEmoji.code === answerEmoji.code) {
        tiles[i] = 'correct'
        frequency.set(guessEmoji.code, (frequency.get(guessEmoji.code) ?? 0) - 1)
      }
    }

    // Pass 2: mark misplaced or absent
    for (let i = 0; i < 5; i++) {
      if (tiles[i] === 'correct') continue
      const guessEmoji = guess.emojis[i]!
      const remaining = frequency.get(guessEmoji.code) ?? 0
      if (remaining > 0) {
        tiles[i] = 'misplaced'
        frequency.set(guessEmoji.code, remaining - 1)
      }
    }

    return GuessResult.create(tiles)
  }
}
