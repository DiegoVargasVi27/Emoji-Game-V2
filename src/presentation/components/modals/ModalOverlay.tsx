import { useEffect, useRef, useCallback, type ReactNode } from 'react'

interface ModalOverlayProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  animationDelay?: number
}

export function ModalOverlay({ isOpen, onClose, children, animationDelay = 0 }: ModalOverlayProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose],
  )

  useEffect(() => {
    if (!isOpen) return

    previousFocusRef.current = document.activeElement as HTMLElement | null
    document.addEventListener('keydown', handleKeyDown)

    // Focus first focusable child
    const timer = setTimeout(() => {
      const focusable = contentRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      focusable?.focus()
    }, 0)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timer)
      previousFocusRef.current?.focus()
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const style: React.CSSProperties = animationDelay > 0
    ? { animationDelay: `${animationDelay}ms` }
    : {}

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={contentRef}
        className="bg-gray-800 rounded-xl p-6 max-w-sm mx-4 w-full animate-bounce-in"
        style={style}
      >
        {children}
      </div>
    </div>
  )
}
