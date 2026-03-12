# Proposal: emoji-wordle

**Project**: Emoji-Game-V2
**Change name**: emoji-wordle
**Date**: 2026-03-11
**Status**: proposed

---

## 1. Intent

Build a Wordle-like daily puzzle game where players guess a secret sequence of 5 emojis from a thematic category. The game is fully client-side — no backend required — using a date-based seed to ensure every player worldwide faces the same daily challenge. The application is built on a strict Domain-Driven Design architecture in React + TypeScript, demonstrating clean separation of concerns and testable domain logic.

**Why this exists**: Emoji Wordle combines the viral loop of Wordle (shared daily challenge, limited attempts, emoji-shareable result grid) with the expressiveness and universality of emoji, lowering the language barrier and broadening appeal.

---

## 2. Scope

### In scope
- Daily challenge: one puzzle per calendar date, same for all players globally (seed-based, no server)
- Guess a sequence of **5 emojis** from the **category of the day**
- **6 attempts** maximum
- Per-tile feedback: correct position (green), wrong position (misplaced/yellow), not in sequence (absent/gray)
- On-screen emoji keyboard grouped by category (fruits, food, vehicles, hearts, animals, etc.)
- Game state persisted to `localStorage` — player can close/reopen browser mid-game
- Win/lose end screen with shareable emoji grid (clipboard copy, no image generation)
- Statistics screen: games played, win %, current streak, best streak (localStorage)
- Responsive layout: mobile-first, playable on phone without zoom
- Accessibility: keyboard navigation, ARIA labels, high-contrast mode consideration

### Out of scope
- User accounts / authentication
- Backend API / database
- Real-time multiplayer
- Custom puzzle creation
- Image generation for sharing
- Internationalization (i18n) — English only for v1
- Native mobile app (web only)
- Animations beyond CSS transitions

---

## 3. Approach

### Architecture style: Domain-Driven Design (layered)

```
Presentation → Application → Domain ← Infrastructure
```

- **Domain layer** is pure TypeScript with zero external dependencies. All game logic lives here.
- **Application layer** orchestrates use cases, calling domain services and repositories via ports (interfaces).
- **Infrastructure layer** implements ports: localStorage adapter, emoji catalog data provider.
- **Presentation layer** is React components + custom hooks. Components are dumb; hooks bridge to use cases.

### Daily challenge algorithm (no backend)
A deterministic seed is derived from the ISO date string (`YYYY-MM-DD`). A seeded PRNG (mulberry32 or similar, ~10 lines) uses that seed to:
1. Pick one category from the catalog.
2. Pick 5 emojis from that category without repetition.

This is computed client-side. The catalog is a static JSON file bundled with the app.

### State management
Zustand store holds the in-memory game state (current attempts, keyboard state, modal visibility). On every mutation, the infrastructure repository writes to localStorage. On app load, the use case reads from localStorage to rehydrate.

### Feedback algorithm (GuessEvaluator)
Mirrors Wordle's multi-pass algorithm:
1. First pass: mark exact matches (correct).
2. Second pass: for remaining tiles, mark misplaced if emoji exists elsewhere in the answer (accounting for frequency — an emoji appearing twice in the answer can only be yellow/green twice total).

---

## 4. Domain Model

### Value Objects

| Name | Fields | Invariants |
|------|--------|------------|
| `Emoji` | `code: string`, `name: string`, `category: CategoryId` | code non-empty, name non-empty |
| `CategoryId` | `value: string` | non-empty, slug format |
| `EmojiCategory` | `id: CategoryId`, `name: string`, `emojis: Emoji[]` | min 5 emojis (need at least a full sequence) |
| `EmojiSequence` | `emojis: readonly Emoji[5]` | exactly 5 elements, emojis may repeat |
| `TileResult` | `'correct' \| 'misplaced' \| 'absent'` | union type (enum-like VO) |
| `GuessResult` | `tiles: readonly TileResult[5]` | exactly 5 tiles |
| `Guess` | `sequence: EmojiSequence`, `result: GuessResult` | both required |
| `GameStatus` | `'playing' \| 'won' \| 'lost'` | union type |
| `GameDate` | `value: string` | ISO date `YYYY-MM-DD`, valid date |

### Aggregate Root

**`Game`**
```
id: GameDate
category: EmojiCategory
answer: EmojiSequence
attempts: Guess[]          // 0–6 entries
status: GameStatus
maxAttempts: 6             // constant
```
Invariants:
- `attempts.length <= maxAttempts`
- `status === 'won'` iff last attempt result has all tiles `correct`
- `status === 'lost'` iff `attempts.length === maxAttempts` and not won
- Cannot add attempts when status !== 'playing'

Methods:
- `submitGuess(sequence: EmojiSequence, evaluator: GuessEvaluator): Game` — returns new immutable Game

### Domain Services

**`GuessEvaluator`**
```typescript
evaluate(guess: EmojiSequence, answer: EmojiSequence): GuessResult
```
- Pure function, no side effects, no dependencies
- Implements two-pass Wordle algorithm with frequency counting

