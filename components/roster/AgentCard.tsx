"use client"

import Link from "next/link"
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
    <div
      className="relative flex flex-col items-center rounded-xl border-2 p-3 text-center transition-all"
      style={{
        backgroundColor: owned ? "var(--bg-elevated)" : "var(--bg-card)",
        borderColor: owned ? rarityBorder : "var(--border)",
        opacity: owned ? 1 : 0.55,
      }}
    >
      {/* Owned toggle */}
      <button
        onClick={() => onToggle(agent.id)}
        className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-colors"
        style={{
          backgroundColor: owned ? "var(--accent-yellow)" : "var(--bg-base)",
          color: owned ? "#000" : "var(--text-muted)",
          border: owned ? "none" : "1px solid var(--border)",
        }}
        aria-label={owned ? `Remover ${agent.name} do roster` : `Adicionar ${agent.name} ao roster`}
      >
        {owned ? "✓" : "+"}
      </button>

      {/* Link to agent detail page */}
      <Link
        href={`/agent/${agent.id}`}
        className="flex flex-col items-center gap-1.5 focus:outline-none focus-visible:ring-2 rounded-lg"
        style={{ "--tw-ring-color": "var(--accent-yellow)" } as React.CSSProperties}
        tabIndex={0}
      >
        <div
          className="h-16 w-16 overflow-hidden rounded-lg"
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
          className="w-full truncate text-xs font-semibold"
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
      </Link>
    </div>
  )
}
