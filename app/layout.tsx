import type { Metadata } from "next"
import { Chakra_Petch, Inter, Geist_Mono } from "next/font/google"
import { NavLogo } from "@/components/ui/NavLogo"
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`h-full ${chakraPetch.variable} ${inter.variable} ${geistMono.variable}`}
    >
      <body className="min-h-full flex flex-col">
        <header
          className="sticky top-0 z-50"
          style={{
            backgroundColor: "var(--surface)",
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent 0 6px, rgba(255,255,255,.012) 6px 7px)",
          }}
        >
          {/* Brand accent stripe */}
          <div
            aria-hidden
            style={{
              height: "2px",
              background:
                "linear-gradient(90deg, var(--brand) 0%, rgba(242,255,73,0.18) 45%, transparent 70%)",
            }}
          />

          <nav
            className="mx-auto flex items-center px-4"
            style={{ maxWidth: "1152px", height: "56px", gap: "20px" }}
          >
            <NavLogo />

            {/* Chassis separator */}
            <div
              aria-hidden
              style={{
                width: "1px",
                height: "24px",
                backgroundColor: "var(--line)",
                flexShrink: 0,
              }}
            />

            <NavLinks />

            {/* Right-side chassis micro-details */}
            <div
              aria-hidden
              className="ml-auto flex items-center"
              style={{ gap: "8px" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  letterSpacing: "0.1em",
                  color: "var(--line)",
                  userSelect: "none",
                }}
              >
                SYS.NAV // 1.0
              </span>
              <span
                style={{
                  fontSize: "18px",
                  color: "var(--line)",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                ¬
              </span>
            </div>
          </nav>

          {/* Bottom chassis border */}
          <div aria-hidden style={{ height: "1px", backgroundColor: "var(--line)" }} />
        </header>

        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
