import { DomainError } from './DomainError.ts'
import type { Emoji } from './Emoji.ts'

type EmojiTuple = readonly [Emoji, Emoji, Emoji, Emoji, Emoji]

export class EmojiSequence {
  private readonly _emojis: EmojiTuple

  private constructor(emojis: EmojiTuple) {
    this._emojis = emojis
  }

  static create(emojis: Emoji[]): EmojiSequence {
    if (emojis.length !== 5) {
      throw new DomainError('EmojiSequence must contain exactly 5 emojis')
    }
    const tuple = Object.freeze([...emojis]) as unknown as EmojiTuple
    return new EmojiSequence(tuple)
  }

  get emojis(): readonly Emoji[] {
    return this._emojis
  }
}
