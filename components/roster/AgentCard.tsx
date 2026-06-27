"use client"

import Link from "next/link"
import { useState } from "react"
import type { Agent } from "@/types/zzz"

const ELEMENT_HEX: Record<Agent["element"], string> = {
  Fire:     "#FF4D3D",
  Ice:      "#5FD0FF",
  Electric: "#4D7BFF",
  Physical: "#F7D94C",
  Ether:    "#FF4DB8",
  Wind:     "#4DFFB8",
}

const ELEMENT_ICON: Record<Agent["element"], string> = {
  Fire:     "/icons/elements/Icon_Fire.webp",
  Ice:      "/icons/elements/Icon_Ice.webp",
  Electric: "/icons/elements/Icon_Electric.webp",
  Physical: "/icons/elements/Icon_Physical.webp",
  Ether:    "/icons/elements/Icon_Ether.webp",
  Wind:     "/icons/elements/Icon_Wind.webp",
}

const RARITY_COLOR: Record<Agent["rarity"], string> = {
  S: "#FF5A1F",
  A: "#9b59b6",
}

const RARITY_ICON: Record<Agent["rarity"], string> = {
  S: "/icons/ranks/Icon_AgentRank_S.webp",
  A: "/icons/ranks/Icon_AgentRank_A.webp",
}

interface AgentCardProps {
  agent: Agent
  owned: boolean
  onToggle: (agentId: string) => void
}

export function AgentCard({ agent, owned, onToggle }: AgentCardProps) {
  const [hovered, setHovered] = useState(false)
  const elColor = ELEMENT_HEX[agent.element]
  const rarityColor = RARITY_COLOR[agent.rarity]
  const isActive = hovered && owned

  return (
    <article
      className="relative"
      style={{
        transform: "skewX(-6deg)",
        opacity: owned ? 1 : 0.4,
        filter: owned ? "none" : "saturate(0.15)",
        transition: "opacity 0.25s ease, filter 0.25s ease",
      }}
    >
      {/* Counter-skew so all content appears straight */}
      <div style={{ transform: "skewX(6deg)" }}>

        {/* Positioning root for the absolute toggle */}
        <div
          className="relative"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >

          {/* ── Card link ─────────────────────────────────────── */}
          <Link
            href={`/agent/${agent.id}`}
            className="block focus:outline-none"
            style={{
              overflow: "hidden",
              /* Chamfer: top-right corner cut at 45° */
              clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
              boxShadow: isActive
                ? `0 0 0 2px ${elColor}, 0 0 28px ${elColor}55, 0 8px 32px rgba(0,0,0,0.8)`
                : `0 0 0 1px var(--line), 0 4px 16px rgba(0,0,0,0.5)`,
              transition: "box-shadow 0.3s ease",
            }}
          >

            {/* Portrait area ─────────────────────────────────── */}
            <div
              className="relative"
              style={{ aspectRatio: "3/4", backgroundColor: "var(--surface)" }}
            >
              {/* Character image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={agent.iconUrl}
                alt={agent.name}
                className="h-full w-full object-cover object-top"
                style={{
                  transform: isActive ? "scale(1.06)" : "scale(1)",
                  transition: "transform 0.45s ease",
                }}
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).style.display = "none"
                }}
              />

              {/* Scanline texture */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 3px)",
                  zIndex: 1,
                }}
              />

              {/* Diagonal element-color reveal on hover */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, transparent 20%, ${elColor}28 100%)`,
                  clipPath: isActive
                    ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
                    : "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
                  transition: "clip-path 0.38s ease",
                  zIndex: 2,
                }}
              />

              {/* Bottom vignette for name-strip readability */}
              <div
                className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
                style={{
                  background: "linear-gradient(to top, rgba(12,13,17,0.9) 0%, transparent 100%)",
                  zIndex: 3,
                }}
              />

              {/* Element badge ── top left */}
              <div
                className="absolute left-2 top-2 flex items-center justify-center p-1"
                style={{
                  backgroundColor: "rgba(12,13,17,0.75)",
                  border: `1px solid ${elColor}55`,
                  clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)",
                  zIndex: 4,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ELEMENT_ICON[agent.element]}
                  alt={agent.element}
                  width={18}
                  height={18}
                  style={{ display: "block" }}
                />
              </div>
            </div>

            {/* Name strip ────────────────────────────────────── */}
            <div
              className="flex items-center gap-2 px-2.5 py-2"
              style={{ backgroundColor: "var(--surface-2)" }}
            >
              {/* Rarity badge */}
              <span
                className="flex h-5.5 w-5.5 shrink-0 items-center justify-center overflow-hidden"
                style={{
                  backgroundColor: rarityColor,
                  clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)",
                  boxShadow: `0 0 8px ${rarityColor}70`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={RARITY_ICON[agent.rarity]}
                  alt={agent.rarity}
                  width={16}
                  height={16}
                  style={{ display: "block" }}
                />
              </span>

              {/* Agent name */}
              <span
                className="flex-1 truncate text-[11px] font-bold uppercase tracking-widest"
                style={{
                  fontFamily: "var(--font-display)",
                  color: isActive ? "var(--fg)" : "var(--muted)",
                  transition: "color 0.2s ease",
                }}
              >
                {agent.name}
              </span>
            </div>
          </Link>

          {/* ── Owned toggle ──────────────────────────────────── */}
          <button
            onClick={() => onToggle(agent.id)}
            className="absolute right-2 top-2 z-10 flex h-5 w-5 items-center justify-center text-[9px] font-black"
            style={{
              fontFamily: "var(--font-display)",
              backgroundColor: owned ? "var(--brand)" : "rgba(12,13,17,0.8)",
              color: owned ? "#000" : "var(--muted)",
              border: owned ? "none" : "1px solid var(--line)",
              clipPath:
                "polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)",
              boxShadow: owned ? "0 0 8px var(--brand)" : "none",
              transition: "background-color 0.2s ease, box-shadow 0.2s ease",
            }}
            aria-label={
              owned
                ? `Remover ${agent.name} do roster`
                : `Adicionar ${agent.name} ao roster`
            }
          >
            {owned ? "✓" : "+"}
          </button>
        </div>
      </div>
    </article>
  )
}
