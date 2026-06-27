"use client"

import { useTransition, useState, useMemo } from "react"
import type { Agent, Bangboo, CompAnalysis } from "@/types/zzz"
import { useComp } from "@/hooks/useComp"
import { addSavedComp } from "@/lib/storage"
import { analyzeComp } from "@/app/comp-builder/actions"
import { CompSlot } from "@/components/comp-builder/CompSlot"
import { CompResult } from "@/components/comp-builder/CompResult"
import { AgentSelector } from "@/components/roster/AgentSelector"

interface CompBuilderProps {
  agents: Agent[]
  bangboos: Bangboo[]
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
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
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "9px",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        {children}
      </h2>
    </div>
  )
}

export function CompBuilder({ agents, bangboos }: CompBuilderProps) {
  const { selectedAgents, isSelected, toggleAgent, removeSlot, clear, isFull } = useComp(agents)
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<CompAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  const recommendedBangboo = useMemo(
    () => (result ? (bangboos.find((b) => b.id === result.bangbooId) ?? null) : null),
    [result, bangboos],
  )

  function handleAnalyze() {
    setResult(null)
    setError(null)
    startTransition(async () => {
      try {
        const analysis = await analyzeComp(selectedAgents)
        setResult(analysis)
      } catch {
        setError("Falha ao analisar a composição. Verifique sua chave de API e tente novamente.")
      }
    })
  }

  function handleClear() {
    clear()
    setResult(null)
    setError(null)
  }

  function handleSave(name: string) {
    addSavedComp({
      id: crypto.randomUUID(),
      name,
      agentIds: selectedAgents.map((a) => a.id),
      bangbooId: result?.bangbooId ?? "",
      aiSuggestion: result?.analysis ?? "",
      createdAt: new Date().toISOString(),
    })
  }

  const slots = [0, 1, 2].map((i) => selectedAgents[i])

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Comp slots */}
      <div>
        <SectionLabel>TEAM.SLOTS</SectionLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {slots.map((agent, i) => (
            <CompSlot key={i} agent={agent} index={i} onRemove={removeSlot} />
          ))}
        </div>

        <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
          <button
            onClick={handleAnalyze}
            disabled={!isFull || isPending}
            style={{
              padding: "9px 24px",
              backgroundColor: "var(--brand)",
              color: "#000",
              fontFamily: "var(--font-display)",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              border: "none",
              cursor: isFull && !isPending ? "pointer" : "not-allowed",
              opacity: isFull && !isPending ? 1 : 0.35,
              clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
              transition: "opacity 0.15s ease",
            }}
          >
            {isPending ? "ANALISANDO..." : "ANALISAR COMP"}
          </button>

          {selectedAgents.length > 0 && (
            <button
              onClick={handleClear}
              style={{
                padding: "9px 18px",
                backgroundColor: "transparent",
                color: "var(--muted)",
                fontFamily: "var(--font-display)",
                fontSize: "0.7rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                border: "1px solid var(--line)",
                cursor: "pointer",
                clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)",
                transition: "color 0.15s ease, border-color 0.15s ease",
              }}
            >
              LIMPAR
            </button>
          )}
        </div>
      </div>

      {/* AI result + Bangboo + Save */}
      <CompResult
        result={result}
        bangboo={recommendedBangboo}
        isPending={isPending}
        error={error}
        onSave={handleSave}
      />

      {/* Agent selector */}
      <div>
        <SectionLabel>AGENT.SELECT</SectionLabel>
        <AgentSelector
          agents={agents}
          isSelected={isSelected}
          isFull={isFull}
          onToggle={toggleAgent}
        />
      </div>
    </div>
  )
}
