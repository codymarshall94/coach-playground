# TODO — Running Issues & Suspicious Things

> Living document. Add anything noticed during development that looks off, needs investigation, or should be revisited later.

---

## Suspicious / Investigate

- [ ] `SmartInput` had `type="number"` allowing decimals — fixed, but check if any saved data contains decimal values for integer fields (reps, rest, RPE, etc.)
- [ ] `coverImageService.ts` creates a top-level `supabase` client at module scope — should confirm this doesn't cause stale auth issues in long-lived sessions
- [ ] `ExerciseGroupCard` props use `any[]` for `onUpdateSets` and `onUpdateIntensity` — should be properly typed
- [ ] ETL normalizer was miscalibrated (comment said `intensityWeight(RPE 7.5) ~ 0.58` but actual formula gives 0.512) — fixed to 2.15, warmup mult raised 0.3→0.5. Monitor real-world scores and adjust if needed. Exercise `cns_demand` values in the DB heavily influence results.

## Tech Debt

- [x] **Three fetch queries for programs** — Extracted `PROGRAM_DETAIL_SELECT` and `PROGRAM_INDEX_SELECT` into `services/programQueries.ts`. All callers (`getProgramById`, SSR builder page, `[id]` page, `templateService`) now import from the single source of truth. Also fixed `[id]/page.tsx` which was missing `weeks:program_weeks(...)` — exactly the bug this was meant to prevent.
- [x] **Save is delete-all + re-insert** — Assessed: upsert/diff isn't practical yet because the tree is 6 levels deep and client-side IDs are ephemeral. Documented the rationale directly in `programService.ts` with guidance on when to revisit (e.g. if workout logging needs stable child IDs).
- [x] **`transformProgramFromSupabase` does heavy normalization** — Eliminated all `any` types in favor of `Record<string, unknown>`, removed dead legacy number check (column renamed to `week_count`), clarified comments. Kept the empty-array fallback for pre-migration blocks that lack `program_weeks` rows.

## UX Papercuts

_Nothing yet._

## Bugs

_Nothing yet._
