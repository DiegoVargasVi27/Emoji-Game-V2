# Tasks: emoji-wordle

**Project**: Emoji-Game-V2
**Change name**: emoji-wordle
**Phase**: tasks
**Date**: 2026-03-12
**Depends on**: proposal.md

---

## State

```
change: emoji-wordle
phase: in-progress
current-task: Phase 2 (complete)
last-updated: 2026-03-12
```

---

## Phase 0: Project Setup

- [x] **0.1** Scaffold Vite + React + TypeScript project at `P:\Emoji-Game-V2` with `npm create vite@latest . -- --template react-ts`
- [x] **0.2** Install Tailwind CSS v3 and configure `tailwind.config.ts` + `postcss.config.js`; add Tailwind directives to `src/index.css`
- [x] **0.3** Install Zustand (`zustand`); verify import resolves correctly in TS strict mode
- [x] **0.4** Install Vitest, `@vitest/ui`, `@testing-library/react`, `@testing-library/user-event`, `jsdom`; configure `vite.config.ts` with `test: { environment: 'jsdom' }`
- [x] **0.5** Create the full folder skeleton from design §8 (all directories: `src/domain/model`, `src/domain/services`, `src/domain/ports`, `src/application`, `src/infrastructure/persistence`, `src/infrastructure/catalog`, `src/infrastructure/challenge`, `src/presentation/store`, `src/presentation/hooks`, `src/presentation/mappers`, `src/presentation/viewmodels`, `src/presentation/pages`, `src/presentation/components/layout`, `src/presentation/components/Board`, `src/presentation/components/Keyboard`, `src/presentation/components/modals`, `src/styles`, `tests/domain`, `tests/application`, `tests/infrastructure`, `tests/presentation`); add `.gitkeep` placeholders
- [x] **0.6** Configure ESLint with `eslint-plugin-react-hooks` and a `no-restricted-imports` rule that blocks any import of `src/infrastructure` or `src/presentation` from within `src/domain`
- [x] **0.7** Configure Prettier with project-level `.prettierrc`; add `format` and `lint` scripts to `package.json`
- [x] **0.8** Add `tsconfig.json` with `"strict": true`, `"noUncheckedIndexedAccess": true`, and path aliases (`@domain`, `@application`, `@infrastructure`, `@presentation`) matching the folder structure
- [x] **0.9** Update `index.html` with app title "Emoji Wordle" and correct `<meta>` viewport tag for mobile-first layout
- [x] **0.10** Verify setup: run `npm run dev` (Vite serves), `npm test` (Vitest runs with zero tests but no errors), `npm run lint` (no lint errors)

---

## Phase 1: Domain Layer

> Pure TypeScript. Zero external imports. No React, no localStorage, no Zustand.
> Gate: `src/domain` has no imports outside itself (enforced by ESLint rule from 0.6).

### Value Objects

