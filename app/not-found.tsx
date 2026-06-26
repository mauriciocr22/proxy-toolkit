import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <p className="text-7xl font-bold" style={{ color: "var(--accent-yellow)" }}>
        404
      </p>
      <h1 className="mt-4 text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
        Página não encontrada
      </h1>
      <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
        O agente ou página que você procura não existe.
      </p>
      <Link
        href="/roster"
        className="mt-8 rounded-lg px-5 py-2.5 text-sm font-semibold"
        style={{ backgroundColor: "var(--accent-yellow)", color: "#000" }}
      >
        Voltar ao Roster
      </Link>
    </div>
  )
}
