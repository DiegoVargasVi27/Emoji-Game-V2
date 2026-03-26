import { Game } from '@domain/model/Game'

const MAX_NAME_LENGTH = 50

export function generateShareText(game: Game, playerName?: string): string {
  const date = game.id.value
  const trimmedName = playerName?.trim()
  const name = trimmedName ? trimmedName.slice(0, MAX_NAME_LENGTH) : ''

  const attempts = game.status === 'lost'
    ? `X/${game.maxAttempts}`
    : `${game.attempts.length}/${game.maxAttempts}`

  const header = name
    ? `🏆 ${name} jugó Emoji Wordle ${date} ${attempts}`
    : `Emoji Wordle ${date} ${attempts}`

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
