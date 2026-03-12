import { GameDate } from '@domain/model/GameDate'
import { DomainError } from '@domain/model/DomainError'

describe('GameDate', () => {
  it('should create with valid date "2026-03-11"', () => {
    const date = GameDate.create('2026-03-11')

    expect(date.value).toBe('2026-03-11')
  })

  it('should extract UTC date correctly with fromUTCDate', () => {
    const utcDate = new Date('2026-03-11T15:30:00Z')
    const gameDate = GameDate.fromUTCDate(utcDate)

    expect(gameDate.value).toBe('2026-03-11')
  })

  it('should reject invalid format "2026-3-1"', () => {
    expect(() => GameDate.create('2026-3-1')).toThrow(
      'GameDate must be a valid ISO date YYYY-MM-DD',
    )
  })

  it('should reject non-date string "not-a-date"', () => {
    expect(() => GameDate.create('not-a-date')).toThrow(
      'GameDate must be a valid ISO date YYYY-MM-DD',
    )
  })

  it('should reject invalid date "2026-02-30"', () => {
    expect(() => GameDate.create('2026-02-30')).toThrow(
      'GameDate must be a valid ISO date YYYY-MM-DD',
    )
  })
})
