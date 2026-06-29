'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'

export function SiteHeader() {
  const { lang, setLang, t } = useLanguage()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-[#FAFAF8]/90 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-slate-900 hover:opacity-70 transition-opacity"
        >
          {t('nav.brand')}
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/planner"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            {t('nav.planTrip')}
          </Link>
          <Link
            href="/profiles"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            {t('nav.travelProfiles')}
          </Link>

          {/* Language toggle */}
          <button
            type="button"
            onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
            className="text-sm font-medium text-slate-400 hover:text-slate-700 transition-colors cursor-pointer tabular-nums"
            aria-label="Switch language"
          >
            {t('nav.langToggle')}
          </button>
        </nav>
      </div>
    </header>
  )
}
