'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { MultiSelect } from '@/components/ui/MultiSelect'
import { Button } from '@/components/ui/Button'
import { saveTripData } from '@/lib/storage'
import { getPreferences } from '@/lib/storage'
import type { TripFormData } from '@/lib/types'

const HOTEL_BUDGETS = [
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

const FOOD_OPTIONS = [
  { value: 'local', label: 'Local cuisine only' },
  { value: 'international', label: 'Mix of local & international' },
  { value: 'vegetarian', label: 'Vegetarian / Vegan' },
  { value: 'any', label: 'No preference' },
]

const PACE_OPTIONS = [
  { value: 'relaxed', label: 'Relaxed — few highlights, lots of downtime' },
  { value: 'moderate', label: 'Moderate — balanced mix' },
  { value: 'fast', label: 'Fast-paced — pack in as much as possible' },
]

const TRIP_LENGTHS = [
  { value: '2', label: '2 days' },
  { value: '3', label: '3 days' },
  { value: '4', label: '4 days' },
  { value: '5', label: '5 days' },
  { value: '7', label: '7 days' },
  { value: '10', label: '10 days' },
  { value: '14', label: '14 days' },
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

const DEFAULT_FORM: TripFormData = {
  destination: '',
  departureCity: '',
  arrivalDate: '',
  tripLength: '4',
  hotelBudget: 'midrange',
  transportationPreference: 'public',
  foodPreference: 'any',
  travelInterests: [],
  travelPace: 'moderate',
  trustedSources: ['general'],
}

export default function PlannerPage() {
  const router = useRouter()
  const [form, setForm] = useState<TripFormData>(DEFAULT_FORM)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof TripFormData, string>>>({})

  useEffect(() => {
    const prefs = getPreferences()
    if (prefs) {
      setForm((prev) => ({
        ...prev,
        hotelBudget: prefs.budget || prev.hotelBudget,
        transportationPreference: prefs.transportationPreference || prev.transportationPreference,
        foodPreference: prefs.favoriteCuisines?.[0] || prev.foodPreference,
        travelPace: prefs.travelPace || prev.travelPace,
        travelInterests: prefs.interests?.length ? prefs.interests : prev.travelInterests,
        trustedSources: prefs.trustedSources?.length ? prefs.trustedSources : prev.trustedSources,
      }))
    }
  }, [])

  function set<K extends keyof TripFormData>(key: K, value: TripFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof TripFormData, string>> = {}
    if (!form.destination.trim()) newErrors.destination = 'Please enter a destination.'
    if (!form.departureCity.trim()) newErrors.departureCity = 'Please enter your departure city.'
    if (!form.arrivalDate) newErrors.arrivalDate = 'Please select an arrival date.'
    if (form.trustedSources.length === 0) newErrors.trustedSources = 'Please select at least one source.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    saveTripData(form)
    setTimeout(() => {
      router.push('/results')
    }, 1200)
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">Plan your trip</h1>
        <p className="text-sm text-slate-500">Tell us where you want to go and we'll take care of the rest.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        {/* Destination */}
        <section className="flex flex-col gap-5">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400">Destination</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Where are you going?"
              placeholder="e.g. Tokyo, Paris, Bali"
              value={form.destination}
              onChange={(e) => set('destination', e.target.value)}
              error={errors.destination}
            />
            <Input
              label="Departing from"
              placeholder="e.g. San Francisco"
              value={form.departureCity}
              onChange={(e) => set('departureCity', e.target.value)}
              error={errors.departureCity}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Arrival date"
              type="date"
              value={form.arrivalDate}
              onChange={(e) => set('arrivalDate', e.target.value)}
              error={errors.arrivalDate}
            />
            <Select
              label="Trip length"
              options={TRIP_LENGTHS}
              value={form.tripLength}
              onChange={(e) => set('tripLength', e.target.value)}
            />
          </div>
        </section>

        <div className="border-t border-slate-100" />

        {/* Preferences */}
        <section className="flex flex-col gap-5">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400">Preferences</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Hotel budget"
              options={HOTEL_BUDGETS}
              value={form.hotelBudget}
              onChange={(e) => set('hotelBudget', e.target.value)}
            />
            <Select
              label="Getting around"
              options={TRANSPORT_OPTIONS}
              value={form.transportationPreference}
              onChange={(e) => set('transportationPreference', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Food preference"
              options={FOOD_OPTIONS}
              value={form.foodPreference}
              onChange={(e) => set('foodPreference', e.target.value)}
            />
            <Select
              label="Travel pace"
              options={PACE_OPTIONS}
              value={form.travelPace}
              onChange={(e) => set('travelPace', e.target.value)}
            />
          </div>
          <MultiSelect
            label="Travel interests"
            hint="Select all that apply"
            options={INTEREST_OPTIONS}
            value={form.travelInterests}
            onChange={(v) => set('travelInterests', v)}
          />
        </section>

        <div className="border-t border-slate-100" />

        {/* Trusted Sources */}
        <section className="flex flex-col gap-5">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400">Trusted Sources</h2>
          <MultiSelect
            label="Where do you usually get travel tips?"
            hint="Your picks shape the recommendations you'll receive"
            options={SOURCE_OPTIONS}
            value={form.trustedSources}
            onChange={(v) => set('trustedSources', v)}
          />
          {errors.trustedSources && (
            <p className="text-xs text-red-500">{errors.trustedSources}</p>
          )}
        </section>

        <div className="border-t border-slate-100" />

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? 'Building your plan...' : 'Get My Travel Plan →'}
          </Button>
        </div>
      </form>
    </div>
  )
}
