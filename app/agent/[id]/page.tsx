import Link from "next/link"
import { notFound } from "next/navigation"
import { getAgent, getWEngines, getDiscSets } from "@/lib/hakushin"
import { AgentBuildClient } from "@/components/agent/AgentBuildClient"

const ELEMENT_COLORS: Record<string, string> = {
  Fire: "#ef4444",
  Ice: "#38bdf8",
  Electric: "#a855f7",
  Physical: "#94a3b8",
  Ether: "#34d399",
  Wind: "#4ade80",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const agent = await getAgent(id).catch(() => null)
  return {
    title: agent ? `${agent.name} — Proxy Toolkit` : "Agente — Proxy Toolkit",
  }
}

export default async function AgentPage({ params }: PageProps) {
  const { id } = await params

  const [agent, wEngines, discSets] = await Promise.all([
    getAgent(id).catch(() => null),
    getWEngines().catch(() => []),
    getDiscSets().catch(() => []),
  ])

  if (!agent) notFound()

  const elementColor = ELEMENT_COLORS[agent.element] ?? "var(--text-secondary)"

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/roster"
        className="mb-6 inline-flex items-center gap-1.5 text-sm transition-colors hover:text-white"
        style={{ color: "var(--text-secondary)" }}
      >
        ← Roster
      </Link>

      {/* Agent header */}
      <div
        className="mb-8 flex items-center gap-6 rounded-xl border-2 p-6"
        style={{
          borderColor: agent.rarity === "S" ? "var(--rarity-s)" : "var(--rarity-a)",
          backgroundColor: "var(--bg-card)",
        }}
      >
        <div
          className="h-24 w-24 shrink-0 overflow-hidden rounded-xl"
          style={{ backgroundColor: "var(--bg-base)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={agent.iconUrl}
            alt={agent.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              {agent.name}
            </h1>
            <span
              className="rounded px-2 py-0.5 text-xs font-bold text-black"
              style={{
                backgroundColor: agent.rarity === "S" ? "var(--rarity-s)" : "var(--rarity-a)",
              }}
            >
              {agent.rarity}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            <span
              className="rounded-full px-3 py-1 text-xs font-medium text-black"
              style={{ backgroundColor: elementColor }}
            >
              {agent.element}
            </span>
            <span
              className="rounded-full border px-3 py-1 text-xs"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              {agent.specialty}
            </span>
            {agent.faction && (
              <span
                className="rounded-full border px-3 py-1 text-xs"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
              >
                {agent.faction}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Build recommender */}
      <AgentBuildClient agent={agent} wEngines={wEngines} discSets={discSets} />
    </div>
  )
}
