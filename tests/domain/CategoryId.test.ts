import { CategoryId } from '@domain/model/CategoryId'

describe('CategoryId', () => {
  it('should accept valid slug "fruits"', () => {
    const id = CategoryId.create('fruits')

    expect(id.value).toBe('fruits')
  })

  it('should accept valid slug with hyphen "ice-cream"', () => {
    const id = CategoryId.create('ice-cream')

    expect(id.value).toBe('ice-cream')
  })

  it('should reject empty string', () => {
    expect(() => CategoryId.create('')).toThrow('CategoryId must not be empty')
  })

  it('should reject invalid slug "My Category!"', () => {
    expect(() => CategoryId.create('My Category!')).toThrow(
      'CategoryId must be a valid slug',
    )
  })

  it('should reject leading hyphen "-fruits"', () => {
    expect(() => CategoryId.create('-fruits')).toThrow(
      'CategoryId must be a valid slug',
    )
  })

  it('should reject trailing hyphen "fruits-"', () => {
    expect(() => CategoryId.create('fruits-')).toThrow(
      'CategoryId must be a valid slug',
    )
  })
})
