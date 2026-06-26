import type { Agent, WEngine, DiscSet, Bangboo } from "@/types/zzz"

const BASE_URL = "https://api.hakush.in/zzz"

// Module-level cache: deduplicates calls within the same server process lifecycle.
// The Next.js `next: { revalidate: 3600 }` option handles ISR revalidation across deploys.
const memoryCache = new Map<string, unknown>()

async function apiFetch<T>(path: string): Promise<T> {
  if (memoryCache.has(path)) {
    return memoryCache.get(path) as T
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) {
    throw new Error(`hakush.in request failed: ${res.status} — ${path}`)
  }
  const data = (await res.json()) as T
  memoryCache.set(path, data)
  return data
}

// ---------------------------------------------------------------------------
// Raw API response types (internal — not exported)
// Field names reflect the actual hakush.in ZZZ response shapes.
// ---------------------------------------------------------------------------

interface RawCharacterItem {
  code: string
  icon: string
  name: string
  rarity: number
  // "type" encodes the Profession/Specialty. Element may appear as a top-level
  // field ("ElementType") or be embedded in the detail response.
  type: number
  ElementType?: number
}

type RawCharacterList = Record<string, RawCharacterItem>

interface RawCharacterDetail extends RawCharacterItem {
  faction?: string
  Camp?: string // alternative field name used in some versions
}

interface RawWeaponItem {
  name: string
  rarity: number
  icon: string
  AvatarBaseType?: string // specialty the weapon is designed for
  desc?: string
}

type RawWeaponList = Record<string, RawWeaponItem>

interface RawEquipmentItem {
  name: string
  desc2?: string  // 2-piece bonus
  desc4?: string  // 4-piece bonus
}

type RawEquipmentList = Record<string, RawEquipmentItem>

interface RawBangbooItem {
  name: string
  rarity: number
  icon: string
  desc?: string
}

type RawBangbooList = Record<string, RawBangbooItem>

// ---------------------------------------------------------------------------
// Mapping helpers
// ---------------------------------------------------------------------------

function mapRarity(rarity: number): "S" | "A" {
  return rarity >= 5 ? "S" : "A"
}

// hakush.in ZZZ element codes (ElementType field)
const ELEMENT_MAP: Record<number, Agent["element"]> = {
  200: "Physical",
  201: "Fire",
  202: "Ice",
  203: "Electric",
  // 204 is tentative for Wind (added in ZZZ 3.0) — verify against live API
  204: "Wind",
  205: "Ether",
}

function mapElement(code: number | undefined): Agent["element"] {
  if (code === undefined) return "Physical"
  return ELEMENT_MAP[code] ?? "Physical"
}

// hakush.in ZZZ profession/specialty codes (type field)
const SPECIALTY_MAP: Record<number, Agent["specialty"]> = {
  1: "Attack",
  2: "Stun",
  3: "Anomaly",
  4: "Support",
  5: "Defense",
}

function mapSpecialty(code: number): Agent["specialty"] {
  return SPECIALTY_MAP[code] ?? "Attack"
}

function iconUrl(icon: string): string {
  return `${BASE_URL}/UI/${icon}.webp`
}

// ---------------------------------------------------------------------------
// Public API functions
// ---------------------------------------------------------------------------

export async function getAgents(): Promise<Agent[]> {
  const data = await apiFetch<RawCharacterList>("/character")
  return Object.entries(data).map(([id, char]) => ({
    id,
    name: char.name,
    element: mapElement(char.ElementType),
    specialty: mapSpecialty(char.type),
    faction: "",
    rarity: mapRarity(char.rarity),
    iconUrl: iconUrl(char.icon),
  }))
}

export async function getAgent(id: string): Promise<Agent | null> {
  try {
    const char = await apiFetch<RawCharacterDetail>(`/character/${id}`)
    return {
      id,
      name: char.name,
      element: mapElement(char.ElementType),
      specialty: mapSpecialty(char.type),
      faction: char.faction ?? char.Camp ?? "",
      rarity: mapRarity(char.rarity),
      iconUrl: iconUrl(char.icon),
    }
  } catch {
    return null
  }
}

export async function getWEngines(): Promise<WEngine[]> {
  const data = await apiFetch<RawWeaponList>("/weapon")
  return Object.entries(data).map(([id, weapon]) => ({
    id,
    name: weapon.name,
    specialty: weapon.AvatarBaseType ?? "",
    rarity: mapRarity(weapon.rarity),
    description: weapon.desc ?? "",
  }))
}

export async function getDiscSets(): Promise<DiscSet[]> {
  const data = await apiFetch<RawEquipmentList>("/equipment")
  return Object.entries(data).map(([id, set]) => ({
    id,
    name: set.name,
    twoPieceBonus: set.desc2 ?? "",
    fourPieceBonus: set.desc4 ?? "",
  }))
}

export async function getBangboos(): Promise<Bangboo[]> {
  const data = await apiFetch<RawBangbooList>("/bangboo")
  return Object.entries(data).map(([id, boo]) => ({
    id,
    name: boo.name,
    rarity: mapRarity(boo.rarity),
    description: boo.desc ?? "",
    iconUrl: iconUrl(boo.icon),
  }))
}
