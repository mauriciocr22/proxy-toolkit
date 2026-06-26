import type { Metadata } from "next"
import Link from "next/link"
import "./globals.css"

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
    <html lang="en" className="h-full">
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
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/roster"
                className="transition-colors hover:text-white"
                style={{ color: "var(--text-secondary)" }}
              >
                Roster
              </Link>
              <Link
                href="/comp-builder"
                className="transition-colors hover:text-white"
                style={{ color: "var(--text-secondary)" }}
              >
                Comp Builder
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
