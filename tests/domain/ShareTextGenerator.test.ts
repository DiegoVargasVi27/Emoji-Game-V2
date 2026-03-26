import { generateShareText } from '@domain/services/ShareTextGenerator'
import { Game } from '@domain/model/Game'
import { GameDate } from '@domain/model/GameDate'
import { Emoji } from '@domain/model/Emoji'
import { EmojiSequence } from '@domain/model/EmojiSequence'
import { EmojiCategory } from '@domain/model/EmojiCategory'
import { CategoryId } from '@domain/model/CategoryId'

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

describe('ShareTextGenerator', () => {
  it('should show won game header with attempt count', () => {
    const game = makeGame()
    const won = game
      .submitGuess(seq('F', 'F', 'F', 'F', 'F'))
      .submitGuess(seq('A', 'B', 'C', 'D', 'E'))

    const text = generateShareText(won)
    const lines = text.split('\n')

    expect(lines[0]).toBe('Emoji Wordle 2026-03-11 2/6')
  })

  it('should show lost game header with X', () => {
    let game = makeGame()
    const wrong = seq('F', 'F', 'F', 'F', 'F')

    for (let i = 0; i < 6; i++) {
      game = game.submitGuess(wrong)
    }

    const text = generateShareText(game)
    const lines = text.split('\n')

    expect(lines[0]).toBe('Emoji Wordle 2026-03-11 X/6')
  })

  it('should map tiles to correct emoji squares', () => {
    const game = makeGame()
    // guess: A F C F F -> correct, absent, correct, absent, absent
    // guess: A B C D E -> all correct
    const g1 = game.submitGuess(seq('A', 'F', 'C', 'F', 'F'))
    const g2 = g1.submitGuess(seq('A', 'B', 'C', 'D', 'E'))

    const text = generateShareText(g2)
    const lines = text.split('\n')

    expect(lines[1]).toBe('\u{1f7e9}\u{2b1b}\u{1f7e9}\u{2b1b}\u{2b1b}')
    expect(lines[2]).toBe('\u{1f7e9}\u{1f7e9}\u{1f7e9}\u{1f7e9}\u{1f7e9}')
  })

  it('should produce header only for game with 0 attempts', () => {
    const game = makeGame()

    const text = generateShareText(game)

    expect(text).toBe('Emoji Wordle 2026-03-11 0/6')
  })

  describe('with playerName', () => {
    it('should include player name in header for won game', () => {
      const game = makeGame()
      const won = game
        .submitGuess(seq('F', 'F', 'F', 'F', 'F'))
        .submitGuess(seq('A', 'B', 'C', 'D', 'E'))

      const text = generateShareText(won, 'Diego')
      const lines = text.split('\n')

      expect(lines[0]).toBe('🏆 Diego jugó Emoji Wordle 2026-03-11 2/6')
    })

    it('should include player name in header for lost game', () => {
      let game = makeGame()
      const wrong = seq('F', 'F', 'F', 'F', 'F')

      for (let i = 0; i < 6; i++) {
        game = game.submitGuess(wrong)
      }

      const text = generateShareText(game, 'Diego')
      const lines = text.split('\n')

      expect(lines[0]).toBe('🏆 Diego jugó Emoji Wordle 2026-03-11 X/6')
    })

    it('should use original format when name is empty string', () => {
      const game = makeGame()
      const won = game.submitGuess(seq('A', 'B', 'C', 'D', 'E'))

      const text = generateShareText(won, '')
      const lines = text.split('\n')

      expect(lines[0]).toBe('Emoji Wordle 2026-03-11 1/6')
    })

    it('should use original format when name is whitespace only', () => {
      const game = makeGame()
      const won = game.submitGuess(seq('A', 'B', 'C', 'D', 'E'))

      const text = generateShareText(won, '   ')
      const lines = text.split('\n')

      expect(lines[0]).toBe('Emoji Wordle 2026-03-11 1/6')
    })

    it('should truncate name longer than 50 characters', () => {
      const game = makeGame()
      const won = game.submitGuess(seq('A', 'B', 'C', 'D', 'E'))
      const longName = 'A'.repeat(51)

      const text = generateShareText(won, longName)
      const lines = text.split('\n')

      expect(lines[0]).toBe(`🏆 ${'A'.repeat(50)} jugó Emoji Wordle 2026-03-11 1/6`)
    })

    it('should include special characters and emojis in name as-is', () => {
      const game = makeGame()
      const won = game.submitGuess(seq('A', 'B', 'C', 'D', 'E'))

      const text = generateShareText(won, 'Diego 🎮')
      const lines = text.split('\n')

      expect(lines[0]).toBe('🏆 Diego 🎮 jugó Emoji Wordle 2026-03-11 1/6')
    })
  })
})
