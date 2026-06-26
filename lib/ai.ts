import { GoogleGenAI } from "@google/genai"
import type { Agent, Bangboo, CompAnalysis, WEngine, DiscSet, BuildAnalysis } from "@/types/zzz"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const COMP_SYSTEM_PROMPT = `
You are a Zenless Zone Zero expert.
Respond ONLY with valid JSON, no markdown, no extra text:
{
  "analysis": "...",
  "bangbooId": "..."
}
The "analysis" field must be in Brazilian Portuguese: explain the comp synergy, each agent's role, and a basic rotation. Maximum 300 words.
The "bangbooId" must be one of the IDs from the bangboo list the user provides. Pick the best Bangboo for the composition. If no bangboo list is provided, use an empty string.
`

const BUILD_SYSTEM_PROMPT = `
You are a Zenless Zone Zero build expert.
Respond ONLY with valid JSON (no markdown, no extra text):
{
  "recommendation": "...",
  "wEngineId": "...",
  "altWEngineId": "...",
  "discSetId": "...",
  "altDiscSetId": "..."
}
The "recommendation" field must be in Brazilian Portuguese: explain the main W-Engine choice, the accessible alternative, the main disc set, the alternative disc set, and priority stats per slot. Maximum 250 words.
All IDs must come from the provided lists. Pick W-Engines suited to the agent's specialty. If no list is provided, use empty strings.
`

type AgentSummary = Pick<Agent, "name" | "element" | "specialty" | "faction" | "rarity">
type BangbooSummary = Pick<Bangboo, "id" | "name" | "rarity" | "description">

export async function getCompSuggestion(agents: Agent[], bangboos: Bangboo[]): Promise<CompAnalysis> {
  const payload = {
    agents: agents.map(({ name, element, specialty, faction, rarity }): AgentSummary => ({
      name, element, specialty, faction, rarity,
    })),
    bangboos: bangboos.map(({ id, name, rarity, description }): BangbooSummary => ({
      id, name, rarity, description,
    })),
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: JSON.stringify(payload),
    config: { systemInstruction: COMP_SYSTEM_PROMPT },
  })

  const text = response.text ?? ""
  const parsed = JSON.parse(text) as { analysis?: string; bangbooId?: string }
  return {
    analysis: parsed.analysis ?? text,
    bangbooId: parsed.bangbooId ?? "",
  }
}

export async function getBuildSuggestion(
  agent: Agent,
  wEngines: WEngine[],
  discSets: DiscSet[],
): Promise<BuildAnalysis> {
  const payload = {
    agent: {
      name: agent.name,
      element: agent.element,
      specialty: agent.specialty,
      faction: agent.faction,
      rarity: agent.rarity,
    },
    wEngines: wEngines.map(({ id, name, specialty, rarity }) => ({ id, name, specialty, rarity })),
    discSets: discSets.map(({ id, name, twoPieceBonus, fourPieceBonus }) => ({
      id, name, twoPieceBonus, fourPieceBonus,
    })),
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: JSON.stringify(payload),
    config: { systemInstruction: BUILD_SYSTEM_PROMPT },
  })

  const text = response.text ?? ""
  const parsed = JSON.parse(text) as Partial<BuildAnalysis>
  return {
    recommendation: parsed.recommendation ?? text,
    wEngineId: parsed.wEngineId ?? "",
    altWEngineId: parsed.altWEngineId ?? "",
    discSetId: parsed.discSetId ?? "",
    altDiscSetId: parsed.altDiscSetId ?? "",
  }
}
