# Visual Direction — Proxy Toolkit

## 1. Core Concept: "New Eridu Bridge Terminal / HDD"

Think of the entire UI as an **old-futuristic electronic device** (cassette, HDD, CRT TV, walkie-talkie). Everything should feel like a *physical component* with chassis, screws, tape, and labels — not a flat webpage. This is the key to avoiding the "AI-made" look.

Three golden rules:

1. **Diagonal over straight** — parallelograms and chamfers are the signature.
2. **Color = information** — neon only carries meaning (attribute, rarity), never decorative.
3. **Texture always** — no 100% flat surfaces; always add grain, scanlines, hexagons, or hatching.

---

## 2. Color Palette (tokens)

### Monochromatic base (the "chassis")

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#0C0D11` | General background, cold near-black |
| `--surface` | `#15171E` | Card chassis |
| `--surface-2` | `#1E212B` | Elevated panels / hover |
| `--line` | `#2A2E3A` | Borders, diagonal dividers |
| `--muted` | `#8A8F9E` | Secondary text |
| `--fg` | `#EDEFF5` | Primary text |

### Brand + accents

| Token | Hex | Usage |
|---|---|---|
| `--brand` | `#F2FF49` | ZZZ acid yellow, CTAs and highlights (use SPARINGLY) |
| `--accent-warn` | `#FF5A1F` | "S-Rank" orange, alerts |

### Attribute colors (semantic — agent classification only)

| Attribute | Hex |
|---|---|
| Physical | `#F7D94C` |
| Fire | `#FF4D3D` |
| Ice | `#5FD0FF` |
| Electric | `#4D7BFF` |
| Ether | `#FF4DB8` |

> Keep the app monochromatic and let **the character's color shine** (the portrait is already colorful). Neon enters only in badges, hover glows, and slot borders.

---

## 3. Typography

- **Display / headings:** `Chakra Petch` or `Saira` (condensed, geometric, tech vibe). UPPERCASE + wide `letter-spacing`.
- **Body:** `Inter` or `Geist`.
- **Numbers / stats:** a monospace font (`Geist Mono` / `JetBrains Mono`) — gives an "instrument reading" feel.

Hierarchy: large condensed section title → small uppercase label with tracking → large mono value.

---

## 4. Shape Language (the heart of the style)

- **Parallelogram card:** `transform: skewX(-7deg)` on the card, content with `skewX(7deg)` to un-skew. Exactly like the reference site.
- **Chamfers via `clip-path`:** mix one corner cut at 45° with rounded corners on the others. Example: panels with the top-right corner "chopped off".
- **Diagonal background lines:** `repeating-linear-gradient(135deg, transparent 0 6px, rgba(255,255,255,.02) 6px 7px)`.
- **Hexagon texture** on the header and large background areas (SVG tile, low opacity).
- **"Chassis" details:** corner brackets `⌐ ¬`, registration marks, micro-labels like `// AGENT.DB`, small screws on panel corners.

---

## 5. Screen Anatomy

### Agent Roster (base screen)

- Header with styled logo + hexagonal texture.
- **Elongated pill filter bar:** A/S Rank toggle, attribute icons, specialty, rarity — matching the reference.
- Grid of **parallelogram cards**: portrait + rarity badge (bottom left) + attribute icon (top) + lime version badge (e.g. `1.2`).
- Hover: neon glow in the attribute color + diagonal clip reveal, not a fade.

### Team Builder (AI comps)

- **3 diagonal/hexagonal slots** for the team + 1 smaller slot for the Bangboo.
- Side panel "AI ANALYSIS" in terminal style: monospaced text appearing with a typewriter effect, synergy bar, justification text.
- `// GENERATE COMP` button in acid yellow.

### Agent Build Page (the "cassette card")

- **Cartridge layout**: header with name/attribute, W-Engine row, grid of 6 Drive Disc slots (numbered), stat priority in mono.
- "Build role" tag (DPS / Stun / Anomaly / Support) with color.

### Best Bangboo

- Compact block coupled to the comp card (Bangboo is the small companion), with mini portrait and reason for the pick.

---

## 6. Motion and Anti-Generic Microdetails

- Subtle **scanlines** + light **bloom/glow** on neon elements.
- **Diagonal hover reveal** (animated clip-path), not standard opacity fade.
- Section "boot-up": lines that draw themselves + quick CRT-flicker on load.
- Optional mechanical click sound on toggles (if you want to go all the way).
- Recurring lime version badges as a UI element.

---

## 7. Pitfalls to Avoid

- Flat, straight rectangular cards → kills the style.
- Purple/violet dominating (not ZZZ's look; reserve magenta only for the Ether attribute).
- Excess neon turning into a "rainbow" → color as information only.
- Smooth surfaces without texture → always add grain/scanline/hexagon.
- Flashy gradients → use solid color + targeted glow instead.