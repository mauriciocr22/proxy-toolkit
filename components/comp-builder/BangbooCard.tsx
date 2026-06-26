"use client"

import type { Bangboo } from "@/types/zzz"

interface BangbooCardProps {
  bangboo: Bangboo
}

export function BangbooCard({ bangboo }: BangbooCardProps) {
  return (
    <div
      className="flex items-center gap-4 rounded-xl border-2 p-4"
      style={{
        borderColor: bangboo.rarity === "S" ? "var(--rarity-s)" : "var(--rarity-a)",
        backgroundColor: "var(--bg-elevated)",
      }}
    >
      <div
        className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl"
        style={{ backgroundColor: "var(--bg-base)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bangboo.iconUrl}
          alt={bangboo.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).style.display = "none"
          }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
            {bangboo.name}
          </span>
          <span
            className="rounded px-1.5 py-0.5 text-[10px] font-bold"
            style={{
              backgroundColor: bangboo.rarity === "S" ? "var(--rarity-s)" : "var(--rarity-a)",
              color: "#000",
            }}
          >
            {bangboo.rarity}
          </span>
        </div>
        {bangboo.description && (
          <p className="mt-1 line-clamp-2 text-xs" style={{ color: "var(--text-secondary)" }}>
            {bangboo.description}
          </p>
        )}
      </div>
    </div>
  )
}
