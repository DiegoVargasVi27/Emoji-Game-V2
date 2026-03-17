import { describe, it, expect } from 'vitest'
import { SeededChallengeGenerator } from '@infrastructure/challenge/SeededChallengeGenerator'
import { GameDate } from '@domain/model/GameDate'

const TEST_CATALOG = [
  {
    id: 'fruits',
    name: 'Fruits',
    emojis: [
      { code: '🍎', name: 'red apple' },
      { code: '🍊', name: 'orange' },
      { code: '🍋', name: 'lemon' },
      { code: '🍇', name: 'grapes' },
      { code: '🍉', name: 'watermelon' },
      { code: '🍓', name: 'strawberry' },
      { code: '🍑', name: 'peach' },
      { code: '🍒', name: 'cherries' },
      { code: '🥝', name: 'kiwi' },
      { code: '🍌', name: 'banana' },
    ],
  },
  {
    id: 'animals',
    name: 'Animals',
    emojis: [
      { code: '🐶', name: 'dog' },
      { code: '🐱', name: 'cat' },
      { code: '🐭', name: 'mouse' },
      { code: '🐹', name: 'hamster' },
      { code: '🐰', name: 'rabbit' },
      { code: '🦊', name: 'fox' },
      { code: '🐻', name: 'bear' },
      { code: '🐼', name: 'panda' },
      { code: '🐨', name: 'koala' },
      { code: '🐯', name: 'tiger' },
    ],
  },
] as const

describe('SeededChallengeGenerator', () => {
  it('should produce the same result for the same date (determinism)', () => {
    const gen = new SeededChallengeGenerator(TEST_CATALOG)
    const date = GameDate.create('2026-03-12')

    const result1 = gen.generate(date)
    const result2 = gen.generate(date)

    expect(result1.category.id.value).toBe(result2.category.id.value)
    expect(result1.answer.emojis.map((e) => e.code)).toEqual(
      result2.answer.emojis.map((e) => e.code),
    )
  })

  it('should produce different results for different dates', () => {
    const gen = new SeededChallengeGenerator(TEST_CATALOG)
    const results = new Set<string>()

    for (let day = 1; day <= 10; day++) {
      const dateStr = `2026-03-${String(day).padStart(2, '0')}`
      const date = GameDate.create(dateStr)
      const result = gen.generate(date)
      const key =
        result.category.id.value +
        ':' +
        result.answer.emojis.map((e) => e.code).join(',')
      results.add(key)
    }

    // At least 2 different results out of 10 dates
    expect(results.size).toBeGreaterThan(1)
  })

  it('should always produce exactly 5 unique emojis in the answer', () => {
    const gen = new SeededChallengeGenerator(TEST_CATALOG)

    for (let day = 1; day <= 20; day++) {
      const dateStr = `2026-04-${String(day).padStart(2, '0')}`
      const date = GameDate.create(dateStr)
      const result = gen.generate(date)

      expect(result.answer.emojis).toHaveLength(5)

      const codes = result.answer.emojis.map((e) => e.code)
      const uniqueCodes = new Set(codes)
      expect(uniqueCodes.size).toBe(5)
    }
  })

  it('should only pick emojis from the selected category', () => {
    const gen = new SeededChallengeGenerator(TEST_CATALOG)

    for (let day = 1; day <= 20; day++) {
      const dateStr = `2026-05-${String(day).padStart(2, '0')}`
      const date = GameDate.create(dateStr)
      const result = gen.generate(date)

      const categoryCodes = result.category.emojis.map((e) => e.code)
      for (const emoji of result.answer.emojis) {
        expect(categoryCodes).toContain(emoji.code)
      }
    }
  })

  it('should throw error for empty catalog', () => {
    expect(() => new SeededChallengeGenerator([])).toThrow(
      'Catalog must have at least one category',
    )
  })

  it('should throw error for category with fewer than 5 emojis', () => {
    const smallCatalog = [
      {
        id: 'tiny',
        name: 'Tiny',
        emojis: [
          { code: '🍎', name: 'red apple' },
          { code: '🍊', name: 'orange' },
          { code: '🍋', name: 'lemon' },
          { code: '🍇', name: 'grapes' },
        ],
      },
    ]
    const gen = new SeededChallengeGenerator(smallCatalog)
    const date = GameDate.create('2026-03-12')

    expect(() => gen.generate(date)).toThrow(
      'must have at least 5 emojis',
    )
  })
})