- [x] **1.1** Create `src/domain/model/GameDate.ts` — VO wrapping ISO date string `YYYY-MM-DD`; factory `GameDate.create(value: string): GameDate` validates format with regex `/^\d{4}-\d{2}-\d{2}$/` and that it is a real date; static `GameDate.fromUTCDate(date: Date): GameDate` extracts UTC date via `toISOString().slice(0, 10)`; throws `DomainError('GameDate must be a valid ISO date YYYY-MM-DD')` on invalid input
- [x] **1.2** Create `src/domain/model/Emoji.ts` — VO with fields `code: string`, `name: string`; factory `Emoji.create({code, name}): Emoji`; validates: code non-empty (throws `'Emoji code must not be empty'`), name non-empty after trim (throws `'Emoji name must not be empty'`); equality method `equals(other: Emoji): boolean` compares by `code` only
- [x] **1.3** Create `src/domain/model/CategoryId.ts` — VO wrapping a slug string; factory `CategoryId.create(value: string): CategoryId`; validates non-empty (throws `'CategoryId must not be empty'`), matches `/^[a-z0-9]+(?:-[a-z0-9]+)*$/` (throws `'CategoryId must be a valid slug'`)
- [x] **1.4** Create `src/domain/model/EmojiCategory.ts` — VO with fields `id: CategoryId`, `name: string`, `emojis: readonly Emoji[]`; factory `EmojiCategory.create({id, name, emojis}): EmojiCategory`; validates `emojis.length >= 5` (throws `'Category must have at least 5 emojis to form a sequence'`)
- [x] **1.5** Create `src/domain/model/EmojiSequence.ts` — VO wrapping `readonly [Emoji, Emoji, Emoji, Emoji, Emoji]`; factory `EmojiSequence.create(emojis: Emoji[]): EmojiSequence`; validates exactly 5 elements (throws `'EmojiSequence must contain exactly 5 emojis'`); underlying array is `Object.freeze`d for runtime immutability; exposes `emojis: readonly Emoji[]` getter
- [x] **1.6** Create `src/domain/model/TileResult.ts` — `type TileResult = 'correct' | 'misplaced' | 'absent'`; export the type and a `TILE_RESULTS` const tuple for exhaustive checks
- [x] **1.7** Create `src/domain/model/GuessResult.ts` — VO wrapping `readonly [TileResult, TileResult, TileResult, TileResult, TileResult]`; factory `GuessResult.create(tiles: TileResult[]): GuessResult`; validates exactly 5 tiles; exposes `tiles: readonly TileResult[]`; exposes `isAllCorrect(): boolean` (all 5 tiles are `'correct'`)
- [x] **1.8** Create `src/domain/model/Guess.ts` — VO combining `sequence: EmojiSequence` and `result: GuessResult`; factory `Guess.create({sequence, result}): Guess`; immutable record, no validation beyond required fields
- [x] **1.9** Create `src/domain/model/GameStatus.ts` — `type GameStatus = 'playing' | 'won' | 'lost'`; export the type
- [x] **1.10** Create `src/domain/model/Game.ts` — Aggregate root; fields: `id: GameDate`, `category: EmojiCategory`, `answer: EmojiSequence`, `attempts: readonly Guess[]`, `status: GameStatus`, `maxAttempts: 6`; static factory `Game.create({date, category, answer}): Game` initializes with `status: 'playing'` and `attempts: []`; method `submitGuess(sequence: EmojiSequence): Game` returns a new immutable `Game` (does not mutate); internally imports and uses `GuessEvaluator` to evaluate the guess — no evaluator param; throws `DomainError('Cannot submit guess: game is already over')` if status !== 'playing'; evaluates the guess, appends `Guess`, determines new status per state machine; never exceeds `maxAttempts` attempts
- [x] **1.11** Create `src/domain/model/DomainError.ts` — `class DomainError extends Error`; constructor sets `this.name = 'DomainError'`; used for all domain validation failures
- [x] **1.12** Create `src/domain/model/PlayerStats.ts` — VO with fields: `gamesPlayed: number`, `gamesWon: number`, `currentStreak: number`, `bestStreak: number`, `lastPlayedDate: GameDate | null`, `guessDistribution: Readonly<Record<1|2|3|4|5|6, number>>`. Factory `PlayerStats.empty(): PlayerStats` returns all zeros. Method `recordResult(date: GameDate, outcome: 'won' | 'lost', attemptsUsed: number): PlayerStats` — returns new instance. Streak logic: if lastPlayedDate is yesterday (UTC), keep streak (increment if won, reset to 0 if lost). If lastPlayedDate is older or null, start fresh streak (1 if won, 0 if lost). Updates bestStreak if currentStreak exceeds it. Increments gamesPlayed, conditionally increments gamesWon, updates guessDistribution[attemptsUsed] if won.

### Domain Ports (Interfaces)

- [x] **1.13** Create `src/domain/ports/IGameRepository.ts` — `interface IGameRepository { save(game: Game): void; loadByDate(date: GameDate): Game | null; }`
- [x] **1.14** Create `src/domain/ports/IChallengeGenerator.ts` — `interface IChallengeGenerator { generate(date: GameDate): { category: EmojiCategory; answer: EmojiSequence } }`
- [x] **1.15** Create `src/domain/ports/IStatsRepository.ts` — `interface IStatsRepository { load(): PlayerStats; save(stats: PlayerStats): void }`

### Domain Services

- [x] **1.16** Create `src/domain/services/GuessEvaluator.ts` — class `GuessEvaluator` with method `evaluate(guess: EmojiSequence, answer: EmojiSequence): GuessResult`; implements two-pass frequency-counting algorithm: Pass 1 marks exact matches (`correct`) and decrements frequency budget; Pass 2 marks remaining positions as `misplaced` (if frequency > 0) or `absent`; pure function — no side effects, no I/O; returns `GuessResult.create(tiles)`
- [x] **1.17** Create `src/domain/services/ShareTextGenerator.ts` — pure function `generateShareText(game: Game): string`. Format: `"Emoji Wordle {YYYY-MM-DD} {attempts}/{maxAttempts}\n"` + one line per attempt mapping TileResult to emoji: correct->green square, misplaced->yellow square, absent->black square. If game is lost, show `"X/6"` instead of `"{attempts}/6"`.

