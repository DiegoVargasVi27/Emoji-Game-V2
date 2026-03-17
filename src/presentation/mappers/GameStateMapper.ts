import type { Game } from '@domain/model/Game.ts'
import type { Emoji } from '@domain/model/Emoji.ts'
import type { TileResult } from '@domain/model/TileResult.ts'
import type {
  GameViewModel,
  TileViewModel,
  KeyViewModel,
} from '@presentation/viewmodels/GameViewModel.ts'

const TILE_STATUS_PRIORITY: Record<string, number> = {
  correct: 3,
  misplaced: 2,
  absent: 1,
  unused: 0,
}

function tileResultToStatus(result: TileResult): TileViewModel['status'] {
  return result
}

export class GameStateMapper {
  static toViewModel(
    game: Game,
    currentInput: Emoji[],
  ): GameViewModel {
    const board = GameStateMapper.buildBoard(game, currentInput)
    const keyboardKeys = GameStateMapper.buildKeyboardKeys(game)

    return {
      date: game.id.value,
      categoryName: game.category.name,
      board,
      currentInput: currentInput.map((e) => e.code),
      keyboardKeys,
      status: game.status,
      attemptsUsed: game.attempts.length,
      maxAttempts: 6,
      answer: game.answer.emojis.map((e) => e.code),
    }
  }

  private static buildBoard(
    game: Game,
    currentInput: Emoji[],
  ): TileViewModel[][] {
    const rows: TileViewModel[][] = []

    // Rows from submitted attempts
    for (const guess of game.attempts) {
      const row: TileViewModel[] = guess.sequence.emojis.map((emoji, i) => ({
        emoji: emoji.code,
        status: tileResultToStatus(guess.result.tiles[i]!),
      }))
      rows.push(row)
    }

    // Current input row (only if game is still playing)
    if (game.status === 'playing' && rows.length < 6) {
      const currentRow: TileViewModel[] = []
      for (let i = 0; i < 5; i++) {
        if (i < currentInput.length) {
          currentRow.push({
            emoji: currentInput[i]!.code,
            status: 'pending',
          })
        } else {
          currentRow.push({ emoji: null, status: 'empty' })
        }
      }
      rows.push(currentRow)
    }

    // Fill remaining rows with empty tiles
    while (rows.length < 6) {
      rows.push(
        Array.from({ length: 5 }, (): TileViewModel => ({
          emoji: null,
          status: 'empty',
        })),
      )
    }

    return rows
  }

  private static buildKeyboardKeys(
    game: Game,
  ): KeyViewModel[] {
    // Compute best status for each emoji code across all attempts
    const bestStatus = new Map<string, 'correct' | 'misplaced' | 'absent'>()

    for (const guess of game.attempts) {
      for (let i = 0; i < 5; i++) {
        const code = guess.sequence.emojis[i]!.code
        const tileStatus = guess.result.tiles[i]!
        const existing = bestStatus.get(code)

        if (
          !existing ||
          TILE_STATUS_PRIORITY[tileStatus]! >
            TILE_STATUS_PRIORITY[existing]!
        ) {
          bestStatus.set(code, tileStatus)
        }
      }
    }

    // Use emojis from the game's category directly
    return game.category.emojis.map(
      (emoji): KeyViewModel => ({
        code: emoji.code,
        displayEmoji: emoji.code,
        status: bestStatus.get(emoji.code) ?? 'unused',
      }),
    )
  }
}
