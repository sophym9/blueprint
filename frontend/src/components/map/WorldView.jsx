import { useState } from 'react'
import { MAP_W, MAP_H } from '../../lib/mapConfig'
import { LANDMARKS } from '../../lib/landmarks'

function getNearestLandmark(mapX, mapY) {
  let nearestId = null
  let nearestDistance = Number.POSITIVE_INFINITY

  for (const [id, landmark] of Object.entries(LANDMARKS)) {
    const dx = landmark.mapX - mapX
    const dy = landmark.mapY - mapY
    const distance = Math.hypot(dx, dy)

    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestId = id
    }
  }

  return nearestId
}

export default function WorldView({ onSelectLandmark, memoryCounts = {} }) {
  const [hovered, setHovered] = useState(null)

  function handleMapClick(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    const mapX = ((event.clientX - rect.left) / rect.width) * 100
    const mapY = ((event.clientY - rect.top) / rect.height) * 100
    const nearestLandmarkId = getNearestLandmark(mapX, mapY)

    if (!nearestLandmarkId) {
      return
    }

    onSelectLandmark(nearestLandmarkId, { x: mapX, y: mapY })
  }

  return (
    <div
      onClick={handleMapClick}
      style={{ position: 'relative', width: `${MAP_W}px`, height: `${MAP_H}px`, flexShrink: 0, cursor: 'pointer' }}
    >
      {/* Actual Duke campus map */}
      <img
        src="/duke-campus-map.png"
        alt="Duke Campus Map"
        style={{ width: '100%', height: '100%', display: 'block', userSelect: 'none' }}
        draggable={false}
      />

      {Object.entries(LANDMARKS).map(([id, landmark]) => {
        const isHovered = hovered === id
        const count = memoryCounts[id] || 0

        return (
          <div
            key={id}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: 'absolute',
              left: `${landmark.mapX}%`,
              top: `${landmark.mapY}%`,
              transform: 'translate(-50%, -100%)',
              cursor: 'pointer',
              zIndex: 10,
            }}
          >
            {isHovered && (
              <div style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(10,14,26,0.95)',
                border: '1px solid #C9A84C',
                borderRadius: '8px',
                padding: '10px 14px',
                width: '190px',
                marginBottom: '6px',
                pointerEvents: 'none',
                whiteSpace: 'normal',
              }}>
                <div style={{ fontFamily: "'IM Fell English', serif", fontSize: '13px', color: '#C9A84C', marginBottom: '2px' }}>
                  {landmark.fictionalName}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#9CA3AF', marginBottom: '4px' }}>
                  {landmark.realName}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#D1D5DB', lineHeight: '1.4' }}>
                  {landmark.description}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#C9A84C', marginTop: '6px' }}>
                  {count > 0 ? `${count} ${count === 1 ? 'memory' : 'memories'}` : 'Click to enter'}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
