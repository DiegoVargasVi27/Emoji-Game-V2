import type { IGameRepository } from '@domain/ports/IGameRepository'
import type { GameStatus } from '@domain/model/GameStatus'
import type { TileResult } from '@domain/model/TileResult'
import { Game } from '@domain/model/Game'
import { GameDate } from '@domain/model/GameDate'
import { CategoryId } from '@domain/model/CategoryId'
import { Emoji } from '@domain/model/Emoji'
import { EmojiCategory } from '@domain/model/EmojiCategory'
import { EmojiSequence } from '@domain/model/EmojiSequence'
import { GuessResult } from '@domain/model/GuessResult'
import { Guess } from '@domain/model/Guess'

interface SerializedGame {
  date: string
  categoryId: string
  categoryName: string
  categoryEmojis: { code: string; name: string }[]
  answer: { code: string; name: string }[]
  attempts: {
    sequence: { code: string; name: string }[]
    tiles: TileResult[]
  }[]
  status: GameStatus
}

const KEY_PREFIX = 'emoji-wordle:game:'

export class LocalStorageGameRepository implements IGameRepository {
  save(game: Game): void {
    const key = KEY_PREFIX + game.id.value
    const serialized: SerializedGame = {
      date: game.id.value,
      categoryId: game.category.id.value,
      categoryName: game.category.name,
      categoryEmojis: game.category.emojis.map((e) => ({
        code: e.code,
        name: e.name,
      })),
      answer: game.answer.emojis.map((e) => ({
        code: e.code,
        name: e.name,
      })),
      attempts: game.attempts.map((guess) => ({
        sequence: guess.sequence.emojis.map((e) => ({
          code: e.code,
          name: e.name,
        })),
        tiles: [...guess.result.tiles] as TileResult[],
      })),
      status: game.status,
    }
    localStorage.setItem(key, JSON.stringify(serialized))
  }

  loadByDate(date: GameDate): Game | null {
    const key = KEY_PREFIX + date.value
    const raw = localStorage.getItem(key)
    if (raw === null) {
      return null
    }

    try {
      const data = JSON.parse(raw) as SerializedGame

      const gameDate = GameDate.create(data.date)
      const categoryId = CategoryId.create(data.categoryId)
      const categoryEmojis = data.categoryEmojis.map((e) =>
        Emoji.create({ code: e.code, name: e.name }),
      )
      const category = EmojiCategory.create({
        id: categoryId,
        name: data.categoryName,
        emojis: categoryEmojis,
      })

      const answerEmojis = data.answer.map((e) =>
        Emoji.create({ code: e.code, name: e.name }),
      )
      const answer = EmojiSequence.create(answerEmojis)

      const attempts = data.attempts.map((a) => {
        const sequenceEmojis = a.sequence.map((e) =>
          Emoji.create({ code: e.code, name: e.name }),
        )
        const sequence = EmojiSequence.create(sequenceEmojis)
        const result = GuessResult.create(a.tiles)
        return Guess.create({ sequence, result })
      })

      return Game.restore({
        date: gameDate,
        category,
        answer,
        attempts,
        status: data.status,
      })
    } catch (error) {
      console.warn(
        `Failed to load game for date ${date.value}:`,
        error,
      )
      return null
    }
  }
}