---

## Phase 2: Domain Tests

> All tests in `tests/domain/`. No React, no infrastructure, no mocks for domain internals.

### Value Object Tests

- [x] **2.1** `tests/domain/Emoji.test.ts` — test scenarios: valid creation with code and name, empty code rejected, whitespace-only name rejected, equality is value-based on `code` (two independently constructed Emoji with same code are equal)
- [x] **2.2** `tests/domain/CategoryId.test.ts` — test: valid slug `fruits`, valid slug with hyphen `ice-cream`, empty string rejected, invalid slug `My Category!` rejected, leading hyphen `-fruits` rejected, trailing hyphen `fruits-` rejected
- [x] **2.3** `tests/domain/EmojiSequence.test.ts` — test all scenarios: valid 5-element list, valid list with repeated emojis accepted, 4 elements rejected, 6 elements rejected, empty list rejected, immutability enforced (attempt to modify `emojis` array does not change sequence — use `Object.isFrozen`)
- [x] **2.4** `tests/domain/GuessResult.test.ts` — test: valid 5-tile creation, `isAllCorrect()` returns true for all-correct, false for mixed, 4 tiles rejected, 6 tiles rejected
- [x] **2.5** `tests/domain/GameDate.test.ts` — test: valid date `2026-03-11`, `fromUTCDate` extracts UTC date correctly, invalid format `2026-3-1` rejected, non-date `not-a-date` rejected

### GuessEvaluator Tests

- [x] **2.6** `tests/domain/GuessEvaluator.test.ts` — implement ALL 10 scenarios from spec §1.3 as individual `it` blocks

### Game Aggregate Tests

- [x] **2.7** `tests/domain/Game.test.ts` — test all spec §1.4 scenarios

### PlayerStats Tests

- [x] **2.8** `tests/domain/PlayerStats.test.ts` — scenarios: (1) empty() returns all zeros, (2) first win sets gamesPlayed=1, gamesWon=1, currentStreak=1, bestStreak=1, (3) first loss sets gamesPlayed=1, gamesWon=0, currentStreak=0, (4) consecutive wins increment streak, (5) loss after wins resets currentStreak but keeps bestStreak, (6) skipping a day (lastPlayedDate is not yesterday) resets streak, (7) guessDistribution increments correct bucket on win, (8) guessDistribution unchanged on loss

### ShareTextGenerator Tests

- [x] **2.9** `tests/domain/ShareTextGenerator.test.ts` — scenarios: (1) won game produces correct header `"Emoji Wordle {date} {n}/6"`, (2) lost game produces `"X/6"`, (3) each row maps tiles to correct emojis, (4) game with 0 attempts produces header only

---

## Phase 3: Infrastructure Layer

> Implements domain ports. May use localStorage and TypeScript data files. No React.

### Emoji Catalog

- [x] **3.1** Create `src/infrastructure/catalog/emojiCatalog.ts` — TypeScript constant `EMOJI_CATALOG` with type `ReadonlyArray<{ id: string; name: string; emojis: ReadonlyArray<{ code: string; name: string }> }>`. Include 8 categories: `fruits` (10+ emojis), `animals` (10+), `food` (10+), `vehicles` (10+), `hearts` (10+), `sports` (10+), `nature` (10+), `faces` (10+). Each category must have at least 10 emojis to provide variety. Exact emoji list can vary but maintain these categories.

### SeededChallengeGenerator (moved from domain)

- [x] **3.2** Create `src/infrastructure/challenge/SeededChallengeGenerator.ts` — class `SeededChallengeGenerator implements IChallengeGenerator`. Constructor takes the emoji catalog data. Method `generate(date: GameDate): { category: EmojiCategory; answer: EmojiSequence }`. Implementation: (a) `getDailySeed(date)` using DJB2 hash of ISO date string, (b) `mulberry32(seed)` PRNG returning float 0-1, (c) category selection via `Math.floor(rand() * catalog.length)`, (d) Fisher-Yates partial shuffle picking 5 UNIQUE emojis. Converts raw catalog data to domain VOs (CategoryId, Emoji, EmojiCategory, EmojiSequence). Validates catalog non-empty (throws `'Catalog must have at least one category'`).

### LocalStorage Persistence

