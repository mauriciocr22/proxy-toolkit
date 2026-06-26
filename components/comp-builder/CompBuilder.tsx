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
    <div className="space-y-8">
      {/* Comp slots */}
      <div>
        <h2
          className="mb-3 text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}
        >
          Composição
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {slots.map((agent, i) => (
            <CompSlot key={i} agent={agent} index={i} onRemove={removeSlot} />
          ))}
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleAnalyze}
            disabled={!isFull || isPending}
            className="rounded-lg px-5 py-2 text-sm font-semibold transition-opacity disabled:opacity-40"
            style={{ backgroundColor: "var(--accent-yellow)", color: "#000" }}
          >
            {isPending ? "Analisando…" : "Analisar Comp"}
          </button>
          {selectedAgents.length > 0 && (
            <button
              onClick={handleClear}
              className="rounded-lg border px-4 py-2 text-sm transition-colors hover:text-white"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              Limpar
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
        <h2
          className="mb-3 text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}
        >
          Selecionar Agentes
        </h2>
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
