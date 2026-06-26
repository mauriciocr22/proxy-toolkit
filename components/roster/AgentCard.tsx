"use client"

import type { Agent } from "@/types/zzz"

const ELEMENT_COLORS: Record<Agent["element"], string> = {
  Fire: "#ef4444",
  Ice: "#38bdf8",
  Electric: "#a855f7",
  Physical: "#94a3b8",
  Ether: "#34d399",
  Wind: "#4ade80",
}

interface AgentCardProps {
  agent: Agent
  owned: boolean
  onToggle: (agentId: string) => void
}

export function AgentCard({ agent, owned, onToggle }: AgentCardProps) {
  const elementColor = ELEMENT_COLORS[agent.element]
  const rarityBorder = agent.rarity === "S" ? "var(--rarity-s)" : "var(--rarity-a)"

  return (
    <button
      onClick={() => onToggle(agent.id)}
      className="relative flex flex-col items-center rounded-xl border-2 p-3 text-center transition-all hover:scale-105 focus:outline-none"
      style={{
        backgroundColor: owned ? "var(--bg-elevated)" : "var(--bg-card)",
        borderColor: owned ? rarityBorder : "var(--border)",
        opacity: owned ? 1 : 0.55,
      }}
      aria-pressed={owned}
      aria-label={`${agent.name} — ${owned ? "owned" : "not owned"}`}
    >
      {owned && (
        <span
          className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-black"
          style={{ backgroundColor: "var(--accent-yellow)" }}
        >
          ✓
        </span>
      )}

      <div
        className="relative mb-2 h-16 w-16 overflow-hidden rounded-lg"
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

      <span
        className="mb-1 w-full truncate text-xs font-semibold"
        style={{ color: "var(--text-primary)" }}
      >
        {agent.name}
      </span>

      <span
        className="rounded px-1.5 py-0.5 text-[10px] font-medium text-black"
        style={{ backgroundColor: elementColor }}
      >
        {agent.element}
      </span>
    </button>
  )
}