- [x] **3.3** Create `src/infrastructure/persistence/LocalStorageGameRepository.ts` — class `LocalStorageGameRepository implements IGameRepository`. Key format: `emoji-wordle:game:{YYYY-MM-DD}`. `save(game: Game): void` serializes to JSON shape: `{ date: string, categoryId: string, categoryName: string, categoryEmojis: {code: string, name: string}[], answer: string[], attempts: { sequence: string[], tiles: TileResult[] }[], status: GameStatus }`. Stores enough data to reconstruct domain objects WITHOUT needing the catalog. `loadByDate(date: GameDate): Game | null` reads key, parses JSON, reconstructs full domain objects (Emoji, EmojiCategory, EmojiSequence, GuessResult, Guess, Game). If JSON is corrupt or parse fails, `console.warn` and return `null`. If key doesn't exist, return `null`.
- [x] **3.4** Create `src/infrastructure/persistence/LocalStorageStatsRepository.ts` — class `LocalStorageStatsRepository implements IStatsRepository`. Key: `emoji-wordle:stats`. `load(): PlayerStats` reads from localStorage, parses JSON, reconstructs `PlayerStats` VO. If not found or corrupt, returns `PlayerStats.empty()`. `save(stats: PlayerStats): void` serializes and writes. JSON shape matches PlayerStats fields: `{ gamesPlayed, gamesWon, currentStreak, bestStreak, lastPlayedDate, guessDistribution }`.

### Infrastructure Tests

- [x] **3.5** `tests/infrastructure/LocalStorageGameRepository.test.ts` — mock localStorage via `vi.stubGlobal`. Scenarios: (1) save then loadByDate returns equivalent Game (all fields match), (2) loadByDate for non-existent date returns null, (3) corrupt JSON in localStorage returns null and logs warning, (4) saves overwrite previous game for same date, (5) different dates stored independently, (6) reconstructed Game has correct domain VOs (not raw strings) — verify types.
- [x] **3.6** `tests/infrastructure/LocalStorageStatsRepository.test.ts` — mock localStorage. Scenarios: (1) load from empty localStorage returns PlayerStats.empty(), (2) save then load returns equivalent PlayerStats, (3) corrupt localStorage returns PlayerStats.empty(), (4) overwrites existing stats on save.
- [x] **3.7** `tests/infrastructure/SeededChallengeGenerator.test.ts` — Scenarios: (1) same date always produces same category and answer (determinism), (2) different dates produce different results (for a sample of 10 dates), (3) answer always has exactly 5 unique emojis, (4) answer emojis are all from the selected category, (5) empty catalog throws error, (6) category with fewer than 5 emojis throws error.

---

## Phase 4: Application Layer

> Use cases depend on domain ports (interfaces). No infrastructure imports. Tests use mock ports.

- [ ] **4.1** Create `src/application/StartDailyGame.ts` — class `StartDailyGame`. Constructor: `(gameRepo: IGameRepository, challengeGenerator: IChallengeGenerator)`. Method `execute(date: GameDate): Game`. Flow: (1) `gameRepo.loadByDate(date)` — if found, return it (rehydration path). (2) If null, `challengeGenerator.generate(date)` to get `{ category, answer }`. (3) `Game.create({ date, category, answer })`. (4) `gameRepo.save(game)`. (5) Return game. Errors: propagate domain errors from generator.
- [ ] **4.2** Create `src/application/SubmitGuess.ts` — class `SubmitGuess`. Constructor: `(gameRepo: IGameRepository, statsRepo: IStatsRepository)`. Method `execute(date: GameDate, sequence: EmojiSequence): Game`. Flow: (1) `gameRepo.loadByDate(date)` — if null, throw `ApplicationError('No active game found')`. (2) `game.submitGuess(sequence)` — returns new Game (may throw DomainError if game over). (3) `gameRepo.save(updatedGame)`. (4) If game just ended (`updatedGame.status !== 'playing'`): load stats via `statsRepo.load()`, call `stats.recordResult(date, updatedGame.status === 'won' ? 'won' : 'lost', updatedGame.attempts.length)`, `statsRepo.save(updatedStats)`. (5) Return updatedGame.
- [ ] **4.3** Create `src/application/GetPlayerStats.ts` — class `GetPlayerStats`. Constructor: `(statsRepo: IStatsRepository)`. Method `execute(): PlayerStats`. Delegates to `statsRepo.load()`. Simple read use case to keep presentation decoupled from infrastructure.
- [ ] **4.4** `tests/application/StartDailyGame.test.ts` — mock IGameRepository and IChallengeGenerator. Scenarios: (1) returns existing game if already saved for today (no generation called), (2) generates and saves new game if none exists, (3) verify `gameRepo.save` called exactly once for new game, (4) verify `challengeGenerator.generate` NOT called if game already exists, (5) propagates error if generator throws.
- [ ] **4.5** `tests/application/SubmitGuess.test.ts` — mock IGameRepository and IStatsRepository. Scenarios: (1) submits guess and returns updated Game, (2) throws ApplicationError if no game exists, (3) propagates DomainError if game is already won, (4) propagates DomainError if game is already lost, (5) saves updated Game to repository, (6) winning guess triggers stats update with outcome 'won', (7) 6th wrong guess triggers stats update with outcome 'lost', (8) non-final guess does NOT update stats.
- [ ] **4.6** `tests/application/GetPlayerStats.test.ts` — mock IStatsRepository. Scenarios: (1) returns stats from repository, (2) returns empty stats if repository returns empty.

