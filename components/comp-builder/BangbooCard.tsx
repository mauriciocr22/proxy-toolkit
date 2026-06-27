"use client"

import type { Bangboo } from "@/types/zzz"

const RARITY_COLOR: Record<Bangboo["rarity"], string> = {
  S: "#FF5A1F",
  A: "#9b59b6",
}

interface BangbooCardProps {
  bangboo: Bangboo
}

export function BangbooCard({ bangboo }: BangbooCardProps) {
  const rarityColor = RARITY_COLOR[bangboo.rarity]

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "12px 16px",
        backgroundColor: "var(--surface-2)",
        backgroundImage:
          "repeating-linear-gradient(135deg, transparent 0 6px, rgba(255,255,255,.008) 6px 7px)",
        borderTop: "1px solid var(--line)",
        borderRight: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
        borderLeft: `2px solid ${rarityColor}`,
        boxShadow: `inset 3px 0 14px ${rarityColor}18`,
        clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
      }}
    >
      {/* Portrait */}
      <div
        style={{
          width: "56px",
          height: "56px",
          flexShrink: 0,
          overflow: "hidden",
          backgroundColor: "var(--surface)",
          clipPath:
            "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
          boxShadow: `0 0 0 1px ${rarityColor}55`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bangboo.iconUrl}
          alt={bangboo.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).style.display = "none"
          }}
        />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--fg)",
            }}
          >
            {bangboo.name}
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "9px",
              fontWeight: 900,
              padding: "1px 6px",
              backgroundColor: rarityColor,
              color: "#fff",
              letterSpacing: "0.1em",
              clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)",
              boxShadow: `0 0 8px ${rarityColor}88`,
            }}
          >
            {bangboo.rarity}
          </span>
        </div>
        {bangboo.description && (
          <p
            style={{
              fontSize: "11px",
              lineHeight: 1.5,
              color: "var(--muted)",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            } as React.CSSProperties}
          >
            {bangboo.description}
          </p>
        )}
      </div>
    </div>
  )
}
