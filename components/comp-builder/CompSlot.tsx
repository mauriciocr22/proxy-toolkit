"use client"

import type { Agent } from "@/types/zzz"

interface CompSlotProps {
  agent: Agent | undefined
  index: number
  onRemove: (index: number) => void
}

export function CompSlot({ agent, index, onRemove }: CompSlotProps) {
  if (!agent) {
    return (
      <div
        className="flex h-24 flex-col items-center justify-center rounded-xl border-2 border-dashed"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}
      >
        <span className="text-2xl" style={{ color: "var(--text-muted)" }}>+</span>
        <span className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
          Slot {index + 1}
        </span>
      </div>
    )
  }

  return (
    <div
      className="relative flex h-24 items-center gap-3 rounded-xl border-2 px-3"
      style={{
        borderColor: agent.rarity === "S" ? "var(--rarity-s)" : "var(--rarity-a)",
        backgroundColor: "var(--bg-elevated)",
      }}
    >
      <div
        className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg"
        style={{ backgroundColor: "var(--bg-base)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={agent.iconUrl}
          alt={agent.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).style.display = "none"
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {agent.name}
        </p>
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          {agent.element} · {agent.specialty}
        </p>
      </div>
      <button
        onClick={() => onRemove(index)}
        className="flex-shrink-0 rounded-full p-1 text-xs transition-colors hover:text-white"
        style={{ color: "var(--text-muted)" }}
        aria-label={`Remove ${agent.name}`}
      >
        ✕
      </button>
    </div>
  )
}
