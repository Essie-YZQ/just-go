# Just Go — Project Status

> Last updated: 2026-06-27

---

## Current Status

MVP v1 is complete, architecturally cleaned up, and ready for localhost review. Build passing, lint clean. Code is pushed to GitHub (`main` branch). Vercel deployment is pending — connect the repo at vercel.com/new (zero config, Next.js is auto-detected).

All data is mock. No backend, no authentication, no API integration. This is by design for v1.

---

## Completed

### Session 1 — Build MVP v1
- Created `PROJECT.md` and `MVP.md` as product source of truth
- Configured `CLAUDE.md` with full collaboration preferences
- Initialized Next.js 15 project (React 19, TypeScript, Tailwind CSS v4)
- Built all 4 pages: Home, Planner (3-step wizard), Results (companion voice), Preferences
- `lib/types.ts`, `lib/storage.ts`, `lib/mock-data.ts`, all `components/ui/` components
- Fixed all ESLint/TypeScript errors
- Created GitHub repo `Essie-YZQ/just-go`, pushed to main
- Renamed folder `just_go` → `just-go`, renamed Xiaohongshu → RedNote everywhere

### Session 2 — UX/Design Overhaul
- **Landing**: New hero copy, source personality cards, implicit ChatGPT positioning
- **Planner**: Survey form → 3-step wizard (The Trip / Your Style / Your Sources). CSS step animations.
- **Results**: GO/NO-GO as hero verdict, shadow cards, interactive checklist, timeline itinerary

### Session 3 — Architecture Cleanup (today)
- Created `lib/constants.ts` as single source of truth for all source data and shared options
- `SOURCES` array (8 sources, all display properties) replaces 3 separate duplicated definitions
- `INTEREST_OPTIONS` extracted from constants — shared between Planner and Preferences
- `lib/mock-data.ts` now derives source labels from `SOURCES` instead of a separate map
- Created `components/ui/Spinner.tsx` — reusable loading spinner component
- Planner and Results pages now use `<Spinner>` instead of inline spinner divs
- Updated `Card` component: added `variant` prop (`border` | `shadow`), default changed to `shadow` to match current design language
- Removed dead `isMichelin` variable from planner source card rendering
- Removed redundant `text-slate-400` conditional that evaluated to the same class in both branches

---

## File Structure

```
just-go/
├── app/
│   ├── globals.css          — @keyframes step-enter + .animate-step
│   ├── layout.tsx           — Sticky header, Geist font, footer
│   ├── page.tsx             — Landing page (imports SOURCES from constants)
│   ├── planner/page.tsx     — 3-step wizard (imports SOURCES, INTEREST_OPTIONS)
│   ├── preferences/page.tsx — Defaults form (imports INTEREST_OPTIONS)
│   └── results/page.tsx     — Companion-voice results
├── components/ui/
│   ├── Button.tsx           — primary / secondary / ghost, 3 sizes, rounded-full
│   ├── Card.tsx             — border | shadow variant, 3 padding sizes
│   ├── Input.tsx            — label + error display
│   ├── MultiSelect.tsx      — toggle chips for preferences page
│   ├── Select.tsx           — native select with label
│   └── Spinner.tsx          — reusable loading spinner (sm | md)
└── lib/
    ├── constants.ts         — SOURCES (SourceDefinition[]) + INTEREST_OPTIONS
    ├── mock-data.ts         — generateMockResult(), Tokyo/Paris/Bali data
    ├── storage.ts           — localStorage helpers
    └── types.ts             — TripFormData, TravelResult, UserPreferences
```

---

## Next Priority

1. **Deploy to Vercel** — Go to vercel.com/new → Import `just-go` → Deploy
2. **Integrate real AI** — Connect Anthropic Claude API to replace mock data in `/results`; stream the response
3. **Redesign Preferences page** — Currently uses old dropdown design (`<Select>`); should match Planner style (tiles + chips)
4. **Expand mock destinations** — Only Tokyo, Paris, Bali have rich data; others get a generic fallback
5. **Mobile testing** — Planner step tiles and source grid on small screens
6. **Show source attribution in Results** — "Based on your Reddit picks" header on each section

