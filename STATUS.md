# Just Go — Project Status

> Last updated: 2026-06-28

---

## Current Status

MVP v1 with Travel Profiles is live on GitHub and deploying to Vercel. Build passing, lint clean.

All data is mock. No backend, no authentication, no API integration. This is by design for v1.

---

## Completed

### Session 1 — Build MVP v1
- Created `PROJECT.md` and `MVP.md` as product source of truth
- Configured `CLAUDE.md` with full collaboration preferences
- Initialized Next.js 15 project (React 19, TypeScript, Tailwind CSS v4)
- Built all 4 pages: Home, Planner (3-step wizard), Results (companion voice), Preferences
- `lib/types.ts`, `lib/storage.ts`, `lib/mock-data.ts`, all `components/ui/` components
- Fixed all ESLint/TypeScript errors; created GitHub repo; renamed Xiaohongshu → RedNote

### Session 2 — UX/Design Overhaul
- Landing: new hero copy, source personality cards, implicit ChatGPT positioning
- Planner: survey form → 3-step wizard (The Trip / Your Style / Your Sources)
- Results: GO/NO-GO as hero verdict, shadow cards, interactive checklist, timeline itinerary

### Session 3 — Architecture Cleanup
- `lib/constants.ts`: single source of truth for SOURCES (all display properties), INTEREST_OPTIONS
- `lib/mock-data.ts`: derives SOURCE_LABELS from constants
- `components/ui/Spinner.tsx`: reusable spinner; `Card` updated with shadow variant
- Removed dead `isMichelin` code; barrel export skipped (App Router client/server concern)

### Session 4 — Travel Profiles (today)
- **New concept**: Travel Profiles replace single global Preferences
- **`app/profiles/page.tsx`**: Profile management — list + in-page create/edit form
  - Profile cards: name, budget/hotel/food summary, colored source names, activity chips
  - Edit form: profile name · budget tiles · hotel style tiles · food style tiles · activity chips · transport chips · source cards
  - 3 default profiles seed on first visit: China Food Trip, Europe Luxury, Weekend Getaway
  - Create / edit / delete flows
- **`app/planner/page.tsx`**: Planner now has 4 steps
  - Step 1 (new): "Choose a Profile" — list of profiles as selectable cards, checkmark indicator
  - Step 2: The Trip (unchanged)
  - Step 3: Your Style — pre-filled from selected profile; subtitle says "Adjust anything you like"
  - Step 4: Your Sources — pre-filled from profile; uses shared `SourceCardGrid`
- **`components/SourceCardGrid.tsx`**: Extracted reusable source card grid (used in planner Step 4 + profiles edit)
- **`lib/storage.ts`**: `getProfiles`, `saveProfile`, `deleteProfile` — lazy-seeds defaults on first access
- **`lib/types.ts`**: `TravelProfile` replaces `UserPreferences`
- **`lib/constants.ts`**: Added `BUDGET_OPTIONS`, `HOTEL_STYLE_OPTIONS`, `FOOD_STYLE_OPTIONS`, `TRANSPORT_OPTIONS` (shared between planner and profiles)
- **Nav**: "Preferences" → "Travel Profiles" linking to `/profiles`
- **`/preferences`**: redirects to `/profiles`

---

## File Structure

```
just-go/
├── app/
│   ├── globals.css            — @keyframes step-enter + .animate-step
│   ├── layout.tsx             — Sticky header, nav (Plan a Trip / Travel Profiles)
│   ├── page.tsx               — Landing page
│   ├── planner/page.tsx       — 4-step wizard (Profile → Trip → Style → Sources)
│   ├── preferences/page.tsx   — redirect to /profiles
│   ├── profiles/page.tsx      — Travel Profiles management (list + edit)
│   └── results/page.tsx       — Companion-voice results
├── components/
│   ├── SourceCardGrid.tsx     — Reusable source card selection (planner + profiles)
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx           — border | shadow variant
│       ├── Input.tsx
│       ├── MultiSelect.tsx    — (available; not currently used in main flows)
│       ├── Select.tsx         — (available; not currently used in main flows)
│       └── Spinner.tsx
└── lib/
    ├── constants.ts           — SOURCES, BUDGET/HOTEL/FOOD/TRANSPORT/INTEREST options
    ├── mock-data.ts           — generateMockResult(), Tokyo/Paris/Bali data
    ├── storage.ts             — Trip data + Profile CRUD (localStorage)
    └── types.ts               — TripFormData, TravelResult, TravelProfile
```