---

## Phase 5: Presentation — Core Infrastructure

> ViewModel types, store, hook, and composition root. No component rendering yet.

- [ ] **5.1** Create `src/presentation/viewmodels/GameViewModel.ts` — Define interfaces:
  ```
  interface TileViewModel { emoji: string | null; status: 'correct' | 'misplaced' | 'absent' | 'pending' | 'empty' }
  interface KeyViewModel { code: string; displayEmoji: string; status: 'correct' | 'misplaced' | 'absent' | 'unused' }
  interface CategoryTabViewModel { id: string; name: string; isActive: boolean }
  interface GameViewModel {
    date: string;
    categoryName: string;
    board: TileViewModel[][];  // always 6 rows x 5 cols
    currentInput: string[];  // emoji codes being assembled (0-5)
    keyboardKeys: KeyViewModel[];
    keyboardCategories: CategoryTabViewModel[];
    status: 'playing' | 'won' | 'lost';
    attemptsUsed: number;
    maxAttempts: 6;
    answer: string[];  // revealed on game over
  }
  ```

- [ ] **5.2** Create `src/presentation/mappers/GameStateMapper.ts` — class `GameStateMapper` with static method `toViewModel(game: Game, currentInput: Emoji[], activeCategory: string): GameViewModel`. Transformations: (1) Map `game.attempts` to `TileViewModel[][]` — each Guess becomes a row of 5 tiles with their result status. (2) Add `currentInput` as a partial row with `'pending'` status for filled positions and `'empty'` for remaining. (3) Fill remaining rows (up to 6 total) with fully empty tiles. (4) Compute keyboard hints: iterate ALL attempts, for each emoji code determine its "best" status across all positions (priority: correct > misplaced > absent > unused). Return as `KeyViewModel[]` filtered by activeCategory. (5) Map categories to `CategoryTabViewModel[]`.

- [ ] **5.3** `tests/presentation/GameStateMapper.test.ts` — Scenarios: (1) Fresh game (0 attempts) maps to 6 empty rows, all keys unused. (2) Game with 2 guesses: first 2 rows have tile statuses, row 3 shows currentInput as pending, rows 4-6 empty. (3) Keyboard key that was `correct` in one guess and `absent` in another shows `correct` (best-status wins). (4) Won game shows `status: 'won'`. (5) Current input with 3 emojis shows 3 pending + 2 empty in current row.

- [ ] **5.4** Create `src/presentation/store/gameStore.ts` — Zustand store with shape:
  ```
  State: { viewModel: GameViewModel | null; isLoading: boolean; error: string | null; activeCategory: string; currentInput: Emoji[]; showResultModal: boolean; showStatsModal: boolean; stats: PlayerStats | null }
  Actions: { startGame(): Promise<void>; addEmoji(emoji: Emoji): void; removeLastEmoji(): void; submitGuess(): Promise<void>; setActiveCategory(id: string): void; toggleResultModal(): void; toggleStatsModal(): void; loadStats(): Promise<void> }
  ```
  `addEmoji` appends if `currentInput.length < 5`. `removeLastEmoji` pops last. `submitGuess` creates `EmojiSequence.create(currentInput)`, calls `SubmitGuess.execute()`, clears `currentInput`, updates `viewModel`. If currentInput.length < 5, does NOT submit (this is handled by UI validation/shake). After submit, if game ended, sets `showResultModal: true` and reloads stats. Use case instances injected via module-level factory `createGameStore(useCases: {...})`.

