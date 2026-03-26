import { useState } from 'react'
import { ModalOverlay } from './ModalOverlay.tsx'
import { usePlayerName } from '@presentation/hooks/usePlayerName.ts'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  onShare: (playerName: string) => void
}

export function ShareModal({ isOpen, onClose, onShare }: ShareModalProps) {
  const [savedName, setSavedName] = usePlayerName()
  const [inputValue, setInputValue] = useState(savedName)

  function handleShare() {
    const trimmed = inputValue.trim()
    setSavedName(trimmed)
    onShare(trimmed)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleShare()
    }
  }

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">Compartir resultado</h2>
        <p className="text-gray-300 text-sm mb-4">
          ¿Con qué nombre querés aparecer?
        </p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tu nombre (opcional)"
          maxLength={50}
          className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 mb-4 outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
          aria-label="Nombre del jugador"
        />
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-medium transition-colors min-h-[44px] cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold transition-colors min-h-[44px] cursor-pointer"
          >
            Compartir
          </button>
        </div>
      </div>
    </ModalOverlay>
  )
}
