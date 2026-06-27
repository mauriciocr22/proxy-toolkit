@AGENTS.md

# Proxy Toolkit

Companion app for Zenless Zone Zero. Allows players to manage their agent roster, build comps with AI suggestions, get per-agent build recommendations, and find the best Bangboo for each comp.

---

## Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19 + Tailwind CSS v4
- **Language:** TypeScript (strict mode)
- **Game data:** static.nanoka.cc (REST, no authentication required)
- **AI:** Google Gemini API (`gemini-2.5-flash`)
- **Persistence:** localStorage (client-side only, no backend)
- **Deploy:** Vercel

---

## Folder Structure

```
proxy-toolkit/
├── app/
│   ├── layout.tsx               # Global layout with nav
│   ├── page.tsx                 # Home → redirects to Roster
│   ├── loading.tsx              # Global loading spinner
│   ├── not-found.tsx            # 404 page
│   ├── roster/
│   │   └── page.tsx             # Manage agents the user owns
│   ├── comp-builder/
│   │   ├── page.tsx             # Build comp + AI suggestion + Bangboo
│   │   └── actions.ts           # Server actions for comp AI call
│   └── agent/
│       └── [id]/
│           ├── page.tsx         # Per-agent build recommender
│           └── actions.ts       # Server actions for build AI call
├── components/
│   ├── ui/                      # Reusable components (NavLinks, …)
│   ├── roster/                  # AgentCard, AgentGrid, AgentSelector
│   ├── comp-builder/            # CompBuilder, CompSlot, CompResult, BangbooCard
│   └── agent/                   # AgentBuildClient, BuildCard, DiscSetCard, WEngineCard
├── lib/
│   ├── hakushin.ts              # nanoka.cc API client (fetch + cache)
│   ├── storage.ts               # Typed localStorage helpers
│   └── ai.ts                    # Gemini API calls (comp + build)
├── hooks/
│   ├── useRoster.ts             # Read/write roster to localStorage
│   └── useComp.ts               # Comp-in-progress state
├── types/
│   └── zzz.ts                   # All ZZZ domain types
└── public/
    └── (static assets if needed)
```

---

## Code Conventions

- **Components:** PascalCase, one per file, single responsibility
- **Functions and variables:** camelCase
- **Types and interfaces:** PascalCase, always in `/types/zzz.ts`
- **No logic in JSX:** extract to hooks or utility functions in `lib/`
- **No `any`:** always use explicit types
- **Absolute imports:** use `@/` as alias for the project root

---

## Commit Convention

Follow conventional commits. **Never mention AI, Claude, or any AI tooling in commit messages.**

Format: `type(scope): short description`

Allowed types:
- `feat`: new feature
- `fix`: bug fix
- `refactor`: refactor without behavior change
- `style`: formatting, no logic change
- `chore`: config, dependencies, project files
- `docs`: documentation

Examples:
- `feat(roster): add agent filtering by element`
- `fix(comp-builder): fix synergy calculation when swapping agents`
- `refactor(storage): extract localStorage helpers into dedicated module`
- `chore: add environment variables example file`

Rules:
- Description in English, imperative mood, no trailing period
- Maximum 72 characters on the first line
- Never include "Generated", "AI-assisted", "Claude", "Copilot" or similar

---

## Design System

Full direction: [docs/design.md](docs/design.md). Visual references: [docs/agent-card.png](docs/agent-card.png), [docs/agent-page.png](docs/agent-page.png), [docs/agents-grid.png](docs/agents-grid.png), [docs/filter-bar.png](docs/filter-bar.png).

### Concept

The UI is an **old-futuristic physical device** (HDD, cassette, CRT). Every element should feel like a chassis component — not a flat webpage. Three non-negotiable rules:
1. **Diagonal over straight** — parallelograms and chamfers everywhere.
2. **Color = information** — neon only on attributes or rarity, never decorative.
3. **Texture always** — no 100% flat surface; add grain, scanlines, or hex pattern.

### Color Tokens

```css
/* Chassis */
--bg:        #0C0D11;  /* page background */
--surface:   #15171E;  /* card chassis */
--surface-2: #1E212B;  /* elevated panels / hover */
--line:      #2A2E3A;  /* borders, dividers */
--muted:     #8A8F9E;  /* secondary text */
--fg:        #EDEFF5;  /* primary text */

/* Brand */
--brand:       #F2FF49;  /* ZZZ acid yellow — CTAs, highlights — use sparingly */
--accent-warn: #FF5A1F;  /* S-rank orange, alerts */

/* Attributes (semantic only — agent classification) */
--el-physical: #F7D94C;
--el-fire:     #FF4D3D;
--el-ice:      #5FD0FF;
--el-electric: #4D7BFF;
--el-ether:    #FF4DB8;
--el-wind:     #4DFFB8;
```

### Typography

- **Headings / labels:** `Chakra Petch` or `Saira` — UPPERCASE, wide `letter-spacing`.
- **Body:** `Inter` or `Geist`.
- **Stats / numbers:** `Geist Mono` or `JetBrains Mono` — "instrument reading" feel.

### Shape Language

- **Parallelogram cards:** `transform: skewX(-7deg)` on the card wrapper; `skewX(7deg)` on the inner content to un-skew.
- **Chamfers:** `clip-path` to cut one corner at 45°; mix with soft radius on remaining corners.
- **Diagonal texture:** `repeating-linear-gradient(135deg, transparent 0 6px, rgba(255,255,255,.02) 6px 7px)`.
- **Hex texture:** SVG tile at low opacity on headers and large background areas.
- **Chassis details:** corner brackets (`⌐ ¬`), micro-labels (`// AGENT.DB`), registration marks.

