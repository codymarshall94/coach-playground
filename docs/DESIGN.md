# PRGRM — Design System

## Philosophy

PRGRM's visual identity is **functional, focused, and earthy**. The interface blends the precision of a spreadsheet with the warmth of a coaching notebook. Every visual choice serves one goal: help coaches and athletes _read_ their program at a glance — what's hard, what's light, what needs attention.

### Guiding principles

1. **Data-dense, not cluttered** — Show sets, reps, intensity, and load in tight layouts. Use whitespace to group, not to pad.
2. **Color carries meaning** — Green = easy/positive, amber = moderate/warning, red-orange = hard/critical. Never decorative color.
3. **Progressive disclosure** — Primary info (exercise, sets × reps, ETL badge) is always visible. Notes, advanced set types, and coaching cues reveal on interaction.
4. **Dark-first parity** — Both themes are first-class. Tokens are defined for light and dark independently — no filter hacks.

---

## Color system

All colors use **OKLCH** for perceptual uniformity. Tokens are defined as CSS custom properties in `app/globals.css` with separate `:root` (light) and `.dark` blocks.

### Semantic palette

| Token | Role | Light | Dark |
|-------|------|-------|------|
| `--brand` | Primary brand green | `oklch(0.66 0.16 150)` | same |
| `--primary` | Buttons, interactive foregrounds | Dark neutral | Light neutral (flipped) |
| `--accent` | Highlights, active states | Mint/lime | Brighter mint |
| `--secondary` | Subtle backgrounds, tags | Leafy sage | Dark sage |
| `--destructive` | Delete, errors | Brick red | same |

### Feedback tokens

| Token | Meaning | Usage |
|-------|---------|-------|
| `--positive` | Good / on-track | Volume in range, passing scores |
| `--warning` | Caution | Approaching limits, imbalances |
| `--critical` | Problem / danger | Over-volume, injury risk flags |
| `--info` | Neutral info | Tooltips, informational badges |

### Load gradient

Used for ETL badges, fatigue bars, and heatmap intensity:

| Token | Level | Hue |
|-------|-------|-----|
| `--load-low` | Recovery / Light | Brand green |
| `--load-medium` | Moderate | Amber |
| `--load-high` | Hard | Orange |
| `--load-max` | Max effort | Red-orange |

### Set-type colors

Each advanced set type has a distinct hue so coaches can scan a program and spot the pattern:

| Set type | Color family |
|----------|-------------|
| Warmup | Sage green |
| Standard | Mossy olive |
| Top set | Bold red-orange |
| Backoff | Tan / khaki |
| AMRAP | Cyan-blue |
| Drop | Goldenrod |
| Cluster | Deep violet |
| Myo-reps | Rust / brown |
| Rest-pause | Dusty lavender |

---

## Typography

