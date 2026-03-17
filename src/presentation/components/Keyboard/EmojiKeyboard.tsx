import type { KeyViewModel } from '@presentation/viewmodels/GameViewModel.ts'
import { EmojiGrid } from './EmojiGrid.tsx'
import { ActionRow } from './ActionRow.tsx'

interface EmojiKeyboardProps {
  keys: KeyViewModel[]
  onKeyClick: (code: string) => void
  onDelete: () => void
  onSubmit: () => void
  canSubmit: boolean
  revealedKeyStatuses?: Record<string, 'correct' | 'misplaced' | 'absent' | 'unused'>
}

export function EmojiKeyboard({
  keys,
  onKeyClick,
  onDelete,
  onSubmit,
  canSubmit,
  revealedKeyStatuses,
}: EmojiKeyboardProps) {
  return (
    <div className="max-w-md mx-auto w-full p-2" aria-label="Emoji keyboard">
      <EmojiGrid
        keys={keys}
        onKeyClick={onKeyClick}
        revealedKeyStatuses={revealedKeyStatuses}
      />
      <div className="mt-2">
        <ActionRow
          onDelete={onDelete}
          onSubmit={onSubmit}
          canSubmit={canSubmit}
        />
      </div>
    </div>
  )
}
