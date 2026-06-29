'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { SOURCES } from '@/lib/constants'
import { useT } from '@/lib/i18n'

const FEATURED_SOURCES = SOURCES.filter((s) => s.featured)

export default function HomePage() {
  const t = useT()

  const steps = [
    { num: '01', titleKey: 'home.step1.title', bodyKey: 'home.step1.body' },
    { num: '02', titleKey: 'home.step2.title', bodyKey: 'home.step2.body' },
    { num: '03', titleKey: 'home.step3.title', bodyKey: 'home.step3.body' },
  ]

  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section className="mx-auto max-w-3xl px-6 pt-28 pb-20 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 mb-8">
          {t('home.eyebrow')}
        </p>
        <h1 className="text-5xl sm:text-[3.75rem] font-semibold tracking-tight text-slate-900 leading-[1.1] mb-6 whitespace-pre-line">
          {t('home.hero.title')}
        </h1>
        <p className="text-lg text-slate-500 max-w-lg mx-auto mb-2 leading-relaxed">
          {t('home.hero.body')}
        </p>
        <p className="text-sm text-slate-400 mb-10">
          {t('home.hero.sub')}
        </p>
        <Link href="/planner">
          <Button size="lg">{t('home.cta')}</Button>
        </Link>
      </section>

      {/* ── Pain strip ── */}
      <div className="border-y border-slate-100 bg-slate-50/70 py-4 px-6">
        <p className="text-center text-sm text-slate-400 max-w-2xl mx-auto">
          {t('home.pain').split(t('home.pain.links')).map((part, i, arr) =>
            i < arr.length - 1 ? (
              <span key={i}>
                {part}
                <span className="text-slate-600 font-medium">{t('home.pain.links')}</span>
              </span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </p>
      </div>

      {/* ── Trusted Sources — core differentiator ── */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-400 mb-4">
            {t('home.sources.eyebrow')}
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-5 whitespace-pre-line">
            {t('home.sources.title')}
          </h2>
          <p className="text-base text-slate-500 max-w-lg mx-auto leading-relaxed">
            {t('home.sources.body')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {FEATURED_SOURCES.map((s) => (
            <div key={s.value} className={`rounded-2xl border p-6 ${s.cardBg}`}>
              <p className={`text-sm font-semibold mb-2 ${s.nameColor}`}>{s.name}</p>
              <p className={`text-base font-semibold mb-2 ${s.taglineColor ?? 'text-slate-900'}`}>
                {t(`source.${s.value}.tagline`)}
              </p>
              <p className={`text-sm leading-relaxed ${s.descColor ?? 'text-slate-500'}`}>
                {t(`source.${s.value}.desc`)}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400">
          {t('home.sources.footer.normal')}
          <span className="text-slate-600">{t('home.sources.footer.emphasis')}</span>
        </p>
      </section>

      <div className="border-t border-slate-100" />

      {/* ── How it works ── */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-400 text-center mb-14">
          {t('home.how.eyebrow')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
          {steps.map((s) => (
            <div key={s.num}>
              <p className="text-xs font-mono text-slate-300 mb-3">{s.num}</p>
              <h3 className="text-base font-semibold text-slate-900 mb-2">{t(s.titleKey)}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{t(s.bodyKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-slate-900 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-500 mb-5">
            {t('home.finalCta.eyebrow')}
          </p>
          <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight mb-5">
            {t('home.finalCta.title')}
          </h2>
          <p className="text-slate-400 text-base mb-10 max-w-xs mx-auto leading-relaxed">
            {t('home.finalCta.body')}
          </p>
          <Link href="/planner">
            <Button variant="secondary" size="lg">{t('home.cta')}</Button>
          </Link>
        </div>
      </section>

    </div>
  )
}
