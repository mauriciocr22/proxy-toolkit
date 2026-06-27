"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const NAV_ITEMS = [
  { href: "/roster", label: "Roster" },
  { href: "/comp-builder", label: "Comp Builder" },
]

export function NavLinks() {
  const pathname = usePathname()
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
      {NAV_ITEMS.map(({ href, label }) => {
        const active = pathname.startsWith(href)
        const isHovered = hovered === href
        return (
          <Link
            key={href}
            href={href}
            onMouseEnter={() => setHovered(href)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              padding: "6px 16px",
              fontFamily: "var(--font-display)",
              fontSize: "0.7rem",
              fontWeight: active ? 600 : 400,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: active ? "var(--brand)" : isHovered ? "var(--fg)" : "var(--muted)",
              transition: "color 0.15s ease",
              textDecoration: "none",
            }}
          >
            {label}
            {active && (
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  bottom: "-2px",
                  left: "50%",
                  transform: "translateX(-50%) skewX(-15deg)",
                  width: "55%",
                  height: "2px",
                  backgroundColor: "var(--brand)",
                  opacity: 0.85,
                }}
              />
            )}
          </Link>
        )
      })}
    </div>
  )
}
