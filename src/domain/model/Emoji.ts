import { DomainError } from './DomainError.ts'

export class Emoji {
  readonly code: string
  readonly name: string

  private constructor(code: string, name: string) {
    this.code = code
    this.name = name
  }

  static create({ code, name }: { code: string; name: string }): Emoji {
    if (!code) {
      throw new DomainError('Emoji code must not be empty')
    }
    if (!name.trim()) {
      throw new DomainError('Emoji name must not be empty')
    }
    return new Emoji(code, name)
  }

  equals(other: Emoji): boolean {
    return this.code === other.code
  }
}
