"use client"

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

interface CompSlotProps {
  agent: Agent | undefined
  index: number
  onRemove: (index: number) => void
}

export function CompSlot({ agent, index, onRemove }: CompSlotProps) {
  const [hovered, setHovered] = useState(false)

  if (!agent) {
    return (
      <div
        style={{
          transform: "skewX(-7deg)",
          border: "1px dashed var(--line)",
          backgroundColor: "var(--surface)",
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0 6px, rgba(255,255,255,.008) 6px 7px)",
        }}
      >
        <div
          style={{
            transform: "skewX(7deg)",
            height: "88px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "8px",
              letterSpacing: "0.12em",
              color: "var(--line)",
            }}
          >
            {`// SLOT.0${index + 1}`}
          </span>
          <span style={{ fontSize: "22px", color: "var(--line)", lineHeight: 1 }}>+</span>
        </div>
      </div>
    )
  }

  const elColor = ELEMENT_HEX[agent.element]

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: "skewX(-7deg)",
        backgroundColor: "var(--surface-2)",
        backgroundImage:
          "repeating-linear-gradient(135deg, transparent 0 6px, rgba(255,255,255,.008) 6px 7px)",
        borderTop: "1px solid var(--line)",
        borderRight: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
        borderLeft: `2px solid ${elColor}`,
        boxShadow: hovered
          ? `inset 3px 0 18px ${elColor}28, 0 0 0 1px ${elColor}44`
          : `inset 3px 0 10px ${elColor}14`,
        transition: "box-shadow 0.2s ease",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          transform: "skewX(7deg)",
          height: "88px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "0 12px",
        }}
      >
        {/* Portrait */}
        <div
          style={{
            width: "50px",
            height: "62px",
            flexShrink: 0,
            overflow: "hidden",
            backgroundColor: "var(--surface)",
            clipPath:
              "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
            boxShadow: `0 0 0 1px ${elColor}44`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={agent.iconUrl}
            alt={agent.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).style.display = "none"
            }}
          />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-mono)",
              fontSize: "8px",
              letterSpacing: "0.1em",
              color: "var(--muted)",
              opacity: 0.5,
              marginBottom: "3px",
            }}
          >
            {`// SLOT.0${index + 1}`}
          </span>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--fg)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {agent.name}
          </p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", marginTop: "3px" }}>
            <span style={{ color: elColor }}>{agent.element}</span>
            <span style={{ color: "var(--line)", margin: "0 5px" }}>·</span>
            <span style={{ color: "var(--muted)" }}>{agent.specialty}</span>
          </p>
        </div>

        {/* Remove */}
        <button
          onClick={() => onRemove(index)}
          aria-label={`Remover ${agent.name}`}
          style={{
            flexShrink: 0,
            width: "20px",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "9px",
            fontWeight: 700,
            color: "var(--muted)",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--line)",
            clipPath:
              "polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
