'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { SourceCardGrid } from '@/components/SourceCardGrid'
import { saveTripData, getProfiles } from '@/lib/storage'
import { SOURCES, INTEREST_OPTIONS, BUDGET_OPTIONS, TRANSPORT_OPTIONS } from '@/lib/constants'
import type { TripFormData, TravelProfile } from '@/lib/types'

// ─── Page-local constants ─────────────────────────────────────────────────────

const STEP_LABELS = ['Choose a Profile', 'The Trip', 'Your Style', 'Your Sources']

const TRIP_DURATIONS = ['2', '3', '4', '5', '7', '10', '14']

const PACE_OPTIONS = [
  { value: 'relaxed', label: 'Take it easy', sub: 'A few highlights, lots of downtime' },
  { value: 'moderate', label: 'Mix it up', sub: 'Balanced sightseeing and rest' },
  { value: 'fast', label: 'See everything', sub: 'Pack in as much as possible' },
]

const BUDGET_LABEL: Record<string, string> = {
  budget: 'Budget',
  midrange: 'Comfortable',
  luxury: 'Luxury',
}

// ─── Default form ─────────────────────────────────────────────────────────────

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

// ─── Types ───────────────────────────────────────────────────────────────────

type SetField = <K extends keyof TripFormData>(key: K, value: TripFormData[K]) => void
type ToggleArray = (key: 'travelInterests' | 'trustedSources', value: string) => void

// ─── Main component ───────────────────────────────────────────────────────────

export default function PlannerPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [profiles] = useState<TravelProfile[]>(() => getProfiles())
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null)
  const [form, setForm] = useState<TripFormData>(DEFAULT_FORM)
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

  function applyProfile(profile: TravelProfile) {
    setSelectedProfileId(profile.id)
    setForm((prev) => ({
      ...prev,
      hotelBudget: profile.budget,
      transportationPreference: profile.transportationPreference,
      travelInterests: profile.activityStyle,
      trustedSources: profile.trustedSources,
      foodPreference: profile.foodStyle,
    }))
    if (errors.profile) setErrors((prev) => ({ ...prev, profile: '' }))
  }

  function validateStep(): boolean {
    if (step === 0) {
      if (!selectedProfileId) {
        setErrors({ profile: 'Please choose a travel profile to continue.' })
        return false
      }
    }
    if (step === 1) {
      const errs: Record<string, string> = {}
      if (!form.destination.trim()) errs.destination = 'Please enter a destination.'
      if (!form.departureCity.trim()) errs.departureCity = 'Please enter your departure city.'
      if (!form.arrivalDate) errs.arrivalDate = 'Please pick a date.'
      setErrors(errs)
      return Object.keys(errs).length === 0
    }
    if (step === 3 && form.trustedSources.length === 0) {
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

  if (generating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
        <Spinner />
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

      {/* Step content */}
      <div className="animate-step" key={step}>
        {step === 0 && (
          <StepProfile
            profiles={profiles}
            selectedProfileId={selectedProfileId}
            onSelect={applyProfile}
            error={errors.profile}
          />
        )}
        {step === 1 && (
          <StepTrip
            form={form}
            errors={errors}
            setField={setField}
            durations={TRIP_DURATIONS}
          />
        )}
        {step === 2 && (
          <StepStyle
            form={form}
            setField={setField}
            toggleArray={toggleArray}
            paceOptions={PACE_OPTIONS}
          />
        )}
        {step === 3 && (
          <StepSources
            form={form}
            toggleArray={toggleArray}
            error={errors.trustedSources}
          />
        )}
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
        {step < 3 ? (
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

// ─── Step 0: Choose a Profile ─────────────────────────────────────────────────

function StepProfile({ profiles, selectedProfileId, onSelect, error }: {
  profiles: TravelProfile[]
  selectedProfileId: string | null
  onSelect: (p: TravelProfile) => void
  error?: string
}) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-1.5">Start with a profile</h2>
        <p className="text-sm text-slate-400">Your profile pre-fills your preferences. You can adjust anything in the next steps.</p>
      </div>

      {profiles.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl">
          <p className="text-slate-400 text-sm mb-3">No profiles yet.</p>
          <Link href="/profiles" className="text-sm font-medium text-slate-700 underline underline-offset-4">
            Create a travel profile →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {profiles.map((p) => {
            const isSelected = selectedProfileId === p.id
            const profileSources = SOURCES.filter((s) => p.trustedSources.includes(s.value)).slice(0, 3)
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelect(p)}
                className={`rounded-2xl border-2 p-5 text-left transition-all cursor-pointer w-full ${
                  isSelected
                    ? 'border-slate-900 bg-white'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 mb-1.5">{p.name}</p>
                    <p className="text-xs text-slate-400 mb-3">
                      {BUDGET_LABEL[p.budget] ?? p.budget}
                      {p.activityStyle.length > 0 && (
                        <> · {p.activityStyle.slice(0, 3).map((a) => a.replace('-', ' ')).join(', ')}</>
                      )}
                    </p>
                    {profileSources.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {profileSources.map((s) => (
                          <span key={s.value} className={`text-xs font-semibold ${s.nameColor}`}>{s.name}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={`shrink-0 mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'bg-slate-900 border-slate-900' : 'border-slate-300'
                  }`}>
                    {isSelected && <span className="text-white text-[10px] font-bold leading-none">✓</span>}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}

      <Link
        href="/profiles"
        className="text-sm text-slate-400 hover:text-slate-700 transition-colors text-center"
      >
        + Manage profiles
      </Link>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
    </div>
  )
}

// ─── Step 1: The Trip ─────────────────────────────────────────────────────────

function StepTrip({ form, errors, setField, durations }: {
  form: TripFormData
  errors: Record<string, string>
  setField: SetField
  durations: string[]
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
            {durations.map((d) => (
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

function StepStyle({ form, setField, toggleArray, paceOptions }: {
  form: TripFormData
  setField: SetField
  toggleArray: ToggleArray
  paceOptions: { value: string; label: string; sub: string }[]
}) {
  return (
    <div className="flex flex-col gap-9">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-1.5">How do you like to travel?</h2>
        <p className="text-sm text-slate-400">Pre-filled from your profile — adjust anything you like.</p>
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
              <span className="text-xs text-slate-400">{opt.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pace */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-3">Travel pace</p>
        <div className="grid grid-cols-3 gap-2.5">
          {paceOptions.map((opt) => (
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
              <span className="text-xs text-slate-400">{opt.sub}</span>
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
          Pre-filled from your profile — this shapes everything you&apos;ll see.
        </p>
      </div>

      <SourceCardGrid
        selected={form.trustedSources}
        onToggle={(value) => toggleArray('trustedSources', value)}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
