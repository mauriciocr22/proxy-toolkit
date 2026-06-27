import { GoogleGenAI } from "@google/genai"
import type { Agent, Bangboo, CompAnalysis, WEngine, DiscSet, BuildAnalysis } from "@/types/zzz"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const COMP_SYSTEM_PROMPT = `
You are an expert on Zenless Zone Zero mechanics with complete knowledge of every agent's kit.

The user provides a JSON object with:
- "agents": 3 agents, each with name, element, specialty, faction, rarity
- "bangboos": available Bangboos, each with id, name, rarity, description
- "bangbooResearch": a plain-text recommendation from a web search identifying the best Bangboo for this comp — treat this as authoritative and use it to pick the bangbooId

Rules for the analysis (field "analysis", in Brazilian Portuguese, max 300 words):
1. Name each agent's specific skills by their in-game names. Never say "her skill" or "the ultimate" without naming the skill.
2. Explain the exact kit interaction that makes this comp work — which skill enables which mechanic for which other agent.
3. For the role of each agent, state it concisely: Main DPS / Trigger / Enabler / Buffer / Support, then justify with the specific mechanic.
4. For the Bangboo: use the "bangbooResearch" field to select the best bangbooId from the provided list. Mention the Bangboo by name in the analysis and explain the synergy reason from the research.
5. Rotation: describe the core loop in 2–3 steps, naming the specific skills.
6. Never give generic advice that is not grounded in the specific kit data of these agents.

Respond ONLY with valid JSON, no markdown, no extra text:
{
  "analysis": "...",
  "bangbooId": "..."
}
The "bangbooId" must be one of the IDs provided in the input. If no bangboo list is provided, use an empty string.
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

// Extracts the first complete {...} JSON object from a string.
// Needed when grounding is active and the model may add text around the JSON.
function extractJson(text: string): string {
  const start = text.indexOf("{")
  const end = text.lastIndexOf("}")
  if (start === -1 || end === -1 || end < start) throw new Error("No JSON object found in model response")
  return text.slice(start, end + 1)
}

type AgentSummary = Pick<Agent, "name" | "element" | "specialty" | "faction" | "rarity">
type BangbooSummary = Pick<Bangboo, "id" | "name" | "rarity" | "description">

export async function getCompSuggestion(agents: Agent[], bangboos: Bangboo[]): Promise<CompAnalysis> {
  const agentNames = agents.map((a) => a.name).join(", ")
  const factions = [...new Set(agents.map((a) => a.faction).filter(Boolean))].join(", ")
  const bangbooNames = bangboos.map((b) => b.name).join(", ")

  // Step 1: grounded search for Bangboo recommendation (plain text, no JSON constraints)
  const searchResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `In Zenless Zone Zero, what is the single best Bangboo for a team with ${agentNames}${factions ? ` (factions: ${factions})` : ""}? The available Bangboos are: ${bangbooNames}. Name the best one and explain the faction or damage synergy in one sentence.`,
    config: { tools: [{ googleSearch: {} }] },
  })
  const bangbooResearch = searchResponse.text ?? ""

  // Step 2: structured JSON analysis with the research result injected as context
  const payload = {
    agents: agents.map(({ name, element, specialty, faction, rarity }): AgentSummary => ({
      name, element, specialty, faction, rarity,
    })),
    bangboos: bangboos.map(({ id, name, rarity, description }): BangbooSummary => ({
      id, name, rarity, description,
    })),
    bangbooResearch,
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: JSON.stringify(payload),
    config: { systemInstruction: COMP_SYSTEM_PROMPT },
  })

  const text = response.text ?? ""
  const parsed = JSON.parse(extractJson(text)) as { analysis?: string; bangbooId?: string }
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
  const parsed = JSON.parse(extractJson(text)) as Partial<BuildAnalysis>
  return {
    recommendation: parsed.recommendation ?? text,
    wEngineId: parsed.wEngineId ?? "",
    altWEngineId: parsed.altWEngineId ?? "",
    discSetId: parsed.discSetId ?? "",
    altDiscSetId: parsed.altDiscSetId ?? "",
  }
}
