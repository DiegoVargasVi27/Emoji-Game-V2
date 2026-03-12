import { DomainError } from './DomainError.ts'

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

export class GameDate {
  readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): GameDate {
    if (!ISO_DATE_REGEX.test(value)) {
      throw new DomainError('GameDate must be a valid ISO date YYYY-MM-DD')
    }

    const parsed = new Date(value + 'T00:00:00Z')
    if (isNaN(parsed.getTime())) {
      throw new DomainError('GameDate must be a valid ISO date YYYY-MM-DD')
    }

    const [year, month, day] = value.split('-').map(Number)
    if (
      parsed.getUTCFullYear() !== year ||
      parsed.getUTCMonth() + 1 !== month ||
      parsed.getUTCDate() !== day
    ) {
      throw new DomainError('GameDate must be a valid ISO date YYYY-MM-DD')
    }

    return new GameDate(value)
  }

  static fromUTCDate(date: Date): GameDate {
    const iso = date.toISOString().slice(0, 10)
    return new GameDate(iso)
  }

  equals(other: GameDate): boolean {
    return this.value === other.value
  }
}
