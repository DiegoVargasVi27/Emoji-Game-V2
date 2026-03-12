import { Emoji } from '@domain/model/Emoji'
import { DomainError } from '@domain/model/DomainError'

describe('Emoji', () => {
  it('should create with valid code and name', () => {
    const emoji = Emoji.create({ code: '🍎', name: 'red apple' })

    expect(emoji.code).toBe('🍎')
    expect(emoji.name).toBe('red apple')
  })

  it('should reject empty code', () => {
    expect(() => Emoji.create({ code: '', name: 'apple' })).toThrow(
      'Emoji code must not be empty',
    )
  })

  it('should reject whitespace-only name', () => {
    expect(() => Emoji.create({ code: '🍎', name: '   ' })).toThrow(
      'Emoji name must not be empty',
    )
  })

  it('should consider two Emoji with same code as equal', () => {
    const a = Emoji.create({ code: '🍎', name: 'red apple' })
    const b = Emoji.create({ code: '🍎', name: 'apple' })

    expect(a.equals(b)).toBe(true)
  })

  it('should consider two Emoji with different codes as not equal', () => {
    const a = Emoji.create({ code: '🍎', name: 'red apple' })
    const b = Emoji.create({ code: '🍊', name: 'orange' })

    expect(a.equals(b)).toBe(false)
  })
})