- [ ] **5.5** Create `src/main.tsx` — Composition root. Pattern: (1) Import and instantiate `EMOJI_CATALOG` data. (2) Create `SeededChallengeGenerator(catalog)`. (3) Create `LocalStorageGameRepository()`. (4) Create `LocalStorageStatsRepository()`. (5) Create use cases: `new StartDailyGame(gameRepo, challengeGen)`, `new SubmitGuess(gameRepo, statsRepo)`, `new GetPlayerStats(statsRepo)`. (6) Create store: `createGameStore({ startDailyGame, submitGuess, getPlayerStats })`. (7) Render `<App store={store} />` into `#root`. No DI framework — manual wiring only.

- [ ] **5.6** Create `src/presentation/hooks/useGame.ts` — Hook `useGame()` selects from Zustand store and returns: `{ viewModel, isLoading, error, addEmoji, removeLastEmoji, submitGuess, setActiveCategory, showResultModal, showStatsModal, toggleResultModal, toggleStatsModal, stats }`. Calls `startGame()` on mount via `useEffect`. This is the ONLY hook components call — components never access store directly.

- [ ] **5.7** Create `src/presentation/hooks/useShareResult.ts` — Hook `useShareResult(game: Game | null)` returns `{ shareResult: () => Promise<void>; copied: boolean }`. `shareResult` calls `generateShareText(game)` (domain function), copies to clipboard via `navigator.clipboard.writeText()`. Sets `copied: true` for 2 seconds via setTimeout, then resets. Falls back to legacy `document.execCommand('copy')` if clipboard API unavailable.

---

## Phase 6: Presentation — Components

> All components are pure props-driven (dumb). Only `GamePage` calls `useGame()`.

### Layout

- [ ] **6.1** `src/presentation/components/layout/App.tsx` — No props. Renders `<Header />` and `<GamePage />`. Container: `min-h-screen bg-gray-900 text-white flex flex-col items-center`.
- [ ] **6.2** `src/presentation/pages/GamePage.tsx` — No external props. Calls `useGame()`. Renders `<GameBoard>`, `<EmojiKeyboard>`, conditionally `<ResultModal>`, `<StatsModal>`. This is the ONLY smart component. All other components are pure/dumb.

### Board Components

- [ ] **6.3** `src/presentation/components/Board/EmojiTile.tsx` — Props: `{ emoji: string | null; status: 'correct' | 'misplaced' | 'absent' | 'pending' | 'empty'; position: number; isRevealing?: boolean }`. Renders square tile. Colors: correct=`bg-green-600`, misplaced=`bg-yellow-500`, absent=`bg-gray-700`, pending=`bg-gray-600 border-2 border-gray-400`, empty=`bg-transparent border-2 border-gray-700`. Size: `w-14 h-14 sm:w-16 sm:h-16`. Font size: `text-2xl sm:text-3xl`. `aria-label="{emoji} - {status}"` or `"empty tile"`.
- [ ] **6.4** `src/presentation/components/Board/GuessRow.tsx` — Props: `{ tiles: TileViewModel[]; isCurrentRow?: boolean; isShaking?: boolean }`. Renders 5 `<EmojiTile>` in a flex row with `gap-1`. `role="row"`.
- [ ] **6.5** `src/presentation/components/Board/GameBoard.tsx` — Props: `{ board: TileViewModel[][]; currentRowIndex: number; isShaking?: boolean; isWinBounce?: boolean }`. Renders 6 `<GuessRow>` in flex column with `gap-1`. `role="grid"` `aria-label="Game board"`. Max width: `max-w-sm mx-auto`.

### Keyboard Components

