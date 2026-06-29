# Just Go — Project Status

> Last updated: 2026-06-28 (Session 6)

---

## Current Status

MVP v1 with bilingual (EN / 中文) support is live. Build passing, TypeScript clean, all pages compile.

Switching language toggles all UI copy instantly — no page reload. Language choice persists in localStorage.

All data is mock. No backend, no authentication, no API integration. This is by design for v1.

Results page is now a 5-section "trusted recommendation explanation" page (not just an itinerary). The full flow — Profile → Trip → Style → Sources → Results — works end to end.

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

### Session 6 — Bilingual i18n (EN / 中文)
- **`lib/i18n.tsx`** (new): `LanguageProvider` React Context + `useT()` + `useLanguage()` hooks; flat translation dict with ~160 keys; `t(key, vars?)` supports `{placeholder}` interpolation; fallback to English on missing key; language persisted in `localStorage` (`just_go_lang`)
- **`components/SiteHeader.tsx`** (new): Client component replacing inline header in `layout.tsx`; includes language toggle button (EN ↔ 中文) in the nav
- **`app/layout.tsx`**: wraps app in `<LanguageProvider>`; uses `<SiteHeader />` for translated nav
- **`app/page.tsx`**: added `'use client'`; all hero, pain strip, sources section, steps, and CTAs use `t()`; source `tagline` and `desc` now use `t('source.{value}.tagline/desc')`
- **`components/SourceCardGrid.tsx`**: source `tagline` and `desc` translated; source names stay in English
- **`app/planner/page.tsx`**: all step headings, labels, placeholders, buttons, errors, option chips (budget/pace/transport/interests) use `t()`; `STEP_SHORT` labels derived from `t()` inside component
- **`app/profiles/page.tsx`**: all headings, form labels, hotel/food/budget labels, activity chips, tile buttons translated; `getStyleSummary` uses `t()` inline in `ProfileCard`
- **`app/results/page.tsx`**: all section headings, badges, day labels, time-of-day labels, info block labels translated; date locale switches with lang (`en-US` / `zh-CN`); `Day {n}` / `第 {n} 天` handled via `t('results.day', { n })`
- **Not translated** (by design): destination names, attraction/restaurant/hotel names, source names (Reddit, Michelin, etc.), mock-data-generated content (itinerary descriptions, whyFits, goNoGoReason — will be AI-generated in v2)
- **Bug fixed during session**: `node_modules/next/dist/lib/constants.js` was missing (corrupted install); fixed with `npm install`

### Session 5 — Results Page Redesign
- **`app/results/page.tsx`**: Full redesign into 5-section "trusted recommendation explanation" page
  1. **Top Decision Summary** — GO badge + destination + dates/length + confidence chip + one-sentence summary
  2. **Why This Plan** — profile connection summary + 3–4 bullet cards
  3. **Source Intelligence** — per-source branded cards with role, insight, and High/Medium/Low impact badge
  4. **Itinerary With Reasoning** — day-by-day with time (morning/afternoon/evening) as rich `DayActivity` objects (name, category chip, whyFits sentence, source tags)
  5. **Alternative Versions** — 3 static cards (Budget Explorer, Food-Focused, Rainy Day Plan) with disabled "Preview version" button
- **`lib/types.ts`**: New interfaces — `DayActivity`, `SourceInsight`, `AlternativeVersion`; updated `DayPlan` (slots now `DayActivity` instead of `string`); `TravelResult` gained `confidence`, `whyThisPlan`, `sourceIntelligence`, `alternativeVersions`
- **`lib/mock-data.ts`**: Full rewrite (~370 lines); source-aware data for Tokyo/Paris/Bali; `SOURCE_INTEL` lookup table for all 7 source types + general fallback; `buildSourceIntelligence()` derives per-source cards from form data; `buildItinerary()` helper; `DayActivity` objects vary by selected source (michelin vs reddit vs rednote vs general)
- Sub-components added to results page: `ItinerarySlot`, `SourceInsightCard`, `AlternativeCard`, `SourceTag`, `SectionHeading`
- **Null guards**: all three new sections wrapped in `result.whyThisPlan &&` / `result.sourceIntelligence &&` / `result.alternativeVersions &&` to survive Turbopack HMR cache stale module edge case
- **Turbopack HMR bug fix**: cleared `.next` cache + added null guards after HMR served stale `mock-data.ts` causing TypeError crash on Results page post-redesign
- Commits: `efaba7d` (redesign), `ea49f14` (null guard fix)

### Session 4 — Travel Profiles
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
│   └── results/page.tsx       — 5-section results: Decision Summary / Why This Plan /
│                                Source Intelligence / Itinerary With Reasoning / Alternatives
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
    ├── constants.ts           — SOURCES (with nameColor/cardBg/selectedBg/selectedBorder),
    │                            BUDGET/HOTEL/FOOD/TRANSPORT/INTEREST options
    ├── mock-data.ts           — SOURCE_INTEL table, buildSourceIntelligence(),
    │                            buildItinerary(), DESTINATION_DATA (Tokyo/Paris/Bali),
    │                            generateMockResult(tripData: TripFormData)
    ├── storage.ts             — Trip data + Profile CRUD (localStorage)
    └── types.ts               — TripFormData, TravelResult (+ confidence/whyThisPlan/
                                 sourceIntelligence/alternativeVersions), TravelProfile,
                                 DayPlan (morning/afternoon/evening: DayActivity),
                                 DayActivity, SourceInsight, AlternativeVersion
