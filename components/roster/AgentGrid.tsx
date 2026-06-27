"use client"

import { useState, useMemo } from "react"
import type { Agent } from "@/types/zzz"
import { useRoster } from "@/hooks/useRoster"
import { AgentCard } from "@/components/roster/AgentCard"

type ElementFilter = Agent["element"] | "All"
type SpecialtyFilter = Agent["specialty"] | "All"
type RarityFilter = Agent["rarity"] | "All"

const ELEMENT_COLORS: Record<Agent["element"], string> = {
  Fire: "#FF4D3D",
  Ice: "#5FD0FF",
  Electric: "#4D7BFF",
  Physical: "#F7D94C",
  Ether: "#FF4DB8",
  Wind: "#4DFFB8",
}

const ELEMENTS: Array<{ value: Agent["element"]; label: string; icon: string }> = [
  { value: "Fire", label: "Fire", icon: "/icons/elements/Icon_Fire.webp" },
  { value: "Ice", label: "Ice", icon: "/icons/elements/Icon_Ice.webp" },
  { value: "Electric", label: "Electric", icon: "/icons/elements/Icon_Electric.webp" },
  { value: "Physical", label: "Physical", icon: "/icons/elements/Icon_Physical.webp" },
  { value: "Ether", label: "Ether", icon: "/icons/elements/Icon_Ether.webp" },
  { value: "Wind", label: "Wind", icon: "/icons/elements/Icon_Wind.webp" },
]

const SPECIALTIES: Array<{ value: Agent["specialty"]; label: string; icon: string }> = [
  { value: "Attack", label: "Attack", icon: "/icons/roles/Icon_Attack.webp" },
  { value: "Stun", label: "Stun", icon: "/icons/roles/Icon_Stun.webp" },
  { value: "Anomaly", label: "Anomaly", icon: "/icons/roles/Icon_Anomaly.webp" },
  { value: "Support", label: "Support", icon: "/icons/roles/Icon_Support.webp" },
  { value: "Defense", label: "Defense", icon: "/icons/roles/Icon_Defense.webp" },
]

interface AgentGridProps {
  agents: Agent[]
}

export function AgentGrid({ agents }: AgentGridProps) {
  const { isOwned, toggleAgent, roster } = useRoster()
  const [element, setElement] = useState<ElementFilter>("All")
  const [specialty, setSpecialty] = useState<SpecialtyFilter>("All")
  const [rarity, setRarity] = useState<RarityFilter>("All")
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
      {/* ── Filter row ─────────────────────────────────────── */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        {/* Left: counts + owned toggle */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <span
            className="text-xs uppercase tracking-[0.25em]"
            style={{ fontFamily: "var(--font-display)", color: "var(--muted)" }}
          >
            {filtered.length} agents
          </span>
          <button
            onClick={() => setShowOwnedOnly((p) => !p)}
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] transition-colors"
            style={{
              fontFamily: "var(--font-display)",
              color: showOwnedOnly ? "var(--brand)" : "var(--muted)",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 14,
                height: 14,
                border: `1px solid ${showOwnedOnly ? "var(--brand)" : "var(--line)"}`,
                backgroundColor: showOwnedOnly ? "var(--brand)" : "transparent",
                clipPath: "polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 0 100%)",
                transition: "all 0.2s ease",
                fontSize: 8,
                fontWeight: 900,
                color: "#000",
                lineHeight: 1,
              }}
            >
              {showOwnedOnly ? "✓" : ""}
            </span>
            Owned · {roster.length}
          </button>
        </div>

        {/* Right: pill filter chassis */}
        <div
          className="flex items-center gap-px overflow-x-auto"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "999px",
            padding: "4px 8px",
            flexShrink: 0,
          }}
        >
          {/* Rarity */}
          <div className="flex items-center gap-0.5">
            <PillButton
              active={rarity === "S"}
              activeColor="#FF5A1F"
              title="S-Rank"
              iconSrc="/icons/ranks/Icon_AgentRank_S.webp"
              onClick={() => setRarity(rarity === "S" ? "All" : "S")}
            />
            <PillButton
              active={rarity === "A"}
              activeColor="#9b59b6"
              title="A-Rank"
              iconSrc="/icons/ranks/Icon_AgentRank_A.webp"
              onClick={() => setRarity(rarity === "A" ? "All" : "A")}
            />
          </div>

          <PillDivider />

          {/* Specialty */}
          <div className="flex items-center gap-0.5">
            {SPECIALTIES.map((s) => (
              <PillButton
                key={s.value}
                active={specialty === s.value}
                activeColor="#EDEFF5"
                title={s.label}
                iconSrc={s.icon}
                onClick={() => setSpecialty(specialty === s.value ? "All" : s.value)}
              />
            ))}
          </div>

          <PillDivider />

          {/* Element */}
          <div className="flex items-center gap-0.5">
            {ELEMENTS.map((el) => (
              <PillButton
                key={el.value}
                active={element === el.value}
                activeColor={ELEMENT_COLORS[el.value]}
                title={el.label}
                iconSrc={el.icon}
                onClick={() => setElement(element === el.value ? "All" : el.value)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Agent grid ─────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <p className="py-20 text-center text-sm" style={{ color: "var(--muted)" }}>
          No agents match the current filters.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {filtered.map((agent, i) => (
            <div
              key={agent.id}
              style={{
                animation: "card-rise 0.3s ease both",
                animationDelay: `${i * 25}ms`,
              }}
            >
              <AgentCard
                agent={agent}
                owned={isOwned(agent.id)}
                onToggle={toggleAgent}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PillDivider() {
  return (
    <div
      className="mx-1.5 h-4 w-px flex-shrink-0"
      style={{ backgroundColor: "var(--line)" }}
    />
  )
}

interface PillButtonProps {
  active: boolean
  activeColor?: string
  onClick: () => void
  children?: React.ReactNode
  title?: string
  iconSrc?: string
}

function PillButton({ active, activeColor = "var(--brand)", onClick, children, title, iconSrc }: PillButtonProps) {
  const [hovered, setHovered] = useState(false)

  const imgFilter = active || hovered ? "none" : "brightness(0.55)"
  const imgScale = hovered ? "scale(0.92)" : "scale(1)"

  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex-shrink-0 flex items-center justify-center"
      style={{
        padding: iconSrc ? "4px 6px" : "4px 8px",
        fontFamily: "var(--font-display)",
        fontSize: "9px",
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        borderRadius: "999px",
        backgroundColor: "transparent",
        color: active ? activeColor : "var(--muted)",
        border: "1px solid transparent",
        boxShadow: "none",
        transition: "all 0.15s ease",
        whiteSpace: "nowrap",
        cursor: "pointer",
      }}
    >
      {iconSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={iconSrc}
          alt={title}
          width={28}
          height={28}
          style={{
            display: "block",
            filter: imgFilter,
            transform: imgScale,
            transition: "filter 0.15s ease, transform 0.15s ease",
          }}
        />
      ) : (
        children
      )}
    </button>
  )
}
