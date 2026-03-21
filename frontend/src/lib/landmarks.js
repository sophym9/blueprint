// mapX, mapY are % of the full 2764×1536 image
// = also the % position within the 1400×778 WorldView/RegionView container

export const LANDMARKS = {
  chapel: {
    region: 'west',
    fictionalName: 'The Grand Spire',
    realName: 'Duke Chapel',
    description: 'A gothic cathedral where legends are made',
    mapX: 39.8,
    mapY: 32.6,
  },
  cameron: {
    region: 'west',
    fictionalName: 'The Blue Devil Colosseum',
    realName: 'Cameron Indoor Stadium',
    description: 'The arena where Blue Devils are forged',
    mapX: 22,
    mapY: 27,
  },
  quad: {
    region: 'west',
    fictionalName: 'Cobblestone Commons',
    realName: 'The Quad',
    description: 'The cobblestone heart of the Western Keep',
    mapX: 38,
    mapY: 50,
  },
  perkins: {
    region: 'west',
    fictionalName: 'The Archive Tower',
    realName: 'Perkins Library',
    description: 'Ancient knowledge locked within its walls',
    mapX: 47,
    mapY: 44,
  },
  marketplace: {
    region: 'west',
    fictionalName: 'The Grand Tavern',
    realName: 'West Union',
    description: 'Where weary adventurers gather and feast',
    mapX: 49,
    mapY: 54,
  },
  bryan: {
    region: 'central',
    fictionalName: 'The Crossroads Keep',
    realName: 'Bryan Center',
    description: 'All roads in the realm pass through here',
    mapX: 40,
    mapY: 63,
  },
  brodhead: {
    region: 'central',
    fictionalName: 'The New Tavern',
    realName: 'Brodhead Center',
    description: 'A newer gathering hall for the modern age',
    mapX: 49,
    mapY: 65,
  },
}

export function getLandmarksForRegion(region) {
  return Object.entries(LANDMARKS)
    .filter(([, l]) => l.region === region)
    .map(([id, l]) => ({ id, ...l }))
}
