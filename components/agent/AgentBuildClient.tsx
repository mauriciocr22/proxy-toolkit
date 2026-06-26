"use client"

import { useTransition, useState, useMemo } from "react"
import type { Agent, BuildAnalysis, WEngine, DiscSet } from "@/types/zzz"
import { analyzeBuild } from "@/app/agent/[id]/actions"
import { BuildCard } from "@/components/agent/BuildCard"
import { WEngineCard } from "@/components/agent/WEngineCard"
import { DiscSetCard } from "@/components/agent/DiscSetCard"

interface AgentBuildClientProps {
  agent: Agent
  wEngines: WEngine[]
  discSets: DiscSet[]
}

export function AgentBuildClient({ agent, wEngines, discSets }: AgentBuildClientProps) {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<BuildAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mainWEngine = useMemo(
    () => wEngines.find((w) => w.id === result?.wEngineId) ?? null,
    [result, wEngines],
  )
  const altWEngine = useMemo(
    () => wEngines.find((w) => w.id === result?.altWEngineId) ?? null,
    [result, wEngines],
  )
  const mainDiscSet = useMemo(
    () => discSets.find((d) => d.id === result?.discSetId) ?? null,
    [result, discSets],
  )
  const altDiscSet = useMemo(
    () => discSets.find((d) => d.id === result?.altDiscSetId) ?? null,
    [result, discSets],
  )

  function handleAnalyze() {
    setResult(null)
    setError(null)
    startTransition(async () => {
      try {
        const analysis = await analyzeBuild(agent)
        setResult(analysis)
      } catch {
        setError("Falha ao gerar a recomendação. Verifique sua chave de API e tente novamente.")
      }
    })
  }

  return (
    <div className="space-y-6">
      <button
        onClick={handleAnalyze}
        disabled={isPending}
        className="rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity disabled:opacity-40"
        style={{ backgroundColor: "var(--accent-yellow)", color: "#000" }}
      >
        {isPending ? "Gerando recomendação…" : "Recomendar Build com IA"}
      </button>

      {isPending && (
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
              Analisando build…
            </p>
          </div>
        </div>
      )}

      {error && (
        <div
          className="rounded-xl border p-6 text-sm"
          style={{ borderColor: "#ef4444", backgroundColor: "rgba(239,68,68,0.08)", color: "#ef4444" }}
        >
          {error}
        </div>
      )}

      {result && (
        <>
          <BuildCard recommendation={result.recommendation} />

          {(mainWEngine || altWEngine) && (
            <div>
              <h3
                className="mb-3 text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                W-Engine
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {mainWEngine && <WEngineCard wEngine={mainWEngine} label="Principal" />}
                {altWEngine && <WEngineCard wEngine={altWEngine} label="Alternativa" />}
              </div>
            </div>
          )}

          {(mainDiscSet || altDiscSet) && (
            <div>
              <h3
                className="mb-3 text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                Conjunto de Discos
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {mainDiscSet && <DiscSetCard discSet={mainDiscSet} label="Principal" />}
                {altDiscSet && <DiscSetCard discSet={altDiscSet} label="Alternativa" />}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
