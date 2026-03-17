import type { KeyViewModel } from '@presentation/viewmodels/GameViewModel.ts'
import { EmojiKey } from './EmojiKey.tsx'

interface EmojiGridProps {
  keys: KeyViewModel[]
  onKeyClick: (code: string) => void
  revealedKeyStatuses?: Record<string, 'correct' | 'misplaced' | 'absent' | 'unused'>
}

export function EmojiGrid({ keys, onKeyClick, revealedKeyStatuses }: EmojiGridProps) {
  return (
    <div
      className="flex flex-wrap gap-1 max-h-40 overflow-y-auto p-1"
      role="group"
      aria-label="Emoji keys"
    >
      {keys.map((key) => (
        <EmojiKey
          key={key.code}
          code={key.code}
          displayEmoji={key.displayEmoji}
          status={key.status}
          overrideStatus={revealedKeyStatuses?.[key.code]}
          onClick={() => onKeyClick(key.code)}
        />
      ))}
    </div>
  )
}
