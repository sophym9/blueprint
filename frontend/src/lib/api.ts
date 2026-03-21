import type {
  CreateMapNoteInput,
  MapNote,
  MapRegionDetail,
  MapRegionSummary,
} from '../types/map'

const API_BASE = '/api'

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`)

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return (await response.json()) as T
}

export function getRegions() {
  return fetchJson<MapRegionSummary[]>('/regions')
}

export function getRegionById(regionId: string) {
  return fetchJson<MapRegionDetail>(`/regions/${regionId}`)
}

export function getNotes() {
  return fetchJson<MapNote[]>('/notes')
}

export async function createNote(payload: CreateMapNoteInput) {
  const response = await fetch(`${API_BASE}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return (await response.json()) as MapNote
}
