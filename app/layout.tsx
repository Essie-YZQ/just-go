import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Just Go — AI Travel Copilot',
  description: 'Go from "Should we go?" to "Let\'s go." in under 30 minutes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body className="min-h-screen flex flex-col bg-[#FAFAF8]">
        <header className="sticky top-0 z-50 border-b border-slate-100 bg-[#FAFAF8]/90 backdrop-blur-sm">
          <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
            <Link href="/" className="text-base font-semibold tracking-tight text-slate-900 hover:opacity-70 transition-opacity">
              Just Go
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/planner" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Plan a Trip
              </Link>
              <Link href="/preferences" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Preferences
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t border-slate-100 py-6">
          <div className="mx-auto max-w-5xl px-6 text-center text-xs text-slate-400">
            Just Go — AI Travel Copilot · MVP v1
          </div>
        </footer>
      </body>
    </html>
  )
}
