export const LANDMARKS = {
  chapel: {
    region: 'west',
    fictionalName: 'The Grand Spire',
    realName: 'Duke Chapel',
    description: 'A gothic cathedral where legends are made',
    position: { x: '30%', y: '25%' },
  },
  cameron: {
    region: 'west',
    fictionalName: 'The Blue Devil Colosseum',
    realName: 'Cameron Indoor Stadium',
    description: 'The arena where Blue Devils are forged',
    position: { x: '60%', y: '35%' },
  },
  quad: {
    region: 'west',
    fictionalName: 'Cobblestone Commons',
    realName: 'The Quad',
    description: 'The cobblestone heart of the Western Keep',
    position: { x: '45%', y: '55%' },
  },
  perkins: {
    region: 'west',
    fictionalName: 'The Archive Tower',
    realName: 'Perkins Library',
    description: 'Ancient knowledge locked within its walls',
    position: { x: '20%', y: '65%' },
  },
  marketplace: {
    region: 'west',
    fictionalName: 'The Grand Tavern',
    realName: 'The Marketplace',
    description: 'Where weary adventurers gather and feast',
    position: { x: '70%', y: '65%' },
  },
  eastdorms: {
    region: 'east',
    fictionalName: 'The Freshman Barracks',
    realName: 'East Campus Dorms',
    description: 'Where all great journeys begin',
    position: { x: '35%', y: '45%' },
  },
  baldwin: {
    region: 'east',
    fictionalName: 'The Hall of Echoes',
    realName: 'Baldwin Auditorium',
    description: 'Music and memory live within these walls',
    position: { x: '65%', y: '55%' },
  },
  bryan: {
    region: 'central',
    fictionalName: 'The Crossroads Keep',
    realName: 'Bryan Center',
    description: 'All roads in the realm pass through here',
    position: { x: '35%', y: '50%' },
  },
  brodhead: {
    region: 'central',
    fictionalName: 'The New Tavern',
    realName: 'Brodhead Center',
    description: 'A newer gathering hall for the modern age',
    position: { x: '65%', y: '50%' },
  },
}

export function getLandmarksForRegion(region) {
  return Object.entries(LANDMARKS)
    .filter(([, l]) => l.region === region)
    .map(([id, l]) => ({ id, ...l }))
}
