# Emoji Wordle

A daily puzzle game where players guess a hidden sequence of 5 emojis from a themed category. Inspired by Wordle, each guess reveals which emojis are correct, misplaced, or absent -- using colored tile feedback to guide the player toward the answer in 6 attempts or fewer.

## Features

- Daily challenge seeded by date, so every player gets the same puzzle
- Wordle-style feedback: correct (green), misplaced (yellow), absent (gray)
- Emoji keyboard filtered by the day's category
- Animated tile reveals with cascading color updates
- Win/loss streaks and guess distribution statistics
- Shareable results as colored grid text
- Game state persisted in localStorage across sessions

## Tech Stack

| Technology | Role |
|---|---|
| React 19 | UI rendering |
| TypeScript 5.9 | Strict mode with `noUncheckedIndexedAccess` |
| Zustand 5 | Lightweight state management (vanilla store) |
| Vite 7 | Dev server and bundler |
| Vitest 4 | Unit testing with jsdom environment |
| Tailwind CSS 3 | Utility-first styling |
| ESLint 9 | Flat config with architectural boundary enforcement |

## Architecture

The project follows **Domain-Driven Design** with a strict layered architecture. Each layer has a single direction of dependency, enforced at the linting level:

```
domain  -->  application  -->  infrastructure
                               presentation
```

- **Domain** contains the core game logic as pure TypeScript classes: value objects (`Emoji`, `EmojiSequence`, `GameDate`, `CategoryId`, `GuessResult`), aggregates (`Game`, `PlayerStats`), domain services (`GuessEvaluator`, `ShareTextGenerator`), and port interfaces (`IGameRepository`, `IChallengeGenerator`, `IStatsRepository`). It has zero external dependencies.
- **Application** implements use cases (`StartDailyGame`, `SubmitGuess`, `GetPlayerStats`) that orchestrate domain objects through port interfaces.
- **Infrastructure** provides concrete adapters: `LocalStorageGameRepository`, `LocalStorageStatsRepository` for persistence, `SeededChallengeGenerator` for deterministic daily puzzles using a seeded PRNG (djb2 + Mulberry32).
- **Presentation** contains React components, a Zustand store, view models, and mappers that translate domain state into UI-ready data.

An ESLint `no-restricted-imports` rule prevents the domain layer from importing infrastructure or presentation code, keeping the dependency direction clean at CI time.

## Project Structure

```
src/
  domain/
    model/          # Value objects and aggregates (Game, Emoji, PlayerStats, ...)
    services/       # Domain services (GuessEvaluator, ShareTextGenerator)
    ports/          # Interfaces for external dependencies
  application/      # Use cases (StartDailyGame, SubmitGuess, GetPlayerStats)
  infrastructure/
    catalog/        # Emoji category data
    challenge/      # Seeded daily challenge generator
    persistence/    # LocalStorage adapters
  presentation/
    components/     # React components (Board, Keyboard, modals, layout)
    hooks/          # Custom React hooks
    mappers/        # Domain-to-ViewModel transformations
    pages/          # Page-level components
    store/          # Zustand store
    viewmodels/     # ViewModel type definitions
tests/
  domain/           # Value object and aggregate tests
  application/      # Use case tests
  infrastructure/   # Adapter tests
  presentation/     # Mapper tests
```

## Getting Started

```bash
# Clone the repository
git clone https://github.com/diegovargas/emoji-game-v2.git
cd emoji-game-v2

# Install dependencies
npm install

# Start the dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Testing

The test suite contains **92 tests** across 16 test files, organized by architectural layer:

- **Domain tests** (10 files): Thorough coverage of value object invariants, game state transitions, guess evaluation logic (including duplicate emoji handling), player stats with streak tracking, and share text generation.
- **Application tests** (3 files): Use case tests with in-memory repository stubs, verifying orchestration behavior including stats updates on game completion.
- **Infrastructure tests** (3 files): Adapter tests for localStorage persistence round-trips and seeded challenge determinism.
- **Presentation tests** (1 file): GameStateMapper tests ensuring correct domain-to-viewmodel translation.

```bash
# Run all tests
npm test

# Run tests with interactive UI
npm run test:ui
```

## Design Decisions

**Immutable value objects with private constructors** -- Domain types like `Emoji`, `EmojiSequence`, `GameDate`, and `GuessResult` enforce their invariants through factory methods (`create`, `restore`) and expose only readonly properties. This makes invalid states unrepresentable.

**Game as an immutable aggregate** -- `Game.submitGuess()` returns a new `Game` instance rather than mutating state. This eliminates an entire class of bugs related to shared mutable state and makes the game logic trivially testable.

**Ports and adapters** -- The domain defines interfaces (`IGameRepository`, `IChallengeGenerator`, `IStatsRepository`) that infrastructure implements. Use cases depend only on these abstractions, making it straightforward to swap localStorage for an API backend or test with in-memory stubs.

**Deterministic daily challenges** -- The `SeededChallengeGenerator` uses a djb2 hash of the date string as a seed for a Mulberry32 PRNG. This guarantees every player sees the same puzzle on a given day without requiring a server.

**Two-pass guess evaluation** -- `GuessEvaluator` uses a frequency-map approach with two passes (correct first, then misplaced) to correctly handle duplicate emojis in guesses -- the same algorithm Wordle uses for duplicate letters.

**Path aliases for layer boundaries** -- TypeScript path aliases (`@domain/*`, `@application/*`, `@infrastructure/*`, `@presentation/*`) make imports readable and reinforce the architectural layers at the code level.
