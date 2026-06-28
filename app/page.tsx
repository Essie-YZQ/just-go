import Link from 'next/link'
import { Button } from '@/components/ui/Button'

const SOURCES = ['RedNote', 'Reddit', 'Google Reviews', 'Eater', 'Michelin', 'YouTube', 'Local Blogs']

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-20 text-center">
        <p className="text-sm font-medium text-slate-400 tracking-widest uppercase mb-6">
          AI Travel Copilot
        </p>
        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-slate-900 leading-tight mb-6">
          From &ldquo;Should we go?&rdquo;<br />to &ldquo;Let&rsquo;s go.&rdquo;
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
          Describe your trip. Get a personalized travel plan in minutes —
          built around the sources you actually trust.
        </p>
        <Link href="/planner">
          <Button size="lg">Start Planning</Button>
        </Link>
      </section>

      <div className="border-t border-slate-100" />

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 text-center mb-12">
          How it works
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {[
            { step: '01', title: 'Tell us your trip', body: "Destination, dates, budget, and what you're looking for." },
            { step: '02', title: 'Choose your sources', body: 'Pick the communities and platforms you trust for travel recommendations.' },
            { step: '03', title: 'Get your plan', body: 'Receive a Go/No-Go verdict, best area to stay, restaurants, and a day-by-day itinerary.' },
          ].map((item) => (
            <div key={item.step} className="flex flex-col gap-3">
              <span className="text-xs font-mono text-slate-300">{item.step}</span>
              <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-slate-100" />

      {/* Trusted sources */}
      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-6">
          Personalized by your trusted sources
        </p>
        <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
          A foodie on Reddit gets different picks than a traveler on Michelin or RedNote.
          The same city. A completely different experience.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {SOURCES.map((source) => (
            <span key={source} className="rounded-full border border-slate-200 px-4 py-1.5 text-sm text-slate-600">
              {source}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl font-semibold text-white mb-4 tracking-tight">
            Ready to stop planning and just go?
          </h2>
          <p className="text-slate-400 mb-8 text-sm">
            Your personalized travel plan is 3 minutes away.
          </p>
          <Link href="/planner">
            <Button variant="secondary" size="lg">
              Plan My Trip
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
