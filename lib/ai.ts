import Anthropic from "@anthropic-ai/sdk"
import type { Agent, Bangboo, CompAnalysis } from "@/types/zzz"

const client = new Anthropic()

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
For the provided agent, recommend in Brazilian Portuguese:
- Main W-Engine and a free/accessible alternative
- Main disc set and an alternative
- Priority stats per slot
Be concise. Maximum 250 words.
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

  const msg = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: COMP_SYSTEM_PROMPT,
    messages: [{ role: "user", content: JSON.stringify(payload) }],
  })

  const block = msg.content[0]
  if (block.type !== "text") throw new Error("Unexpected response type")

  const parsed = JSON.parse(block.text) as { analysis?: string; bangbooId?: string }
  return {
    analysis: parsed.analysis ?? block.text,
    bangbooId: parsed.bangbooId ?? "",
  }
}

export async function getBuildSuggestion(agent: Agent): Promise<string> {
  const summary: AgentSummary = {
    name: agent.name,
    element: agent.element,
    specialty: agent.specialty,
    faction: agent.faction,
    rarity: agent.rarity,
  }

  const msg = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: BUILD_SYSTEM_PROMPT,
    messages: [{ role: "user", content: JSON.stringify(summary) }],
  })

  const block = msg.content[0]
  if (block.type !== "text") throw new Error("Unexpected response type")
  return block.text
}
