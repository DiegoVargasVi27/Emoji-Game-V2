import type { TileViewModel } from '@presentation/viewmodels/GameViewModel.ts'
import { GuessRow } from './GuessRow.tsx'

interface GameBoardProps {
  board: TileViewModel[][]
  currentRowIndex: number
  isShaking?: boolean
  isRevealing?: boolean
  isWinBouncing?: boolean
  revealingRowIndex?: number
  onShakeEnd?: () => void
}

export function GameBoard({
  board,
  currentRowIndex,
  isShaking,
  isRevealing,
  isWinBouncing,
  revealingRowIndex,
  onShakeEnd,
}: GameBoardProps) {
  return (
    <div
      className="flex flex-col gap-1 max-w-sm mx-auto p-4"
      role="grid"
      aria-label="Game board"
    >
      {board.map((row, index) => (
        <GuessRow
          key={index}
          tiles={row}
          isCurrentRow={index === currentRowIndex}
          isShaking={isShaking && index === currentRowIndex}
          isRevealing={isRevealing && index === (revealingRowIndex ?? -1)}
          isBouncing={isWinBouncing && index === (revealingRowIndex ?? -1)}
          onShakeEnd={onShakeEnd}
        />
      ))}
    </div>
  )
}
