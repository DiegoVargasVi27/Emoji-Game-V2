import { GuessEvaluator } from '@domain/services/GuessEvaluator'
import { Emoji } from '@domain/model/Emoji'
import { EmojiSequence } from '@domain/model/EmojiSequence'

const e = (code: string) => Emoji.create({ code, name: code })
const seq = (...codes: string[]) => EmojiSequence.create(codes.map((c) => e(c)))

describe('GuessEvaluator', () => {
  const evaluator = new GuessEvaluator()

  it('should mark all correct when guess matches answer exactly', () => {
    const answer = seq('A', 'B', 'C', 'D', 'E')
    const guess = seq('A', 'B', 'C', 'D', 'E')

    const result = evaluator.evaluate(guess, answer)

    expect(result.tiles).toEqual(['correct', 'correct', 'correct', 'correct', 'correct'])
  })

  it('should mark all absent when no emoji appears in answer', () => {
    const answer = seq('A', 'B', 'C', 'D', 'E')
    const guess = seq('F', 'G', 'H', 'I', 'J')

    const result = evaluator.evaluate(guess, answer)

    expect(result.tiles).toEqual(['absent', 'absent', 'absent', 'absent', 'absent'])
  })

  it('should mark all misplaced when all emojis are in answer but wrong positions', () => {
    const answer = seq('A', 'B', 'C', 'D', 'E')
    const guess = seq('B', 'C', 'D', 'E', 'A')

    const result = evaluator.evaluate(guess, answer)

    expect(result.tiles).toEqual([
      'misplaced', 'misplaced', 'misplaced', 'misplaced', 'misplaced',
    ])
  })

  it('should handle mix of correct and misplaced', () => {
    const answer = seq('A', 'B', 'C', 'D', 'E')
    const guess = seq('A', 'C', 'B', 'D', 'F')

    const result = evaluator.evaluate(guess, answer)

    expect(result.tiles).toEqual([
      'correct', 'misplaced', 'misplaced', 'correct', 'absent',
    ])
  })

  it('should handle duplicate in guess with one in answer: first match gets result, second absent', () => {
    // answer: A B C D E — A appears once
    // guess:  A A F G H — A at pos 0 is correct, A at pos 1 has no remaining frequency
    const answer = seq('A', 'B', 'C', 'D', 'E')
    const guess = seq('A', 'A', 'F', 'G', 'H')

    const result = evaluator.evaluate(guess, answer)

    expect(result.tiles).toEqual(['correct', 'absent', 'absent', 'absent', 'absent'])
  })

  it('should handle duplicate in answer with one in guess: correct position gets correct', () => {
    // answer: A A C D E — A appears twice
    // guess:  A F G H I — A at pos 0 is correct
    const answer = seq('A', 'A', 'C', 'D', 'E')
    const guess = seq('A', 'F', 'G', 'H', 'I')

    const result = evaluator.evaluate(guess, answer)

    expect(result.tiles).toEqual(['correct', 'absent', 'absent', 'absent', 'absent'])
  })

  it('should handle duplicate in both guess and answer', () => {
    // answer: A A C D E — A appears twice
    // guess:  A A F G H — both A's match
    const answer = seq('A', 'A', 'C', 'D', 'E')
    const guess = seq('A', 'A', 'F', 'G', 'H')

    const result = evaluator.evaluate(guess, answer)

    expect(result.tiles).toEqual(['correct', 'correct', 'absent', 'absent', 'absent'])
  })

  it('should handle all same emoji in guess with once in answer', () => {
    // answer: A B C D E — A appears once at pos 0
    // guess:  A A A A A — only pos 0 is correct, rest absent
    const answer = seq('A', 'B', 'C', 'D', 'E')
    const guess = seq('A', 'A', 'A', 'A', 'A')

    const result = evaluator.evaluate(guess, answer)

    expect(result.tiles).toEqual(['correct', 'absent', 'absent', 'absent', 'absent'])
  })

  it('should give correct priority over misplaced in frequency counting', () => {
    // answer: A B C D E — A appears once
    // guess:  F A G H A — A at pos 1 is misplaced, A at pos 4 is absent
    //   but wait: correct pass first. Neither is correct.
    //   Then misplaced pass: pos 1 gets misplaced (frequency consumed), pos 4 gets absent
    const answer = seq('A', 'B', 'C', 'D', 'E')
    const guess = seq('F', 'A', 'G', 'H', 'A')

    const result = evaluator.evaluate(guess, answer)

    expect(result.tiles).toEqual(['absent', 'misplaced', 'absent', 'absent', 'absent'])
  })

  it('should mark remaining positions absent when all instances consumed by correct matches', () => {
    // answer: A A C D E — A appears twice
    // guess:  A A A F G — pos 0 correct, pos 1 correct, pos 2 has no remaining A's
    const answer = seq('A', 'A', 'C', 'D', 'E')
    const guess = seq('A', 'A', 'A', 'F', 'G')

    const result = evaluator.evaluate(guess, answer)

    expect(result.tiles).toEqual(['correct', 'correct', 'absent', 'absent', 'absent'])
  })
})
