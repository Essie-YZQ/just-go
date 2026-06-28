import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { SOURCES } from '@/lib/constants'

const FEATURED_SOURCES = SOURCES.filter((s) => s.featured)

const STEPS = [
  {
    num: '01',
    title: 'Build a Travel Profile',
    body: 'Set your trusted sources, budget, and travel style. Save different profiles for different trips — China Food Trip, Europe Luxury, Weekend Getaway.',
  },
  {
    num: '02',
    title: 'Tell us your trip',
    body: 'Destination, dates, and pace. Your profile pre-fills the rest.',
  },
  {
    num: '03',
    title: 'Get a confident recommendation',
    body: 'A Go / No-Go verdict, where to stay, what to eat, and a full day-by-day plan — built around your sources.',
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section className="mx-auto max-w-3xl px-6 pt-28 pb-20 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 mb-8">
          AI Travel Copilot
        </p>
        <h1 className="text-5xl sm:text-[3.75rem] font-semibold tracking-tight text-slate-900 leading-[1.1] mb-6">
          From &ldquo;Should we go?&rdquo;<br />to a flight booked.
        </h1>
        <p className="text-lg text-slate-500 max-w-lg mx-auto mb-2 leading-relaxed">
          Create a Travel Profile with your trusted sources, budget, and travel style.
          Tell us where you want to go — and get a personalized plan in under 30 minutes.
        </p>
        <p className="text-sm text-slate-400 mb-10">
          For spontaneous travelers. No sign-up required.
        </p>
        <Link href="/planner">
          <Button size="lg">Start Planning →</Button>
        </Link>
      </section>

      {/* ── Pain strip ── */}
      <div className="border-y border-slate-100 bg-slate-50/70 py-4 px-6">
        <p className="text-center text-sm text-slate-400 max-w-2xl mx-auto">
          Most people jump between{' '}
          <span className="text-slate-600 font-medium">
            Google → Reddit → YouTube → Booking → Maps → TikTok
          </span>
          {' '}before deciding. Just Go replaces that loop with one conversation.
        </p>
      </div>

      {/* ── Trusted Sources — core differentiator ── */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-400 mb-4">
            What makes Just Go different
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-5">
            A Reddit local and a Michelin hunter<br className="hidden sm:block" />
            visit the same city. Different plans.
          </h2>
          <p className="text-base text-slate-500 max-w-lg mx-auto leading-relaxed">
            Your Travel Profile is built around the communities you trust —
            not a one-size-fits-all algorithm. A Reddit profile and a Michelin profile
            give completely different recommendations for the same city.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {FEATURED_SOURCES.map((s) => (
            <div key={s.value} className={`rounded-2xl border p-6 ${s.cardBg}`}>
              <p className={`text-sm font-semibold mb-2 ${s.nameColor}`}>{s.name}</p>
              <p className={`text-base font-semibold mb-2 ${s.taglineColor ?? 'text-slate-900'}`}>
                {s.tagline}
              </p>
              <p className={`text-sm leading-relaxed ${s.descColor ?? 'text-slate-500'}`}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400">
          ChatGPT gives the same answer to everyone.{' '}
          <span className="text-slate-600">Just Go doesn&apos;t.</span>
        </p>
      </section>

      <div className="border-t border-slate-100" />

      {/* ── How it works ── */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-400 text-center mb-14">
          How it works
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
          {STEPS.map((s) => (
            <div key={s.num}>
              <p className="text-xs font-mono text-slate-300 mb-3">{s.num}</p>
              <h3 className="text-base font-semibold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-slate-900 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-500 mb-5">
            Stop researching. Start going.
          </p>
          <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight mb-5">
            Just go.
          </h2>
          <p className="text-slate-400 text-base mb-10 max-w-xs mx-auto leading-relaxed">
            A complete, personalized travel plan in under 30 minutes.
          </p>
          <Link href="/planner">
            <Button variant="secondary" size="lg">Start Planning →</Button>
          </Link>
        </div>
      </section>

    </div>
  )
}
