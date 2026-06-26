"use server"

import { getWEngines, getDiscSets } from "@/lib/hakushin"
import { getBuildSuggestion } from "@/lib/ai"
import type { Agent, BuildAnalysis } from "@/types/zzz"

export async function analyzeBuild(agent: Agent): Promise<BuildAnalysis> {
  const [wEngines, discSets] = await Promise.all([
    getWEngines().catch(() => []),
    getDiscSets().catch(() => []),
  ])
  return getBuildSuggestion(agent, wEngines, discSets)
}
