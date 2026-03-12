import { DomainError } from './DomainError.ts'

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export class CategoryId {
  readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): CategoryId {
    if (!value) {
      throw new DomainError('CategoryId must not be empty')
    }
    if (!SLUG_REGEX.test(value)) {
      throw new DomainError('CategoryId must be a valid slug')
    }
    return new CategoryId(value)
  }

  equals(other: CategoryId): boolean {
    return this.value === other.value
  }
}
