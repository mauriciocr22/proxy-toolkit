import { getAgents } from "@/lib/hakushin"
import { AgentGrid } from "@/components/roster/AgentGrid"

export const metadata = {
  title: "Roster — Proxy Toolkit",
}

export default async function RosterPage() {
  const agents = await getAgents().catch(() => [] as Awaited<ReturnType<typeof getAgents>>)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Your Roster
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Click an agent to mark them as owned.
        </p>
      </div>

      {agents.length === 0 ? (
        <div
          className="rounded-xl border p-12 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}
        >
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Could not load agent data. Check your connection and try again.
          </p>
        </div>
      ) : (
        <AgentGrid agents={agents} />
      )}
    </div>
  )
}
