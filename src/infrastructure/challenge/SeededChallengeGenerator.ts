import type { IChallengeGenerator } from '@domain/ports/IChallengeGenerator'
import type { GameDate } from '@domain/model/GameDate'
import { CategoryId } from '@domain/model/CategoryId'
import { Emoji } from '@domain/model/Emoji'
import { EmojiCategory } from '@domain/model/EmojiCategory'
import { EmojiSequence } from '@domain/model/EmojiSequence'

type CatalogData = ReadonlyArray<{
  id: string
  name: string
  emojis: ReadonlyArray<{ code: string; name: string }>
}>

function djb2Hash(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0
  }
  return hash >>> 0
}

function mulberry32(seed: number): () => number {
  let state = seed
  return () => {
    state = (state + 0x6D2B79F5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export class SeededChallengeGenerator implements IChallengeGenerator {
  private readonly catalog: CatalogData

  constructor(catalog: CatalogData) {
    if (catalog.length === 0) {
      throw new Error('Catalog must have at least one category')
    }
    this.catalog = catalog
  }

  generate(
    date: GameDate,
  ): { category: EmojiCategory; answer: EmojiSequence } {
    const seed = djb2Hash(date.value)
    const rand = mulberry32(seed)

    const rawCategory =
      this.catalog[Math.floor(rand() * this.catalog.length)]!

    if (rawCategory.emojis.length < 5) {
      throw new Error(
        `Category "${rawCategory.id}" must have at least 5 emojis`,
      )
    }

    // Fisher-Yates partial shuffle to pick 5 unique emojis
    const pool = [...rawCategory.emojis]
    for (let i = pool.length - 1; i > pool.length - 6; i--) {
      const j = Math.floor(rand() * (i + 1))
      const temp = pool[i]!
      pool[i] = pool[j]!
      pool[j] = temp
    }
    const picked = pool.slice(pool.length - 5)

    // Convert to domain VOs
    const categoryId = CategoryId.create(rawCategory.id)
    const emojis = rawCategory.emojis.map((e) =>
      Emoji.create({ code: e.code, name: e.name }),
    )
    const category = EmojiCategory.create({
      id: categoryId,
      name: rawCategory.name,
      emojis,
    })

    const answerEmojis = picked.map((e) =>
      Emoji.create({ code: e.code, name: e.name }),
    )
    const answer = EmojiSequence.create(answerEmojis)

    return { category, answer }
  }
}
