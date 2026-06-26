"use client"

import { useState, useMemo } from "react"
import type { Agent } from "@/types/zzz"
import { useRoster } from "@/hooks/useRoster"
import { AgentCard } from "@/components/roster/AgentCard"

const ELEMENTS: Array<Agent["element"] | "All"> = [
  "All", "Fire", "Ice", "Electric", "Physical", "Ether", "Wind",
]
const SPECIALTIES: Array<Agent["specialty"] | "All"> = [
  "All", "Attack", "Stun", "Anomaly", "Support", "Defense",
]
const RARITIES: Array<Agent["rarity"] | "All"> = ["All", "S", "A"]

interface AgentGridProps {
  agents: Agent[]
}

export function AgentGrid({ agents }: AgentGridProps) {
  const { isOwned, toggleAgent, roster } = useRoster()
  const [element, setElement] = useState<Agent["element"] | "All">("All")
  const [specialty, setSpecialty] = useState<Agent["specialty"] | "All">("All")
  const [rarity, setRarity] = useState<Agent["rarity"] | "All">("All")
  const [showOwnedOnly, setShowOwnedOnly] = useState(false)

  const filtered = useMemo(() => {
    return agents.filter((a) => {
      if (element !== "All" && a.element !== element) return false
      if (specialty !== "All" && a.specialty !== specialty) return false
      if (rarity !== "All" && a.rarity !== rarity) return false
      if (showOwnedOnly && !isOwned(a.id)) return false
      return true
    })
  }, [agents, element, specialty, rarity, showOwnedOnly, isOwned])

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <FilterGroup
          label="Element"
          options={ELEMENTS}
          value={element}
          onChange={(v) => setElement(v as Agent["element"] | "All")}
        />
        <FilterGroup
          label="Specialty"
          options={SPECIALTIES}
          value={specialty}
          onChange={(v) => setSpecialty(v as Agent["specialty"] | "All")}
        />
        <FilterGroup
          label="Rarity"
          options={RARITIES}
          value={rarity}
          onChange={(v) => setRarity(v as Agent["rarity"] | "All")}
        />
        <button
          onClick={() => setShowOwnedOnly((p) => !p)}
          className="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
          style={{
            borderColor: showOwnedOnly ? "var(--accent-yellow)" : "var(--border)",
            color: showOwnedOnly ? "var(--accent-yellow)" : "var(--text-secondary)",
            backgroundColor: showOwnedOnly ? "rgba(245,196,0,0.1)" : "transparent",
          }}
        >
          Owned only
        </button>
        <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>
          {roster.length} owned · {filtered.length} shown
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-sm" style={{ color: "var(--text-muted)" }}>
          No agents match the current filters.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {filtered.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              owned={isOwned(agent.id)}
              onToggle={toggleAgent}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface FilterGroupProps {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
}

function FilterGroup({ label: _label, options, value, onChange }: FilterGroupProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className="rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
          style={{
            backgroundColor: value === opt ? "var(--accent-yellow)" : "var(--bg-elevated)",
            color: value === opt ? "#000" : "var(--text-secondary)",
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
