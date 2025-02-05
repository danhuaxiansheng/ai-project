import type { Metadata } from "next"
import { GeistSans } from 'geist/font/sans'
import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"

export const metadata: Metadata = {
  title: "AI 小说创作系统",
  description: "基于 DeepSeek 的智能小说创作系统",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
} 