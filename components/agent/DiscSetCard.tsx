"use client"

import type { DiscSet } from "@/types/zzz"

interface DiscSetCardProps {
  discSet: DiscSet
  label?: string
}

export function DiscSetCard({ discSet, label }: DiscSetCardProps) {
  return (
    <div
      className="rounded-xl border-2 p-4"
      style={{ borderColor: "var(--accent-cyan-dim)", backgroundColor: "var(--bg-elevated)" }}
    >
      {label && (
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
      )}
      <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
        {discSet.name}
      </p>
      {discSet.twoPieceBonus && (
        <div className="mt-2">
          <span
            className="text-[10px] font-bold uppercase tracking-wide"
            style={{ color: "var(--accent-cyan)" }}
          >
            2 peças
          </span>
          <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {discSet.twoPieceBonus}
          </p>
        </div>
      )}
      {discSet.fourPieceBonus && (
        <div className="mt-2">
          <span
            className="text-[10px] font-bold uppercase tracking-wide"
            style={{ color: "var(--accent-cyan)" }}
          >
            4 peças
          </span>
          <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {discSet.fourPieceBonus}
          </p>
        </div>
      )}
    </div>
  )
}
