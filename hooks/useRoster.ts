"use client"

import { useState, useEffect, useCallback } from "react"
import { getRoster, setRoster } from "@/lib/storage"
import type { RosterAgent } from "@/types/zzz"

export function useRoster() {
  const [roster, setRosterState] = useState<RosterAgent[]>([])

  useEffect(() => {
    setRosterState(getRoster())
  }, [])

  const isOwned = useCallback(
    (agentId: string) => roster.some((r) => r.agentId === agentId),
    [roster],
  )

  const toggleAgent = useCallback(
    (agentId: string) => {
      const next = isOwned(agentId)
        ? roster.filter((r) => r.agentId !== agentId)
        : [...roster, { agentId, level: 60, mindscape: 0, coreSkill: "A" } satisfies RosterAgent]
      setRosterState(next)
      setRoster(next)
    },
    [roster, isOwned],
  )

  return { roster, isOwned, toggleAgent }
}
