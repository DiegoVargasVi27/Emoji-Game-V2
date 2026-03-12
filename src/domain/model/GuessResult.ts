import { DomainError } from './DomainError.ts'
import type { TileResult } from './TileResult.ts'

type TileResultTuple = readonly [TileResult, TileResult, TileResult, TileResult, TileResult]

export class GuessResult {
  private readonly _tiles: TileResultTuple

  private constructor(tiles: TileResultTuple) {
    this._tiles = tiles
  }

  static create(tiles: TileResult[]): GuessResult {
    if (tiles.length !== 5) {
      throw new DomainError('GuessResult must contain exactly 5 tiles')
    }
    const tuple = Object.freeze([...tiles]) as unknown as TileResultTuple
    return new GuessResult(tuple)
  }

  get tiles(): readonly TileResult[] {
    return this._tiles
  }

  isAllCorrect(): boolean {
    return this._tiles.every((t) => t === 'correct')
  }
}
