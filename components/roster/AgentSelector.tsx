"use client"

import { useState, useMemo } from "react"
import type { Agent } from "@/types/zzz"
import { useRoster } from "@/hooks/useRoster"

const ELEMENT_COLORS: Record<Agent["element"], string> = {
  Fire: "#ef4444",
  Ice: "#38bdf8",
  Electric: "#a855f7",
  Physical: "#94a3b8",
  Ether: "#34d399",
  Wind: "#4ade80",
}

interface AgentSelectorProps {
  agents: Agent[]
  isSelected: (id: string) => boolean
  isFull: boolean
  onToggle: (id: string) => void
}

export function AgentSelector({ agents, isSelected, isFull, onToggle }: AgentSelectorProps) {
  const { isOwned } = useRoster()
  const [showAll, setShowAll] = useState(false)

  const sorted = useMemo(() => {
    return [...agents].sort((a, b) => {
      const aOwned = isOwned(a.id) ? 0 : 1
      const bOwned = isOwned(b.id) ? 0 : 1
      return aOwned - bOwned || a.name.localeCompare(b.name)
    })
  }, [agents, isOwned])

  const displayed = useMemo(() => {
    if (showAll) return sorted
    return sorted.filter((a) => isOwned(a.id))
  }, [sorted, showAll, isOwned])

  const ownedCount = sorted.filter((a) => isOwned(a.id)).length

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <button
          onClick={() => setShowAll(false)}
          className="rounded-md px-3 py-1 text-xs font-medium transition-colors"
          style={{
            backgroundColor: !showAll ? "var(--accent-yellow)" : "var(--bg-elevated)",
            color: !showAll ? "#000" : "var(--text-secondary)",
          }}
        >
          Meu Roster ({ownedCount})
        </button>
        <button
          onClick={() => setShowAll(true)}
          className="rounded-md px-3 py-1 text-xs font-medium transition-colors"
          style={{
            backgroundColor: showAll ? "var(--accent-yellow)" : "var(--bg-elevated)",
            color: showAll ? "#000" : "var(--text-secondary)",
          }}
        >
          Todos os Agentes
        </button>
      </div>

      {displayed.length === 0 ? (
        <p className="py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
          Nenhum agente no seu roster.{" "}
          <a href="/roster" className="underline" style={{ color: "var(--accent-yellow)" }}>
            Adicione agentes
          </a>{" "}
          primeiro.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
          {displayed.map((agent) => {
            const selected = isSelected(agent.id)
            const disabled = isFull && !selected

            return (
              <button
                key={agent.id}
                onClick={() => onToggle(agent.id)}
                disabled={disabled}
                className="flex flex-col items-center rounded-xl border-2 p-2 text-center transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30"
                style={{
                  borderColor: selected ? "var(--accent-yellow)" : "var(--border)",
                  backgroundColor: selected ? "rgba(245,196,0,0.1)" : "var(--bg-card)",
                }}
                aria-pressed={selected}
                aria-label={agent.name}
              >
                <div
                  className="mb-1 h-12 w-12 overflow-hidden rounded-lg"
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
                <span className="w-full truncate text-[10px] font-medium" style={{ color: "var(--text-primary)" }}>
                  {agent.name}
                </span>
                <span
                  className="mt-0.5 rounded px-1 py-px text-[9px] font-medium text-black"
                  style={{ backgroundColor: ELEMENT_COLORS[agent.element] }}
                >
                  {agent.element}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
