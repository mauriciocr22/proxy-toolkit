import Anthropic from "@anthropic-ai/sdk"
import type { Agent } from "@/types/zzz"

const client = new Anthropic()

const COMP_SYSTEM_PROMPT = `
You are a Zenless Zone Zero expert.
Analyze the provided agent composition and respond in Brazilian Portuguese.
Explain the comp's synergy, each agent's role, the ideal Bangboo, and a basic rotation.
Be direct and practical. Maximum 300 words.
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

export async function getCompSuggestion(agents: Agent[]): Promise<string> {
  const summary: AgentSummary[] = agents.map(({ name, element, specialty, faction, rarity }) => ({
    name, element, specialty, faction, rarity,
  }))

  const msg = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: COMP_SYSTEM_PROMPT,
    messages: [{ role: "user", content: JSON.stringify(summary) }],
  })

  const block = msg.content[0]
  if (block.type !== "text") throw new Error("Unexpected response type")
  return block.text
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
