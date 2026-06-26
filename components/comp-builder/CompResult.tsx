"use client"

interface CompResultProps {
  result: string | null
  isPending: boolean
  error: string | null
}

export function CompResult({ result, isPending, error }: CompResultProps) {
  if (isPending) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border p-12"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}
      >
        <div className="text-center">
          <div
            className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
            style={{ borderColor: "var(--accent-yellow)", borderTopColor: "transparent" }}
          />
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Analyzing composition…
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="rounded-xl border p-6 text-sm"
        style={{
          borderColor: "#ef4444",
          backgroundColor: "rgba(239,68,68,0.08)",
          color: "#ef4444",
        }}
      >
        {error}
      </div>
    )
  }

  if (!result) return null

  return (
    <div
      className="rounded-xl border p-6"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}
    >
      <h2 className="mb-4 text-sm font-bold uppercase tracking-widest" style={{ color: "var(--accent-yellow)" }}>
        Análise da Comp
      </h2>
      <p className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {result}
      </p>
    </div>
  )
}
