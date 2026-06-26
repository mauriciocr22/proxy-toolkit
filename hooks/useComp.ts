"use client"

import { useState, useCallback, useMemo } from "react"
import type { Agent } from "@/types/zzz"

export function useComp(allAgents: Agent[]) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const selectedAgents = useMemo(
    () =>
      selectedIds
        .map((id) => allAgents.find((a) => a.id === id))
        .filter((a): a is Agent => a !== undefined),
    [selectedIds, allAgents],
  )

  const isSelected = useCallback((id: string) => selectedIds.includes(id), [selectedIds])

  const toggleAgent = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }, [])

  const removeSlot = useCallback((index: number) => {
    setSelectedIds((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const clear = useCallback(() => setSelectedIds([]), [])

  return {
    selectedIds,
    selectedAgents,
    isSelected,
    toggleAgent,
    removeSlot,
    clear,
    isFull: selectedIds.length === 3,
  }
}
