'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { SourceCardGrid } from '@/components/SourceCardGrid'
import { saveTripData, getProfiles } from '@/lib/storage'
import { SOURCES, INTEREST_OPTIONS, BUDGET_OPTIONS, TRANSPORT_OPTIONS } from '@/lib/constants'
import { useT } from '@/lib/i18n'
import type { TripFormData, TravelProfile } from '@/lib/types'

// ─── Date helpers ─────────────────────────────────────────────────────────────

function toDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function getToday(): string { return toDateStr(new Date()) }
function getTomorrow(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return toDateStr(d)
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
  const t = useT()
  const [step, setStep] = useState(0)
  const [profiles] = useState<TravelProfile[]>(() => getProfiles())
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null)
  const [form, setForm] = useState<TripFormData>(() => ({
    ...DEFAULT_FORM,
    arrivalDate: typeof window !== 'undefined' ? getTomorrow() : '',
  }))
  const [generating, setGenerating] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const STEP_SHORT = [
    t('planner.steps.profile'),
    t('planner.steps.trip'),
    t('planner.steps.style'),
    t('planner.steps.sources'),
  ]

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
        setErrors({ profile: t('planner.profile.error') })
        return false
      }
    }
    if (step === 1) {
      const errs: Record<string, string> = {}
      if (!form.destination.trim()) errs.destination = t('planner.trip.destination.error')
      if (!form.departureCity.trim()) errs.departureCity = t('planner.trip.departure.error')
      if (!form.arrivalDate) errs.arrivalDate = t('planner.trip.date.error')
      setErrors(errs)
      return Object.keys(errs).length === 0
    }
    if (step === 3 && form.trustedSources.length === 0) {
      setErrors({ trustedSources: t('planner.sources.error') })
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
          <p className="text-base font-medium text-slate-700">{t('planner.loading.title')}</p>
          <p className="text-sm text-slate-400 mt-1">{t('planner.loading.sub')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-14">

      {/* Step indicator */}
      <div className="mb-12">
        <div className="relative flex justify-between items-start">
          {/* Track */}
          <div className="absolute top-4 left-4 right-4 h-px bg-slate-100">
            <div
              className="h-full bg-slate-900 transition-all duration-500"
              style={{ width: `${(step / (STEP_SHORT.length - 1)) * 100}%` }}
            />
          </div>

          {STEP_SHORT.map((label, i) => {
            const isDone = i < step
            const isCurrent = i === step
            return (
              <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                  isDone || isCurrent
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white border-slate-200 text-slate-400'
                }`}>
                  {isDone ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] font-medium transition-colors ${
                  isCurrent ? 'text-slate-700' : isDone ? 'text-slate-500' : 'text-slate-300'
                }`}>
                  {label}
                </span>
              </div>
            )
          })}
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
          />
        )}
        {step === 2 && (
          <StepStyle
            form={form}
            setField={setField}
            toggleArray={toggleArray}
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
            {t('planner.back')}
          </button>
        )}
        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {t('planner.continue')}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {t('planner.getMyPlan')}
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
  const t = useT()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-1.5">{t('planner.profile.heading')}</h2>
        <p className="text-sm text-slate-400">{t('planner.profile.sub')}</p>
      </div>

      {profiles.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl">
          <p className="text-slate-400 text-sm mb-3">{t('planner.profile.empty')}</p>
          <Link href="/profiles" className="text-sm font-medium text-slate-700 underline underline-offset-4">
            {t('planner.profile.createLink')}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {profiles.map((p) => {
            const isSelected = selectedProfileId === p.id
            const profileSources = SOURCES.filter((s) => p.trustedSources.includes(s.value))
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
                    <div className="flex items-center gap-2 flex-wrap mb-2.5">
                      <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        {t(`budgetLabel.${p.budget}`)}
                      </span>
                    </div>
                    {profileSources.length > 0 && (
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
                        {profileSources.map((s) => (
                          <span key={s.value} className={`text-sm font-semibold ${s.nameColor}`}>{s.name}</span>
                        ))}
                      </div>
                    )}
                    {p.activityStyle.length > 0 && (
                      <p className="text-xs text-slate-400">
                        {p.activityStyle.slice(0, 3).map((a) => t(`interest.${a}`)).join(' · ')}
                      </p>
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
        {t('planner.profile.manage')}
      </Link>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
    </div>
  )
}

// ─── Step 1: The Trip ─────────────────────────────────────────────────────────

function StepTrip({ form, errors, setField }: {
  form: TripFormData
  errors: Record<string, string>
  setField: SetField
}) {
  const t = useT()
  const TRIP_DURATIONS = ['2', '3', '4', '5', '7', '10', '14']

  return (
    <div className="flex flex-col gap-9">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-1.5">{t('planner.trip.heading')}</h2>
        <p className="text-sm text-slate-400">{t('planner.trip.sub')}</p>
      </div>

      <div className="flex flex-col gap-4">
        <Input
          label={t('planner.trip.destination')}
          placeholder={t('planner.trip.destination.placeholder')}
          value={form.destination}
          onChange={(e) => setField('destination', e.target.value)}
          error={errors.destination}
        />
        <Input
          label={t('planner.trip.departure')}
          placeholder={t('planner.trip.departure.placeholder')}
          value={form.departureCity}
          onChange={(e) => setField('departureCity', e.target.value)}
          error={errors.departureCity}
        />
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700">{t('planner.trip.arrivalDate')}</label>
            <div className="flex gap-1.5">
              {([
                { labelKey: 'planner.trip.today', value: getToday() },
                { labelKey: 'planner.trip.tomorrow', value: getTomorrow() },
              ]).map((opt) => (
                <button
                  key={opt.labelKey}
                  type="button"
                  onClick={() => setField('arrivalDate', opt.value)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                    form.arrivalDate === opt.value
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>
          </div>
          <input
            type="date"
            value={form.arrivalDate}
            onChange={(e) => setField('arrivalDate', e.target.value)}
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none transition-colors ${
              errors.arrivalDate ? 'border-red-400' : 'border-slate-200'
            }`}
          />
          {errors.arrivalDate && <p className="text-xs text-red-500 mt-1.5">{errors.arrivalDate}</p>}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700 mb-3">{t('planner.trip.length')}</p>
          <div className="flex flex-wrap gap-2">
            {TRIP_DURATIONS.map((d) => (
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
  const t = useT()

  const PACE_OPTIONS = [
    { value: 'relaxed' },
    { value: 'moderate' },
    { value: 'fast' },
  ]

  return (
    <div className="flex flex-col gap-9">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-1.5">{t('planner.style.heading')}</h2>
        <p className="text-sm text-slate-400">{t('planner.style.sub')}</p>
      </div>

      {/* Budget */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-0.5">{t('planner.style.budget')}</p>
        <p className="text-xs text-slate-400 mb-3">{t('planner.style.budget.hint')}</p>
        <div className="grid grid-cols-2 gap-2.5">
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
              <span className="text-sm font-semibold">{t(`budget.${opt.value}.label`)}</span>
              <span className="text-xs text-slate-400">{t(`budget.${opt.value}.sub`)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pace */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-3">{t('planner.style.pace')}</p>
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
              <span className="text-sm font-semibold">{t(`pace.${opt.value}.label`)}</span>
              <span className="text-xs text-slate-400">{t(`pace.${opt.value}.sub`)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Transport */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-3">{t('planner.style.transport')}</p>
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
              {t(`transport.${opt.value}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-1">{t('planner.style.interests')}</p>
        <p className="text-xs text-slate-400 mb-3">{t('planner.style.interests.hint')}</p>
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
              {t(`interest.${opt.value}`)}
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
  const t = useT()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-1.5">
          {t('planner.sources.heading')}
        </h2>
        <p className="text-sm text-slate-400">
          {t('planner.sources.sub')}
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