**`DailyChallengeGenerator`**
```typescript
generate(date: GameDate, catalog: EmojiCategory[]): { category: EmojiCategory; answer: EmojiSequence }
```
- Uses mulberry32 seeded PRNG from date string hash
- Deterministic: same date always yields same result
- Picks category index, then 5 unique emojis from that category

### Ports (Interfaces)

**`IGameRepository`**
```typescript
save(game: Game): void
loadByDate(date: GameDate): Game | null
```

**`IEmojiCatalogProvider`**
```typescript
getCategories(): EmojiCategory[]
```

---

## 5. Tech Stack

| Concern | Choice | Rationale |
|---------|--------|-----------|
| UI framework | React 18 | Hooks + concurrent features; team familiarity |
| Language | TypeScript 5 | Strict mode; branded types for VOs; safety |
| Build tool | Vite | Fast HMR; minimal config; native ESM |
| Styling | Tailwind CSS v3 | Utility-first; no CSS-in-JS overhead; responsive out of the box |
| State management | Zustand | Minimal boilerplate; selector-based; works well with immutable domain objects |
| Testing | Vitest + React Testing Library | Vite-native; fast; same config as app |
| Persistence | localStorage | Zero infra; survives page refresh; simple JSON serialization |
| Emoji catalog | Static JSON (bundled) | No network dependency; tree-shakeable; version-controlled |
| PRNG | mulberry32 (inline, ~10 lines) | No dependency; deterministic; sufficient quality |
| Linting | ESLint + eslint-plugin-react-hooks | Enforce hook rules |
| Formatting | Prettier | Consistent style |

**No backend. No authentication. No external APIs.**

---

## 6. Folder Structure

```
P:\Emoji-Game-V2\
├── src\
│   ├── domain\                          # Pure TS, zero deps
│   │   ├── model\
│   │   │   ├── Emoji.ts                 # Emoji VO + factory
│   │   │   ├── EmojiCategory.ts         # EmojiCategory VO
│   │   │   ├── EmojiSequence.ts         # EmojiSequence VO (exactly 5)
│   │   │   ├── GuessResult.ts           # TileResult + GuessResult VOs
│   │   │   ├── Guess.ts                 # Guess VO
│   │   │   ├── GameStatus.ts            # GameStatus union
│   │   │   ├── GameDate.ts              # GameDate VO
│   │   │   └── Game.ts                  # Game aggregate root
│   │   ├── services\
│   │   │   ├── GuessEvaluator.ts        # Two-pass evaluation algorithm
│   │   │   └── DailyChallengeGenerator.ts # Seeded PRNG + selection
│   │   └── ports\
│   │       ├── IGameRepository.ts       # Port interface
│   │       └── IEmojiCatalogProvider.ts # Port interface
│   │
│   ├── application\                     # Use cases; depends on domain only
│   │   ├── StartDailyGame.ts            # Load or create today's game
│   │   ├── SubmitGuess.ts               # Validate + evaluate + save guess
│   │   └── GetGameState.ts              # Read current game (for rehydration)
│   │
│   ├── infrastructure\                  # Implements domain ports
│   │   ├── persistence\
│   │   │   └── LocalStorageGameRepository.ts
│   │   └── catalog\
│   │       ├── StaticEmojiCatalogProvider.ts
│   │       └── emoji-catalog.json       # Static emoji data
│   │
│   ├── presentation\                    # React layer
│   │   ├── hooks\
│   │   │   ├── useGameStore.ts          # Zustand store + use case wiring
│   │   │   └── useShareResult.ts        # Clipboard share logic
│   │   ├── components\
│   │   │   ├── Board\
│   │   │   │   ├── Board.tsx            # 6×5 grid of tiles
│   │   │   │   ├── Row.tsx              # One guess row
│   │   │   │   └── Tile.tsx             # Single emoji tile with state
│   │   │   ├── Keyboard\
│   │   │   │   ├── EmojiKeyboard.tsx    # Category tabs + emoji grid
│   │   │   │   ├── CategoryTab.tsx      # Tab button per category
│   │   │   │   └── EmojiKey.tsx         # Single emoji key with state coloring
│   │   │   ├── modals\
│   │   │   │   ├── ResultModal.tsx      # Win/lose + share button
│   │   │   │   └── StatsModal.tsx       # Statistics display
│   │   │   └── layout\
│   │   │       ├── Header.tsx           # Title + stats icon
│   │   │       └── App.tsx              # Root component
│   │   └── mappers\
│   │       └── GameStateMapper.ts       # Domain Game → UI view model
│   │
│   ├── main.tsx                         # Vite entry point
│   └── vite-env.d.ts
│
├── tests\
│   ├── domain\
│   │   ├── GuessEvaluator.test.ts
│   │   ├── DailyChallengeGenerator.test.ts
│   │   └── Game.test.ts
│   ├── application\
│   │   ├── StartDailyGame.test.ts
│   │   └── SubmitGuess.test.ts
│   └── infrastructure\
│       └── LocalStorageGameRepository.test.ts
│
├── openspec\                            # SDD artifacts
│   └── changes\
│       └── emoji-wordle\
│           └── proposal.md              # This file
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── package.json
└── README.md
```

