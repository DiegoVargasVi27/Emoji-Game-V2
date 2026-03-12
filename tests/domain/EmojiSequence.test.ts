import { EmojiSequence } from '@domain/model/EmojiSequence'
import { Emoji } from '@domain/model/Emoji'
import { DomainError } from '@domain/model/DomainError'

const e = (code: string) => Emoji.create({ code, name: code })

describe('EmojiSequence', () => {
  it('should create with valid 5-element list', () => {
    const seq = EmojiSequence.create([e('🍎'), e('🍊'), e('🍋'), e('🍇'), e('🍓')])

    expect(seq.emojis).toHaveLength(5)
  })

  it('should accept repeated emojis', () => {
    const seq = EmojiSequence.create([e('🍎'), e('🍎'), e('🍎'), e('🍎'), e('🍎')])

    expect(seq.emojis).toHaveLength(5)
  })

  it('should reject 4 elements', () => {
    expect(() =>
      EmojiSequence.create([e('🍎'), e('🍊'), e('🍋'), e('🍇')]),
    ).toThrow('EmojiSequence must contain exactly 5 emojis')
  })

  it('should reject 6 elements', () => {
    expect(() =>
      EmojiSequence.create([e('🍎'), e('🍊'), e('🍋'), e('🍇'), e('🍓'), e('🍑')]),
    ).toThrow('EmojiSequence must contain exactly 5 emojis')
  })

  it('should reject empty list', () => {
    expect(() => EmojiSequence.create([])).toThrow(
      'EmojiSequence must contain exactly 5 emojis',
    )
  })

  it('should freeze the emojis array', () => {
    const seq = EmojiSequence.create([e('🍎'), e('🍊'), e('🍋'), e('🍇'), e('🍓')])

    expect(Object.isFrozen(seq.emojis)).toBe(true)
  })
})