| Setting | Value |
|---------|-------|
| **Font family** | [Outfit](https://fonts.google.com/specimen/Outfit) (Google Fonts) — geometric sans-serif with a sporty, modern feel |
| **Variable** | `--font-outfit` applied via `next/font/google` |
| **Weights loaded** | 400 (body), 500 (medium labels), 600 (headings), 700 (display/bold) |
| **Rendering** | `font-display: swap`, `antialiased` |

### Text scale (utility classes)

Defined as Tailwind `@layer utilities` classes for consistent use across components:

| Class | Purpose | Spec |
|-------|---------|------|
| `.text-display` | Page headings | 2xl→3xl, font-semibold, tight leading, -0.01em tracking |
| `.text-title` | Card/section headings | lg, font-semibold, tight leading |
| `.text-body` | Body copy | sm, relaxed leading (1.5rem) |
| `.text-meta` | Labels, helpers, micro-copy | xs, muted-foreground |
| `.text-value` | Numeric data (sets, reps, scores) | xl, font-semibold, tabular-nums |

---

## Spacing & radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius` | `0.875rem` (14px) | Base radius for cards and dialogs |
| `--radius-sm` | `--radius - 4px` | Badges, small inputs |
| `--radius-md` | `--radius - 2px` | Buttons, dropdowns |
| `--radius-lg` | `--radius` | Cards, sheets |
| `--radius-xl` | `--radius + 4px` | Modals, large panels |

General spacing follows Tailwind's default 4px grid (`gap-1` = 4px, `gap-2` = 8px, etc.).

---

## Component library

Built on **shadcn/ui** (new-york style) with Tailwind CSS. Components live in `components/ui/`.

### Available primitives

Accordion, Alert, AlertDialog, Avatar, Badge, Button, Card, Checkbox, Collapsible, Dialog, DropdownMenu, HoverCard, Input, Label, Popover, Progress, ScrollArea, Select, Separator, Sheet, Skeleton, Slider, Sonner (toast), Switch, Table, Tabs, Textarea, Tooltip.

### Custom components (outside `ui/`)

| Component | File | Purpose |
|-----------|------|---------|
| `ScoreDial` | `components/ScoreDial.tsx` | Circular 0–100 score gauge |
| `MuscleHeatmap` | `components/MuscleHeatmap.tsx` | SVG body map colored by volume |
| `ETLDisplay` | `features/.../EtlDisplay.tsx` | Inline ETL badge with tooltip |
| `SmartInput` | `components/SmartInput.tsx` | Typeahead input with fuzzy search |
| `RichTextEditor` | `components/RichTextEditor.tsx` | TipTap-based rich text for descriptions |
| `SortableItem` | `components/SortableItem.tsx` | dnd-kit drag handle wrapper |
| `InfoTooltip` | `components/InfoTooltip.tsx` | `(i)` icon with tooltip content |
| `TermTooltip` | `components/TermTooltip.tsx` | Glossary-linked term hover |
| `ProgressIndicator` | `components/ProgressIndicator.tsx` | Thin progress bar |
| `ProgramCard` | `components/ProgramCard.tsx` | Card preview of a saved program |
| `EmptyState` | `components/EmptyState.tsx` | Placeholder for empty lists |

---

## Theming

Managed by `next-themes` with three modes: **system**, **light**, **dark**. The toggle is in the Navbar via `ThemeToggle.tsx`.

### How it works

1. `ThemeProvider` wraps the app with `attribute="class"` so Tailwind's `.dark` variant activates correctly.
2. All color tokens have separate light/dark definitions in `globals.css` — no `invert()` or `filter` hacks.
3. Components use semantic tokens (`bg-card`, `text-muted-foreground`, `border-border`) — never raw OKLCH values inline.

---

## Iconography

- **Library:** [Lucide React](https://lucide.dev/) (configured via shadcn/ui)
- **Size convention:** `w-4 h-4` (16px) for inline icons, `w-5 h-5` for buttons, `w-3 h-3` for metadata/badges
- **Color:** Inherit from parent text color; use `text-muted-foreground` for decorative icons

---

## Layout patterns

### Navbar
Fixed top bar with logo, nav links, theme toggle, and auth actions. Collapses to a hamburger sheet on mobile.

### Builder (main workspace)
Three-zone layout:
1. **Day tabs / block selector** — horizontal scrollable tab bar at the top
2. **Exercise list** — vertical stack of draggable exercise cards (collapsed or expanded)
3. **Analytics panel** — slide-out sheet with session metrics, muscle heatmap, and coach nudges

### Cards
Exercise cards have two states:
- **Collapsed** — single row: order number, exercise name, set count, ETL badge, duration
- **Expanded** — full editing surface: set table, intensity selector, notes, remove button

---

## Motion

- **Library:** Framer Motion (`motion/react`)
- **Philosophy:** Subtle and functional — quick fades and height animations for expand/collapse, no decorative transitions
- **Standard config:** `duration: 0.2, ease: "easeOut"` for card expand/collapse
- **Drag:** dnd-kit handles drag animations; custom `SortableItem` wraps the drag handle

---

## Responsive strategy

- **Breakpoints:** Tailwind defaults (`sm: 640px`, `md: 768px`, `lg: 1024px`)
- **Mobile-first:** Base styles target mobile; `md:` and `lg:` add desktop refinements
- **Builder on mobile:** Full-width card stack, collapsible analytics, touch-friendly drag handles
- **PDF export:** Fixed A4 layout — responsive concerns don't apply

---

## Conventions for contributors

1. **Use semantic tokens** — `bg-card`, `text-foreground`, `border-border`. Never hard-code colors.
2. **Use utility classes** — `.text-title`, `.text-meta`, `.text-value` for consistent typography.
3. **Use `cn()`** — Import from `lib/utils` for conditional class merging.
4. **Prefer existing primitives** — Check `components/ui/` before adding a new one.
5. **Keep dark mode parity** — Every new color must be defined in both `:root` and `.dark`.
6. **Icons from Lucide only** — Don't introduce additional icon libraries.
7. **No inline styles** — Use Tailwind utilities; exceptions only for dynamic computed values (e.g., heatmap colors, progress bar widths).
