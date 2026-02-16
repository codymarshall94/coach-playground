# PRGRM — Contributing Guidelines

## Quick start

```bash
# Install dependencies
npm install

# Start dev server (Turbopack)
npm run dev

# Lint
npm run lint

# Production build
npm run build
```

You need a `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Coding conventions

### TypeScript
- Strict types; avoid `any` unless truly unavoidable.
- Prefer `interface` over `type` for object shapes.
- Export types from `types/` for cross-layer use.

### React
- Functional components only.
- Add `"use client"` only when the component uses hooks, browser APIs, or event handlers.
- Prefer composition (children, render props) over deep prop drilling.

### Styling
- Tailwind utility classes — no custom CSS unless unavoidable.
- Use `cn()` from `lib/utils` for conditional class merging.
- Use existing shadcn/ui primitives in `components/ui/` before adding new ones.

### State
- Local state lives in hooks (`useWorkoutBuilder`).
- Server state uses TanStack React Query.
- No global stores (Redux, Zustand, etc.).

### Data access
- All Supabase calls go through `services/`. Never import Supabase directly in components.
- Use `utils/supabase/server.ts` in server components/actions, `utils/supabase/client.ts` in client code.

### Engine logic
- Keep `engines/` free of React imports and side effects.
- New analytics go into the appropriate engine layer (day → week → block → program).
- The UI reads engine output via `useProgramEngine`.

## PR workflow

1. Keep PRs small and focused on a single concern.
2. Run `npm run lint` and `npm run build` before pushing.
3. Describe what changed and why in the PR description.
4. Include migration steps if database schema changes.
