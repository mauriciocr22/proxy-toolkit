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
        className="flex items-center justify-center rounded-xl border p-12"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}
      >
        <div className="text-center">
          <div
            className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2"
            style={{ borderColor: "var(--accent-yellow)", borderTopColor: "transparent" }}
          />
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Analisando composição…
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="rounded-xl border p-6 text-sm"
        style={{ borderColor: "#ef4444", backgroundColor: "rgba(239,68,68,0.08)", color: "#ef4444" }}
      >
        {error}
      </div>
    )
  }

  if (!result) return null

  return (
    <div className="space-y-4">
      {/* Analysis text */}
      <div
        className="rounded-xl border p-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}
      >
        <h2
          className="mb-4 text-xs font-bold uppercase tracking-widest"
          style={{ color: "var(--accent-yellow)" }}
        >
          Análise da Comp
        </h2>
        <p
          className="whitespace-pre-wrap text-sm leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {result.analysis}
        </p>
      </div>

      {/* Bangboo recommendation */}
      {bangboo && (
        <div>
          <h2
            className="mb-3 text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--accent-cyan)" }}
          >
            Bangboo Recomendado
          </h2>
          <BangbooCard bangboo={bangboo} />
        </div>
      )}

      {/* Save comp */}
      <div
        className="rounded-xl border p-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}
      >
        {saved ? (
          <p className="text-sm font-medium" style={{ color: "var(--accent-yellow)" }}>
            Comp salva com sucesso!
          </p>
        ) : (
          <div className="flex gap-3">
            <input
              type="text"
              value={compName}
              onChange={(e) => setCompName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="Nome da comp…"
              className="flex-1 rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent-yellow)]"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            />
            <button
              onClick={handleSave}
              disabled={!compName.trim()}
              className="rounded-lg px-4 py-2 text-sm font-semibold transition-opacity disabled:opacity-40"
              style={{ backgroundColor: "var(--accent-yellow)", color: "#000" }}
            >
              Salvar Comp
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
