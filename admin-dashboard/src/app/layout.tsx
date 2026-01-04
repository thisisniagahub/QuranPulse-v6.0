import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AdminSidebar } from '@/components/admin/Sidebar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QuranPulse Mission Control',
  description: 'Admin Dashboard for QuranPulse',
}

import { CommandMenu } from '@/components/admin/CommandMenu'

// ... existing imports

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CommandMenu>
          <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </CommandMenu>
      </body>
    </html>
  )
}
