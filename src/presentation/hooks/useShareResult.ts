import { useState, useCallback, useRef, useEffect } from 'react'
import type { Game } from '@domain/model/Game.ts'
import { generateShareText } from '@domain/services/ShareTextGenerator.ts'

export function useShareResult(game: Game | null) {
  const [copied, setCopied] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const shareResult = useCallback(async (playerName?: string) => {
    if (!game) return

    const text = generateShareText(game, playerName)

    // Try Web Share API first (native sheet on mobile)
    if (navigator.canShare?.({ text }) || typeof navigator.share === 'function') {
      try {
        setIsSharing(true)
        await navigator.share({ text })
        setIsSharing(false)
        return
      } catch (err) {
        setIsSharing(false)
        // AbortError = user dismissed the sheet — silent, no feedback
        if (err instanceof Error && err.name === 'AbortError') return
        // Any other share error: fall through to clipboard
      }
    }

    // Clipboard fallback
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        // Legacy execCommand fallback
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }

      setCopied(true)
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setCopied(false)
        timeoutRef.current = null
      }, 2000)
    } catch {
      // Silently fail if copy is not permitted
    }
  }, [game])

  return { shareResult, copied, isSharing }
}
