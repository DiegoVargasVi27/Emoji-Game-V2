import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LocalStorageGameRepository } from '@infrastructure/persistence/LocalStorageGameRepository'
import { Game } from '@domain/model/Game'
import { GameDate } from '@domain/model/GameDate'
import { CategoryId } from '@domain/model/CategoryId'
import { Emoji } from '@domain/model/Emoji'
import { EmojiCategory } from '@domain/model/EmojiCategory'
import { EmojiSequence } from '@domain/model/EmojiSequence'

function makeEmoji(code: string, name: string) {
  return Emoji.create({ code, name })
}

function makeCategory() {
  const emojis = [
    makeEmoji('🍎', 'red apple'),
    makeEmoji('🍊', 'orange'),
    makeEmoji('🍋', 'lemon'),
    makeEmoji('🍇', 'grapes'),
    makeEmoji('🍉', 'watermelon'),
    makeEmoji('🍓', 'strawberry'),
  ]
  return EmojiCategory.create({
    id: CategoryId.create('fruits'),
    name: 'Fruits',
    emojis,
  })
}

function makeAnswer() {
  return EmojiSequence.create([
    makeEmoji('🍎', 'red apple'),
    makeEmoji('🍊', 'orange'),
    makeEmoji('🍋', 'lemon'),
    makeEmoji('🍇', 'grapes'),
    makeEmoji('🍉', 'watermelon'),
  ])
}

function makeGame(dateStr = '2026-03-12') {
  const date = GameDate.create(dateStr)
  const category = makeCategory()
  const answer = makeAnswer()
  return Game.create({ date, category, answer })
}

describe('LocalStorageGameRepository', () => {
  let store: Record<string, string>
  let repo: LocalStorageGameRepository

  beforeEach(() => {
    store = {}
    const mockStorage = {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key]
      }),
      clear: vi.fn(() => {
        store = {}
      }),
      length: 0,
      key: vi.fn(() => null),
    }
    vi.stubGlobal('localStorage', mockStorage)
    repo = new LocalStorageGameRepository()
  })

  it('should return equivalent Game after save and loadByDate', () => {
    const game = makeGame()
    repo.save(game)
    const loaded = repo.loadByDate(game.id)

    expect(loaded).not.toBeNull()
    expect(loaded!.id.value).toBe(game.id.value)
    expect(loaded!.category.id.value).toBe(game.category.id.value)
    expect(loaded!.category.name).toBe(game.category.name)
    expect(loaded!.answer.emojis.map((e) => e.code)).toEqual(
      game.answer.emojis.map((e) => e.code),
    )
    expect(loaded!.status).toBe('playing')
    expect(loaded!.attempts).toHaveLength(0)
  })

  it('should return null for non-existent date', () => {
    const date = GameDate.create('2020-01-01')
    const loaded = repo.loadByDate(date)
    expect(loaded).toBeNull()
  })

  it('should return null for corrupt JSON', () => {
    store['emoji-wordle:game:2026-03-12'] = 'not valid json {{{}'
    const date = GameDate.create('2026-03-12')
    const loaded = repo.loadByDate(date)

    expect(loaded).toBeNull()
  })

  it('should overwrite previous game for same date', () => {
    const game1 = makeGame()
    repo.save(game1)

    // Submit a guess to create a different game state
    const guess = EmojiSequence.create([
      makeEmoji('🍓', 'strawberry'),
      makeEmoji('🍊', 'orange'),
      makeEmoji('🍋', 'lemon'),
      makeEmoji('🍇', 'grapes'),
      makeEmoji('🍉', 'watermelon'),
    ])
    const game2 = game1.submitGuess(guess)
    repo.save(game2)

    const loaded = repo.loadByDate(game2.id)
    expect(loaded).not.toBeNull()
    expect(loaded!.attempts).toHaveLength(1)
  })

  it('should store different dates independently', () => {
    const game1 = makeGame('2026-03-10')
    const game2 = makeGame('2026-03-11')
    repo.save(game1)
    repo.save(game2)

    const loaded1 = repo.loadByDate(GameDate.create('2026-03-10'))
    const loaded2 = repo.loadByDate(GameDate.create('2026-03-11'))
    expect(loaded1).not.toBeNull()
    expect(loaded2).not.toBeNull()
    expect(loaded1!.id.value).toBe('2026-03-10')
    expect(loaded2!.id.value).toBe('2026-03-11')
  })
})
