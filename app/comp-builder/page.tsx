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
      {/* Chassis page header */}
      <div style={{ marginBottom: "32px" }}>
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-mono)",
            fontSize: "8px",
            letterSpacing: "0.14em",
            color: "var(--muted)",
            opacity: 0.5,
            marginBottom: "6px",
          }}
        >
          {"// COMP.BUILDER"}
        </span>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.5rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--fg)",
            animation: "crt-flicker 8s ease-in-out infinite",
          }}
        >
          COMP BUILDER
        </h1>
        <p
          style={{
            marginTop: "6px",
            fontSize: "0.8rem",
            color: "var(--muted)",
            fontFamily: "var(--font-body)",
          }}
        >
          Selecione 3 agentes e receba uma análise de composição com IA.
        </p>
        <div
          style={{
            marginTop: "14px",
            height: "1px",
            background:
              "linear-gradient(90deg, var(--brand) 0%, rgba(242,255,73,0.15) 40%, transparent 70%)",
          }}
        />
      </div>

      {agents.length === 0 ? (
        <div
          style={{
            border: "1px solid var(--line)",
            borderLeft: "2px solid var(--line)",
            backgroundColor: "var(--surface)",
            padding: "48px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--muted)",
              letterSpacing: "0.06em",
            }}
          >
            {">"} ERR: Não foi possível carregar os agentes. Verifique sua conexão.
          </p>
        </div>
      ) : (
        <CompBuilder agents={agents} bangboos={bangboos} />
      )}
    </div>
  )
}
