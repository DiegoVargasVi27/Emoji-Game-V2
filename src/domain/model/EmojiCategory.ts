import { DomainError } from './DomainError.ts'
import type { CategoryId } from './CategoryId.ts'
import type { Emoji } from './Emoji.ts'

export class EmojiCategory {
  readonly id: CategoryId
  readonly name: string
  readonly emojis: readonly Emoji[]

  private constructor(id: CategoryId, name: string, emojis: readonly Emoji[]) {
    this.id = id
    this.name = name
    this.emojis = emojis
  }

  static create({
    id,
    name,
    emojis,
  }: {
    id: CategoryId
    name: string
    emojis: readonly Emoji[]
  }): EmojiCategory {
    if (emojis.length < 5) {
      throw new DomainError('Category must have at least 5 emojis to form a sequence')
    }
    return new EmojiCategory(id, name, emojis)
  }
}
