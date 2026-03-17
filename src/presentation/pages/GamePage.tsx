import { useGame } from '@presentation/hooks/useGame.ts'
import { Emoji } from '@domain/model/Emoji.ts'
import { GameBoard } from '@presentation/components/Board/GameBoard.tsx'
import { EmojiKeyboard } from '@presentation/components/Keyboard/EmojiKeyboard.tsx'
import { ResultModal } from '@presentation/components/modals/ResultModal.tsx'
import { StatsModal } from '@presentation/components/modals/StatsModal.tsx'
import { useShareResult } from '@presentation/hooks/useShareResult.ts'

export function GamePage() {
  const {
    viewModel,
    isLoading,
    error,
    addEmoji,
    removeLastEmoji,
    submitGuess,
    showResultModal,
    showStatsModal,
    toggleResultModal,
    toggleStatsModal,
    stats,
    isShaking,
    isRevealing,
    isWinBouncing,
    clearShake,
    revealedKeyStatuses,
  } = useGame()

  const { shareResult, copied } = useShareResult(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1 text-gray-400">
        Cargando...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center flex-1 text-red-400">
        {error}
      </div>
    )
  }

  if (!viewModel) return null

  const handleKeyClick = (code: string) => {
    const emoji = Emoji.create({ code, name: code })
    addEmoji(emoji)
  }

  const handleSubmit = () => {
    void submitGuess()
  }

  const canSubmit = viewModel.currentInput.length === 5

  // The revealing row is the last submitted guess row (attemptsUsed - 1)
  const revealingRowIndex = viewModel.attemptsUsed > 0
    ? viewModel.attemptsUsed - 1
    : -1

  return (
    <main className="flex flex-col items-center flex-1 w-full">
      <GameBoard
        board={viewModel.board}
        currentRowIndex={viewModel.attemptsUsed}
        isShaking={isShaking}
        isRevealing={isRevealing}
        isWinBouncing={isWinBouncing}
        revealingRowIndex={revealingRowIndex}
        onShakeEnd={clearShake}
      />
      {viewModel.status === 'playing' && (
        <EmojiKeyboard
          keys={viewModel.keyboardKeys}
          onKeyClick={handleKeyClick}
          onDelete={removeLastEmoji}
          onSubmit={handleSubmit}
          canSubmit={canSubmit}
          revealedKeyStatuses={revealedKeyStatuses}
        />
      )}
      {showResultModal && viewModel.status !== 'playing' && (
        <ResultModal
          status={viewModel.status}
          attemptsUsed={viewModel.attemptsUsed}
          maxAttempts={viewModel.maxAttempts}
          answer={viewModel.answer}
          onShare={shareResult}
          copied={copied}
          onClose={toggleResultModal}
        />
      )}
      {showStatsModal && stats && (
        <StatsModal stats={stats} onClose={toggleStatsModal} />
      )}
    </main>
  )
}
