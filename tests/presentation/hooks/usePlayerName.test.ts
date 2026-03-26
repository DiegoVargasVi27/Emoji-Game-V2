import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePlayerName } from '@presentation/hooks/usePlayerName.ts'

const STORAGE_KEY = 'emoji-wordle-player-name'

describe('usePlayerName', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('returns empty string initially when localStorage has no saved name', () => {
    const { result } = renderHook(() => usePlayerName())

    expect(result.current[0]).toBe('')
  })

  it('returns saved name from localStorage on mount', () => {
    localStorage.setItem(STORAGE_KEY, 'Diego')

    const { result } = renderHook(() => usePlayerName())

    expect(result.current[0]).toBe('Diego')
  })

  it('setName updates state and persists to localStorage', () => {
    const { result } = renderHook(() => usePlayerName())

    act(() => {
      result.current[1]('Mariana')
    })

    expect(result.current[0]).toBe('Mariana')
    expect(localStorage.getItem(STORAGE_KEY)).toBe('Mariana')
  })

  it('setName overwrites previously saved name in localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'Diego')
    const { result } = renderHook(() => usePlayerName())

    act(() => {
      result.current[1]('Mariana')
    })

    expect(result.current[0]).toBe('Mariana')
    expect(localStorage.getItem(STORAGE_KEY)).toBe('Mariana')
  })

  it('handles localStorage read errors gracefully and returns empty string', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError: localStorage is not available')
    })

    const { result } = renderHook(() => usePlayerName())

    expect(result.current[0]).toBe('')
  })

  it('handles localStorage write errors gracefully without throwing', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('SecurityError: localStorage is not available')
    })

    const { result } = renderHook(() => usePlayerName())

    expect(() => {
      act(() => {
        result.current[1]('Diego')
      })
    }).not.toThrow()

    // State is still updated in memory even if localStorage failed
    expect(result.current[0]).toBe('Diego')
  })
})