```

---

## Next Priority

1. **Integrate real AI** — Connect Anthropic Claude API to replace mock data in `/results`; stream the response; model: `claude-sonnet-4-6` or `claude-haiku-4-5-20251001` for cost
2. **Profile-aware Results** — Show "Based on your China Food Trip profile" in Section 1 (Top Decision Summary)
3. **Activate Alternative Versions** — The 3 alternative cards exist but "Preview version" button is disabled; make them functional (either mock data or AI-generated variants)
4. **Expand mock destinations** — Only Tokyo, Paris, Bali have rich `DayActivity` data; others fall back to generic; add more destinations
5. **Profile pre-select memory** — Remember the last-used profile so the planner pre-highlights it on return visits
6. **Mobile testing** — Results page new layout (5 sections, source cards, itinerary slots) not yet tested on small screens
7. **Delete confirmation** — Profile delete has no confirm dialog; add one

---

## Known Issues

| Issue | Type | Priority |
|---|---|---|
| Only 3 destinations have rich DayActivity mock data (Tokyo, Paris, Bali) | Content gap | Medium |
| Alternative Versions cards exist but "Preview version" button is non-functional | Feature gap | Medium |
| Results page doesn't show which profile was used | Feature gap | Low |
| Profile delete has no confirmation dialog | UX risk | Low |
| No "last used profile" memory in planner | UX polish | Low |
| Results page 5-section layout not tested on mobile | QA gap | Low |
| `MultiSelect` and `Select` components are unused in main flows (only available) | Cleanup | Low |
| Turbopack HMR may cache stale `mock-data.ts` — fix: `rm -rf .next` and restart | Dev tooling | Low |

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

**Results page is explanation-first, not itinerary-first**
The old results page was a simple list of activities. The redesign leads with WHY (the decision summary, why this plan, source intelligence) before HOW (the day-by-day itinerary). This matches the product's core job: confident decision-making, not itinerary generation.

**`DayActivity` replaces string slots in `DayPlan`**
Previously `morning: string`. Now `morning: DayActivity` with `name`, `category`, `whyFits`, `sources[]`. This allows the itinerary to explain its reasoning inline, not just list activities.

**Alternative Versions are static MVP placeholders**
Three alternative cards (Budget, Food-Focused, Rainy Day) are shown but non-functional. This seeds the concept early so users understand differentiation is possible, without requiring AI or extra data work now.

**Null guards on new `TravelResult` fields**
`whyThisPlan`, `sourceIntelligence`, `alternativeVersions` are optional at the type level (via null guard at render, not `?` in the interface). This makes old cached `TravelResult` objects from Turbopack's stale module safe — they simply skip the new sections rather than crashing.

---

## AI / Engineering Learnings

**`useState` lazy initializer for localStorage** — `useState(() => getProfiles())` reads storage once at mount without triggering `react-hooks/set-state-in-effect`. The SSR guard (`typeof window === 'undefined'`) is required in the storage helpers because Next.js pre-renders static pages on the server.

**`React.FormEvent` deprecated in React 19** — Use `{ preventDefault(): void }` as a minimal structural interface.

**CSS keyframe step animations** — `@keyframes step-enter` + `.animate-step` in `globals.css`. `key={step}` causes React to re-mount → re-triggers animation. Zero dependencies.

**Barrel exports in Next.js App Router** — A `components/ui/index.ts` that re-exports both server and client components can blur the server/client boundary. Skipped for now. Import each component directly.

**Turbopack HMR stale module pattern** — When `lib/mock-data.ts` is rewritten, Turbopack sometimes serves the old compiled module to the browser without re-compiling. The symptom: page crashes on fields that exist in the new file but not the old cached module. Fix: `rm -rf .next` and restart dev server. Null guards on new fields are a safety net (not a prevention).

**`SOURCE_META` lookup in results page** — `const SOURCE_META = Object.fromEntries(SOURCES.map(s => [s.value, { name, nameColor, cardBg }]))` at module level. Avoids calling `SOURCES.find()` in a render loop. Pattern to reuse when rendering source-branded UI.

**Two project directories exist** — `/Users/yangzhiqing/Desktop/fun_projects/just-go` (hyphen, the real project) and `just_go` (underscore, wrong). Always `cd just-go` before running `npm run dev`. The underscore directory has no `package.json`.

---

## Future Architecture Ideas

- **`lib/api/` folder** — when AI integration lands, API helpers go here separate from mock-data
- **`hooks/` folder** — custom React hooks (e.g., `useProfiles`, `useTripForm`) when state logic is complex enough
- **Typed literal unions** — `budget: 'budget' | 'midrange' | 'luxury'` instead of `string`; deferred because it requires updating mock-data comparisons
- **Consistent `<Card>` usage** — Results page hardcodes card styles; could be refactored to use `<Card variant="shadow">`
- **Profile export/share** — Let users share a profile as a link or JSON. No auth needed, just encode in URL params
