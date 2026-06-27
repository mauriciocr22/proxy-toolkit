"use client"

import { useState } from "react"
import type { Bangboo, CompAnalysis } from "@/types/zzz"
import { BangbooCard } from "@/components/comp-builder/BangbooCard"

interface CompResultProps {
  result: CompAnalysis | null
  bangboo: Bangboo | null
  isPending: boolean
  error: string | null
  onSave: (name: string) => void
}

const PANEL_SCANLINES: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 3px)",
}

export function CompResult({ result, bangboo, isPending, error, onSave }: CompResultProps) {
  const [compName, setCompName] = useState("")
  const [saved, setSaved] = useState(false)

  function handleSave() {
    if (!compName.trim()) return
    onSave(compName.trim())
    setSaved(true)
  }

  if (isPending) {
    return (
      <div
        style={{
          backgroundColor: "var(--surface)",
          borderTop: "1px solid var(--line)",
          borderRight: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
          borderLeft: "2px solid var(--brand)",
          ...PANEL_SCANLINES,
        }}
      >
        <div
          style={{
            padding: "8px 16px",
            borderBottom: "1px solid var(--line)",
            backgroundColor: "var(--surface-2)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--brand)",
            }}
          >
            ANÁLISE DA COMP
          </span>
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--font-mono)",
              fontSize: "8px",
              color: "var(--line)",
              letterSpacing: "0.1em",
            }}
          >
            {"// COMP.ANALYSIS > OUTPUT"}
          </span>
        </div>
        <div
          style={{
            padding: "20px 16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: "2px solid var(--brand)",
              borderTopColor: "transparent",
              animation: "spin 0.75s linear infinite",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--muted)",
              letterSpacing: "0.08em",
            }}
          >
            {">"} PROCESSANDO ANÁLISE...
          </span>
          <span className="terminal-cursor" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--brand)" }}>
            █
          </span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          backgroundColor: "rgba(239,68,68,0.05)",
          borderTop: "1px solid rgba(239,68,68,0.35)",
          borderRight: "1px solid rgba(239,68,68,0.35)",
          borderBottom: "1px solid rgba(239,68,68,0.35)",
          borderLeft: "2px solid #ef4444",
          padding: "14px 16px",
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          color: "#ef4444",
          letterSpacing: "0.06em",
        }}
      >
        <span style={{ opacity: 0.6, marginRight: "8px" }}>{">"}</span>
        {`ERR: ${error}`}
      </div>
    )
  }

  if (!result) return null

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Terminal analysis panel */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          borderTop: "1px solid var(--line)",
          borderRight: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
          borderLeft: "2px solid var(--brand)",
          ...PANEL_SCANLINES,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 16px",
            borderBottom: "1px solid var(--line)",
            backgroundColor: "var(--surface-2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                display: "inline-block",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "var(--brand)",
                boxShadow: "0 0 6px var(--brand)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--brand)",
              }}
            >
              ANÁLISE DA COMP
            </span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "8px",
              color: "var(--line)",
              letterSpacing: "0.1em",
            }}
          >
            {"// COMP.ANALYSIS > OUTPUT"}
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 16px 16px" }}>
          <p
            style={{
              fontSize: "0.85rem",
              lineHeight: 1.75,
              color: "var(--muted)",
              whiteSpace: "pre-wrap",
            }}
          >
            {result.analysis}
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            borderTop: "1px solid var(--line)",
            backgroundColor: "var(--surface-2)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "8px",
              color: "var(--line)",
              letterSpacing: "0.1em",
            }}
          >
            STATUS:
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "8px",
              color: "var(--el-wind)",
              letterSpacing: "0.1em",
            }}
          >
            COMPLETE
          </span>
        </div>
      </div>

      {/* Bangboo recommendation */}
      {bangboo && (
        <div>
          <div
            style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "8px",
                color: "var(--muted)",
                opacity: 0.5,
                letterSpacing: "0.12em",
              }}
            >
              //
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--muted)",
              }}
            >
              BANGBOO RECOMENDADO
            </span>
          </div>
          <BangbooCard bangboo={bangboo} />
        </div>
      )}

      {/* Save comp */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--line)",
          padding: "12px 16px",
        }}
      >
        {saved ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--el-wind)" }}>
              ▸
            </span>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: "0.08em",
                color: "var(--el-wind)",
              }}
            >
              COMP SALVA COM SUCESSO
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={compName}
              onChange={(e) => setCompName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="// NOME DA COMP..."
              style={{
                flex: 1,
                backgroundColor: "var(--bg)",
                border: "1px solid var(--line)",
                padding: "7px 12px",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: "0.06em",
                color: "var(--fg)",
                outline: "none",
              }}
            />
            <button
              onClick={handleSave}
              disabled={!compName.trim()}
              style={{
                padding: "7px 18px",
                backgroundColor: "var(--brand)",
                color: "#000",
                fontFamily: "var(--font-display)",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                border: "none",
                cursor: compName.trim() ? "pointer" : "not-allowed",
                opacity: compName.trim() ? 1 : 0.35,
                clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)",
                transition: "opacity 0.15s ease",
              }}
            >
              SALVAR
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
