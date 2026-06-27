import Link from "next/link"

export function NavLogo() {
  return (
    <Link
      href="/"
      className="shrink-0 select-none"
      style={{ display: "flex", flexDirection: "column", gap: "3px", lineHeight: 1, textDecoration: "none" }}
    >
      {/* Micro-label */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "8px",
          letterSpacing: "0.14em",
          color: "var(--muted)",
          opacity: 0.55,
        }}
      >
        {"// ZZZ.COMPANION"}
      </span>

      {/* LED + skewed badge row */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Status LED */}
        <span
          aria-hidden
          className="nav-led"
          style={{
            display: "inline-block",
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            backgroundColor: "var(--el-wind)",
            boxShadow: "0 0 6px var(--el-wind), 0 0 14px rgba(77,255,184,0.35)",
            flexShrink: 0,
          }}
        />

        {/* Parallelogram badge */}
        <div
          style={{
            transform: "skewX(-7deg)",
            padding: "3px 14px 3px 10px",
            backgroundColor: "var(--surface-2)",
            borderTop: "1px solid var(--line)",
            borderRight: "1px solid var(--line)",
            borderBottom: "1px solid var(--line)",
            borderLeft: "2px solid var(--brand)",
          }}
        >
          <span
            style={{
              display: "block",
              transform: "skewX(7deg)",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: "0.2em",
              color: "var(--brand)",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            PROXY TOOLKIT
          </span>
        </div>
      </div>
    </Link>
  )
}
