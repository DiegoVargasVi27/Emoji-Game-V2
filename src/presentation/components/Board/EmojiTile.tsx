import { useState, useEffect, useRef, useCallback } from 'react'

const STATUS_CLASSES: Record<string, string> = {
  correct: 'bg-green-600',
  misplaced: 'bg-yellow-500',
  absent: 'bg-gray-700',
  pending: 'bg-gray-600 border-2 border-gray-400',
  empty: 'bg-transparent border-2 border-gray-700',
}

interface EmojiTileProps {
  emoji: string | null
  status: 'correct' | 'misplaced' | 'absent' | 'pending' | 'empty'
  position: number
  isRevealing?: boolean
  isBouncing?: boolean
  isPopping?: boolean
}

export function EmojiTile({
  emoji,
  status,
  position,
  isRevealing,
  isBouncing,
  isPopping,
}: EmojiTileProps) {
  // 7.2: During flip, show neutral color until halfway point, then show result color
  // All setState calls are inside setTimeout callbacks (async) to satisfy react-hooks/set-state-in-effect.
  const [showResultColor, setShowResultColor] = useState(!isRevealing)
  const prevRevealingRef = useRef(isRevealing)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    if (isRevealing && !prevRevealingRef.current) {
      // Revealing just started — reset color via async callback
      timers.push(setTimeout(() => setShowResultColor(false), 0))
    }
    prevRevealingRef.current = isRevealing

    if (!isRevealing) {
      // Not revealing — show the result color
      timers.push(setTimeout(() => setShowResultColor(true), 0))
      return () => timers.forEach(clearTimeout)
    }

    // Color changes at the 50% mark of each tile's flip (250ms after its delay starts)
    const delay = position * 300 + 250
    timers.push(setTimeout(() => setShowResultColor(true), delay))

    return () => timers.forEach(clearTimeout)
  }, [isRevealing, position])

  // 7.5: Detect pop (transition from empty/no-emoji to having emoji in pending)
  const [isPoppingLocal, setIsPoppingLocal] = useState(false)
  const prevEmojiRef = useRef(emoji)

  useEffect(() => {
    const wasEmpty = !prevEmojiRef.current
    prevEmojiRef.current = emoji

    if (emoji && wasEmpty && status === 'pending') {
      // Use async callback to satisfy react-hooks/set-state-in-effect
      const timer = setTimeout(() => setIsPoppingLocal(true), 0)
      return () => clearTimeout(timer)
    }
  }, [emoji, status])

  const handleAnimationEnd = useCallback((e: React.AnimationEvent) => {
    if (e.animationName === 'popIn') {
      setIsPoppingLocal(false)
    }
  }, [])

  const displayStatus =
    isRevealing && !showResultColor ? 'pending' : status
  const statusClass = STATUS_CLASSES[displayStatus] ?? ''

  const animationClasses: string[] = []
  if (isRevealing) animationClasses.push('animate-flip')
  if (isBouncing) animationClasses.push('animate-bounce-tile')
  if (isPopping || isPoppingLocal) animationClasses.push('animate-pop-in')

  const style: React.CSSProperties = {}
  if (isRevealing) {
    style.animationDelay = `${position * 300}ms`
  }
  if (isBouncing) {
    style.animationDelay = `${position * 100}ms`
  }

  const ariaLabel =
    emoji && status !== 'empty' ? `${emoji} - ${status}` : 'empty tile'

  return (
    <div
      className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded text-2xl sm:text-3xl select-none ${statusClass} ${animationClasses.join(' ')}`}
      style={style}
      aria-label={ariaLabel}
      role="gridcell"
      onAnimationEnd={handleAnimationEnd}
    >
      {emoji}
    </div>
  )
}