### Motion Rules

- **Hover:** diagonal clip-path reveal in the attribute color — not a standard opacity fade.
- **Neon glow:** `box-shadow` in the attribute color on hover; subtle scanline overlay on cards.
- **Page load:** staggered entry (animation-delay per card) + brief CRT-flicker on section titles.

### Pitfalls

- No plain rounded rectangles — always apply skew or chamfer.
- No purple/violet as dominant tone (reserve magenta for Ether only).
- No rainbow neon — color carries meaning, not mood.
- No smooth flat surfaces — grain or scanlines required.

---

## Core Types

```typescript
// types/zzz.ts

export interface Agent {
  id: string
  name: string
  element: 'Fire' | 'Ice' | 'Electric' | 'Physical' | 'Ether' | 'Wind'
  specialty: 'Attack' | 'Stun' | 'Anomaly' | 'Support' | 'Defense'
  faction: string
  rarity: 'S' | 'A'
  iconUrl: string
}

export interface RosterAgent {
  agentId: string
  level: number          // 1–60
  mindscape: number      // 0–6 (equivalent to constellation)
  coreSkill: string      // 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
}

export interface WEngine {
  id: string
  name: string
  specialty: string
  rarity: 'S' | 'A' | 'B'
  description: string
}

export interface DiscSet {
  id: string
  name: string
  twoPieceBonus: string
  fourPieceBonus: string
}

export interface Bangboo {
  id: string
  name: string
  rarity: 'S' | 'A'
  description: string
  iconUrl: string
}

export interface SavedComp {
  id: string
  name: string
  agentIds: string[]      // always 3
  bangbooId: string
  aiSuggestion: string    // text generated by AI
  createdAt: string       // ISO string
}

export interface CompAnalysis {
  analysis: string
  bangbooId: string
}

export interface BuildAnalysis {
  recommendation: string
  wEngineId: string
  altWEngineId: string
  discSetId: string
  altDiscSetId: string
}
```

---

## localStorage Schema

```typescript
// lib/storage.ts manages these keys:

"proxy-toolkit:roster"      // RosterAgent[]
"proxy-toolkit:saved-comps" // SavedComp[]
```

Always read and write via typed helpers in `lib/storage.ts`. Never access `localStorage` directly in components.

---

## nanoka.cc API

Base URL: `https://static.nanoka.cc`

The API uses a versioned manifest pattern:
1. `GET /manifest.json` — returns `{ zzz: { latest: "<version>" } }`
2. `GET /zzz/<version>/<resource>.json` — returns the full data file

Resources: `character`, `weapon`, `equipment`, `bangboo`

Asset icons: `https://static.nanoka.cc/assets/zzz/<basename>.webp`

All game data fetches must go through `lib/hakushin.ts`. Use `next: { revalidate: 3600 }` on fetches (revalidates every hour). An in-memory `Map` cache prevents duplicate fetches within the same server lifecycle.

---

## Gemini API — Prompts

All calls use `gemini-2.5-flash` via `@google/genai`. Responses are always structured JSON; `extractJson()` in `lib/ai.ts` strips any surrounding text the model may emit.

### Comp suggestion + Bangboo

Two-step flow in `getCompSuggestion`:
1. **Grounded search** (Google Search tool enabled) — asks which Bangboo fits the comp and gets a plain-text research result.
2. **Structured analysis** — sends agents + bangboo list + research result, returns JSON.

```typescript
// lib/ai.ts — input payload shape
{
  agents: Array<{ name, element, specialty, faction, rarity }>,
  bangboos: Array<{ id, name, rarity, description }>,
  bangbooResearch: string   // plain-text result from step 1
}

// output shape
{ analysis: string, bangbooId: string }
```

The system prompt instructs the model to: name skills by their in-game names, explain exact kit interactions, state each agent's role concisely, pick `bangbooId` from the provided list using the research result, and give a 2–3 step rotation. Max 300 words, in Brazilian Portuguese.

### Per-agent build recommender

Single call in `getBuildSuggestion`:

```typescript
// input payload shape
{
  agent: { name, element, specialty, faction, rarity },
  wEngines: Array<{ id, name, specialty, rarity }>,
  discSets: Array<{ id, name, twoPieceBonus, fourPieceBonus }>
}

// output shape (BuildAnalysis)
{ recommendation: string, wEngineId: string, altWEngineId: string, discSetId: string, altDiscSetId: string }
```

The system prompt instructs the model to recommend the main W-Engine, an accessible alternative, main disc set, alternative disc set, and priority stats per slot. All IDs must come from the provided lists. Max 250 words, in Brazilian Portuguese.

---

## Implementation Progress

Redesign of the visual layer to match the "HDD/chassis" direction in [docs/design.md](docs/design.md).

- [x] 1. Global CSS variables and typography (tokens, fonts, base texture)
- [x] 2. AgentCard — parallelogram shape, attribute hover glow, rarity badge
- [x] 3. Roster page — hex texture header, pill filter bar, responsive grid
- [ ] 4. Nav — styled logo, chassis micro-details
- [ ] 5. Comp Builder — diagonal team slots, terminal-style AI analysis panel

---

## Out of Scope

- Damage calculator with exact formulas
- User login or accounts
- HoYoLAB integration to auto-import roster
- Agent tier list
- Pull/gacha tracker

