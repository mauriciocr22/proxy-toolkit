"use client"

import { useTransition, useState } from "react"
import type { Agent } from "@/types/zzz"
import { useComp } from "@/hooks/useComp"
import { analyzeComp } from "@/app/comp-builder/actions"
import { CompSlot } from "@/components/comp-builder/CompSlot"
import { CompResult } from "@/components/comp-builder/CompResult"
import { AgentSelector } from "@/components/roster/AgentSelector"

interface CompBuilderProps {
  agents: Agent[]
}

export function CompBuilder({ agents }: CompBuilderProps) {
  const { selectedAgents, isSelected, toggleAgent, removeSlot, clear, isFull } = useComp(agents)
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleAnalyze() {
    setResult(null)
    setError(null)
    startTransition(async () => {
      try {
        const text = await analyzeComp(selectedAgents)
        setResult(text)
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

  const slots = [0, 1, 2].map((i) => selectedAgents[i])

  return (
    <div className="space-y-8">
      {/* Comp slots */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
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

      {/* AI result */}
      <CompResult result={result} isPending={isPending} error={error} />

      {/* Agent selector */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
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
