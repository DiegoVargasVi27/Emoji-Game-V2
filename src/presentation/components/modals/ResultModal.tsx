import { ModalOverlay } from './ModalOverlay.tsx'

interface ResultModalProps {
  status: 'won' | 'lost'
  attemptsUsed: number
  maxAttempts: number
  answer: string[]
  onShare: () => void
  copied: boolean
  onClose: () => void
}

export function ResultModal({
  status,
  attemptsUsed,
  maxAttempts,
  answer,
  onShare,
  copied,
  onClose,
}: ResultModalProps) {
  const isWin = status === 'won'

  return (
    <ModalOverlay isOpen={true} onClose={onClose}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          {isWin ? '¡Buen trabajo!' : '¡Mejor suerte mañana!'}
        </h2>
        <p className="text-gray-300 mb-4">
          {isWin
            ? `${attemptsUsed}/${maxAttempts} intentos`
            : `La respuesta era: ${answer.join('')}`}
        </p>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold cursor-pointer transition-colors min-h-[44px]"
          onClick={onShare}
          type="button"
        >
          {copied ? '¡Copiado!' : 'Compartir resultado'}
        </button>
      </div>
    </ModalOverlay>
  )
}