---

## 7. Implementation Order

### Phase 1 — Domain (no React, no infra)
1. Value Objects: `GameDate`, `Emoji`, `CategoryId`, `EmojiCategory`, `EmojiSequence`
2. Value Objects: `TileResult`, `GuessResult`, `Guess`, `GameStatus`
3. Aggregate: `Game` (immutable, no persistence)
4. Domain Service: `GuessEvaluator` with full test suite
5. Domain Service: `DailyChallengeGenerator` with determinism tests
6. Ports: `IGameRepository`, `IEmojiCatalogProvider` (interfaces only)

**Gate**: All domain unit tests pass. Zero external imports in `/domain`.

### Phase 2 — Application layer
7. Use case: `StartDailyGame`
8. Use case: `SubmitGuess`
9. Use case: `GetGameState`

**Gate**: Use case tests pass with mock repositories.

### Phase 3 — Infrastructure
10. `emoji-catalog.json` — curate 6+ categories, 10+ emojis each
11. `StaticEmojiCatalogProvider` — load and validate catalog
12. `LocalStorageGameRepository` — serialize/deserialize Game to JSON

**Gate**: Integration test: start game, submit guesses, reload from localStorage, verify state matches.

### Phase 4 — Presentation (React)
13. Zustand store + `useGameStore` hook (wires use cases)
14. `Tile` and `Row` components
15. `Board` component
16. `EmojiKey` and `EmojiKeyboard` components
17. `Header`, `App` root layout
18. `ResultModal` (win/lose screen + share)
19. `StatsModal`
20. `useShareResult` hook (clipboard)
21. Responsive polish, accessibility attributes

**Gate**: Manual smoke test: start game, play to win and to lose, share result, reload and verify persistence, mobile layout check.

### Phase 5 — QA & polish
22. Edge cases: same emoji repeated in answer, empty attempts, already-played today
23. Accessibility audit (keyboard nav, screen reader labels)
24. Performance check (no unnecessary re-renders)
25. Cross-browser smoke test (Chrome, Firefox, Safari mobile)

---

## 8. Risks & Tradeoffs

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Emoji rendering inconsistency across OS/browser | High | Medium | Use emoji codes consistently; test on Windows, macOS, Android, iOS early |
| GuessEvaluator frequency-counting bug (duplicate emojis) | Medium | High | Exhaustive unit tests with known-tricky cases before building UI |
| localStorage quota exceeded (statistics accumulate) | Low | Low | Prune stats older than 365 days on load |
| Catalog bias: some categories easier than others | Medium | Low | Curate categories manually; keep category sizes balanced |
| Date/timezone bug (player in UTC-12 gets "tomorrow's" puzzle) | Medium | Medium | Always use UTC date for seed calculation, not local date |
| Seeded PRNG collision: two dates produce identical puzzles | Low | Low | Log generated answers during catalog curation; verify uniqueness for 365 days |
| Zustand store coupling to domain objects | Low | Medium | Map domain → view model in `GameStateMapper` before storing in Zustand |

### Key tradeoff: Immutable domain vs. Zustand mutation
Domain objects are immutable (methods return new instances). Zustand works with mutable state internally. The `useGameStore` hook calls use cases (which return new `Game` instances) and replaces the store's game reference atomically. This keeps domain pure while keeping Zustand ergonomic.

### Key tradeoff: Static catalog vs. API-fed catalog
Static catalog means no network, no loading states, no API keys — but adding new emojis requires a deploy. For v1, this is the right call. The `IEmojiCatalogProvider` port means swapping to an API later is a single infrastructure change.

---

## 9. Success Criteria

### Functional
- [ ] The same date produces the same puzzle on two different browsers (determinism)
- [ ] GuessEvaluator correctly handles all duplicate emoji edge cases
- [ ] Player can complete a game (win or lose) from a fresh page load
- [ ] Game state survives page refresh mid-game
- [ ] Share button copies correct emoji grid to clipboard
- [ ] Statistics persist and update correctly after each game

### Technical
- [ ] Domain layer has zero external imports (enforced by ESLint no-restricted-imports or manual review)
- [ ] Domain unit test coverage >= 90% (GuessEvaluator, DailyChallengeGenerator, Game aggregate)
- [ ] Application use case tests pass with mock ports
- [ ] No TypeScript errors in strict mode (`"strict": true`)
- [ ] Lighthouse performance score >= 90 on mobile

### UX
- [ ] Playable on a 375px wide screen without horizontal scroll
- [ ] Emoji keyboard is tappable without accidental misses on mobile
- [ ] First meaningful paint < 1.5s on average 4G connection

---

*Proposal generated: 2026-03-11*
*Next phase: run `sdd-spec` and `sdd-design` in parallel*
