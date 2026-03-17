import { GuessResult } from '@domain/model/GuessResult'
import type { TileResult } from '@domain/model/TileResult'

describe('GuessResult', () => {
  it('should create with valid 5-tile array', () => {
    const tiles: TileResult[] = ['correct', 'misplaced', 'absent', 'correct', 'absent']
    const result = GuessResult.create(tiles)

    expect(result.tiles).toHaveLength(5)
  })

  it('should return true for isAllCorrect when all tiles are correct', () => {
    const result = GuessResult.create([
      'correct', 'correct', 'correct', 'correct', 'correct',
    ])

    expect(result.isAllCorrect()).toBe(true)
  })

  it('should return false for isAllCorrect when tiles are mixed', () => {
    const result = GuessResult.create([
      'correct', 'misplaced', 'correct', 'correct', 'correct',
    ])

    expect(result.isAllCorrect()).toBe(false)
  })

  it('should reject 4 tiles', () => {
    expect(() =>
      GuessResult.create(['correct', 'correct', 'correct', 'correct']),
    ).toThrow('GuessResult must contain exactly 5 tiles')
  })

  it('should reject 6 tiles', () => {
    expect(() =>
      GuessResult.create([
        'correct', 'correct', 'correct', 'correct', 'correct', 'absent',
      ]),
    ).toThrow('GuessResult must contain exactly 5 tiles')
  })
})
