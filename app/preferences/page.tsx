'use client'

import { useState } from 'react'
import { Select } from '@/components/ui/Select'
import { MultiSelect } from '@/components/ui/MultiSelect'
import { Button } from '@/components/ui/Button'
import { savePreferences, getPreferences } from '@/lib/storage'
import type { UserPreferences } from '@/lib/types'

const BUDGET_OPTIONS = [
  { value: 'budget', label: 'Budget — Under $100/night' },
  { value: 'midrange', label: 'Mid-range — $100–250/night' },
  { value: 'luxury', label: 'Luxury — $250+/night' },
]

const TRANSPORT_OPTIONS = [
  { value: 'public', label: 'Public transit' },
  { value: 'rental', label: 'Rental car' },
  { value: 'rideshare', label: 'Taxi / Ride-share' },
  { value: 'walk', label: 'Walk everywhere' },
]

const PACE_OPTIONS = [
  { value: 'relaxed', label: 'Relaxed' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'fast', label: 'Fast-paced' },
]

const CUISINE_OPTIONS = [
  { value: 'local', label: 'Local cuisine' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'italian', label: 'Italian' },
  { value: 'mexican', label: 'Mexican' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'indian', label: 'Indian' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'seafood', label: 'Seafood' },
  { value: 'vegetarian', label: 'Vegetarian / Vegan' },
  { value: 'street-food', label: 'Street Food' },
]

const SOURCE_OPTIONS = [
  { value: 'general', label: 'General recommendations' },
  { value: 'xiaohongshu', label: 'Xiaohongshu' },
  { value: 'reddit', label: 'Reddit' },
  { value: 'google-reviews', label: 'Google Reviews' },
  { value: 'eater', label: 'Eater' },
  { value: 'michelin', label: 'Michelin Guide' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'local-blogs', label: 'Local Blogs' },
]

const INTEREST_OPTIONS = [
  { value: 'museums', label: 'Museums' },
  { value: 'nightlife', label: 'Nightlife' },
  { value: 'nature', label: 'Nature' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'food', label: 'Food & Dining' },
  { value: 'history', label: 'History' },
  { value: 'art', label: 'Art' },
  { value: 'beach', label: 'Beach' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'photography', label: 'Photography' },
]

const DEFAULT_PREFS: UserPreferences = {
  budget: 'midrange',
  favoriteCuisines: [],
  travelPace: 'moderate',
  transportationPreference: 'public',
  trustedSources: ['general'],
  interests: [],
}

export default function PreferencesPage() {
  const [prefs, setPrefs] = useState<UserPreferences>(() => {
    if (typeof window === 'undefined') return DEFAULT_PREFS
    return getPreferences() ?? DEFAULT_PREFS
  })
  const [saved, setSaved] = useState(false)

  function set<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) {
    setPrefs((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    savePreferences(prefs)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">Preferences</h1>
        <p className="text-sm text-slate-500">
          Save your defaults. They&apos;ll be pre-filled when you plan your next trip.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-10">
        {/* Travel Style */}
        <section className="flex flex-col gap-5">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400">Travel Style</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Default budget"
              options={BUDGET_OPTIONS}
              value={prefs.budget}
              onChange={(e) => set('budget', e.target.value)}
            />
            <Select
              label="Travel pace"
              options={PACE_OPTIONS}
              value={prefs.travelPace}
              onChange={(e) => set('travelPace', e.target.value)}
            />
            <Select
              label="Transportation"
              options={TRANSPORT_OPTIONS}
              value={prefs.transportationPreference}
              onChange={(e) => set('transportationPreference', e.target.value)}
            />
          </div>
        </section>

        <div className="border-t border-slate-100" />

        {/* Food */}
        <section className="flex flex-col gap-5">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400">Food</h2>
          <MultiSelect
            label="Favorite cuisines"
            hint="Select all that you enjoy"
            options={CUISINE_OPTIONS}
            value={prefs.favoriteCuisines}
            onChange={(v) => set('favoriteCuisines', v)}
          />
        </section>

        <div className="border-t border-slate-100" />

        {/* Interests */}
        <section className="flex flex-col gap-5">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400">Interests</h2>
          <MultiSelect
            label="What do you enjoy doing?"
            hint="These shape activity recommendations"
            options={INTEREST_OPTIONS}
            value={prefs.interests}
            onChange={(v) => set('interests', v)}
          />
        </section>

        <div className="border-t border-slate-100" />

        {/* Trusted Sources */}
        <section className="flex flex-col gap-5">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400">Trusted Sources</h2>
          <MultiSelect
            label="Where do you trust travel recommendations from?"
            options={SOURCE_OPTIONS}
            value={prefs.trustedSources}
            onChange={(v) => set('trustedSources', v)}
          />
        </section>

        <div className="border-t border-slate-100" />

        <div className="flex items-center justify-between gap-4">
          <p className={`text-sm transition-opacity duration-300 ${saved ? 'text-emerald-600 opacity-100' : 'opacity-0'}`}>
            Preferences saved.
          </p>
          <Button type="submit" size="md">
            Save Preferences
          </Button>
        </div>
      </form>

      <p className="mt-6 text-xs text-slate-400">
        Preferences are stored locally on your device only. No account required.
      </p>
    </div>
  )
}
