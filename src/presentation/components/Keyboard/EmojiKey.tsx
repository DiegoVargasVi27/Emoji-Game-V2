const STATUS_CLASSES: Record<string, string> = {
  correct: 'bg-green-600',
  misplaced: 'bg-yellow-500',
  absent: 'bg-gray-700',
  unused: 'bg-gray-600',
}

interface EmojiKeyProps {
  code: string
  displayEmoji: string
  status: 'correct' | 'misplaced' | 'absent' | 'unused'
  overrideStatus?: 'correct' | 'misplaced' | 'absent' | 'unused'
  onClick: () => void
}

export function EmojiKey({
  displayEmoji,
  status,
  overrideStatus,
  onClick,
}: EmojiKeyProps) {
  // 7.6: During reveal, use overrideStatus if available, otherwise keep current status
  const effectiveStatus = overrideStatus ?? status
  const statusClass = STATUS_CLASSES[effectiveStatus] ?? ''

  return (
    <button
      className={`w-10 h-10 min-w-[44px] min-h-[44px] flex items-center justify-center rounded text-xl select-none cursor-pointer hover:opacity-80 transition-all duration-300 ${statusClass}`}
      onClick={onClick}
      role="button"
      aria-label={displayEmoji}
      type="button"
    >
      {displayEmoji}
    </button>
  )
}
