import { Game } from '@domain/model/Game'
import { GameDate } from '@domain/model/GameDate'
import { Emoji } from '@domain/model/Emoji'
import { EmojiSequence } from '@domain/model/EmojiSequence'
import { EmojiCategory } from '@domain/model/EmojiCategory'
import { CategoryId } from '@domain/model/CategoryId'
import { DomainError } from '@domain/model/DomainError'

const e = (code: string) => Emoji.create({ code, name: code })
const seq = (...codes: string[]) => EmojiSequence.create(codes.map((c) => e(c)))

const makeGame = () => {
  const date = GameDate.create('2026-03-11')
  const category = EmojiCategory.create({
    id: CategoryId.create('fruits'),
    name: 'Fruits',
    emojis: [e('A'), e('B'), e('C'), e('D'), e('E'), e('F')],
  })
  const answer = seq('A', 'B', 'C', 'D', 'E')
  return Game.create({ date, category, answer })
}

describe('Game', () => {
  it('should start with status "playing" and empty attempts', () => {
    const game = makeGame()

    expect(game.status).toBe('playing')
    expect(game.attempts).toHaveLength(0)
  })

  it('should transition to "won" on correct guess', () => {
    const game = makeGame()
    const won = game.submitGuess(seq('A', 'B', 'C', 'D', 'E'))

    expect(won.status).toBe('won')
  })

  it('should stay "playing" on wrong guess', () => {
    const game = makeGame()
    const next = game.submitGuess(seq('F', 'F', 'F', 'F', 'F'))

    expect(next.status).toBe('playing')
  })

  it('should transition to "lost" after 6 wrong guesses', () => {
    let game = makeGame()
    const wrong = seq('F', 'F', 'F', 'F', 'F')

    for (let i = 0; i < 6; i++) {
      game = game.submitGuess(wrong)
    }

    expect(game.status).toBe('lost')
  })

  it('should throw when submitting after winning', () => {
    const game = makeGame()
    const won = game.submitGuess(seq('A', 'B', 'C', 'D', 'E'))

    expect(() => won.submitGuess(seq('A', 'B', 'C', 'D', 'E'))).toThrow(
      'Cannot submit guess: game is already over',
    )
  })

  it('should throw when submitting after losing', () => {
    let game = makeGame()
    const wrong = seq('F', 'F', 'F', 'F', 'F')

    for (let i = 0; i < 6; i++) {
      game = game.submitGuess(wrong)
    }

    expect(() => game.submitGuess(wrong)).toThrow(
      'Cannot submit guess: game is already over',
    )
  })

  it('should return a NEW Game instance on each submitGuess (immutable)', () => {
    const game = makeGame()
    const next = game.submitGuess(seq('F', 'F', 'F', 'F', 'F'))

    expect(next).not.toBe(game)
  })

  it('should accumulate attempts correctly', () => {
    const game = makeGame()
    const wrong = seq('F', 'F', 'F', 'F', 'F')

    const g1 = game.submitGuess(wrong)
    const g2 = g1.submitGuess(wrong)
    const g3 = g2.submitGuess(wrong)

    expect(g1.attempts).toHaveLength(1)
    expect(g2.attempts).toHaveLength(2)
    expect(g3.attempts).toHaveLength(3)
  })
})
