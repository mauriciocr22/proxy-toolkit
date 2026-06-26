import type { Agent, WEngine, DiscSet, Bangboo } from "@/types/zzz"

const STATIC_BASE = "https://static.nanoka.cc"
const ASSET_BASE = `${STATIC_BASE}/assets/zzz`

const memoryCache = new Map<string, unknown>()

async function apiFetch<T>(url: string): Promise<T> {
  if (memoryCache.has(url)) return memoryCache.get(url) as T
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`nanoka.cc request failed: ${res.status} — ${url}`)
  const data = (await res.json()) as T
  memoryCache.set(url, data)
  return data
}

async function dataUrl(resource: string): Promise<string> {
  const manifest = await apiFetch<{ zzz: { latest: string } }>(`${STATIC_BASE}/manifest.json`)
  return `${STATIC_BASE}/zzz/${manifest.zzz.latest}/${resource}.json`
}

// ---------------------------------------------------------------------------
// Raw API response types (internal)
// ---------------------------------------------------------------------------

interface RawCharacter {
  en: string
  rank: number  // 4=S, 3=A
  type: number  // specialty code
  element: number
  camp: number
  icon: string
  code: string
}

type RawCharacterList = Record<string, RawCharacter>

interface RawWeapon {
  en: string
  rank: number  // 4=S, 3=A, 2=B
  type: number
  desc?: string
  icon: string
}

type RawWeaponList = Record<string, RawWeapon>

interface RawEquipmentLocale {
  name: string
  desc2?: string
  desc4?: string
}

interface RawEquipment {
  en: RawEquipmentLocale
  icon: string
}

type RawEquipmentList = Record<string, RawEquipment>

interface RawBangboo {
  en: string
  rank: number
  desc?: string
  icon: string
}

type RawBangbooList = Record<string, RawBangboo>

// ---------------------------------------------------------------------------
// Mapping helpers
// ---------------------------------------------------------------------------

function mapRarity(rank: number): "S" | "A" {
  return rank >= 4 ? "S" : "A"
}

function mapWeaponRarity(rank: number): "S" | "A" | "B" {
  if (rank >= 4) return "S"
  if (rank >= 3) return "A"
  return "B"
}

const ELEMENT_MAP: Record<number, Agent["element"]> = {
  200: "Physical",
  201: "Fire",
  202: "Ice",
  203: "Electric",
  204: "Wind",
  205: "Ether",
}

const SPECIALTY_MAP: Record<number, Agent["specialty"]> = {
  1: "Attack",
  2: "Stun",
  3: "Anomaly",
  4: "Support",
  5: "Defense",
  6: "Support",
}

// camp IDs from the static data mapped to in-game faction names.
// Camps 3 and 4 are both Sons of Calydon sub-factions; Bangboo synergy treats them identically.
const FACTION_MAP: Record<number, string> = {
  1: "Cunning Hares",
  2: "Victoria Housekeeping",
  3: "Sons of Calydon",
  4: "Sons of Calydon",
  5: "Obol Squad",
  6: "Section 6",
  7: "Criminal Investigation Special Response Team",
  8: "G.A.T.E.",
}

function mapElement(code: number): Agent["element"] {
  return ELEMENT_MAP[code] ?? "Physical"
}

function mapSpecialty(code: number): Agent["specialty"] {
  return SPECIALTY_MAP[code] ?? "Attack"
}

// Icon field is either a bare name ("IconRole01") or a full path ending in .png.
// Both resolve to `${ASSET_BASE}/{basename}.webp`.
function iconUrl(icon: string): string {
  const basename = icon.split("/").pop()?.replace(/\.[^.]+$/, "") ?? icon
  return `${ASSET_BASE}/${basename}.webp`
}

// ---------------------------------------------------------------------------
// Public API functions
// ---------------------------------------------------------------------------

export async function getAgents(): Promise<Agent[]> {
  const data = await apiFetch<RawCharacterList>(await dataUrl("character"))
  return Object.entries(data).map(([id, char]) => ({
    id,
    name: char.en,
    element: mapElement(char.element),
    specialty: mapSpecialty(char.type),
    faction: FACTION_MAP[char.camp] ?? "",
    rarity: mapRarity(char.rank),
    iconUrl: iconUrl(char.icon),
  }))
}

export async function getAgent(id: string): Promise<Agent | null> {
  try {
    const data = await apiFetch<RawCharacterList>(await dataUrl("character"))
    const char = data[id]
    if (!char) return null
    return {
      id,
      name: char.en,
      element: mapElement(char.element),
      specialty: mapSpecialty(char.type),
      faction: FACTION_MAP[char.camp] ?? "",
      rarity: mapRarity(char.rank),
      iconUrl: iconUrl(char.icon),
    }
  } catch {
    return null
  }
}

export async function getWEngines(): Promise<WEngine[]> {
  const data = await apiFetch<RawWeaponList>(await dataUrl("weapon"))
  return Object.entries(data).map(([id, weapon]) => ({
    id,
    name: weapon.en,
    specialty: SPECIALTY_MAP[weapon.type] ?? "",
    rarity: mapWeaponRarity(weapon.rank),
    description: weapon.desc ?? "",
  }))
}

export async function getDiscSets(): Promise<DiscSet[]> {
  const data = await apiFetch<RawEquipmentList>(await dataUrl("equipment"))
  return Object.entries(data).map(([id, set]) => ({
    id,
    name: set.en.name,
    twoPieceBonus: set.en.desc2 ?? "",
    fourPieceBonus: set.en.desc4 ?? "",
  }))
}

export async function getBangboos(): Promise<Bangboo[]> {
  const data = await apiFetch<RawBangbooList>(await dataUrl("bangboo"))
  return Object.entries(data).map(([id, boo]) => ({
    id,
    name: boo.en,
    rarity: mapRarity(boo.rank),
    description: boo.desc ?? "",
    iconUrl: iconUrl(boo.icon),
  }))
}
