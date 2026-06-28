'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { SourceCardGrid } from '@/components/SourceCardGrid'
import { getProfiles, saveProfile, deleteProfile } from '@/lib/storage'
import {
  SOURCES,
  BUDGET_OPTIONS,
  HOTEL_STYLE_OPTIONS,
  FOOD_STYLE_OPTIONS,
  TRANSPORT_OPTIONS,
  INTEREST_OPTIONS,
} from '@/lib/constants'
import type { TravelProfile } from '@/lib/types'

// ─── Display helpers ──────────────────────────────────────────────────────────

const BUDGET_LABEL: Record<string, string> = {
  budget: 'Budget',
  midrange: 'Comfortable',
  premium: 'Premium',
  luxury: 'Luxury',
}

const HOTEL_LABEL: Record<string, string> = {
  any: 'Any hotel',
  hostel: 'Hostel / Guesthouse',
  boutique: 'Boutique',
  luxury: 'Luxury',
}

const FOOD_LABEL: Record<string, string> = {
  any: 'Any food style',
  'street-food': 'Street & Local',
  casual: 'Casual Dining',
  'fine-dining': 'Fine Dining',
}

const BLANK_PROFILE: Omit<TravelProfile, 'id'> = {
  name: '',
  trustedSources: [],
  budget: 'midrange',
  hotelStyle: 'any',
  foodStyle: 'any',
  activityStyle: [],
  transportationPreference: 'public',
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<TravelProfile[]>(() => getProfiles())
  const [view, setView] = useState<'list' | 'edit'>('list')
  const [editing, setEditing] = useState<TravelProfile | null>(null)

  function startNew() {
    setEditing({ ...BLANK_PROFILE, id: crypto.randomUUID() })
    setView('edit')
  }

  function startEdit(profile: TravelProfile) {
    setEditing({ ...profile })
    setView('edit')
  }

  function handleSave(profile: TravelProfile) {
    saveProfile(profile)
    setProfiles(getProfiles())
    setView('list')
    setEditing(null)
  }

  function handleDelete(id: string) {
    deleteProfile(id)
    setProfiles(getProfiles())
  }

  function handleBack() {
    setView('list')
    setEditing(null)
  }

  if (view === 'edit' && editing) {
    return (
      <ProfileEditView
        profile={editing}
        onSave={handleSave}
        onBack={handleBack}
      />
    )
  }

  return (
    <ProfileListView
      profiles={profiles}
      onNew={startNew}
      onEdit={startEdit}
      onDelete={handleDelete}
    />
  )
}

// ─── List view ────────────────────────────────────────────────────────────────

