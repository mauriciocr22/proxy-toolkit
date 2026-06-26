import { getAgents, getBangboos } from "@/lib/hakushin"
import { CompBuilder } from "@/components/comp-builder/CompBuilder"

export const metadata = {
  title: "Comp Builder — Proxy Toolkit",
}

export default async function CompBuilderPage() {
  const [agents, bangboos] = await Promise.all([
    getAgents().catch(() => [] as Awaited<ReturnType<typeof getAgents>>),
    getBangboos().catch(() => [] as Awaited<ReturnType<typeof getBangboos>>),
  ])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Comp Builder
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Selecione 3 agentes e receba uma análise de composição com IA.
        </p>
      </div>

      {agents.length === 0 ? (
        <div
          className="rounded-xl border p-12 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}
        >
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Não foi possível carregar os agentes. Verifique sua conexão e tente novamente.
          </p>
        </div>
      ) : (
        <CompBuilder agents={agents} bangboos={bangboos} />
      )}
    </div>
  )
}
