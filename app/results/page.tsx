'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getTripData } from '@/lib/storage'
import { generateMockResult } from '@/lib/mock-data'
import type { TravelResult } from '@/lib/types'

type PageData = {
  result: TravelResult
  tripLength: string
  arrivalDate: string
}

export default function ResultsPage() {
  const router = useRouter()
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [checked, setChecked] = useState<Set<number>>(new Set())

  useEffect(() => {
    const data = getTripData()
    if (!data) {
      router.replace('/planner')
      return
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPageData({
      result: generateMockResult(data),
      tripLength: data.tripLength,
      arrivalDate: data.arrivalDate,
    })
  }, [router])

  function toggleCheck(i: number) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(i)) { next.delete(i) } else { next.add(i) }
      return next
    })
  }

  if (!pageData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-6 w-6 rounded-full border-2 border-slate-200 border-t-slate-700 animate-spin" />
        <p className="text-sm text-slate-400">Loading your travel plan...</p>
      </div>
    )
  }

  const { result, tripLength, arrivalDate } = pageData
  const isGo = result.goNoGo === 'GO'

  const formattedDate = arrivalDate
    ? new Date(arrivalDate + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">

      {/* ── Verdict header ── */}
      <div className="mb-10">
        <div className="flex items-start gap-5 mb-6">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-slate-400 mb-2">
              Your travel plan
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 mb-2">
              {result.destination}
            </h1>
            <p className="text-sm text-slate-400">
              {formattedDate && `${formattedDate} · `}{tripLength} days
            </p>
          </div>

          <div className={`shrink-0 rounded-2xl px-6 py-4 text-center mt-1 ${
            isGo ? 'bg-emerald-50' : 'bg-rose-50'
          }`}>
            <p className={`text-2xl font-bold tracking-wide ${
              isGo ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              {result.goNoGo}
            </p>
            <p className={`text-xs font-medium mt-0.5 ${
              isGo ? 'text-emerald-500' : 'text-rose-500'
            }`}>
              {isGo ? 'Recommended' : 'Not recommended'}
            </p>
          </div>
        </div>

        {/* AI companion take */}
        <p className="text-base text-slate-600 leading-relaxed border-l-2 border-slate-200 pl-5">
          {result.goNoGoReason}
        </p>
      </div>

      {/* ── Quick info strip ── */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 py-5 mb-10 border-y border-slate-100 text-sm">
        <span className="text-slate-400">
          Stay in{' '}
          <span className="font-semibold text-slate-800">{result.bestArea.name}</span>
        </span>
        <span className="text-slate-300 hidden sm:inline">·</span>
        <span className="text-slate-400">
          {result.transportation.gettingAround.split('.')[0]}
        </span>
      </div>

      {/* ── Content sections ── */}
      <div className="flex flex-col gap-10">

        {/* Where to Stay */}
        <section>
          <SectionHeading>Where to Stay</SectionHeading>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">{result.bestArea.name}</h3>
            <p className="text-sm text-slate-600 mb-3 leading-relaxed">{result.bestArea.description}</p>
            <p className="text-sm text-slate-500 italic">{result.bestArea.whyStayHere}</p>
          </div>
        </section>

        {/* Getting There */}
        <section>
          <SectionHeading>Getting There</SectionHeading>
          <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-5">
            <InfoBlock label="From the airport" value={result.transportation.fromAirport} />
            <InfoBlock label="Getting around" value={result.transportation.gettingAround} />
            <InfoBlock label="Local tip" value={result.transportation.tip} />
          </div>
        </section>

        {/* Where to Eat */}
        <section>
          <SectionHeading>Where to Eat</SectionHeading>
          <div className="flex flex-col gap-3">
            {result.restaurants.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{r.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{r.cuisine}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 mt-0.5">
                    {r.source && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                        {r.source}
                      </span>
                    )}
                    <span className="text-sm text-slate-400">{r.priceRange}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{r.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What to Do */}
        <section>
          <SectionHeading>What to Do</SectionHeading>
          <div className="flex flex-col gap-3">
            {result.thingsToDo.map((a, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-sm font-semibold text-slate-900">{a.name}</h3>
                  <span className="text-xs text-slate-400 shrink-0 mt-0.5">{a.duration}</span>
                </div>
                <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500 mb-2">
                  {a.type}
                </span>
                <p className="text-sm text-slate-600 leading-relaxed">{a.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Itinerary */}
        <section>
          <SectionHeading>Your Itinerary</SectionHeading>
          <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-7">
            {result.itinerary.map((day) => (
              <div key={day.day}>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.12em] mb-4">
                  Day {day.day}
                </p>
                <div className="flex flex-col gap-3 pl-4 border-l-2 border-slate-100">
                  <TimeSlot label="Morning" value={day.morning} />
                  <TimeSlot label="Afternoon" value={day.afternoon} />
                  <TimeSlot label="Evening" value={day.evening} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Plan B */}
        <section>
          <SectionHeading>Plan B</SectionHeading>
          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-6">
            <p className="text-sm text-slate-600 leading-relaxed">{result.backupPlan}</p>
          </div>
        </section>

        {/* Before You Book */}
        <section>
          <SectionHeading>Before You Book</SectionHeading>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <ul className="flex flex-col gap-3">
              {result.bookingChecklist.map((item, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => toggleCheck(i)}
                    className="flex items-start gap-3 text-left w-full group cursor-pointer"
                  >
                    <div className={`mt-0.5 h-4 w-4 rounded shrink-0 border-2 flex items-center justify-center transition-all ${
                      checked.has(i)
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-slate-300 group-hover:border-slate-400'
                    }`}>
                      {checked.has(i) && (
                        <span className="text-white text-[10px] leading-none font-bold">✓</span>
                      )}
                    </div>
                    <span className={`text-sm transition-colors ${
                      checked.has(i) ? 'text-slate-400 line-through' : 'text-slate-700'
                    }`}>
                      {item}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

      </div>

      {/* ── Footer actions ── */}
      <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/planner"
          className="text-sm text-slate-400 hover:text-slate-700 transition-colors"
        >
          ← Adjust preferences
        </Link>
        <p className="text-xs text-slate-300 text-center">
          MVP v1 · Real AI integration coming in v2
        </p>
      </div>

    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold text-slate-900 mb-4">{children}</h2>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm text-slate-700 leading-relaxed">{value}</p>
    </div>
  )
}

function TimeSlot({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <span className="text-xs font-medium text-slate-400 w-16 shrink-0 pt-0.5">{label}</span>
      <p className="text-sm text-slate-700 leading-relaxed">{value}</p>
    </div>
  )
}
