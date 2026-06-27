import { getAgents } from "@/lib/hakushin"
import { AgentGrid } from "@/components/roster/AgentGrid"

export const metadata = {
  title: "Roster — Proxy Toolkit",
}

const HEX_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='52'%3E%3Cpath d='M30 2 L58 17 L58 37 L30 52 L2 37 L2 17 Z' fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='1'/%3E%3C/svg%3E")`

export default async function RosterPage() {
  const agents = await getAgents().catch(() => [] as Awaited<ReturnType<typeof getAgents>>)

  return (
    <div>
      {/* ── Hex-texture header ─────────────────────────────── */}
      <header
        className="relative overflow-hidden border-b"
        style={{ borderColor: "var(--line)", backgroundColor: "var(--surface)" }}
      >
        {/* Hex SVG tile */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: HEX_BG, backgroundRepeat: "repeat" }}
        />
        {/* Gradient mask — left stays dark, right opens to hex */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(105deg, var(--surface) 25%, transparent 72%)" }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-8">
          <p
            className="mb-1 text-[10px] uppercase tracking-[0.35em]"
            style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
          >
            // AGENT.DB
          </p>

          <div className="flex items-end justify-between">
            <div>
              <h1
                className="text-4xl font-black uppercase"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--fg)",
                  letterSpacing: "0.15em",
                  animation: "crt-flicker 3s ease 0.4s 1",
                }}
              >
                YOUR ROSTER
              </h1>
              <p
                className="mt-1 text-[11px] uppercase tracking-[0.22em]"
                style={{ fontFamily: "var(--font-display)", color: "var(--muted)" }}
              >
                Click an agent to mark as owned · Navigate to build
              </p>
            </div>

            {/* Stat counter — hidden on mobile */}
            <div className="hidden sm:flex flex-col items-end gap-0.5 pb-1" aria-hidden>
              <span
                className="text-[9px] uppercase tracking-[0.3em]"
                style={{ fontFamily: "var(--font-display)", color: "var(--muted)" }}
              >
                AGENTS
              </span>
              <span
                className="text-3xl font-black tabular-nums leading-none"
                style={{ fontFamily: "var(--font-mono)", color: "var(--brand)" }}
              >
                {String(agents.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Grid section ───────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        {agents.length === 0 ? (
          <div
            className="border p-12 text-center"
            style={{
              borderColor: "var(--line)",
              backgroundColor: "var(--surface)",
              clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Could not load agent data. Check your connection and try again.
            </p>
          </div>
        ) : (
          <AgentGrid agents={agents} />
        )}
      </div>
    </div>
  )
}
