import { StartDailyGame } from '@application/StartDailyGame'
import { Game } from '@domain/model/Game'
import { GameDate } from '@domain/model/GameDate'
import { Emoji } from '@domain/model/Emoji'
import { EmojiSequence } from '@domain/model/EmojiSequence'
import { EmojiCategory } from '@domain/model/EmojiCategory'
import { CategoryId } from '@domain/model/CategoryId'
import type { IGameRepository } from '@domain/ports/IGameRepository'
import type { IChallengeGenerator } from '@domain/ports/IChallengeGenerator'

const e = (code: string) => Emoji.create({ code, name: code })
const seq = (...codes: string[]) => EmojiSequence.create(codes.map((c) => e(c)))

const makeCategory = () =>
  EmojiCategory.create({
    id: CategoryId.create('fruits'),
    name: 'Fruits',
    emojis: [e('A'), e('B'), e('C'), e('D'), e('E'), e('F')],
  })

const makeDate = () => GameDate.create('2026-03-11')

const makeAnswer = () => seq('A', 'B', 'C', 'D', 'E')

const createMocks = () => {
  const gameRepo: IGameRepository = {
    save: vi.fn(),
    loadByDate: vi.fn(),
  }
  const challengeGenerator: IChallengeGenerator = {
    generate: vi.fn(),
  }
  return { gameRepo, challengeGenerator }
}

describe('StartDailyGame', () => {
  it('should return existing game if already saved', () => {
    const { gameRepo, challengeGenerator } = createMocks()
    const date = makeDate()
    const existingGame = Game.create({ date, category: makeCategory(), answer: makeAnswer() })
    vi.mocked(gameRepo.loadByDate).mockReturnValue(existingGame)

    const useCase = new StartDailyGame(gameRepo, challengeGenerator)
    const result = useCase.execute(date)

    expect(result).toBe(existingGame)
    expect(challengeGenerator.generate).not.toHaveBeenCalled()
  })

  it('should generate and save a new game if none exists', () => {
    const { gameRepo, challengeGenerator } = createMocks()
    const date = makeDate()
    const category = makeCategory()
    const answer = makeAnswer()
    vi.mocked(gameRepo.loadByDate).mockReturnValue(null)
    vi.mocked(challengeGenerator.generate).mockReturnValue({ category, answer })

    const useCase = new StartDailyGame(gameRepo, challengeGenerator)
    const result = useCase.execute(date)

    expect(result.status).toBe('playing')
    expect(result.attempts).toHaveLength(0)
    expect(result.category).toBe(category)
    expect(result.answer).toBe(answer)
  })

  it('should call gameRepo.save once for a new game', () => {
    const { gameRepo, challengeGenerator } = createMocks()
    const date = makeDate()
    vi.mocked(gameRepo.loadByDate).mockReturnValue(null)
    vi.mocked(challengeGenerator.generate).mockReturnValue({
      category: makeCategory(),
      answer: makeAnswer(),
    })

    const useCase = new StartDailyGame(gameRepo, challengeGenerator)
    useCase.execute(date)

    expect(gameRepo.save).toHaveBeenCalledOnce()
  })

  it('should not call challengeGenerator.generate if game exists', () => {
    const { gameRepo, challengeGenerator } = createMocks()
    const date = makeDate()
    const existingGame = Game.create({ date, category: makeCategory(), answer: makeAnswer() })
    vi.mocked(gameRepo.loadByDate).mockReturnValue(existingGame)

    const useCase = new StartDailyGame(gameRepo, challengeGenerator)
    useCase.execute(date)

    expect(challengeGenerator.generate).not.toHaveBeenCalled()
  })

  it('should propagate error if generator throws', () => {
    const { gameRepo, challengeGenerator } = createMocks()
    const date = makeDate()
    vi.mocked(gameRepo.loadByDate).mockReturnValue(null)
    vi.mocked(challengeGenerator.generate).mockImplementation(() => {
      throw new Error('Generator failed')
    })

    const useCase = new StartDailyGame(gameRepo, challengeGenerator)

    expect(() => useCase.execute(date)).toThrow('Generator failed')
  })
})