---

## Known Issues

| Issue | Type | Priority |
|---|---|---|
| Preferences page uses old dropdown design (`<Select>`) | UX debt | Medium |
| Only 3 destinations have rich mock data | Content gap | Medium |
| No form state persistence — refreshing Planner mid-step resets form | UX bug | Low |
| Results footer still shows "MVP v1" disclaimer | Copy | Low |
| Planner `tripLength` defaults to `'5'`, Preferences page defaults to `'4'` | Minor inconsistency | Low |
| Source selection in Planner doesn't sync back to Preferences after plan generated | Feature gap | Low |

---

## Recent Product Decisions

**Planner → 3-step wizard (not single form)**
Single-page forms trigger cognitive overload. The wizard lets users focus on one decision at a time. Sources step placed last — it's the most important question and deserves maximum attention.

**Sources step is the featured moment in Planner**
Each source gets a full personality card (tagline + description), not just a label. The core differentiator should be experienced at the decision point, not just on the landing page.

**GO/NO-GO verdict is the hero on Results**
The verdict is the user's core question. It was a small pill badge; now it's a large, color-coded panel that anchors the page.

**Results uses `shadow-sm` cards, not `border` cards**
Border cards on a light background feel flat and documentation-like. Shadow cards feel like floating UI — closer to the Apple/Notion aesthetic the product targets.

**Interactive checklist in Results**
Users who reach the checklist are about to book. Clickable checkboxes with strikethrough animation respects their intent.

**"Xiaohongshu" renamed to "RedNote"**
RedNote is the internationally recognized English name. Updated across all UI, code, mock data, and docs.

**Architecture: single source of truth for sources (lib/constants.ts)**
Source data was duplicated in 3 places. Centralized in `SOURCES` constant — adding a new source is now a single-file change.

---

## AI / Engineering Learnings

**`useState` lazy initializer vs `useEffect` for localStorage**
`useEffect(() => { setState(...) }, [])` triggers `react-hooks/set-state-in-effect`. Correct pattern: `useState(() => { if (typeof window === 'undefined') return default; return storage.read() })`. The SSR guard is required because Next.js pre-renders static pages on the server.

**`React.FormEvent` deprecated in React 19**
Use `{ preventDefault(): void }` — a minimal structural interface TypeScript accepts without warnings.

**CSS keyframe animations in Tailwind v4**
Define `@keyframes` + `.animate-step` class in `globals.css`. Apply to a `div` with `key={step}` — React re-mounts on key change, re-triggering the animation. Zero external dependencies.

**`create-next-app` won't initialize into a non-empty directory**
Workaround: scaffold into `/tmp/just_go_temp`, then `cp -r` into project folder. `node_modules` copied this way has broken symlinks — fix with `chmod -R 755` before `rm -rf` + `npm install`.

**Barrel exports risk in Next.js App Router**
A `components/ui/index.ts` barrel that re-exports both server and client components can blur the server/client boundary. Skip the barrel for now — import each component directly. Revisit in V2 once architecture is more mature.

---

## Future Architecture Ideas

*(Things worth doing in V2, deliberately not done today)*

- **Barrel export** `components/ui/index.ts` — cleaner multi-import syntax, but needs careful handling of client/server component boundaries in App Router
- **`lib/api/` folder** — when real AI integration lands, API call helpers go here, separate from mock-data
- **`hooks/` folder** — custom React hooks (e.g., `useLocalStorage`, `useTripForm`) when state logic grows complex enough to warrant extraction
- **Typed literal union for form fields** — `hotelBudget: 'budget' | 'midrange' | 'luxury'` instead of `string`. Deferred because it requires updating mock-data comparisons too.
- **`constants/` folder** — when `lib/constants.ts` grows to cover more domains (e.g., API endpoints, feature flags), split into a dedicated folder
- **Consistent Card usage** — `components/ui/Card` is updated and ready; refactor Results page to use `<Card>` instead of hardcoded div classes
