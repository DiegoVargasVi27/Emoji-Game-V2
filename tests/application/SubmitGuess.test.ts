import { SubmitGuess } from '@application/SubmitGuess'
import { ApplicationError } from '@application/ApplicationError'
import { Game } from '@domain/model/Game'
import { GameDate } from '@domain/model/GameDate'
import { Emoji } from '@domain/model/Emoji'
import { EmojiSequence } from '@domain/model/EmojiSequence'
import { EmojiCategory } from '@domain/model/EmojiCategory'
import { CategoryId } from '@domain/model/CategoryId'
import { PlayerStats } from '@domain/model/PlayerStats'
import { DomainError } from '@domain/model/DomainError'
import type { IGameRepository } from '@domain/ports/IGameRepository'
import type { IStatsRepository } from '@domain/ports/IStatsRepository'

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

const makeGame = () =>
  Game.create({ date: makeDate(), category: makeCategory(), answer: makeAnswer() })

const createMocks = () => {
  const gameRepo: IGameRepository = {
    save: vi.fn(),
    loadByDate: vi.fn(),
  }
  const statsRepo: IStatsRepository = {
    load: vi.fn(),
    save: vi.fn(),
  }
  return { gameRepo, statsRepo }
}

describe('SubmitGuess', () => {
  it('should submit guess and return updated Game', () => {
    const { gameRepo, statsRepo } = createMocks()
    const game = makeGame()
    vi.mocked(gameRepo.loadByDate).mockReturnValue(game)

    const useCase = new SubmitGuess(gameRepo, statsRepo)
    const result = useCase.execute(makeDate(), seq('F', 'F', 'F', 'F', 'F'))

    expect(result.attempts).toHaveLength(1)
    expect(result.status).toBe('playing')
  })

  it('should throw ApplicationError if no game exists', () => {
    const { gameRepo, statsRepo } = createMocks()
    vi.mocked(gameRepo.loadByDate).mockReturnValue(null)

    const useCase = new SubmitGuess(gameRepo, statsRepo)

    expect(() => useCase.execute(makeDate(), seq('A', 'B', 'C', 'D', 'E'))).toThrow(
      ApplicationError,
    )
    expect(() => useCase.execute(makeDate(), seq('A', 'B', 'C', 'D', 'E'))).toThrow(
      'No active game found',
    )
  })

  it('should propagate DomainError if game is already won', () => {
    const { gameRepo, statsRepo } = createMocks()
    const game = makeGame()
    const wonGame = game.submitGuess(makeAnswer())
    vi.mocked(gameRepo.loadByDate).mockReturnValue(wonGame)

    const useCase = new SubmitGuess(gameRepo, statsRepo)

    expect(() => useCase.execute(makeDate(), seq('A', 'B', 'C', 'D', 'E'))).toThrow(
      DomainError,
    )
    expect(() => useCase.execute(makeDate(), seq('A', 'B', 'C', 'D', 'E'))).toThrow(
      'Cannot submit guess: game is already over',
    )
  })

  it('should propagate DomainError if game is already lost', () => {
    const { gameRepo, statsRepo } = createMocks()
    let game = makeGame()
    const wrong = seq('F', 'F', 'F', 'F', 'F')
    for (let i = 0; i < 6; i++) {
      game = game.submitGuess(wrong)
    }
    vi.mocked(gameRepo.loadByDate).mockReturnValue(game)

    const useCase = new SubmitGuess(gameRepo, statsRepo)

    expect(() => useCase.execute(makeDate(), wrong)).toThrow(DomainError)
    expect(() => useCase.execute(makeDate(), wrong)).toThrow(
      'Cannot submit guess: game is already over',
    )
  })

  it('should save updated Game to repository', () => {
    const { gameRepo, statsRepo } = createMocks()
    const game = makeGame()
    vi.mocked(gameRepo.loadByDate).mockReturnValue(game)

    const useCase = new SubmitGuess(gameRepo, statsRepo)
    const result = useCase.execute(makeDate(), seq('F', 'F', 'F', 'F', 'F'))

    expect(gameRepo.save).toHaveBeenCalledOnce()
    expect(gameRepo.save).toHaveBeenCalledWith(result)
  })

  it('should trigger stats update with outcome "won" on winning guess', () => {
    const { gameRepo, statsRepo } = createMocks()
    const game = makeGame()
    vi.mocked(gameRepo.loadByDate).mockReturnValue(game)
    vi.mocked(statsRepo.load).mockReturnValue(PlayerStats.empty())

    const useCase = new SubmitGuess(gameRepo, statsRepo)
    useCase.execute(makeDate(), makeAnswer())

    expect(statsRepo.load).toHaveBeenCalledOnce()
    expect(statsRepo.save).toHaveBeenCalledOnce()
    const savedStats = vi.mocked(statsRepo.save).mock.calls[0][0]
    expect(savedStats.gamesPlayed).toBe(1)
    expect(savedStats.gamesWon).toBe(1)
  })

  it('should trigger stats update with outcome "lost" on 6th wrong guess', () => {
    const { gameRepo, statsRepo } = createMocks()
    let game = makeGame()
    const wrong = seq('F', 'F', 'F', 'F', 'F')
    for (let i = 0; i < 5; i++) {
      game = game.submitGuess(wrong)
    }
    vi.mocked(gameRepo.loadByDate).mockReturnValue(game)
    vi.mocked(statsRepo.load).mockReturnValue(PlayerStats.empty())

    const useCase = new SubmitGuess(gameRepo, statsRepo)
    useCase.execute(makeDate(), wrong)

    expect(statsRepo.load).toHaveBeenCalledOnce()
    expect(statsRepo.save).toHaveBeenCalledOnce()
    const savedStats = vi.mocked(statsRepo.save).mock.calls[0][0]
    expect(savedStats.gamesPlayed).toBe(1)
    expect(savedStats.gamesWon).toBe(0)
  })

  it('should NOT update stats on non-final guess', () => {
    const { gameRepo, statsRepo } = createMocks()
    const game = makeGame()
    vi.mocked(gameRepo.loadByDate).mockReturnValue(game)

    const useCase = new SubmitGuess(gameRepo, statsRepo)
    useCase.execute(makeDate(), seq('F', 'F', 'F', 'F', 'F'))

    expect(statsRepo.load).not.toHaveBeenCalled()
    expect(statsRepo.save).not.toHaveBeenCalled()
  })
})
