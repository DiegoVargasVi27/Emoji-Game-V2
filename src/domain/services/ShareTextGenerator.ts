import { Game } from '@domain/model/Game'

export function generateShareText(game: Game): string {
  const date = game.id.value
  const header = game.status === 'lost'
    ? `Emoji Wordle ${date} X/${game.maxAttempts}`
    : `Emoji Wordle ${date} ${game.attempts.length}/${game.maxAttempts}`

  const rows = game.attempts.map((guess) =>
    guess.result.tiles
      .map((tile) => {
        switch (tile) {
          case 'correct':
            return '🟩'
          case 'misplaced':
            return '🟨'
          case 'absent':
            return '⬛'
        }
      })
      .join(''),
  )

  return [header, ...rows].join('\n')
}
