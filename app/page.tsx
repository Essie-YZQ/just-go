import Link from 'next/link'
import { Button } from '@/components/ui/Button'

const SOURCES = [
  { name: 'Reddit', style: 'bg-orange-50 text-orange-700 border-orange-200' },
  { name: 'RedNote', style: 'bg-rose-50 text-rose-700 border-rose-200' },
  { name: 'Google Reviews', style: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'Michelin Guide', style: 'bg-slate-900 text-white border-slate-900' },
  { name: 'YouTube', style: 'bg-red-50 text-red-700 border-red-200' },
  { name: 'Eater', style: 'bg-amber-50 text-amber-700 border-amber-200' },
  { name: 'Local Blogs', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
]

const STEPS = [
  {
    step: '01',
    title: 'Tell us about your trip',
    body: "Where you're going, when, your budget, and what kind of traveler you are.",
  },
  {
    step: '02',
    title: 'Pick your trusted sources',
    body: 'Reddit, Michelin, RedNote, Google Reviews — whoever you actually trust for travel tips.',
  },
  {
    step: '03',
    title: 'Get your plan',
    body: 'A Go/No-Go verdict, best area to stay, restaurants, and a full itinerary — in minutes.',
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-500 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
          For spontaneous travelers
        </div>

        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-slate-900 leading-tight mb-5">
          From &ldquo;Should we go?&rdquo;<br />to &ldquo;Let&rsquo;s go.&rdquo;
        </h1>

        <p className="text-xl text-slate-600 max-w-md mx-auto mb-3 font-medium">
          Stop switching between 10 tabs.
        </p>
        <p className="text-base text-slate-400 max-w-lg mx-auto mb-10 leading-relaxed">
          Tell us where you want to go. Pick the sources you trust.
          Get a complete, personalized travel plan in under 30 minutes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/planner">
            <Button size="lg">Start Planning →</Button>
          </Link>
          <p className="text-xs text-slate-400">No sign-up required</p>
        </div>
      </section>

      {/* Pain point strip */}
      <div className="border-y border-slate-100 bg-slate-50 py-4">
        <p className="text-center text-sm text-slate-400 px-6">
          Most people jump between{' '}
          <span className="text-slate-600 font-medium">
            Google → Reddit → YouTube → Booking → Maps → TikTok
          </span>{' '}
          before deciding. Just Go does it in one place.
        </p>
      </div>

      {/* Trusted Sources — core differentiator */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-4">
          What makes Just Go different
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-5">
          Same city. Different traveler.<br />Completely different plan.
        </h2>
        <p className="text-base text-slate-500 max-w-lg mx-auto mb-12 leading-relaxed">
          A Reddit foodie, a Michelin hunter, and a RedNote traveler all visiting Tokyo
          will each get a completely different set of recommendations —
          because they trust different sources.
        </p>

        <div className="flex flex-wrap justify-center gap-2.5 mb-5">
          {SOURCES.map((source) => (
            <span
              key={source.name}
              className={`rounded-full border px-4 py-2 text-sm font-medium ${source.style}`}
            >
              {source.name}
            </span>
          ))}
        </div>

        <p className="text-xs text-slate-400">
          Your plan is shaped by the communities you trust — not a generic algorithm.
        </p>
      </section>

      <div className="border-t border-slate-100" />

      {/* How it works */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 text-center mb-12">
          How it works
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {STEPS.map((item) => (
            <div key={item.step} className="flex flex-col gap-3">
              <span className="text-xs font-mono text-slate-300">{item.step}</span>
              <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-4">
            Ready?
          </p>
          <h2 className="text-4xl font-semibold text-white mb-4 tracking-tight">
            Just go.
          </h2>
          <p className="text-slate-400 mb-8 text-sm max-w-sm mx-auto leading-relaxed">
            Your complete travel plan — built around the sources you trust — in under 30 minutes.
          </p>
          <Link href="/planner">
            <Button variant="secondary" size="lg">
              Start Planning →
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
