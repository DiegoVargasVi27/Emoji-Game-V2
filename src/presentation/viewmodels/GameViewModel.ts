export interface TileViewModel {
  emoji: string | null
  status: 'correct' | 'misplaced' | 'absent' | 'pending' | 'empty'
}

export interface KeyViewModel {
  code: string
  displayEmoji: string
  status: 'correct' | 'misplaced' | 'absent' | 'unused'
}

export interface GameViewModel {
  date: string
  categoryName: string
  board: TileViewModel[][]
  currentInput: string[]
  keyboardKeys: KeyViewModel[]
  status: 'playing' | 'won' | 'lost'
  attemptsUsed: number
  maxAttempts: 6
  answer: string[]
}
