import type { EmojiCategory } from '@domain/model/EmojiCategory'
import type { EmojiSequence } from '@domain/model/EmojiSequence'
import type { GameDate } from '@domain/model/GameDate'

export interface IChallengeGenerator {
  generate(date: GameDate): { category: EmojiCategory; answer: EmojiSequence }
}