function ProfileListView({ profiles, onNew, onEdit, onDelete }: {
  profiles: TravelProfile[]
  onNew: () => void
  onEdit: (p: TravelProfile) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-1">Travel Profiles</h1>
          <p className="text-sm text-slate-400">Each profile shapes your entire travel plan.</p>
        </div>
        <button
          type="button"
          onClick={onNew}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          + New Profile
        </button>
      </div>

      {profiles.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-slate-200 rounded-2xl">
          <p className="text-slate-400 text-sm mb-4">No profiles yet.</p>
          <button
            type="button"
            onClick={onNew}
            className="text-sm font-medium text-slate-700 underline underline-offset-4 cursor-pointer"
          >
            Create your first profile
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profiles.map((p) => (
            <ProfileCard key={p.id} profile={p} onEdit={onEdit} onDelete={onDelete} />
          ))}
          <button
            type="button"
            onClick={onNew}
            className="rounded-2xl border-2 border-dashed border-slate-200 p-6 text-left hover:border-slate-300 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-600 transition-colors">
              <span className="text-2xl font-light">+</span>
              <span className="text-sm font-medium">Create new profile</span>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Profile card ─────────────────────────────────────────────────────────────

function getStyleSummary(profile: TravelProfile): string {
  const parts: string[] = []
  if (profile.hotelStyle !== 'any') parts.push(HOTEL_LABEL[profile.hotelStyle])
  if (profile.foodStyle !== 'any') parts.push(FOOD_LABEL[profile.foodStyle])
  return parts.join(' · ')
}

function ProfileCard({ profile, onEdit, onDelete }: {
  profile: TravelProfile
  onEdit: (p: TravelProfile) => void
  onDelete: (id: string) => void
}) {
  const profileSources = SOURCES.filter((s) => profile.trustedSources.includes(s.value))
  const topActivities = profile.activityStyle.slice(0, 3)
  const styleSummary = getStyleSummary(profile)

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-900 leading-snug">{profile.name || 'Untitled Profile'}</h3>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onEdit(profile)}
            className="text-xs text-slate-400 hover:text-slate-700 transition-colors cursor-pointer font-medium"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(profile.id)}
            className="text-xs text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
            aria-label="Delete profile"
          >
            ✕
          </button>
        </div>
      </div>

      <span className="inline-flex w-fit rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
        {BUDGET_LABEL[profile.budget] ?? profile.budget}
      </span>

      {profileSources.length > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
          {profileSources.map((s) => (
            <span key={s.value} className={`text-sm font-semibold ${s.nameColor}`}>{s.name}</span>
          ))}
        </div>
      )}

      {styleSummary && (
        <p className="text-xs text-slate-400">{styleSummary}</p>
      )}

      {topActivities.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {topActivities.map((a) => (
            <span key={a} className="rounded-full bg-slate-50 border border-slate-100 px-2.5 py-0.5 text-xs text-slate-500 capitalize">
              {a.replace('-', ' ')}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Edit view ────────────────────────────────────────────────────────────────

function ProfileEditView({ profile, onSave, onBack }: {
  profile: TravelProfile
  onSave: (p: TravelProfile) => void
  onBack: () => void
}) {
  const [form, setForm] = useState<TravelProfile>(profile)
  const [saving, setSaving] = useState(false)
  const [nameError, setNameError] = useState('')

  const isNew = !getProfiles().find((p) => p.id === profile.id)

  function setField<K extends keyof TravelProfile>(key: K, value: TravelProfile[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (key === 'name') setNameError('')
  }

  function toggleActivity(value: string) {
    setForm((prev) => ({
      ...prev,
      activityStyle: prev.activityStyle.includes(value)
        ? prev.activityStyle.filter((v) => v !== value)
        : [...prev.activityStyle, value],
    }))
  }

  function toggleSource(value: string) {
    setForm((prev) => ({
      ...prev,
      trustedSources: prev.trustedSources.includes(value)
        ? prev.trustedSources.filter((v) => v !== value)
        : [...prev.trustedSources, value],
    }))
  }

  function handleSave() {
    if (!form.name.trim()) {
      setNameError('Please give this profile a name.')
      return
    }
    setSaving(true)
    setTimeout(() => {
      onSave({ ...form, name: form.name.trim() })
    }, 400)
  }

  if (saving) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Spinner size="sm" />
        <p className="text-sm text-slate-400">Saving profile...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-14">
      {/* Header */}
      <div className="mb-10">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-slate-400 hover:text-slate-700 transition-colors cursor-pointer mb-6 block"
        >
          ← Travel Profiles
        </button>
        <h1 className="text-2xl font-semibold text-slate-900">
          {isNew ? 'New Profile' : 'Edit Profile'}
        </h1>
      </div>

      <div className="flex flex-col gap-10">

        {/* Profile name */}
        <div>
          <Input
            label="Profile name"
            placeholder="e.g. Japan with Friends, Europe Luxury, Solo Adventure..."
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            error={nameError}
          />
        </div>

        {/* Budget */}
        <Section label="Budget" hint="Recommendations are adjusted for your destination.">
          <div className="grid grid-cols-2 gap-2.5">
            {BUDGET_OPTIONS.map((opt) => (
              <TileButton
                key={opt.value}
                label={opt.label}
                sub={opt.sub}
                selected={form.budget === opt.value}
                onClick={() => setField('budget', opt.value)}
              />
            ))}
          </div>
        </Section>

        {/* Hotel Style */}
        <Section label="Hotel Style">
          <div className="grid grid-cols-2 gap-2.5">
            {HOTEL_STYLE_OPTIONS.map((opt) => (
              <TileButton
                key={opt.value}
                label={opt.label}
                sub={opt.sub}
                selected={form.hotelStyle === opt.value}
                onClick={() => setField('hotelStyle', opt.value)}
              />
            ))}
          </div>
        </Section>

        {/* Food Style */}
        <Section label="Food Style">
          <div className="grid grid-cols-2 gap-2.5">
            {FOOD_STYLE_OPTIONS.map((opt) => (
              <TileButton
                key={opt.value}
                label={opt.label}
                sub={opt.sub}
                selected={form.foodStyle === opt.value}
                onClick={() => setField('foodStyle', opt.value)}
              />
            ))}
          </div>
        </Section>

        {/* Activity Style */}
        <Section label="Activity Style" hint="Select all that apply">
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((opt) => (
              <ChipButton
                key={opt.value}
                label={opt.label}
                selected={form.activityStyle.includes(opt.value)}
                onClick={() => toggleActivity(opt.value)}
              />
            ))}
          </div>
        </Section>

        {/* Transportation */}
        <Section label="Getting Around">
          <div className="flex flex-wrap gap-2">
            {TRANSPORT_OPTIONS.map((opt) => (
              <ChipButton
                key={opt.value}
                label={opt.label}
                selected={form.transportationPreference === opt.value}
                onClick={() => setField('transportationPreference', opt.value)}
              />
            ))}
          </div>
        </Section>

        {/* Trusted Sources */}
        <Section label="Trusted Sources" hint="This is the most important choice — it shapes your entire plan.">
          <SourceCardGrid selected={form.trustedSources} onToggle={toggleSource} />
        </Section>

      </div>

      {/* Save */}
      <div className="mt-12 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-3 text-sm font-medium text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          Save Profile
        </button>
      </div>
    </div>
  )
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function Section({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3">
        <p className="text-sm font-medium text-slate-700 mb-0.5">{label}</p>
        {hint && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

function TileButton({ label, sub, selected, onClick }: {
  label: string
  sub: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col gap-1 rounded-xl border p-4 text-left transition-all cursor-pointer ${
        selected
          ? 'bg-slate-900 border-slate-900 text-white'
          : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300'
      }`}
    >
      <span className="text-sm font-semibold">{label}</span>
      <span className="text-xs text-slate-400">{sub}</span>
    </button>
  )
}

function ChipButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
        selected
          ? 'bg-slate-900 text-white border-slate-900'
          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
      }`}
    >
      {label}
    </button>
  )
}
