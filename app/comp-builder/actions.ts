"use server"

import { getCompSuggestion } from "@/lib/ai"
import type { Agent } from "@/types/zzz"

export async function analyzeComp(agents: Agent[]): Promise<string> {
  if (agents.length !== 3) throw new Error("Exactly 3 agents required")
  return getCompSuggestion(agents)
}
