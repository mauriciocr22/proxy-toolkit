"use client"

import { useState, useMemo } from "react"
import type { Agent } from "@/types/zzz"
import { useRoster } from "@/hooks/useRoster"

const ELEMENT_HEX: Record<Agent["element"], string> = {
  Fire:     "#FF4D3D",
  Ice:      "#5FD0FF",
  Electric: "#4D7BFF",
  Physical: "#F7D94C",
  Ether:    "#FF4DB8",
  Wind:     "#4DFFB8",
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
      {/* Toggle buttons */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <button
          onClick={() => setShowAll(false)}
          style={{
            padding: "5px 14px",
            backgroundColor: !showAll ? "var(--brand)" : "var(--surface-2)",
            color: !showAll ? "#000" : "var(--muted)",
            fontFamily: "var(--font-display)",
            fontSize: "0.65rem",
            fontWeight: !showAll ? 700 : 400,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            border: !showAll ? "none" : "1px solid var(--line)",
            cursor: "pointer",
            clipPath: "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 0 100%)",
            transition: "background-color 0.15s ease, color 0.15s ease",
          }}
        >
          ROSTER ({ownedCount})
        </button>
        <button
          onClick={() => setShowAll(true)}
          style={{
            padding: "5px 14px",
            backgroundColor: showAll ? "var(--brand)" : "var(--surface-2)",
            color: showAll ? "#000" : "var(--muted)",
            fontFamily: "var(--font-display)",
            fontSize: "0.65rem",
            fontWeight: showAll ? 700 : 400,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            border: showAll ? "none" : "1px solid var(--line)",
            cursor: "pointer",
            clipPath: "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 0 100%)",
            transition: "background-color 0.15s ease, color 0.15s ease",
          }}
        >
          TODOS
        </button>
      </div>

      {displayed.length === 0 ? (
        <p style={{ padding: "32px 0", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--muted)", letterSpacing: "0.06em" }}>
          {">"} Nenhum agente no roster.{" "}
          <a href="/roster" style={{ color: "var(--brand)", textDecoration: "underline" }}>
            Adicione agentes
          </a>{" "}
          primeiro.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
          {displayed.map((agent) => {
            const selected = isSelected(agent.id)
            const disabled = isFull && !selected
            const elColor = ELEMENT_HEX[agent.element]

            return (
              <button
                key={agent.id}
                onClick={() => onToggle(agent.id)}
                disabled={disabled}
                className="flex flex-col items-center p-2 text-center transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30"
                style={{
                  border: selected ? `2px solid var(--brand)` : "1px solid var(--line)",
                  backgroundColor: selected ? "rgba(242,255,73,0.08)" : "var(--surface)",
                  clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)",
                  boxShadow: selected ? "0 0 10px rgba(242,255,73,0.2)" : "none",
                  transition: "border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease",
                }}
                aria-pressed={selected}
                aria-label={agent.name}
              >
                <div
                  style={{
                    marginBottom: "4px",
                    width: "48px",
                    height: "48px",
                    overflow: "hidden",
                    backgroundColor: "var(--bg)",
                    clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)",
                  }}
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
                  className="w-full truncate"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "9px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--fg)",
                  }}
                >
                  {agent.name}
                </span>
                <span
                  style={{
                    marginTop: "2px",
                    padding: "1px 5px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "8px",
                    color: elColor,
                    backgroundColor: `${elColor}18`,
                    border: `1px solid ${elColor}44`,
                  }}
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
