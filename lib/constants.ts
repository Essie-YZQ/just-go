// ─── Sources ──────────────────────────────────────────────────────────────────
//
// Single source of truth for all travel source data.
// Used by: landing page (display), planner (selection), mock-data (labels).

export interface SourceDefinition {
  value: string
  name: string
  tagline: string
  desc: string
  nameColor: string       // text color for the source name
  cardBg: string          // landing page card: bg + border combined (e.g. 'bg-orange-50 border-orange-100')
  selectedBg: string      // planner: background when card is selected
  selectedBorder: string  // planner: border when card is selected
  taglineColor?: string   // override for dark-background cards (Michelin)
  descColor?: string      // override for dark-background cards (Michelin)
  featured: boolean       // whether to show on the landing page
}

export const SOURCES: SourceDefinition[] = [
  {
    value: 'reddit',
    name: 'Reddit',
    tagline: 'Real opinions. No filters.',
    desc: "Local intel and honest takes from actual travelers — not sponsored results.",
    nameColor: 'text-orange-700',
    cardBg: 'bg-orange-50 border-orange-100',
    selectedBg: 'bg-orange-50',
    selectedBorder: 'border-orange-400',
    featured: true,
  },
  {
    value: 'rednote',
    name: 'RedNote',
    tagline: 'Trending. Aesthetic. Now.',
    desc: "Visual hotspots and what's popular right now — the traveler's eye view.",
    nameColor: 'text-rose-700',
    cardBg: 'bg-rose-50 border-rose-100',
    selectedBg: 'bg-rose-50',
    selectedBorder: 'border-rose-400',
    featured: true,
  },
  {
    value: 'michelin',
    name: 'Michelin',
    tagline: 'World-class. Curated.',
    desc: "Starred restaurants and expert-level dining — for the serious table.",
    nameColor: 'text-white',
    taglineColor: 'text-slate-200',
    descColor: 'text-slate-400',
    cardBg: 'bg-slate-900 border-slate-900',
    selectedBg: 'bg-slate-900',
    selectedBorder: 'border-slate-700',
    featured: true,
  },
  {
    value: 'google-reviews',
    name: 'Google Reviews',
    tagline: 'Crowd-sourced confidence.',
    desc: "High-volume ratings that surface what's consistently good over time.",
    nameColor: 'text-blue-700',
    cardBg: 'bg-blue-50 border-blue-100',
    selectedBg: 'bg-blue-50',
    selectedBorder: 'border-blue-400',
    featured: true,
  },
  {
    value: 'youtube',
    name: 'YouTube',
    tagline: 'See it before you go.',
    desc: "Video guides from creators who've been there and know what to look for.",
    nameColor: 'text-red-700',
    cardBg: 'bg-red-50 border-red-100',
    selectedBg: 'bg-red-50',
    selectedBorder: 'border-red-400',
    featured: true,
  },
  {
    value: 'eater',
    name: 'Eater',
    tagline: 'Food-forward. Expert-led.',
    desc: "Editorial restaurant picks from journalists who cover food full-time.",
    nameColor: 'text-amber-800',
    cardBg: 'bg-amber-50 border-amber-100',
    selectedBg: 'bg-amber-50',
    selectedBorder: 'border-amber-400',
    featured: true,
  },
  {
    value: 'local-blogs',
    name: 'Local Blogs',
    tagline: 'On the ground. In the know.',
    desc: "Picks from people who actually live there.",
    nameColor: 'text-emerald-700',
    cardBg: 'bg-emerald-50 border-emerald-100',
    selectedBg: 'bg-emerald-50',
    selectedBorder: 'border-emerald-400',
    featured: false,
  },
  {
    value: 'general',
    name: 'Surprise me',
    tagline: 'Balanced mix.',
    desc: "A blend of popular, well-reviewed recommendations.",
    nameColor: 'text-slate-700',
    cardBg: 'bg-slate-50 border-slate-200',
    selectedBg: 'bg-slate-50',
    selectedBorder: 'border-slate-400',
    featured: false,
  },
]

// ─── Shared option lists ──────────────────────────────────────────────────────
//
// These are used by both the Planner and Preferences pages with identical values.

export const INTEREST_OPTIONS = [
  { value: 'food', label: 'Food & Dining' },
  { value: 'art', label: 'Art' },
  { value: 'museums', label: 'Museums' },
  { value: 'nature', label: 'Nature' },
  { value: 'nightlife', label: 'Nightlife' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'history', label: 'History' },
  { value: 'beach', label: 'Beach' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'photography', label: 'Photography' },
]
