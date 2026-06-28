'use client'

import { SOURCES } from '@/lib/constants'

interface SourceCardGridProps {
  selected: string[]
  onToggle: (value: string) => void
}

export function SourceCardGrid({ selected, onToggle }: SourceCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {SOURCES.map((s) => {
        const isSelected = selected.includes(s.value)
        return (
          <button
            key={s.value}
            type="button"
            onClick={() => onToggle(s.value)}
            className={`rounded-2xl border-2 p-5 text-left transition-all cursor-pointer ${
              isSelected
                ? `${s.selectedBg} ${s.selectedBorder}`
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <p className={`text-sm font-bold mb-1 ${isSelected ? s.nameColor : 'text-slate-800'}`}>
              {s.name}
            </p>
            <p className={`text-sm font-medium mb-1 ${isSelected ? (s.taglineColor ?? 'text-slate-700') : 'text-slate-600'}`}>
              {s.tagline}
            </p>
            <p className={`text-xs leading-relaxed ${isSelected ? (s.descColor ?? 'text-slate-500') : 'text-slate-400'}`}>
              {s.desc}
            </p>
          </button>
        )
      })}
    </div>
  )
}
