export default function Loading() {
  return (
    <div className="flex items-center justify-center py-32">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2"
        style={{ borderColor: "var(--accent-yellow)", borderTopColor: "transparent" }}
      />
    </div>
  )
}
