"use client"

import type { WEngine } from "@/types/zzz"

const RARITY_COLORS: Record<WEngine["rarity"], string> = {
  S: "var(--rarity-s)",
  A: "var(--rarity-a)",
  B: "#3b82f6",
}

interface WEngineCardProps {
  wEngine: WEngine
  label?: string
}

export function WEngineCard({ wEngine, label }: WEngineCardProps) {
  return (
    <div
      className="rounded-xl border-2 p-4"
      style={{
        borderColor: RARITY_COLORS[wEngine.rarity],
        backgroundColor: "var(--bg-elevated)",
      }}
    >
      {label && (
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
      )}
      <div className="flex items-center gap-2">
        <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
          {wEngine.name}
        </span>
        <span
          className="rounded px-1.5 py-0.5 text-[10px] font-bold text-black"
          style={{ backgroundColor: RARITY_COLORS[wEngine.rarity] }}
        >
          {wEngine.rarity}
        </span>
      </div>
      {wEngine.specialty && (
        <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
          {wEngine.specialty}
        </p>
      )}
      {wEngine.description && (
        <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {wEngine.description}
        </p>
      )}
    </div>
  )
}
