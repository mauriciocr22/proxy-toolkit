import type { Metadata } from "next"
import Link from "next/link"
import { Chakra_Petch, Inter, Geist_Mono } from "next/font/google"
import { NavLinks } from "@/components/ui/NavLinks"
import "./globals.css"

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
})

const inter = Inter({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-body",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Proxy Toolkit",
  description: "Companion app for Zenless Zone Zero — manage your roster, build comps, and get build recommendations.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`h-full ${chakraPetch.variable} ${inter.variable} ${geistMono.variable}`}
    >
      <body className="min-h-full flex flex-col">
        <header
          className="sticky top-0 z-50 border-b"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <nav className="mx-auto flex max-w-6xl items-center gap-8 px-4 h-14">
            <Link
              href="/"
              className="text-sm font-bold tracking-widest uppercase"
              style={{ color: "var(--accent-yellow)" }}
            >
              Proxy Toolkit
            </Link>
            <NavLinks />
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
