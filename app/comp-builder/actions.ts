"use server"

import { getCompSuggestion } from "@/lib/ai"
import { getBangboos } from "@/lib/hakushin"
import type { Agent, CompAnalysis } from "@/types/zzz"

export async function analyzeComp(agents: Agent[]): Promise<CompAnalysis> {
  if (agents.length !== 3) throw new Error("Exactly 3 agents required")
  const bangboos = await getBangboos().catch(() => [])
  return getCompSuggestion(agents, bangboos)
}