- [ ] **6.6** `src/presentation/components/Keyboard/EmojiKey.tsx` — Props: `{ code: string; displayEmoji: string; status: 'correct' | 'misplaced' | 'absent' | 'unused'; onClick: () => void }`. Size: `w-10 h-10 min-w-[40px]` (44px tap target with padding). Colors match tile colors by status. `unused`=`bg-gray-600`. `role="button"` `aria-label="{emoji name}"`. `text-xl`.
- [ ] **6.7** `src/presentation/components/Keyboard/EmojiGrid.tsx` — Props: `{ keys: KeyViewModel[]; onKeyClick: (code: string) => void }`. Renders wrapped flex grid of `<EmojiKey>`. `gap-1`. `flex-wrap`. Max height with overflow-y-auto if too many keys. `role="group" aria-label="Emoji keys"`.
- [ ] **6.8** `src/presentation/components/Keyboard/CategoryTab.tsx` — Props: `{ id: string; name: string; isActive: boolean; onClick: () => void }`. Active: `bg-gray-700 text-white border-b-2 border-blue-400`. Inactive: `text-gray-400 hover:text-gray-200`. `role="tab" aria-selected={isActive}`.
- [ ] **6.9** `src/presentation/components/Keyboard/ActionRow.tsx` — Props: `{ onDelete: () => void; onSubmit: () => void; canSubmit: boolean }`. Delete button: backspace icon or text, `aria-label="Delete last emoji"`. Submit button: "Enter" or checkmark, `aria-label="Submit guess"`. Submit `disabled` when `!canSubmit`. Both buttons `min-h-[44px]` for tap targets.
- [ ] **6.10** `src/presentation/components/Keyboard/EmojiKeyboard.tsx` — Props: `{ categories: CategoryTabViewModel[]; keys: KeyViewModel[]; onCategoryChange: (id: string) => void; onKeyClick: (code: string) => void; onDelete: () => void; onSubmit: () => void; canSubmit: boolean }`. Renders `<CategoryTab>` row (horizontal scroll, `role="tablist"`), `<EmojiGrid>`, `<ActionRow>`. Max width: `max-w-md mx-auto`. `aria-label="Emoji keyboard"`.

### Header

- [ ] **6.11** `src/presentation/components/layout/Header.tsx` — Props: `{ onStatsClick: () => void }`. Title "Emoji Wordle" centered, `text-xl font-bold`. Stats button: bar chart icon, top-right, `aria-label="View statistics"`. Sticky top, `bg-gray-900 border-b border-gray-700 p-4`.

### Modal Components

- [ ] **6.12** `src/presentation/components/modals/ModalOverlay.tsx` — Props: `{ isOpen: boolean; onClose: () => void; children: ReactNode }`. Backdrop: `fixed inset-0 bg-black/50 z-50`. Content: centered, `bg-gray-800 rounded-xl p-6 max-w-sm mx-4`. Closes on backdrop click and Escape key. Focus trap: on mount, focus first focusable child; on unmount, restore focus. `role="dialog" aria-modal="true"`. Render null when `!isOpen`.
- [ ] **6.13** `src/presentation/components/modals/ResultModal.tsx` — Props: `{ status: 'won' | 'lost'; attemptsUsed: number; maxAttempts: number; answer: string[]; onShare: () => void; copied: boolean; onClose: () => void }`. Win: "Great job!" + "{attemptsUsed}/{maxAttempts} guesses". Lose: "Better luck tomorrow!" + "The answer was: {emojis joined}". Share button: `bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold`. Text toggles: "Share Result" / "Copied!".
- [ ] **6.14** `src/presentation/components/modals/StatsModal.tsx` — Props: `{ stats: PlayerStats; onClose: () => void }`. Title: "Statistics". Display 4 stats in a row: Games Played, Win %, Current Streak, Best Streak. Below: "Guess Distribution" — horizontal bar chart showing counts for 1-6 guesses, with the bar width proportional to max count. Highlight the current game's guess count if applicable.

---

## Phase 7: Animations & Polish

- [ ] **7.1** Create `src/styles/animations.css` — Define all keyframes: `flipIn` (0% rotateX(0) -> 50% rotateX(90deg) -> 100% rotateX(0), 500ms ease-in-out), `shake` (0%,100% translateX(0) -> 25% translateX(-4px) -> 75% translateX(4px), 300ms), `bounce` (0%,100% scale(1) -> 50% scale(1.15), 400ms), `popIn` (0% scale(0.8) -> 50% scale(1.1) -> 100% scale(1), 100ms), `bounceIn` (0% scale(0) opacity(0) -> 60% scale(1.05) -> 100% scale(1) opacity(1), 300ms ease-out). Add corresponding Tailwind utility classes via `@layer utilities { .animate-flip { ... } ... }`.

- [ ] **7.2** Tile flip reveal: triggers when `GuessRow` transitions from `pending` to `evaluated`. Each tile flips sequentially with `300ms * index` stagger delay (tile 0 at 0ms, tile 4 at 1200ms). At the 50% mark (250ms), background color changes from neutral to result color. Implementation: CSS `animation-delay` via inline style `style={{ animationDelay: \`${index * 300}ms\` }}`. Total row reveal: ~1700ms.

- [ ] **7.3** Shake animation: triggers when user submits with fewer than 5 emojis selected (incomplete sequence). The current `GuessRow` receives `isShaking={true}` for 300ms. Remove class after animation via `onAnimationEnd`. Guess is NOT submitted — presentation-only validation.

