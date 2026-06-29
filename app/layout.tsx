import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { LanguageProvider } from '@/lib/i18n'
import { SiteHeader } from '@/components/SiteHeader'
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
        <LanguageProvider>
          <SiteHeader />
          <main className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-slate-100 py-6">
      <div className="mx-auto max-w-5xl px-6 text-center text-xs text-slate-400">
        Just Go — AI Travel Copilot · MVP v1
      </div>
    </footer>
  )
}
