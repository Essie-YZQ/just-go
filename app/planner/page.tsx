'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { saveTripData, getPreferences } from '@/lib/storage'
import type { TripFormData } from '@/lib/types'

// ─── Constants ───────────────────────────────────────────────────────────────

const DURATIONS = ['2', '3', '4', '5', '7', '10', '14']

const BUDGET_OPTIONS = [
  { value: 'budget', label: 'Budget', sub: 'Under $100 / night' },
  { value: 'midrange', label: 'Comfortable', sub: '$100–250 / night' },
  { value: 'luxury', label: 'Luxury', sub: '$250+ / night' },
]

const PACE_OPTIONS = [
  { value: 'relaxed', label: 'Take it easy', sub: 'A few highlights, lots of downtime' },
  { value: 'moderate', label: 'Mix it up', sub: 'Balanced sightseeing and rest' },
  { value: 'fast', label: 'See everything', sub: 'Pack in as much as possible' },
]

const TRANSPORT_OPTIONS = [
  { value: 'public', label: 'Public Transit' },
  { value: 'rental', label: 'Rental Car' },
  { value: 'rideshare', label: 'Ride-share' },
  { value: 'walk', label: 'Walk / Bike' },
]

const INTEREST_OPTIONS = [
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

const SOURCE_OPTIONS = [
  {
    value: 'reddit',
    name: 'Reddit',
    tagline: 'Real opinions. No filters.',
    desc: 'Local intel and honest takes from real travelers.',
    selectedBg: 'bg-orange-50',
    selectedBorder: 'border-orange-400',
    nameColor: 'text-orange-700',
  },
  {
    value: 'rednote',
    name: 'RedNote',
    tagline: 'Trending. Aesthetic. Now.',
    desc: 'Visual hotspots and what\'s popular right now.',
    selectedBg: 'bg-rose-50',
    selectedBorder: 'border-rose-400',
    nameColor: 'text-rose-700',
  },
  {
    value: 'michelin',
    name: 'Michelin',
    tagline: 'World-class. Curated.',
    desc: 'Starred restaurants and expert-level picks.',
    selectedBg: 'bg-slate-900',
    selectedBorder: 'border-slate-700',
    nameColor: 'text-white',
    taglineColor: 'text-slate-200',
    descColor: 'text-slate-400',
  },
  {
    value: 'google-reviews',
    name: 'Google Reviews',
    tagline: 'Crowd-sourced confidence.',
    desc: 'High-volume ratings that surface what\'s actually good.',
    selectedBg: 'bg-blue-50',
    selectedBorder: 'border-blue-400',
    nameColor: 'text-blue-700',
  },
  {
    value: 'youtube',
    name: 'YouTube',
    tagline: 'See it before you go.',
    desc: 'Video guides from creators who\'ve been there.',
    selectedBg: 'bg-red-50',
    selectedBorder: 'border-red-400',
    nameColor: 'text-red-700',
  },
  {
    value: 'eater',
    name: 'Eater',
    tagline: 'Food-forward. Expert-led.',
    desc: 'Editorial picks from editors who cover food full-time.',
    selectedBg: 'bg-amber-50',
    selectedBorder: 'border-amber-400',
    nameColor: 'text-amber-800',
  },
  {
    value: 'local-blogs',
    name: 'Local Blogs',
    tagline: 'On the ground. In the know.',
    desc: 'Picks from people who actually live there.',
    selectedBg: 'bg-emerald-50',
    selectedBorder: 'border-emerald-400',
    nameColor: 'text-emerald-700',
  },
  {
    value: 'general',
    name: 'Surprise me',
    tagline: 'Balanced mix.',
    desc: 'A blend of popular, well-reviewed recommendations.',
    selectedBg: 'bg-slate-50',
    selectedBorder: 'border-slate-400',
    nameColor: 'text-slate-700',
  },
]

const STEP_LABELS = ['The Trip', 'Your Style', 'Your Sources']

// ─── Default form & initializer ──────────────────────────────────────────────

const DEFAULT_FORM: TripFormData = {
  destination: '',
  departureCity: '',
  arrivalDate: '',
  tripLength: '5',
  hotelBudget: 'midrange',
  transportationPreference: 'public',
  foodPreference: 'any',
  travelInterests: [],
  travelPace: 'moderate',
  trustedSources: [],
}

function getInitialForm(): TripFormData {
  if (typeof window === 'undefined') return DEFAULT_FORM
  const prefs = getPreferences()
  if (!prefs) return DEFAULT_FORM
  return {
    ...DEFAULT_FORM,
    hotelBudget: prefs.budget || DEFAULT_FORM.hotelBudget,
    transportationPreference: prefs.transportationPreference || DEFAULT_FORM.transportationPreference,
    travelPace: prefs.travelPace || DEFAULT_FORM.travelPace,
    travelInterests: prefs.interests?.length ? prefs.interests : DEFAULT_FORM.travelInterests,
    trustedSources: prefs.trustedSources?.length ? prefs.trustedSources : DEFAULT_FORM.trustedSources,
  }
}

// ─── Types ───────────────────────────────────────────────────────────────────

type SetField = <K extends keyof TripFormData>(key: K, value: TripFormData[K]) => void
type ToggleArray = (key: 'travelInterests' | 'trustedSources', value: string) => void

// ─── Main component ───────────────────────────────────────────────────────────

export default function PlannerPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<TripFormData>(getInitialForm)
  const [generating, setGenerating] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function setField<K extends keyof TripFormData>(key: K, value: TripFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key as string]) setErrors((prev) => ({ ...prev, [key as string]: '' }))
  }

  function toggleArray(key: 'travelInterests' | 'trustedSources', value: string) {
    setForm((prev) => {
      const arr = prev[key] as string[]
      return { ...prev, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] }
    })
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  function validateStep(): boolean {
    if (step === 0) {
      const errs: Record<string, string> = {}
      if (!form.destination.trim()) errs.destination = 'Please enter a destination.'
      if (!form.departureCity.trim()) errs.departureCity = 'Please enter your departure city.'
      if (!form.arrivalDate) errs.arrivalDate = 'Please pick a date.'
      setErrors(errs)
      return Object.keys(errs).length === 0
    }
    if (step === 2 && form.trustedSources.length === 0) {
      setErrors({ trustedSources: 'Pick at least one source to continue.' })
      return false
    }
    return true
  }

  function goNext() {
    if (!validateStep()) return
    setErrors({})
    setStep((s) => s + 1)
  }

  function goBack() {
    setErrors({})
    setStep((s) => s - 1)
  }

  function handleGenerate() {
    if (!validateStep()) return
    setGenerating(true)
    saveTripData(form)
    setTimeout(() => router.push('/results'), 1600)
  }

  // ── Generating state ──
  if (generating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
        <div className="h-7 w-7 rounded-full border-2 border-slate-200 border-t-slate-700 animate-spin" />
        <div className="text-center">
          <p className="text-base font-medium text-slate-700">Building your plan...</p>
          <p className="text-sm text-slate-400 mt-1">Curating picks from your trusted sources</p>
        </div>
      </div>
    )
  }

  const progress = ((step + 1) / STEP_LABELS.length) * 100

  return (
    <div className="mx-auto max-w-xl px-6 py-14">

      {/* Progress */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-xs text-slate-400">Step {step + 1} of {STEP_LABELS.length}</p>
          <p className="text-xs font-semibold text-slate-600">{STEP_LABELS[step]}</p>
        </div>
        <div className="h-0.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-slate-900 rounded-full transition-all duration-400"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step content — key triggers re-mount + CSS animation */}
      <div className="animate-step" key={step}>
        {step === 0 && <StepTrip form={form} errors={errors} setField={setField} />}
        {step === 1 && <StepStyle form={form} setField={setField} toggleArray={toggleArray} />}
        {step === 2 && <StepSources form={form} toggleArray={toggleArray} error={errors.trustedSources} />}
      </div>

      {/* Navigation */}
      <div className={`flex items-center mt-12 ${step > 0 ? 'justify-between' : 'justify-end'}`}>
        {step > 0 && (
          <button
            type="button"
            onClick={goBack}
            className="text-sm text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            ← Back
          </button>
        )}
        {step < 2 ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Continue →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Get My Plan →
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Step 1: The Trip ─────────────────────────────────────────────────────────

function StepTrip({ form, errors, setField }: {
  form: TripFormData
  errors: Record<string, string>
  setField: SetField
}) {
  return (
    <div className="flex flex-col gap-9">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-1.5">Where are you going?</h2>
        <p className="text-sm text-slate-400">Start with the basics — we&apos;ll handle the rest.</p>
      </div>

      <div className="flex flex-col gap-4">
        <Input
          label="Destination"
          placeholder="Tokyo, Paris, Bali..."
          value={form.destination}
          onChange={(e) => setField('destination', e.target.value)}
          error={errors.destination}
        />
        <Input
          label="Departing from"
          placeholder="New York, London, Beijing..."
          value={form.departureCity}
          onChange={(e) => setField('departureCity', e.target.value)}
          error={errors.departureCity}
        />
      </div>

      <div className="flex flex-col gap-4">
        <Input
          label="Arrival date"
          type="date"
          value={form.arrivalDate}
          onChange={(e) => setField('arrivalDate', e.target.value)}
          error={errors.arrivalDate}
        />

        <div>
          <p className="text-sm font-medium text-slate-700 mb-3">Trip length</p>
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setField('tripLength', d)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                  form.tripLength === d
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Step 2: Your Style ───────────────────────────────────────────────────────

function StepStyle({ form, setField, toggleArray }: {
  form: TripFormData
  setField: SetField
  toggleArray: ToggleArray
}) {
  return (
    <div className="flex flex-col gap-9">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-1.5">How do you like to travel?</h2>
        <p className="text-sm text-slate-400">We&apos;ll tailor the recommendations to match your style.</p>
      </div>

      {/* Budget */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-3">Budget</p>
        <div className="grid grid-cols-3 gap-2.5">
          {BUDGET_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setField('hotelBudget', opt.value)}
              className={`flex flex-col gap-1 rounded-xl border p-4 text-left transition-all cursor-pointer ${
                form.hotelBudget === opt.value
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300'
              }`}
            >
              <span className="text-sm font-semibold">{opt.label}</span>
              <span className={`text-xs ${form.hotelBudget === opt.value ? 'text-slate-400' : 'text-slate-400'}`}>
                {opt.sub}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Pace */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-3">Travel pace</p>
        <div className="grid grid-cols-3 gap-2.5">
          {PACE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setField('travelPace', opt.value)}
              className={`flex flex-col gap-1 rounded-xl border p-4 text-left transition-all cursor-pointer ${
                form.travelPace === opt.value
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300'
              }`}
            >
              <span className="text-sm font-semibold">{opt.label}</span>
              <span className={`text-xs ${form.travelPace === opt.value ? 'text-slate-400' : 'text-slate-400'}`}>
                {opt.sub}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Transport */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-3">Getting around</p>
        <div className="flex flex-wrap gap-2">
          {TRANSPORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setField('transportationPreference', opt.value)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                form.transportationPreference === opt.value
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-1">You&apos;re into</p>
        <p className="text-xs text-slate-400 mb-3">Select all that apply</p>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleArray('travelInterests', opt.value)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                form.travelInterests.includes(opt.value)
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Step 3: Your Sources ─────────────────────────────────────────────────────

function StepSources({ form, toggleArray, error }: {
  form: TripFormData
  toggleArray: ToggleArray
  error?: string
}) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-1.5">
          Who do you trust for travel tips?
        </h2>
        <p className="text-sm text-slate-400">
          This is the most important question. It shapes everything you&apos;ll see.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SOURCE_OPTIONS.map((s) => {
          const selected = form.trustedSources.includes(s.value)
          const isMichelin = s.value === 'michelin'
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => toggleArray('trustedSources', s.value)}
              className={`rounded-2xl border-2 p-5 text-left transition-all cursor-pointer ${
                selected
                  ? `${s.selectedBg} ${s.selectedBorder}`
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <p className={`text-sm font-bold mb-1 ${selected ? s.nameColor : 'text-slate-800'}`}>
                {s.name}
              </p>
              <p className={`text-sm font-medium mb-1 ${
                selected
                  ? (s.taglineColor ?? (isMichelin ? 'text-slate-200' : 'text-slate-700'))
                  : 'text-slate-600'
              }`}>
                {s.tagline}
              </p>
              <p className={`text-xs leading-relaxed ${
                selected
                  ? (s.descColor ?? (isMichelin ? 'text-slate-400' : 'text-slate-500'))
                  : 'text-slate-400'
              }`}>
                {s.desc}
              </p>
            </button>
          )
        })}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