- [ ] **7.4** Win bounce: triggers AFTER tile flip completes (~1700ms delay). Each tile in winning row bounces sequentially with `100ms` stagger. Total: ~2200ms after flip. Implementation: timeout after flip, then add bounce class to tiles.

- [ ] **7.5** Tile pop: triggers when emoji added to `currentInput`. Newly filled tile scales 0.8->1.1->1.0 over `100ms`. Trigger on `TileViewModel` transition from `empty` to `pending` with emoji value.

- [ ] **7.6** Keyboard color update timing: key colors update AFTER corresponding tile flip reveals. Each key updates when its tile's flip completes (at `300ms * index + 500ms`). Colors cascade over ~1700ms matching tile reveals. Implementation: use delayed state updates or CSS transition-delay synced with flip timings.

- [ ] **7.7** Mobile responsive verification — specific checks: (1) Board + keyboard fit 375px x 667px viewport without scroll. (2) Keyboard emoji grid wraps correctly with appropriate `gap`. (3) Add `env(safe-area-inset-bottom)` padding for notched devices. (4) Modals scrollable if content exceeds viewport. (5) Touch targets minimum 44x44px (WCAG 2.5.5). (6) `user-select: none` on interactive elements to prevent text selection on long-press.

- [ ] **7.8** ResultModal bounce-in: modal appears with `bounceIn` animation (scale 0->1.05->1 over 300ms). Delay: for wins, wait for flip (~1700ms) + bounce (~2200ms) = ~4s. For losses, wait for flip (~1700ms) + 500ms buffer = ~2.2s. Implementation: pass delay as prop or compute in store.

---

## Phase 8: Verification

> Manual test checklist against spec scenarios and automated suite runs.

### Automated Test Suite

- [ ] **8.1** Run full Vitest suite (`npm test`); assert zero failures; target >= 90% coverage on `src/domain` files
- [ ] **8.2** Run TypeScript compiler (`npx tsc --noEmit`); assert zero errors with `strict: true`
- [ ] **8.3** Run ESLint (`npm run lint`); assert zero errors

### GuessEvaluator Duplicate Scenarios (Manual Spot-Check)

- [ ] **8.4** Open the running app; play a guess where the same emoji appears twice in your guess but once in the answer
- [ ] **8.5** Play a guess where your guess has an emoji not in the answer at all, repeated 5 times

### Daily Challenge Determinism

- [ ] **8.6** In browser console, verify same date produces identical result
- [ ] **8.7** Verify game loaded matches tomorrow's expected seed

### LocalStorage Persistence & Rehydration

- [ ] **8.8** Start a game, submit 2 guesses, close the tab; reopen — verify board shows 2 guesses
- [ ] **8.9** Corrupt localStorage; reload — verify app starts fresh game
- [ ] **8.10** Win a game; reload — verify ResultModal appears immediately

### Accessibility

- [ ] **8.11** Navigate the full game using only keyboard
- [ ] **8.12** Use browser accessibility inspector; verify all emoji keys have `aria-label`
- [ ] **8.13** Verify `ResultModal` receives focus on open

### Statistics

- [ ] **8.14** Win a game; open StatsModal — verify stats correct
- [ ] **8.15** Manually set `lastPlayedDate` to yesterday; reload; win — verify streak increments

### Share Feature

- [ ] **8.16** Win a game; click "Copy result"; verify clipboard format
- [ ] **8.17** Lose a game; click "Copy result"; verify clipboard format

### Cross-Device

- [ ] **8.18** Open on a 375px viewport; verify no horizontal scroll
- [ ] **8.19** Verify emoji render consistently on Windows Chrome

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 0 | 10 | Project setup, tooling, folder structure |
| 1 | 17 | Domain layer: VOs, ports, services |
| 2 | 9 | Domain unit tests (all spec scenarios) |
| 3 | 7 | Infrastructure: catalog, challenge generator, localStorage repos, tests |
| 4 | 6 | Application use cases + tests |
| 5 | 7 | Presentation core: VMs, mapper, store, hooks, composition root |
| 6 | 14 | Presentation components (all UI components) |
| 7 | 8 | Animations & mobile polish |
| 8 | 19 | Verification: automated + manual |
| **Total** | **97** | |

---

*Tasks generated: 2026-03-11*
*Tasks updated: 2026-03-12*
*Depends on: proposal.md*
