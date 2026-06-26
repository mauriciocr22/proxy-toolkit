import type { RosterAgent, SavedComp } from "@/types/zzz"

const KEYS = {
  roster: "proxy-toolkit:roster",
  savedComps: "proxy-toolkit:saved-comps",
} as const

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function safeWrite<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // quota exceeded or access denied
  }
}

export function getRoster(): RosterAgent[] {
  return safeRead<RosterAgent[]>(KEYS.roster, [])
}

export function setRoster(roster: RosterAgent[]): void {
  safeWrite(KEYS.roster, roster)
}

export function getSavedComps(): SavedComp[] {
  return safeRead<SavedComp[]>(KEYS.savedComps, [])
}

export function setSavedComps(comps: SavedComp[]): void {
  safeWrite(KEYS.savedComps, comps)
}

export function addSavedComp(comp: SavedComp): void {
  setSavedComps([...getSavedComps(), comp])
}

export function deleteSavedComp(id: string): void {
  setSavedComps(getSavedComps().filter((c) => c.id !== id))
}
