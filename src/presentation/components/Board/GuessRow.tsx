import type { TileViewModel } from '@presentation/viewmodels/GameViewModel.ts'
import { EmojiTile } from './EmojiTile.tsx'

interface GuessRowProps {
  tiles: TileViewModel[]
  isCurrentRow?: boolean
  isShaking?: boolean
  isRevealing?: boolean
  isBouncing?: boolean
  onShakeEnd?: () => void
}

export function GuessRow({
  tiles,
  isShaking,
  isRevealing,
  isBouncing,
  onShakeEnd,
}: GuessRowProps) {
  const shakeClass = isShaking ? 'animate-shake' : ''

  return (
    <div
      className={`flex gap-1 ${shakeClass}`}
      role="row"
      onAnimationEnd={(e) => {
        if (e.animationName === 'shake' && onShakeEnd) {
          onShakeEnd()
        }
      }}
    >
      {tiles.map((tile, index) => (
        <EmojiTile
          key={index}
          emoji={tile.emoji}
          status={tile.status}
          position={index}
          isRevealing={isRevealing}
          isBouncing={isBouncing}
        />
      ))}
    </div>
  )
}
