// mapX, mapY are % of the full 2764×1536 image
// = also the % position within the 1400×778 WorldView/RegionView container

export const LANDMARKS = {
  chapel: {
    region: 'west',
    fictionalName: 'The Grand Spire',
    realName: 'Duke Chapel',
    description: 'A gothic cathedral where legends are made',
    mapX: 52,
    mapY: 32.6,
  },
  cameron: {
    region: 'west',
    fictionalName: 'The Blue Devil Colosseum',
    realName: 'Cameron Indoor Stadium',
    description: 'The arena where Blue Devils are forged',
    mapX: 15,
    mapY: 41,
  },
  quad: {
    region: 'west',
    fictionalName: 'Cobblestone Commons',
    realName: 'The Quad',
    description: 'The cobblestone heart of the Western Keep',
    mapX: 41,
    mapY: 48,
  },
  libraries: {
    region: 'west',
    fictionalName: 'The Archive Tower',
    realName: 'Libraries',
    description: 'Ancient knowledge locked within its walls',
    mapX: 60,
    mapY: 39,
  },
  westunion: {
    region: 'west',
    fictionalName: 'The Grand Tavern',
    realName: 'West Union',
    description: 'Where weary adventurers gather and feast',
    mapX: 46,
    mapY: 38,
  },
  bryan: {
    region: 'west',
    fictionalName: 'The Crossroads Keep',
    realName: 'Bryan Center',
    description: 'All roads in the realm pass through here',
    mapX: 43,
    mapY: 29.5,
  },
  backyard: {
    region: 'west',
    fictionalName: 'The Back Grounds',
    realName: 'The Backyard',
    description: 'A hidden retreat behind the Western Keep',
    mapX: 35,
    mapY: 75,
  },
  sciencedr: {
    region: 'west',
    fictionalName: 'The Scholar\'s Road',
    realName: 'Science Drive',
    description: 'The path where discoveries begin',
    mapX: 52,
    mapY: 21,
  },
  gardens: {
    region: 'central',
    fictionalName: 'The Blooming Meadows',
    realName: 'Sarah P. Duke Gardens',
    description: 'A never-ending expanse of nature',
    mapX: 63,
    mapY: 65,
  },
  centralcampus: {
    region: 'central',
    fictionalName: 'The Unexplored',
    realName: 'Central Campus',
    description: 'A new adventure awaits',
    mapX: 81,
    mapY: 75,
  },
}

export function getNearestLandmark(x, y) {
  return Object.entries(LANDMARKS)
    .map(([id, landmark]) => ({
      id,
      ...landmark,
      distance: Math.hypot(landmark.mapX - x, landmark.mapY - y),
    }))
    .sort((a, b) => a.distance - b.distance)[0]
}

export function getLandmarksForRegion(region) {
  return Object.entries(LANDMARKS)
    .filter(([, l]) => l.region === region)
    .map(([id, l]) => ({ id, ...l }))
}
