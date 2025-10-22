import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '吵架包赢',
  description: '智能生成强有力的回击话语',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  )
}
