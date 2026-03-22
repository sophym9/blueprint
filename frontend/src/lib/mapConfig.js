export const ZOOM_LEVELS = { WORLD: 0, REGION: 1, LANDMARK: 2 }

// Map image: 1381×768, displayed at 1400×778 in WorldView/RegionView
export const MAP_W = 1400
export const MAP_H = 778

export const REGIONS = {
  west: {
    fictionalName: 'The Western Keep',
    realName: 'West Campus',
    description: 'Ancient gothic halls of glory and legend',
    color: '#4A90E2',
    // Ellipse overlay on the 1400×778 world view (cx, cy, rx, ry in px)
    overlay: { cx: 430, cy: 310, rx: 280, ry: 210 },
    // zoomTo() args when entering region view
    zoom: { scale: 2, x: 540, y: 158 },
  },
  central: {
    fictionalName: 'The Central Crossing',
    realName: 'Central Campus',
    description: 'Heart of the realm, where all roads meet',
    color: '#C9A84C',
    overlay: { cx: 680, cy: 500, rx: 190, ry: 110 },
    zoom: { scale: 2, x: 40, y: -222 },
  },
}
