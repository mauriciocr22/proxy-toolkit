"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_ITEMS = [
  { href: "/roster", label: "Roster" },
  { href: "/comp-builder", label: "Comp Builder" },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-6 text-sm">
      {NAV_ITEMS.map(({ href, label }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className="transition-colors hover:text-white"
            style={{
              color: active ? "var(--accent-yellow)" : "var(--text-secondary)",
              fontWeight: active ? 600 : 400,
            }}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
