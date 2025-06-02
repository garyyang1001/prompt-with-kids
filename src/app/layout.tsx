import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI親子創作坊 - Prompt Engineering學習平台',
  description: '讓家長與孩子在創作中自然掌握AI溝通技巧',
  keywords: ['AI教育', '親子學習', 'Prompt Engineering', '創作'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        <div className="min-h-screen bg-bg-cream">
          {children}
        </div>
      </body>
    </html>
  )
}