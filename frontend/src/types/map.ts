export type RegionCategory =
  | 'academic'
  | 'housing'
  | 'landmark'
  | 'recreation'
  | 'event'
  | 'parking'

export interface MapPoint {
  x: number
  y: number
}

export interface RegionPolygon {
  points: MapPoint[]
}

export interface MapRegionSummary {
  id: string
  name: string
  category: RegionCategory
  shortDescription: string
  color: string
  polygon: RegionPolygon
}

export interface MapRegionDetail extends MapRegionSummary {
  longDescription: string
  highlights: string[]
  tags: string[]
}

export interface MapNote {
  id: string
  x: number
  y: number
  message: string
  createdAt: string
}

export interface CreateMapNoteInput {
  x: number
  y: number
  message: string
}
