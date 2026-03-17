import { describe, it, expect } from 'vitest'
import { GameStateMapper } from '@presentation/mappers/GameStateMapper.ts'
import { Game } from '@domain/model/Game.ts'
import { GameDate } from '@domain/model/GameDate.ts'
import { CategoryId } from '@domain/model/CategoryId.ts'
import { Emoji } from '@domain/model/Emoji.ts'
import { EmojiCategory } from '@domain/model/EmojiCategory.ts'
import { EmojiSequence } from '@domain/model/EmojiSequence.ts'
import { GuessResult } from '@domain/model/GuessResult.ts'
import { Guess } from '@domain/model/Guess.ts'
import type { TileResult } from '@domain/model/TileResult.ts'

function makeEmoji(code: string, name?: string): Emoji {
  return Emoji.create({ code, name: name ?? code })
}

function makeCategory(): EmojiCategory {
  return EmojiCategory.create({
    id: CategoryId.create('fruits'),
    name: 'Fruits',
    emojis: [
      makeEmoji('🍎', 'red apple'),
      makeEmoji('🍊', 'orange'),
      makeEmoji('🍋', 'lemon'),
      makeEmoji('🍇', 'grapes'),
      makeEmoji('🍉', 'watermelon'),
      makeEmoji('🍓', 'strawberry'),
      makeEmoji('🍑', 'peach'),
    ],
  })
}

function makeSequence(codes: string[]): EmojiSequence {
  return EmojiSequence.create(codes.map((c) => makeEmoji(c)))
}

function makeGuess(
  codes: string[],
  tiles: TileResult[],
): Guess {
  return Guess.create({
    sequence: makeSequence(codes),
    result: GuessResult.create(tiles),
  })
}

function makeFreshGame(): Game {
  return Game.create({
    date: GameDate.create('2026-03-15'),
    category: makeCategory(),
    answer: makeSequence(['🍎', '🍊', '🍋', '🍇', '🍉']),
  })
}

describe('GameStateMapper', () => {
  it('maps fresh game (0 attempts) to 6 empty rows with all keys unused', () => {
    const game = makeFreshGame()
    const vm = GameStateMapper.toViewModel(game, [])

    expect(vm.board).toHaveLength(6)
    for (const row of vm.board) {
      expect(row).toHaveLength(5)
      for (const tile of row) {
        expect(tile.emoji).toBeNull()
        expect(tile.status).toBe('empty')
      }
    }

    for (const key of vm.keyboardKeys) {
      expect(key.status).toBe('unused')
    }
  })

  it('maps game with 2 guesses: first 2 rows evaluated, row 3 shows currentInput, rows 4-6 empty', () => {
    const game = Game.restore({
      date: GameDate.create('2026-03-15'),
      category: makeCategory(),
      answer: makeSequence(['🍎', '🍊', '🍋', '🍇', '🍉']),
      attempts: [
        makeGuess(
          ['🍎', '🍓', '🍋', '🍑', '🍉'],
          ['correct', 'absent', 'correct', 'absent', 'correct'],
        ),
        makeGuess(
          ['🍎', '🍊', '🍇', '🍋', '🍉'],
          ['correct', 'correct', 'misplaced', 'misplaced', 'correct'],
        ),
      ],
      status: 'playing',
    })

    const currentInput = [makeEmoji('🍎'), makeEmoji('🍊')]
    const vm = GameStateMapper.toViewModel(game, currentInput)

    // Row 0: evaluated
    expect(vm.board[0]![0]!.status).toBe('correct')
    expect(vm.board[0]![0]!.emoji).toBe('🍎')
    expect(vm.board[0]![1]!.status).toBe('absent')
    expect(vm.board[0]![4]!.status).toBe('correct')

    // Row 1: evaluated
    expect(vm.board[1]![1]!.status).toBe('correct')
    expect(vm.board[1]![2]!.status).toBe('misplaced')

    // Row 2: current input (2 pending + 3 empty)
    expect(vm.board[2]![0]!.status).toBe('pending')
    expect(vm.board[2]![0]!.emoji).toBe('🍎')
    expect(vm.board[2]![1]!.status).toBe('pending')
    expect(vm.board[2]![1]!.emoji).toBe('🍊')
    expect(vm.board[2]![2]!.status).toBe('empty')
    expect(vm.board[2]![3]!.status).toBe('empty')
    expect(vm.board[2]![4]!.status).toBe('empty')

    // Rows 3-5: empty
    for (let r = 3; r < 6; r++) {
      for (const tile of vm.board[r]!) {
        expect(tile.status).toBe('empty')
        expect(tile.emoji).toBeNull()
      }
    }
  })

  it('keyboard key that was correct in one guess and absent in another shows correct (best-status wins)', () => {
    const game = Game.restore({
      date: GameDate.create('2026-03-15'),
      category: makeCategory(),
      answer: makeSequence(['🍎', '🍊', '🍋', '🍇', '🍉']),
      attempts: [
        // 🍎 is absent in position 1 (wrong position, not in answer at pos 1)
        makeGuess(
          ['🍓', '🍎', '🍋', '🍇', '🍉'],
          ['absent', 'absent', 'correct', 'correct', 'correct'],
        ),
        // 🍎 is correct in position 0
        makeGuess(
          ['🍎', '🍊', '🍋', '🍇', '🍉'],
          ['correct', 'correct', 'correct', 'correct', 'correct'],
        ),
      ],
      status: 'won',
    })

    const vm = GameStateMapper.toViewModel(game, [])

    const appleKey = vm.keyboardKeys.find((k) => k.code === '🍎')
    expect(appleKey?.status).toBe('correct')
  })

  it('won game shows status won', () => {
    const game = Game.restore({
      date: GameDate.create('2026-03-15'),
      category: makeCategory(),
      answer: makeSequence(['🍎', '🍊', '🍋', '🍇', '🍉']),
      attempts: [
        makeGuess(
          ['🍎', '🍊', '🍋', '🍇', '🍉'],
          ['correct', 'correct', 'correct', 'correct', 'correct'],
        ),
      ],
      status: 'won',
    })

    const vm = GameStateMapper.toViewModel(game, [])
    expect(vm.status).toBe('won')
  })

  it('current input with 3 emojis shows 3 pending + 2 empty in current row', () => {
    const game = makeFreshGame()
    const currentInput = [
      makeEmoji('🍎'),
      makeEmoji('🍊'),
      makeEmoji('🍋'),
    ]

    const vm = GameStateMapper.toViewModel(game, currentInput)

    // Row 0 should be the current input row (no attempts yet)
    const row = vm.board[0]!
    expect(row[0]!.status).toBe('pending')
    expect(row[0]!.emoji).toBe('🍎')
    expect(row[1]!.status).toBe('pending')
    expect(row[1]!.emoji).toBe('🍊')
    expect(row[2]!.status).toBe('pending')
    expect(row[2]!.emoji).toBe('🍋')
    expect(row[3]!.status).toBe('empty')
    expect(row[3]!.emoji).toBeNull()
    expect(row[4]!.status).toBe('empty')
    expect(row[4]!.emoji).toBeNull()
  })
})
