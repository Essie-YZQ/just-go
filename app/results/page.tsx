'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getTripData } from '@/lib/storage'
import { generateMockResult } from '@/lib/mock-data'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { TravelResult } from '@/lib/types'

type PageData = {
  result: TravelResult
  destination: string
  tripLength: string
  arrivalDate: string
}

export default function ResultsPage() {
  const router = useRouter()
  const [pageData, setPageData] = useState<PageData | null>(null)

  useEffect(() => {
    const data = getTripData()
    if (!data) {
      router.replace('/planner')
      return
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPageData({
      result: generateMockResult(data),
      destination: data.destination,
      tripLength: data.tripLength,
      arrivalDate: data.arrivalDate,
    })
  }, [router])

  if (!pageData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-sm text-slate-400">Loading your travel plan...</p>
      </div>
    )
  }

  const { result, tripLength, arrivalDate } = pageData
  const isGo = result.goNoGo === 'GO'

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1">Your travel plan</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{result.destination}</h1>
            <p className="text-sm text-slate-500 mt-1">
              {arrivalDate && `Arriving ${new Date(arrivalDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · `}
              {tripLength} days
            </p>
          </div>
          <span
            className={`mt-1 shrink-0 rounded-full px-5 py-2 text-sm font-semibold tracking-wide ${
              isGo
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {result.goNoGo}
          </span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed border-l-2 border-slate-200 pl-4">
          {result.goNoGoReason}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Best Area to Stay */}
        <Card>
          <SectionLabel>Best Area to Stay</SectionLabel>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">{result.bestArea.name}</h3>
          <p className="text-sm text-slate-600 mb-3">{result.bestArea.description}</p>
          <p className="text-sm text-slate-500 italic">{result.bestArea.whyStayHere}</p>
        </Card>

        {/* Transportation */}
        <Card>
          <SectionLabel>Getting There & Around</SectionLabel>
          <div className="flex flex-col gap-4">
            <InfoRow label="From the airport" value={result.transportation.fromAirport} />
            <InfoRow label="Getting around" value={result.transportation.gettingAround} />
            <InfoRow label="Pro tip" value={result.transportation.tip} />
          </div>
        </Card>

        {/* Restaurants */}
        <Card>
          <SectionLabel>Where to Eat</SectionLabel>
          <div className="flex flex-col gap-5">
            {result.restaurants.map((r, i) => (
              <div key={i} className="flex gap-4">
                <span className="mt-0.5 text-xs font-mono text-slate-300 w-4 shrink-0">{i + 1}</span>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-slate-900">{r.name}</span>
                    <span className="text-xs text-slate-400">{r.priceRange}</span>
                    {r.source && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{r.source}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-1">{r.cuisine}</p>
                  <p className="text-sm text-slate-600">{r.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Things To Do */}
        <Card>
          <SectionLabel>Things To Do</SectionLabel>
          <div className="flex flex-col gap-4">
            {result.thingsToDo.map((a, i) => (
              <div key={i} className="flex gap-4">
                <span className="mt-0.5 text-xs font-mono text-slate-300 w-4 shrink-0">{i + 1}</span>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-slate-900">{a.name}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{a.type}</span>
                    <span className="text-xs text-slate-400">{a.duration}</span>
                  </div>
                  <p className="text-sm text-slate-600">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Itinerary */}
        <Card>
          <SectionLabel>Day-by-Day Itinerary</SectionLabel>
          <div className="flex flex-col gap-5">
            {result.itinerary.map((day) => (
              <div key={day.day}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Day {day.day}</p>
                <div className="flex flex-col gap-1.5 pl-3 border-l border-slate-100">
                  <DayRow label="Morning" value={day.morning} />
                  <DayRow label="Afternoon" value={day.afternoon} />
                  <DayRow label="Evening" value={day.evening} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Backup Plan */}
        <Card className="bg-slate-50 border-slate-200">
          <SectionLabel>Backup Plan</SectionLabel>
          <p className="text-sm text-slate-600">{result.backupPlan}</p>
        </Card>

        {/* Booking Checklist */}
        <Card>
          <SectionLabel>Booking Checklist</SectionLabel>
          <ul className="flex flex-col gap-2">
            {result.bookingChecklist.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-slate-200 flex items-center justify-center">
                  <span className="sr-only">Unchecked</span>
                </span>
                <span className="text-sm text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-100">
        <Link href="/planner">
          <Button variant="ghost">← Adjust preferences</Button>
        </Link>
        <p className="text-xs text-slate-400 text-center">
          All recommendations are illustrative for MVP v1. Real AI integration coming in v2.
        </p>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-4">{children}</p>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400 mb-0.5">{label}</p>
      <p className="text-sm text-slate-700">{value}</p>
    </div>
  )
}

function DayRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-sm text-slate-600">
      <span className="font-medium text-slate-800">{label}:</span> {value}
    </p>
  )
}