---

## Next Priority

1. **Integrate real AI** — Connect Anthropic Claude API to replace mock data in `/results`; stream the response
2. **Profile-aware Results** — Show "Based on your China Food Trip profile" in the results header
3. **Expand mock destinations** — Only Tokyo, Paris, Bali have rich data; others get a generic fallback
4. **Profile pre-select memory** — Remember the last-used profile so the planner pre-highlights it on return visits
5. **Mobile testing** — Profile grid, planner step cards, source cards on small screens
6. **Delete confirmation** — Currently deletes immediately; add a confirm step for profiles

---

## Known Issues

| Issue | Type | Priority |
|---|---|---|
| Only 3 destinations have rich mock data | Content gap | Medium |
| Profile delete has no confirmation dialog | UX risk | Low |
| No "last used profile" memory in planner | UX polish | Low |
| Results page doesn't show which profile was used | Feature gap | Low |
| `MultiSelect` and `Select` components are unused in main flows (only available) | Cleanup | Low |

---

## Product Decisions

**Travel Profiles replace single Preferences**
One global preference set doesn't match how travelers actually behave. A user traveling with family uses completely different settings than a solo food trip. Profiles make this explicit.

**3 default profiles seed on first visit**
Users shouldn't land on an empty state. China Food Trip / Europe Luxury / Weekend Getaway represent 3 distinct travel personalities and immediately show the value of the concept.

**Profile selection is Step 1 of the planner (required)**
Making profile selection mandatory (not optional) ensures users understand the concept and that their preferences will flow into the plan. It also creates a natural moment to visit /profiles and create their own.

**Steps 3 & 4 (Style, Sources) show "pre-filled from your profile"**
Users who selected a profile need to understand why preferences are already filled in. The subtitle change communicates this clearly and invites them to adjust.

**Hotel Style and Food Style are profile fields, not trip fields**
Travel pace is trip-specific (you might want a fast-paced Japan trip but relaxed Bali). But hotel preference and food style are personality traits that don't change trip-to-trip. This distinction drives what's in the profile vs. what's in Steps 2-4 of the planner.

**Source cards extracted into `SourceCardGrid`**
Used in both planner Step 4 and the profiles edit form. Single source of truth for source card appearance and interaction.

---

## AI / Engineering Learnings

**`useState` lazy initializer for localStorage** — `useState(() => getProfiles())` reads storage once at mount without triggering `react-hooks/set-state-in-effect`. The SSR guard (`typeof window === 'undefined'`) is required in the storage helpers because Next.js pre-renders static pages on the server.

**`React.FormEvent` deprecated in React 19** — Use `{ preventDefault(): void }` as a minimal structural interface.

**CSS keyframe step animations** — `@keyframes step-enter` + `.animate-step` in `globals.css`. `key={step}` causes React to re-mount → re-triggers animation. Zero dependencies.

**Barrel exports in Next.js App Router** — A `components/ui/index.ts` that re-exports both server and client components can blur the server/client boundary. Skipped for now. Import each component directly.

---

## Future Architecture Ideas

- **`lib/api/` folder** — when AI integration lands, API helpers go here separate from mock-data
- **`hooks/` folder** — custom React hooks (e.g., `useProfiles`, `useTripForm`) when state logic is complex enough
- **Typed literal unions** — `budget: 'budget' | 'midrange' | 'luxury'` instead of `string`; deferred because it requires updating mock-data comparisons
- **Consistent `<Card>` usage** — Results page hardcodes card styles; could be refactored to use `<Card variant="shadow">`
- **Profile export/share** — Let users share a profile as a link or JSON. No auth needed, just encode in URL params
