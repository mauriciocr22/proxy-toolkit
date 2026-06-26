"use client"

interface BuildCardProps {
  recommendation: string
}

export function BuildCard({ recommendation }: BuildCardProps) {
  return (
    <div
      className="rounded-xl border p-6"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}
    >
      <h2
        className="mb-4 text-xs font-bold uppercase tracking-widest"
        style={{ color: "var(--accent-yellow)" }}
      >
        Recomendação de Build
      </h2>
      <p
        className="whitespace-pre-wrap text-sm leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        {recommendation}
      </p>
    </div>
  )
}
