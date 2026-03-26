import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useShareResult } from '@presentation/hooks/useShareResult.ts'
import { Game } from '@domain/model/Game'
import { GameDate } from '@domain/model/GameDate'
import { Emoji } from '@domain/model/Emoji'
import { EmojiSequence } from '@domain/model/EmojiSequence'
import { EmojiCategory } from '@domain/model/EmojiCategory'
import { CategoryId } from '@domain/model/CategoryId'

const e = (code: string) => Emoji.create({ code, name: code })
const seq = (...codes: string[]) => EmojiSequence.create(codes.map((c) => e(c)))

function makeGame(): Game {
  const date = GameDate.create('2026-03-11')
  const category = EmojiCategory.create({
    id: CategoryId.create('fruits'),
    name: 'Fruits',
    emojis: [e('A'), e('B'), e('C'), e('D'), e('E'), e('F')],
  })
  const answer = seq('A', 'B', 'C', 'D', 'E')
  return Game.create({ date, category, answer })
}

describe('useShareResult', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    // Reset navigator.share and clipboard to undefined by default
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: undefined,
    })
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    })
  })

  it('returns copied=false and isSharing=false initially', () => {
    const game = makeGame()
    const { result } = renderHook(() => useShareResult(game))

    expect(result.current.copied).toBe(false)
    expect(result.current.isSharing).toBe(false)
  })

  it('calls navigator.share() when available', async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: shareMock,
    })

    const game = makeGame().submitGuess(seq('A', 'B', 'C', 'D', 'E'))
    const { result } = renderHook(() => useShareResult(game))

    await act(async () => {
      await result.current.shareResult()
    })

    expect(shareMock).toHaveBeenCalledOnce()
    expect(shareMock).toHaveBeenCalledWith(
      expect.objectContaining({ text: expect.stringContaining('Emoji Wordle') }),
    )
    // clipboard should NOT have been called since share succeeded
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled()
  })

  it('falls back to clipboard when navigator.share is not available', async () => {
    // navigator.share is already undefined in beforeEach
    const game = makeGame().submitGuess(seq('A', 'B', 'C', 'D', 'E'))
    const { result } = renderHook(() => useShareResult(game))

    await act(async () => {
      await result.current.shareResult()
    })

    expect(navigator.clipboard.writeText).toHaveBeenCalledOnce()
  })

  it('sets copied=true after successful clipboard copy', async () => {
    const game = makeGame().submitGuess(seq('A', 'B', 'C', 'D', 'E'))
    const { result } = renderHook(() => useShareResult(game))

    await act(async () => {
      await result.current.shareResult()
    })

    expect(result.current.copied).toBe(true)
  })

  it('AbortError from navigator.share is silent — no clipboard fallback', async () => {
    const abortError = new Error('User aborted')
    abortError.name = 'AbortError'
    const shareMock = vi.fn().mockRejectedValue(abortError)
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: shareMock,
    })

    const game = makeGame().submitGuess(seq('A', 'B', 'C', 'D', 'E'))
    const { result } = renderHook(() => useShareResult(game))

    await act(async () => {
      await result.current.shareResult()
    })

    expect(navigator.clipboard.writeText).not.toHaveBeenCalled()
    expect(result.current.copied).toBe(false)
  })

  it('other share errors fall through to clipboard fallback', async () => {
    const genericError = new Error('Share failed')
    const shareMock = vi.fn().mockRejectedValue(genericError)
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: shareMock,
    })

    const game = makeGame().submitGuess(seq('A', 'B', 'C', 'D', 'E'))
    const { result } = renderHook(() => useShareResult(game))

    await act(async () => {
      await result.current.shareResult()
    })

    expect(navigator.clipboard.writeText).toHaveBeenCalledOnce()
    expect(result.current.copied).toBe(true)
  })

  it('does nothing when game is null — early return', async () => {
    const { result } = renderHook(() => useShareResult(null))

    await act(async () => {
      await result.current.shareResult()
    })

    expect(navigator.clipboard.writeText).not.toHaveBeenCalled()
    expect(result.current.copied).toBe(false)
  })

  it('passes playerName to generateShareText when provided', async () => {
    const game = makeGame().submitGuess(seq('A', 'B', 'C', 'D', 'E'))
    const { result } = renderHook(() => useShareResult(game))

    await act(async () => {
      await result.current.shareResult('Diego')
    })

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('Diego'),
    )
  })

  it('copied resets to false after 2 seconds', async () => {
    vi.useFakeTimers()

    const game = makeGame().submitGuess(seq('A', 'B', 'C', 'D', 'E'))
    const { result } = renderHook(() => useShareResult(game))

    await act(async () => {
      await result.current.shareResult()
    })

    expect(result.current.copied).toBe(true)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(result.current.copied).toBe(false)

    vi.useRealTimers()
  })
})
